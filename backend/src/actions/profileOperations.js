import Profile from '../db/models/profileModel'
import Reset from '../db/models/resetModel'
import RandomString from 'randomstring'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { ApolloError } from 'apollo-server'
import Email from '../messageQueue/email'
import config from 'config'

exports.logIn = (username, password) => {
    let user = Profile.findOne({ nickname: username }).then((result) => {
        if (result) {
            const hash = crypto.createHmac('sha256', process.env.PROFILE_HASH_SECRET || config.profileHashSecret)
                .update(password + result.salt)
                .digest('hex')

            if (result.password != hash) {
                return null
            }

            return Profile.findOne({ nickname: username, password: hash }).select('-password -passwordReset -salt -verificationToken -__v')
                .then((result) => {
                    if (result) {
                        var token = jwt.sign({ user: result }, process.env.PROFILE_JWT_SECRET || config.profileJWTSecret)
                        let resultUser = result
                        resultUser['token'] = token.toString()
                        return resultUser
                    } else {
                        return null
                    }
                })
        } else {
            return null
        }
    })

    return user
}

exports.createProfile = async (args) => {
    let user = args.user
    user.salt = RandomString.generate()
    user.verificationToken = RandomString.generate()
    user.password = crypto.createHmac('sha256', process.env.PROFILE_HASH_SECRET || config.profileHashSecret)
        .update(user.password + user.salt)
        .digest('hex')
    return Profile.create(user).then((result) => {
        // Send email
        const email = new Email()
        email.send({
            template: 'newUser',
            user: {
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email
            },
            data: {
                verificationLink: `verify/${result.nickname}/${result.verificationToken}`
            }
        })

        return result
    })
}

exports.getProfile = async (userId) => {
    return Profile.findOne({ _id: mongoose.Types.ObjectId(userId) })
}

exports.updateProfile = async (args) => {
    return Profile.findOneAndUpdate({ _id: mongoose.Types.ObjectId(args.user._id) }, args.user, { returnNewDocument: true, useFindAndModify: false })
}

exports.confirmProfile = async (username, verificationToken) => {
    return Profile.findOneAndUpdate({ nickname: username, verificationToken: verificationToken }, { userConfirmed: true }, { returnNewDocument: true, useFindAndModify: false })
        .then((result) => {
            if (result != null) return true
            else return false
        })
}

exports.deleteProfile = async (args) => {
    return Profile.findOne({ _id: mongoose.Types.ObjectId(args._id) })
        .then((result) => {
            if (result) {
                return Profile.findOneAndRemove({ _id: mongoose.Types.ObjectId(args._id) }, { useFindAndModify: false })
            } else {
                throw new ApolloError("No such object!")
            }
        })
}

exports.getAllProfiles = async () => {
    return Profile.find({})
}

exports.createPasswordReset = async (username) => {
    return Profile.findOne({ nickname: username }).populate('passwordReset').then(async (result) => {
        if (result == null) return

        // Remove existing password reset if present
        if (result.passwordReset != null) {
            await Reset.findOneAndRemove({ _id: result.passwordReset._id }, { useFindAndModify: false })
        }

        let expireDate = new Date()
        expireDate.setDate(expireDate.getDate() + 1)
        const pwReset = new Reset({
            _id: new mongoose.Types.ObjectId(),
            expireDate: expireDate,
            verificationToken: RandomString.generate()
        })

        return Reset.create(pwReset).then((result) => {
            if (result == null) return false

            return Profile.findOneAndUpdate({ nickname: username }, { passwordReset: pwReset._id }, { returnNewDocument: true, useFindAndModify: false })
                .then((result) => {
                    if (result != null) {
                        // Send email
                        const email = new Email()
                        email.send({
                            template: 'resetPassword',
                            user: {
                                firstName: result.firstName,
                                lastName: result.lastName,
                                email: result.email
                            },
                            data: {
                                resetLink: `reset/${result.nickname}/${pwReset.verificationToken}`
                            }
                        })

                        return true
                    }
                    else return false
                })
        })
    })
}

exports.confirmPasswordReset = async (username, verificationToken, newPassword) => {
    return Profile.findOne({ nickname: username }).populate('passwordReset').then((user) => {
        if (user == null || user.passwordReset == null || user.passwordReset.verificationToken != verificationToken) {
            throw new ApolloError("Invalid verification token!")
        }

        user.salt = RandomString.generate()
        user.password = crypto.createHmac('sha256', process.env.PROFILE_HASH_SECRET || config.profileHashSecret)
            .update(newPassword + user.salt)
            .digest('hex')

        user.passwordReset = null
        return Profile.findOneAndUpdate({ _id: user._id }, user, { returnNewDocument: true, useFindAndModify: false })
            .then((result) => {
                if (result != null) {
                    Reset.findOneAndRemove({ _id: result.passwordReset._id }, { useFindAndModify: false }).then((result))

                    return true
                }
                else return false
            })
    })
}