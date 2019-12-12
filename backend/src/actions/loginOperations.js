import Login from '../db/models/loginModel'
import mongoose from 'mongoose'

exports.getLogin = async (loginId) => {
    return Login.findOne({ _id: mongoose.Types.ObjectId(loginId) })
}