import mongoose from 'mongoose'
import resetSchema from './resetSchema'

module.exports = mongoose.model('reset', resetSchema)