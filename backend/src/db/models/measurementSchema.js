import mongoose from 'mongoose'
import Const from '#constants'
const Schema = mongoose.Schema
const measurementSchema = mongoose.Schema({
  householdId: { type: String, ref: Const.MONGO_FAMILY, required: true },
  userId: { type: String, required: true },
  value: { type: Number, required: true },
  date: { type: Date, required: true }
}, {
  timestamps: true
})
export default measurementSchema