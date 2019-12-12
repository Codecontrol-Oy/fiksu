import mongoose from 'mongoose'
import Const from '../../constants'

const Schema = mongoose.Schema
const friendSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: Const.MONGO_PROFILE },
  friendId: { type: mongoose.Schema.Types.ObjectId, ref: Const.MONGO_PROFILE },
  status: {
    type: String,
    enum: [Const.STATUS_PENDING, Const.STATUS_APPROVED, Const.STATUS_REJECTED],
    default: Const.STATUS_PENDING
  }
}, {
  timestamps: true
})
export default friendSchema