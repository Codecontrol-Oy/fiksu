import mongoose from 'mongoose'
import savedEcoActionSchema from './savedEcoActionSchema'
import Const from '../../constants'

module.exports = mongoose.model(Const.MONGO_SAVED_ECOACTIONS, savedEcoActionSchema)