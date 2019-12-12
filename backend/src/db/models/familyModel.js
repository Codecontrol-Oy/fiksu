import mongoose from 'mongoose'
import familySchema from './familySchema'
import Const from '../../constants'

module.exports = mongoose.model(Const.MONGO_FAMILY, familySchema)