import mongoose from 'mongoose'
import Const from '../../constants'
import container from '#translate'
const localeService = container.resolve('localeService')

const Schema = mongoose.Schema
const profileSchema = mongoose.Schema({
  firstName: {
    type: String, required: [true, function () {
      return localeService.translate('FIRSTNAME_REQUIRED');
    }]
  },
  lastName: { type: String, required: [true, function () {
    return localeService.translate('LASTNAME_REQUIRED');
  }] },
  birthDate: { type: Date, required: [true, function () {
    return localeService.translate('BIRTHDATE_REQUIRED');
  }] },
  address: {
    city: { type: String, required: [true, function () {
      return localeService.translate('ADDRESS_CITY_REQUIRED');
    }] }
  },
  roles: { type: [String] },
  permissions: {
    showRealName: {
      type: String,
      enum: [Const.PERMISSION_NONE, Const.PERMISSION_FRIEND_ONLY, Const.PERMISSION_PUBLIC],
      default: Const.PERMISSION_NONE
    },
    showEmail: {
      type: String,
      enum: [Const.PERMISSION_NONE, Const.PERMISSION_FRIEND_ONLY, Const.PERMISSION_PUBLIC],
      default: Const.PERMISSION_NONE
    },
    showBirthDate: {
      type: String,
      enum: [Const.PERMISSION_NONE, Const.PERMISSION_FRIEND_ONLY, Const.PERMISSION_PUBLIC],
      default: Const.PERMISSION_NONE
    },
    allowPushNotifications: { type: Boolean },
    allowEmailNotifications: { type: Boolean }
  },
  loginId: { type: mongoose.Schema.Types.ObjectId, ref: Const.MONGO_LOGIN },
}, {
  timestamps: true
})
export default profileSchema