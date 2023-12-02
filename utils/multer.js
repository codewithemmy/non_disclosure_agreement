const cloudinary = require("cloudinary").v2
const { config } = require("../core/config")
const fs = require("fs")
cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
})

// const uploadManager = async (req) => {
//   const result = await cloudinary.uploader.upload(req.files.file.tempFilePath, {
//     use_filename: true,
//     folder: "file-upload",
//   })
//   fs.unlinkSync(req.files.file.tempFilePath)

//   return result
// }

const uploadImageManager = async (req) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "file-upload",
    }
  )
  fs.unlinkSync(req.files.image.tempFilePath)

  return result
}

const uploadFileManager = async (req) => {
  const result = await cloudinary.uploader.upload(req.files.file.tempFilePath, {
    use_filename: true,
    folder: "file-upload",
  })
  fs.unlinkSync(req.files.file.tempFilePath)

  return result
}

module.exports = {
  uploadFileManager,
  uploadImageManager,
}
