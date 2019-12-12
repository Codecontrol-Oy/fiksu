import mongoose from 'mongoose'
import Const from '../../constants'
import container from '#translate'
const localeService = container.resolve('localeService')

const Schema = mongoose.Schema
const tipSchema = mongoose.Schema({
  title: {
    type: String, required: [true, function () {
      return localeService.translate('TITLE_REQUIRED');
    }]
  },
  description: {
    type: String, required: [true, function () {
      return localeService.translate('DESCRIPTION_REQUIRED');
    }]
  },
  enabled: { type: Boolean },
  visibleDate: {
    type: Date, required: [true, function () {
      return localeService.translate('VISIBLEDATE_REQUIRED');
    }]
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: Const.MONGO_PROFILE },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: Const.MONGO_PROFILE }
}, {
  timestamps: true
})
export default tipSchema