import mongoose from 'mongoose'
import resetSchema from './resetSchema'
import Const from '../../constants'

module.exports = mongoose.model(Const.MONGO_RESET, resetSchema)