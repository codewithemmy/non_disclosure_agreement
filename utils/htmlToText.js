const htmlToText = require("html-to-text")

const convertHtmlToText = () => {
  return htmlToText.convert(html, {
    wordwrap: false,
    ignoreHref: true,
    ignoreImage: true,
  })
}

module.export = { convertHtmlToText }
