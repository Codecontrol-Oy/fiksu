import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import Const from '../../constants'
import container from '#translate'
const localeService = container.resolve('localeService')

const Schema = mongoose.Schema
const groupSchema = mongoose.Schema({
  name: {
    type: String, required: [true, function () {
      return localeService.translate('NAME_REQUIRED');
    }], unique: true
  },
  description: {
    type: String
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId, required: [true, function () {
      return localeService.translate('OWNER_REQUIRED');
    }]
  },
  adminIds: { type: [mongoose.Schema.Types.ObjectId] },
  memberIds: { type: [mongoose.Schema.Types.ObjectId] },
  pendingIds: { type: [mongoose.Schema.Types.ObjectId] },
  invitedIds: { type: [mongoose.Schema.Types.ObjectId] },
  permissions: {
    visibility: {
      type: String,
      enum: [Const.PERMISSION_NONE, Const.PERMISSION_PUBLIC],
      default: Const.PERMISSION_NONE
    }
  }
}, {
  timestamps: true
})
groupSchema.plugin(uniqueValidator, {
  message: function (args) {
    switch (args.path) {
      case "name":
        return localeService.translate('NAME_UNIQUE')
    }
    return localeService.translate('MONGOOSE_UNIQUE').replace('{VALUE}', args.value)
  }
})
export default groupSchema