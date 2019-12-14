import mongoose from 'mongoose'
import ecoActionTypeSchema from './ecoActionTypeSchema'
import Const from '../../constants'

module.exports = mongoose.model(Const.MONGO_ECOACTION_TYPE, ecoActionTypeSchema)