const express = require("express")
const path = require("path")
const docusign = require("docusign-esign")
const fs = require("fs")
const app = express()

//utility function
const makeEmailEnvelope = (payload, fileName) => {
  const { email, ccEmail } = payload

  let converts = fs.readFileSync(
    path.resolve(__dirname, "..", "..", "pdf", `${fileName}`)
  )

  // Create the envelope definition
  let env = new docusign.EnvelopeDefinition()
  env.emailSubject = "Please sign this document set"

  const pdfBase64 = Buffer.from(converts).toString("base64")

  let doc1 = new docusign.Document.constructFromObject({
    documentBase64: pdfBase64,
    name: "Contract Signing",
    fileExtension: "pdf",
    documentId: 1234,
  })

  env.documents = [doc1]

  let signer1 = docusign.Signer.constructFromObject({
    email: email,
    name: email,
    recipientId: 1,
  })

  const ccRecipients = docusign.CarbonCopy.constructFromObject({
    email: ccEmail,
    name: ccEmail,
    routingOrder: 2,
    recipientId: 2,
  })

  let recipients = docusign.Recipients.constructFromObject({
    signers: [signer1],
    carbonCopies: [ccRecipients],
  })

  env.recipients = recipients

  env.status = "sent"

  return env
}

const makeEnvelope = (name, email) => {
  let env = new docusign.EnvelopeDefinition()
  env.templateId = process.env.TEMPLATE_ID

  let signer1 = docusign.TemplateRole.constructFromObject({
    email: email,
    name: name,
    roleName: "Applicant",
  })

  env.templateRoles = [signer1]
  env.status = "sent"

  return env
}

const getEnvelopeApi = (req) => {
  let dsApiClient = new docusign.ApiClient()
  dsApiClient.setBasePath(process.env.BASE_PATH)
  dsApiClient.addDefaultHeader(
    "Authorization",
    "Bearer " + req.session.access_token
  )
  return new docusign.EnvelopesApi(dsApiClient)
}

function makeRecipientViewRequest(name, email, clientUserId) {
  let viewRequest = new docusign.RecipientViewRequest()
  viewRequest.returnUrl = "http://localhost:8000/success"
  viewRequest.authenticationMethod = "none"

  // Recipient information must match embedded recipient info
  // we used to create the envelope.
  viewRequest.email = email
  viewRequest.userName = name
  viewRequest.clientUserId = process.env.CLIENT_USER_ID
  return viewRequest
}

const checkToken = async (req) => {
  if (req.session.access_token && Date.now() < req.session.expires_at) {
  } else {
    console.log("generating a new access token")
    let dsApiClient = new docusign.ApiClient()
    dsApiClient.setBasePath(process.env.BASE_PATH)
    const results = await dsApiClient.requestJWTUserToken(
      process.env.INTEGRATION_KEY,
      process.env.USER_ID,
      "signature",
      fs.readFileSync(path.join(__dirname, "private.key")),
      3600
    )
    req.session.access_token = results.body.access_token
    req.session.expires_at = Date.now() * (results.body.expires_in - 60) * 1000
  }
}

module.exports = {
  makeEnvelope,
  getEnvelopeApi,
  makeRecipientViewRequest,
  checkToken,
  makeEmailEnvelope,
}
