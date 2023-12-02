const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps, fileModifier } = require("../../utils/index")
const { CustomError } = require("../../utils/errors")
const { ContractService } = require("./contract.service")
const mongoose = require("mongoose")

const createContractController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ContractService.createContract(req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const fetchContractController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ContractService.fetchContract(req.query, res.locals.jwt)
  )

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const updateContractController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ContractService.updateContractService(req.params.id, req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const fetchContractFilesController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ContractService.fetchContract(req.query, res.locals.jwt)
  )
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  createContractController,
  fetchContractController,
  updateContractController,
  fetchContractFilesController,
}
