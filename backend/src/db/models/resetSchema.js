import mongoose from 'mongoose'
import container from '#translate'
const localeService = container.resolve('localeService')

const Schema = mongoose.Schema
const resetSchema = mongoose.Schema({
  expireDate: {
    type: Date, required: [true, function () {
      return localeService.translate('EXPIREDATE_REQUIRED');
    }]
  },
  verificationToken: {
    type: String, required: [true, function () {
      return localeService.translate('VERIFICATIONTOKEN_REQUIRED');
    }]
  }
}, {
  timestamps: true
})

export default resetSchema