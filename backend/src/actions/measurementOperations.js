import Measurement from '../db/models/measurementModel'
import mongoose from 'mongoose'
import { ApolloError } from 'apollo-server'

exports.getMeasurements = async (args) => {
    const from = new Date(args.from)
    const to = new Date(args.to)
    return Measurement.find({ userId: args.userId, date: { "$gte": from, "$lt": to } })
}

exports.createMeasurement = async (args) => {
    const date = new Date(args.date)
    const measurement = {
        value: args.value,
        date: date,
        userId: args.userId
    }
    const from = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
    let to = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
    to.setDate(to.getDate() + 1)
    return Measurement.findOneAndRemove({ userId: args.userId, date: { "$gte": from, "$lt": to } }, { useFindAndModify: false })
        .then(() => {
            return Measurement.create(measurement)
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