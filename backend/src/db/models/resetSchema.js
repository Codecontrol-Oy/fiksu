import mongoose from 'mongoose'

const Schema = mongoose.Schema
const resetSchema = mongoose.Schema({
  expireDate: { type: Date, required: true },
  verificationToken: { type: String, required: true }
}, {
  timestamps: true
})

export default resetSchema