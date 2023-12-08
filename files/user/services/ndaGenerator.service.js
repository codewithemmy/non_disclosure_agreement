const axios = require("axios")
const { default: mongoose } = require("mongoose")
const fs = require("fs")
const path = require("path")
const { v4: uuidv4 } = require("uuid")
const { completionNDA } = require("../../../utils/openai")
const { UserSuccess, UserFailure } = require("../user.messages")
const { UserRepository } = require("../user.repository")
const { ProfileFailure } = require("../messages/profile.messages")
const { ContractService } = require("../../contract/contract.service")
const { ContractRepository } = require("../../contract/contract.repository")
const { uploadImageManager } = require("../../../utils/multer")
const { convertHtmlToText } = require("../../../utils/htmlToText")

class ndaService {
  static async NDAGeneratorService(payload, locals) {
    if (!payload.files || !payload.files.image)
      return { success: false, msg: UserFailure.UPLOAD }

    const image = await uploadImageManager(payload)

    const user = await UserRepository.findSingleUserWithParams({
      _id: new mongoose.Types.ObjectId(locals._id),
    })

    if (!user) return { success: false, msg: ProfileFailure.NO_USER_FOUND }

    if (user.tokenIsNew) {
      await UserRepository.incrementUserById(locals._id, {
        tokenCountUsed: 1,
      })

      if (user.tokenCountUsed === 10) {
        user.tokenCountUsed = 0
        user.tokenIsNew = false
        await user.save()
      }
    }

    const {
      company,
      initiator,
      nameOfSignee,
      governingCountry,
      governingState,
      contractType,
      request,
    } = payload.body

    let prompt

    if (request) {
      prompt = `Considering this ${request}. create  Non Disclosure Agreement(NDA) for company name ${company}, initiated by ${initiator},
        name of Signee should be ${nameOfSignee}, governing country should be ${governingCountry}, ${governingState}.
        return the result as a Markdown format
    `
    } else {
      prompt = `create  Non Disclosure Agreement(NDA) for company name ${company}, initiated by ${initiator},
        name of Signee should be ${nameOfSignee}, governing country should be ${governingCountry}, ${governingState}.
        return the result as a Markdown format
    `
    }

    const result = await completionNDA(prompt)

    if (!result)
      return {
        success: false,
        msg: UserFailure.NDA_NETWORK,
      }

    const date = new Date()
    return {
      success: true,
      msg: UserSuccess.FETCH,
      date,
      logo: image.secure_url,
      data: result,
    }
  }

  static async saveNdaService(req, locals) {
    let randomId

    let contract

    do {
      randomId = uuidv4()
      contract = await ContractRepository.fetchOne({ uniqueId: randomId })
    } while (contract)

    const { htmlContent } = req.body

    if (!htmlContent) {
      return { success: false, msg: UserFailure.HTML }
    }

    const plainTextPayload = convertHtmlToText(htmlContent)

    const filename = `${randomId}_document.html`
    const filePath = path.join(__dirname, "../../../utils/public/html/", filename)
    fs.writeFileSync(filePath, htmlContent)

    try {
      const pdfFilename = `${randomId}_document.pdf`
      const pdfFilePath = path.join(
        __dirname,
        "../../../utils/public/pdf/",
        pdfFilename
      )

      // Use the DocRaptor API directly to create a PDF
      const url = "https://api.docraptor.com/docs"
      const json = {
        user_credentials: process.env.DOCRAPTOR_API_KEY,
        doc: {
          document_content: `${plainTextPayload}`,
          type: "pdf",
          test: true, // Set to false for production
        },
      }

      const response = await axios.post(url, json, {
        responseType: "arraybuffer",
      })

      fs.writeFileSync(pdfFilePath, response.data)

      // You can now proceed to save the contract and respond to the client as needed
      const contract = await ContractService.createContract({
        contractName: pdfFilename,
        randomId,
        clientId: new mongoose.Types.ObjectId(locals),
      })

      if (!contract) {
        return {
          success: false,
          msg: UserFailure.TASK,
        }
      }

      return {
        success: true,
        msg: UserSuccess.UPDATE,
        fileId: randomId,
      }
    } catch (error) {
      console.error("PDF generation failed:", error)

      // Handle the error and return an appropriate response
      return {
        success: false,
        msg: UserFailure.TASK,
      }
    }
  }
}

module.exports = { ndaService }
