import mongoose from 'mongoose'
import profileSchema from './profileSchema'
import Const from '../../constants'

module.exports = mongoose.model(Const.MONGO_PROFILE, profileSchema)