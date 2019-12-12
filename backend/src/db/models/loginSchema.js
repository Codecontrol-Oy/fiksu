import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import Const from '../../constants'
require('mongoose-type-email');
import container from '#translate'
const localeService = container.resolve('localeService')

const Schema = mongoose.Schema
const loginSchema = mongoose.Schema({
  normalizedNickName: {
    type: String, required: [true, function () {
      return localeService.translate('NICKNAME_REQUIRED');
    }], unique: true
  },
  nickname: {
    type: String, required: [true, function () {
      return localeService.translate('NICKNAME_REQUIRED');
    }], unique: true, uniqueCaseInsensitive: true
  },
  password: {
    type: String, required: [true, function () {
      return localeService.translate('PASSWORD_REQUIRED');
    }]
  },
  salt: { type: String, required: true },
  userConfirmed: Boolean,
  passwordReset: { type: mongoose.Schema.Types.ObjectId, ref: Const.MONGO_RESET },
  verificationToken: String,
  email: {
    type: mongoose.SchemaTypes.Email, required: [true, function () {
      return localeService.translate('EMAIL_REQUIRED');
    }], unique: true, uniqueCaseInsensitive: true
  },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: Const.MONGO_PROFILE },
}, {
  timestamps: true
})
loginSchema.plugin(uniqueValidator, {
  message: function (args) {
    switch (args.path) {
      case "nickname":
        return localeService.translate('NICKNAME_UNIQUE')
      case "email":
        return localeService.translate('EMAIL_UNIQUE')
      case "normalizedNickName":
        return localeService.translate('NICKNAME_UNIQUE')
    }
    return localeService.translate('MONGOOSE_UNIQUE').replace('{VALUE}', args.value)
  }
})
export default loginSchema