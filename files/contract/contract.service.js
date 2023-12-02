const { default: mongoose } = require("mongoose")
const { v4: uuidv4 } = require("uuid")
const moment = require("moment")
const { queryConstructor, AlphaNumeric } = require("../../utils")
const { contractMessages } = require("./contract.message")
const {
  TransactionRepository,
} = require("../transaction/transaction.repository")
const { TransactionMessages } = require("../transaction/transaction.messages")
const { ContractRepository } = require("./contract.repository")

class ContractService {
  static async createContract(payload) {
    const { randomId } = payload

    let uniqueId = randomId
    // const transaction = await TransactionRepository.fetchOne({
    //   userId: userId,
    // })

    // if (!transaction)
    //   return { success: false, msg: TransactionMessages.TRANSACTION_NOT_FOUND }

    let randomGen
    let duplicateRandomGen

    // Keep generating a new randomGen until it doesn't collide with duplicateRandomGen
    do {
      randomGen = AlphaNumeric(7, "number")
      duplicateRandomGen = await ContractRepository.fetchOne({
        $or: [{ uniqueId }, { contractId: randomGen }],
      })
    } while (duplicateRandomGen)

    // const duplicateContract = await ContractRepository.fetchOne({
    //   transaction: transaction._id,
    // })

    // if (duplicateContract)
    //   return { success: false, msg: ContractMessages.DUPLICATE }

    const contract = await ContractRepository.create({
      ...payload,
      contractId: randomGen,
      uniqueId,
    })

    if (!contract._id)
      return { success: false, msg: contractMessages.CREATE_ERROR }

    return { success: true, msg: contractMessages.CREATE }
  }

  static async fetchContract(payload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Contract"
    )

    if (error) return { success: false, msg: error }

    const contract = await ContractRepository.fetch({
      ...params,
      limit,
      skip,
      sort,
    })

    if (contract.length < 1)
      return { success: true, msg: contractMessages.NONE_FOUND, data: [] }

    return {
      success: true,
      msg: contractMessages.FETCH_SUCCESS,
      data: contract,
    }
  }

  static async updateContractService(id, payload) {
    const contract = await ContractRepository.fetchOne({
      _id: new mongoose.Types.ObjectId(id),
    })

    if (!contract._id)
      return { success: false, msg: ContractMessages.ORDER_ERROR }

    await ContractRepository.updateOrder(id, payload)

    return {
      success: true,
      msg: ContractMessages.UPDATE_SUCCESS,
    }
  }

  static async fetchContractFile(payload, locals) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Contract"
    )

    if (error) return { success: false, msg: error }

    const { _id, isAdmin } = locals

    let extra = {}

    if (!isAdmin) {
      extra = { userId: new mongoose.Types.ObjectId(_id) }
    }

    const contract = await ContractRepository.fetch({
      ...params,
      limit,
      skip,
      sort,
      ...extra,
    })

    if (contract.length < 1)
      return { success: true, msg: ContractMessages.NONE_FOUND, data: [] }

    return {
      success: true,
      msg: ContractMessages.FETCH_SUCCESS,
      data: contract,
    }
  }
}

module.exports = { ContractService }
