const contentParser = (req, res, next) => {
  const contentType = req.get("Content-Type")

  if (contentType && contentType.includes("text/html")) {
    // Parse the request body as JSON
    let rawData = ""
    req.setEncoding("utf8")

    req.on("data", (chunk) => {
      rawData += chunk
    })

    req.on("end", () => {
      try {
        req.body = JSON.parse(rawData)
        next()
      } catch (error) {
        console.error("Error parsing HTML body:", error)
        res.status(400).send("Bad Request")
      }
    })
  } else {
    next()
  }
}

module.exports = { contentParser }
