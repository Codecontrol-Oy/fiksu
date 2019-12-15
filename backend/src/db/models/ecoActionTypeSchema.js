import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ecoActionTypeSchema = mongoose.Schema({
  title: { type: String },
  description: { type: String },
  amount: { type: Number },
  icon: { type: String }
}, {
  timestamps: true
})
export default ecoActionTypeSchema