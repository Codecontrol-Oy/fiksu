import SavedEcoAction from '../db/models/savedEcoActionModel'
import EcoActionTypeModel from '../db/models/ecoActionTypeModel'
import mongoose from 'mongoose'
import { ApolloError } from 'apollo-server'
import container from '#translate'
const localeService = container.resolve('localeService')

exports.createSavedEcoAction = async (args, context) => {
    return EcoActionTypeModel.findOne({ _id: mongoose.Types.ObjectId(args.savedEcoAction.ecoActionTypeId) })
        .then((ecoActionType) => {
            if (!ecoActionType) {
                throw new ApolloError(localeService.translate('ECOACTIONTYPE_NOT_FOUND'))
            }

            let ecoAction = {
                userId: context.user._id,
                ecoActionTypeId: args.savedEcoAction.ecoActionTypeId,
                value: args.savedEcoAction.value,
                date: new Date(args.savedEcoAction.date)
            }

            return SavedEcoAction.create(ecoAction)
        })
}

exports.getSavedEcoActions = async (args) => {
    const from = new Date(args.from)
    const to = new Date(args.to)
    return SavedEcoAction.find({ userId: args.userId, date: { "$gte": from, "$lt": to } })
}

exports.getAllSavedEcoActions = async (args) => {
    return SavedEcoAction.find({ userId: args.userId })
}

exports.removeSavedEcoAction = async (args) => {
    return SavedEcoAction.findOne({ _id: mongoose.Types.ObjectId(args._id) })
        .then((result) => {
            if (result) {
                return SavedEcoAction.findOneAndRemove({ _id: mongoose.Types.ObjectId(args._id) }, { useFindAndModify: false })
            } else {
                throw new ApolloError("No such object!")
            }
        })
}