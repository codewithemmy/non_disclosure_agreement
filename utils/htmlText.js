const htmlToText = require("html-to-text")

const convertHtmlToText = (html) => {
  return htmlToText.convert(html, {
    wordwrap: false,
    ignoreHref: true,
    ignoreImage: true,
  })
}

module.exports = { convertHtmlToText }
