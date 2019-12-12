import Profile from '../db/models/profileModel'
import mongoose from 'mongoose'
import { ApolloError } from 'apollo-server'

exports.getRoles = async (userId) => {
    return Profile.findOne({ _id: mongoose.Types.ObjectId(userId) })
        .then((profile) => {
            return profile?.roles
        })
}

exports.addRole = async (args) => {
    const userId = args.userId
    const role = args.role

    return Profile.findOne({ _id: mongoose.Types.ObjectId(userId) })
        .then((profile) => {
            if (profile.roles.indexOf(role) === -1) {
                profile.roles.push(role)
            }
            return Profile.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, profile, { new: true, returnNewDocument: true, useFindAndModify: false })
                .then((result) => {
                    return result?.roles
                })
        })
}

exports.removeRole = async (args) => {
    const userId = args.userId
    const role = args.role

    return Profile.findOne({ _id: mongoose.Types.ObjectId(userId) })
        .then((profile) => {
            var index = profile.roles.indexOf(role)
            if (index > -1) {
                profile.roles.splice(index, 1)
            }

            return Profile.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, profile, { new: true, returnNewDocument: true, useFindAndModify: false })
                .then((result) => {
                    return result?.roles
                })
        })
}