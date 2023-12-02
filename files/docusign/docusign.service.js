const { default: mongoose } = require("mongoose")
const util = require("util")
const fs = require("fs")
const writeFile = util.promisify(fs.writeFile)
const { ContractRepository } = require("../contract/contract.repository")
const path = require("path")
const { queryConstructor, AlphaNumeric } = require("../../utils")
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
      `../../public/pdf/${params}_document.pdf`
    )

    await checkToken(req)
    let envelopesApi = getEnvelopeApi(req)
    let envelope = makeEmailEnvelope(req.body.email, filePath)
    let results = await envelopesApi.createEnvelope(
      process.env.API_ACCOUNT_ID,
      {
        envelopeDefinition: envelope,
      }
    )

    if (!results) return { success: false, msg: docusignMessages.CREATE_ERROR }

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
    let signedDocumentData = await envelopesApi.getEnvelope(
      process.env.API_ACCOUNT_ID,
      req.params.envelopeId
    )

    if (!signedDocumentData) {
      console.error("No data received from Docusign")
      return { success: false, msg: "No data received from Docusign" }
    }

    const { documentsUri } = signedDocumentData
    console.log("document", documentsUri)

    // Convert binary data to Base64
    const signedDocumentBase64 = Buffer.from(documentsUri).toString("base64")

    const pdfFilename = `new_document.pdf`
    const pdfFilePath = path.join(__dirname, "../../public/pdf/", pdfFilename)

    try {
      await writeFile(pdfFilePath, signedDocumentBase64, "base64")
      console.log("File successfully written")
    } catch (error) {
      console.error("Error writing the file:", error)
      return {
        success: false,
        msg: "Error writing the file",
      }
    }

    return {
      success: true,
      msg: "Document successfully saved as Base64 in a file",
    }
  }
}

module.exports = { DocusignService }
