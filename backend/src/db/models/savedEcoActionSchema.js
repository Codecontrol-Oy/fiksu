import mongoose from 'mongoose'
import Const from '#constants'
const Schema = mongoose.Schema
const savedEcoActionSchema = mongoose.Schema({
  userId: { type: String, ref: Const.MONGO_PROFILE, required: true },
  ecoActionTypeId: { type: String, ref: Const.MONGO_ECOACTION_TYPE, required: true },
  value: { type: String, required: true },
  date: { type: Date, required: true }
}, {
  timestamps: true
})
export default savedEcoActionSchema