import Tip from '../db/models/tipModel'
import mongoose from 'mongoose'
import { ApolloError } from 'apollo-server'

exports.createTip = async (args, user) => {
    args.tip.createdBy = user._id
    args.tip.updatedBy = user._id
    return Tip.create(args.tip)
}

exports.getTip = async (args) => {
    return Tip.findOne({ _id: mongoose.Types.ObjectId(args._id) })
}

exports.updateTip = async (args, user) => {
    args.tip.updatedBy = user._id
    return Tip.findOneAndUpdate({ _id: mongoose.Types.ObjectId(args.tip._id) }, args.tip, { new: true, returnNewDocument: true, useFindAndModify: false })
}

exports.deleteTip = async (args) => {
    return Tip.findOne({ _id: mongoose.Types.ObjectId(args._id) })
        .then((result) => {
            if (result) {
                return Tip.findOneAndRemove({ _id: mongoose.Types.ObjectId(args._id) }, { useFindAndModify: false })
            } else {
                throw new ApolloError("No such object!")
            }
        })
}

exports.getAllTips = async (args) => {
    if (args.filter && args.filter.date) {
        let startDate = new Date(args.filter.date)
        let endDate = new Date(args.filter.date)
        endDate.setDate(endDate.getDate() + 1)

        return Tip.find({ visibleDate: { "$gte": startDate, "$lt": endDate } })
    }
    return Tip.find({})
}