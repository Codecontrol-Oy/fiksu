import mongoose from 'mongoose'
import housingSchema from './housingSchema'
import Const from '../../constants'

module.exports = mongoose.model(Const.MONGO_HOUSING, housingSchema)