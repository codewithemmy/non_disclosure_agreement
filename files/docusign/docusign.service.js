const { default: mongoose } = require("mongoose")
const util = require("util")
const fs = require("fs")
const writeFile = util.promisify(fs.writeFile)
const { ContractRepository } = require("../contract/contract.repository")
const path = require("path")
const {
  checkToken,
  getEnvelopeApi,
  makeEmailEnvelope,
} = require("../../utils/docusign/docusign")
const { docusignMessages } = require("./docusign.message")
const { ContractService } = require("../contract/contract.service")

class DocusignService {
  static async postDocusignService(req) {
    const params = req.params.uuid

    const findContract = await ContractRepository.fetchOne({ uniqueId: params })

    if (!findContract)
      return { success: false, msg: docusignMessages.NONE_FOUND }

    // Generate an initial file path
    let filePath = path.resolve(
      __dirname,
      `../../utils/public/pdf/${params}_document.pdf`
    )

    await checkToken(req)
    let envelopesApi = getEnvelopeApi(req)
    let envelope = makeEmailEnvelope(req.body, filePath)
    let results = await envelopesApi.createEnvelope(
      process.env.API_ACCOUNT_ID,
      {
        envelopeDefinition: envelope,
      }
    )

    if (!results) return { success: false, msg: docusignMessages.CREATE_ERROR }

    const contract = await ContractRepository.updateContractByParams(
      {
        uniqueId: req.params.uuid,
      },
      { envelopeId: results.envelopeId }
    )

    if (!contract) return { success: false, msg: `contract not found` }

    return {
      success: true,
      msg: docusignMessages.SUCCESS,
      data: results,
    }
  }

  static async getDocusignService(req) {
    // Assuming envelopesApi.getEnvelope returns binary data
    await checkToken(req)
    let envelopesApi = getEnvelopeApi(req)
    let signedDocumentData = await envelopesApi.getDocument(
      process.env.API_ACCOUNT_ID,
      req.params.envelopeId,
      "combined"
    )

    if (!signedDocumentData) {
      console.error("No data received from Docusign")
      return { success: false, msg: docusignMessages.NO_DATA }
    }

    const pdfFilename = `new_document.pdf`
    const pdfFilePath = path.join(
      __dirname,
      "../../utils/public/pdf/",
      pdfFilename
    )

    try {
      await writeFile(pdfFilePath, signedDocumentData, "binary")
    } catch (error) {
      console.error("Error writing the file:", error)
      return {
        success: false,
        msg: docusignMessages.ERROR_FILE,
      }
    }

    return {
      success: true,
      msg: docusignMessages.DOWNLOAD_BASE64,
    }
  }

  static async docusignWebhookService(req) {
    await checkToken(req)

    // Extract relevant information from the DocuSign webhook payload
    const docusignEvent = req.body

    // Implement logic to update your application based on the DocuSign event
    if (docusignEvent.event === "envelope-completed") {
      const envelopeId = docusignEvent?.data?.envelopeId

      let envelopesApi = getEnvelopeApi(req)
      let signedDocumentData = await envelopesApi.getDocument(
        process.env.API_ACCOUNT_ID,
        envelopeId,
        "combined"
      )

      try {
        const contract = await ContractRepository.fetchOne({
          envelopeId,
        })

        const pdfFilename = `${contract.uniqueId}_document.pdf`
        const newFilePath = path.join(
          __dirname,
          "../../utils/public/pdf/",
          pdfFilename
        )

        await writeFile(newFilePath, signedDocumentData, "binary")

        contract.status = "signed"
        await contract.save()

        return {
          success: true,
          msg: "Document successfully saved as Base64 in a file",
        }
      } catch (error) {
        console.error("Error downloading signed document:", error)
        throw error
      }
    }
  }
}

module.exports = { DocusignService }
