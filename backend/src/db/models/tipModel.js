import mongoose from 'mongoose'
import tipSchema from './tipSchema'
import Const from '../../constants'

module.exports = mongoose.model(Const.MONGO_TIPS, tipSchema)