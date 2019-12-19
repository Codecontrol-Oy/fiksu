import mongoose from 'mongoose'
import Const from '#constants'
const Schema = mongoose.Schema
const savedConsumptionSchema = mongoose.Schema({
  householdId: { type: String, ref: Const.MONGO_FAMILY, required: true },
  userId: { type: String, required: true },
  consumptionTypeId: { type: String, ref: Const.MONGO_CONSUMPTION_TYPE, required: true },
  value: { type: String, required: true },
  notes: { type: String },
  date: { type: Date, required: true }
}, {
  timestamps: true
})
export default savedConsumptionSchema