import mongoose from 'mongoose'
const Schema = mongoose.Schema
const savedConsumptionSchema = mongoose.Schema({
  userId: { type: String, required: true },
  consumptionTypeId: { type: String, required: true },
  value: { type: String, required: true },
  date: { type: Date, required: true }
}, {
  timestamps: true
})
export default savedConsumptionSchema