import mongoose from 'mongoose'
const Schema = mongoose.Schema
const measurementSchema = mongoose.Schema({
  userId: { type: String, required: true },
  value: { type: Number, required: true },
  date: { type: Date, required: true }
}, {
  timestamps: true
})
export default measurementSchema