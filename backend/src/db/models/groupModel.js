import mongoose from 'mongoose'
import groupSchema from './groupSchema'
import Const from '../../constants'

module.exports = mongoose.model(Const.MONGO_GROUP, groupSchema)