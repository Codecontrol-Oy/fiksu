import EcoActionTypeModel from '../db/models/ecoActionTypeModel'
import mongoose from 'mongoose'
import { ApolloError } from 'apollo-server'

exports.getEcoActionTypes = () => {
    return EcoActionTypeModel.find({})
}

exports.getEcoActionType = (args) => {
    return EcoActionTypeModel.findOne({ _id: mongoose.Types.ObjectId(args.ecoActionTypeId) })
}