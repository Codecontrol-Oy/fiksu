import SavedConsumption from '../db/models/savedConsumptionModel'
import Family from '../db/models/familyModel'
import mongoose from 'mongoose'
import { ApolloError } from 'apollo-server'
import container from '#translate'
const localeService = container.resolve('localeService')

exports.createSavedConsumption = async (args, context) => {
    return Family.findOne({
        $and: [
            { _id: args.savedConsumption.householdId },
            { $or: [{ ownerId: context.user._id }, { memberIds: context.user._id }, { adminIds: context.user._id }] }
        ]
    }).then((household) => {
        if (!household) {
            throw new ApolloError(localeService.translate('FAMILY_MEMBER_NOT_FOUND'))
        }

        if (args.savedConsumption.value < 0) {
            throw new ApolloError(localeService.translate('SAVED_CONSUMPTION_NEGATIVE'))
        }

        if (args.savedConsumption.notes && args.savedConsumption.notes.notes > 255) {
            throw new ApolloError(localeService.translate('SAVED_CONSUMPTION_NOTES_TOO_LONG'))
        }

        let consumption = {
            householdId: args.savedConsumption.householdId,
            userId: context.user._id,
            consumptionTypeId: args.savedConsumption.consumptionTypeId,
            value: args.savedConsumption.value,
            notes: args.savedConsumption.notes,
            date: new Date(args.savedConsumption.date)
        }
        return SavedConsumption.create(consumption)
    })
}

exports.getSavedConsumptions = async (args) => {
    const from = new Date(args.from)
    const to = new Date(args.to)
    return SavedConsumption.find({ householdId: args.householdId, date: { "$gte": from, "$lt": to } }).sort({ date: -1 })
}

exports.getAllSavedConsumptions = async (args) => {
    return SavedConsumption.find({ householdId: args.householdId }).sort({ date: -1 })
}

exports.removeSavedConsumption = async (args) => {
    return SavedConsumption.findOne({ _id: mongoose.Types.ObjectId(args._id) })
        .then((result) => {
            if (result) {
                return SavedConsumption.findOneAndRemove({ _id: mongoose.Types.ObjectId(args._id) }, { useFindAndModify: false })
            } else {
                throw new ApolloError("No such object!")
            }
        })
}