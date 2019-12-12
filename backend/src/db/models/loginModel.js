import mongoose from 'mongoose'
import loginSchema from './loginSchema'
import Const from '../../constants'

module.exports = mongoose.model(Const.MONGO_LOGIN, loginSchema)