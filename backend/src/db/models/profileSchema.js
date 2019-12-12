import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
require('mongoose-type-email');

const Schema = mongoose.Schema
const profileSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickname: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  userConfirmed: Boolean,
  passwordReset: { type: mongoose.Schema.Types.ObjectId, ref: 'reset' },
  verificationToken: String,
  email: { type: mongoose.SchemaTypes.Email, required: true, unique: true }
}, {
  timestamps: true
})
profileSchema.plugin(uniqueValidator)
export default profileSchema