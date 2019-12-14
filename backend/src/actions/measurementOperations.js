import Measurement from '../db/models/measurementModel'
import Family from '../db/models/familyModel'
import mongoose from 'mongoose'
import { ApolloError } from 'apollo-server'
import container from '#translate'
const localeService = container.resolve('localeService')

exports.getMeasurements = async (args) => {
    const from = new Date(args.from)
    const to = new Date(args.to)
    return Measurement.find({ householdId: args.householdId, date: { "$gte": from, "$lt": to } })
}

exports.createMeasurement = async (args, context) => {
    return Family.findOne({
        $and: [
            { _id: args.householdId },
            { $or: [{ ownerId: context.user._id }, { memberIds: context.user._id }, { adminIds: context.user._id }] }
        ]
    }).then((household) => {
        if (!household) {
            throw new ApolloError(localeService.translate('FAMILY_MEMBER_NOT_FOUND'))
        }

        const date = new Date(args.date)
        const measurement = {
            value: args.value,
            date: date,
            userId: context.user._id,
            householdId: args.householdId
        }
        const from = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
        let to = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
        to.setDate(to.getDate() + 1)
        return Measurement.findOneAndRemove({ householdId: args.householdId, date: { "$gte": from, "$lt": to } }, { useFindAndModify: false })
            .then(() => {
                return Measurement.create(measurement)
            })
    })
}

exports.deleteMeasurement = async (args) => {
    return Measurement.findOne({ _id: mongoose.Types.ObjectId(args._id) })
        .then((result) => {
            if (result) {
                return Measurement.findOneAndRemove({ _id: mongoose.Types.ObjectId(args._id) }, { useFindAndModify: false })
            } else {
                throw new ApolloError("No such object!")
            }
        })
}