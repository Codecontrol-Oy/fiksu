import mongoose from 'mongoose'
import savedConsumptionSchema from './savedConsumptionSchema'
import Const from '../../constants'

module.exports = mongoose.model(Const.MONGO_SAVED_CONSUMPTION, savedConsumptionSchema)