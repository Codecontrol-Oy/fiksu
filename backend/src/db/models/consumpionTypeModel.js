import mongoose from 'mongoose'
import consumptionTypeSchema from './consumptionTypeSchema'
import Const from '../../constants'

module.exports = mongoose.model(Const.MONGO_CONSUMPTION_TYPE, consumptionTypeSchema)