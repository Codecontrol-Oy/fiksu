import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import Const from '../../constants'
import container from '#translate'
const localeService = container.resolve('localeService')

const Schema = mongoose.Schema
const familySchema = mongoose.Schema({
  name: {
    type: String, required: [true, function () {
      return localeService.translate('NAME_REQUIRED');
    }]
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId, required: [true, function () {
      return localeService.translate('OWNER_REQUIRED');
    }], unique: true
  },
  adminIds: { type: [mongoose.Schema.Types.ObjectId] },
  memberIds: { type: [mongoose.Schema.Types.ObjectId] },
  pendingIds: { type: [mongoose.Schema.Types.ObjectId] }
}, {
  timestamps: true
})
familySchema.plugin(uniqueValidator, {
  message: function (args) {
    switch (args.path) {
      case "ownerId":
        return localeService.translate('OWNER_UNIQUE')
    }
    return localeService.translate('MONGOOSE_UNIQUE').replace('{VALUE}', args.value)
  }
})
export default familySchema