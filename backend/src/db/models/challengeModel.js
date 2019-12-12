import mongoose from 'mongoose'
import challengeSchema from './challengeSchema'
import Const from '../../constants'

module.exports = mongoose.model(Const.MONGO_CHALLENGE, challengeSchema)