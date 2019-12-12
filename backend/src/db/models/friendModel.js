import mongoose from 'mongoose'
import friendSchema from './friendSchema'
import Const from '../../constants'

module.exports = mongoose.model(Const.MONGO_FRIEND, friendSchema)