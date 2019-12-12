import mongoose from 'mongoose'
import measurementSchema from './measurementSchema'
import Const from '../../constants'

module.exports = mongoose.model(Const.MONGO_MEASUREMENT, measurementSchema)