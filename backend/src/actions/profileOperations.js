import Login from '../db/models/loginModel'
import Profile from '../db/models/profileModel'
import Reset from '../db/models/resetModel'
import Family from '../db/models/familyModel'
import Group from '../db/models/groupModel'
import RandomString from 'randomstring'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { ApolloError } from 'apollo-server'
import Email from '../messageQueue/email'
import config from 'config'
import util from 'util'
import container from '#translate'
const localeService = container.resolve('localeService')
import Const from '#constants'

function removeSensitiveInformation(profile) {
    return profile.select('user roles _id nickname firstName lastName createdAt updatedAt')
}

exports.logIn = (username, password) => {
    let user = Login.findOne({ normalizedNickName: username.toUpperCase() }).populate('profileId').then((result) => {
        if (result) {
            const hash = crypto.createHmac('sha256', process.env.PROFILE_HASH_SECRET || config.profileHashSecret)
                .update(password + result.salt)
                .digest('hex')

            if (result.password != hash) {
                return null
            }

            if (result) {
                let userInfo = {
                    _id: result.profileId._id,
                    roles: result.roles,
                    nickname: result.nickname,
                    firstName: result.profileId.firstName,
                    lastName: result.profileId.lastName,
                    createdAt: result.profileId.createdAt,
                    updatedAt: result.profileId.updatedAt,
                    roles: result.profileId.roles
                }
                var token = jwt.sign({ user: userInfo }, process.env.PROFILE_JWT_SECRET || config.profileJWTSecret, {
                    expiresIn: parseInt(process.env.PROFILE_JWT_LIFETIME, 10) || parseInt(config.profileJWTLifeTime, 10)
                })
                var refreshToken = jwt.sign({ user: userInfo._id }, process.env.REFRESH_JWT_SECRET || config.refreshJWTSecret, {
                    expiresIn: parseInt(process.env.REFRESH_JWT_LIFETIME, 10) || parseInt(config.refreshJWTLifeTime, 10)
                })
                let resultUser = userInfo
                resultUser['token'] = token.toString()
                resultUser['refreshToken'] = refreshToken.toString()
                return resultUser
            } else {
                return null
            }
        } else {
            return null
        }
    })

    return user
}

exports.refreshToken = async (refreshToken) => {
    var payload;
    try {
        payload = await util.promisify(jwt.verify)(refreshToken, process.env.REFRESH_JWT_SECRET)
    }
    catch (ex) {
        if (ex.name == 'TokenExpiredError') {
            throw new ApolloError(localeService.translate('TOKEN_EXPIRED'), 'TokenExpiredError')
        }

        throw ex
    }

    let user = removeSensitiveInformation(Profile.findOne({ _id: payload.user }))
        //.select('-password -passwordReset -salt -verificationToken -__v -normalizedNickName')
        .then((result) => {
            if (result) {
                var token = jwt.sign({ user: result }, process.env.PROFILE_JWT_SECRET || config.profileJWTSecret, {
                    expiresIn: parseInt(process.env.PROFILE_JWT_LIFETIME, 10) || parseInt(config.profileJWTLifeTime, 10)
                })
                // var refreshToken = jwt.sign({ user: result._id }, process.env.REFRESH_JWT_SECRET || config.refreshJWTSecret, {
                //     expiresIn: process.env.REFRESH_JWT_LIFETIME || config.refreshJWTLifeTime
                // })

                //resultUser['refreshToken'] = refreshToken.toString()
                return {
                    token: token.toString(),
                    refreshToken: refreshToken.toString()
                }
            } else {
                return null
            }
        })

    return user
}

exports.emailTaken = async (email) => {
    return Login.findOne({ email: email })
        .then((login) => {
            return login != null
        })
}

function validatePassword(password) {
    if (!password.length) {
        throw new ApolloError(localeService.translate('PASSWORD_REQUIRED'), null, {
            errors: {
                password: localeService.translate('PASSWORD_REQUIRED')
            }
        })
    }
    if (password.length < Const.DEFAULT_MIN_PASSWORD_LENGTH) {
        throw new ApolloError(localeService.translate('PASSWORD_MIN_REQUIRED', { minLen: Const.DEFAULT_MIN_PASSWORD_LENGTH }), null, {
            errors: {
                password: localeService.translate('PASSWORD_MIN_REQUIRED')
            }
        })
    }
    if (!/\d/.test(password)) { // At least one number
        throw new ApolloError(localeService.translate('PASSWORD_COMPLEXITY_FAILED'), null, {
            errors: {
                password: localeService.translate('PASSWORD_COMPLEXITY_FAILED')
            }
        })
    }
    if (!/[a-z]/.test(password)) { // At least one lowercase char [a-z]
        throw new ApolloError(localeService.translate('PASSWORD_COMPLEXITY_FAILED'), null, {
            errors: {
                password: localeService.translate('PASSWORD_COMPLEXITY_FAILED')
            }
        })
    }
    if (!/[A-Z]/.test(password)) { // At least one uppercase char [A-Z]
        throw new ApolloError(localeService.translate('PASSWORD_COMPLEXITY_FAILED'), null, {
            errors: {
                password: localeService.translate('PASSWORD_COMPLEXITY_FAILED')
            }
        })
    }
    if (!/[!@#\$%\^&]/.test(password)) { // At least one special character
        throw new ApolloError(localeService.translate('PASSWORD_COMPLEXITY_FAILED'), null, {
            errors: {
                password: localeService.translate('PASSWORD_COMPLEXITY_FAILED')
            }
        })
    }
}

exports.createProfile = async (args) => {
    let user = args.user
    let loginId = mongoose.Types.ObjectId()

    validatePassword(user.password)

    let profile = new Profile({
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        address: {
            city: user?.address?.city
        },
        loginId: loginId,
    })

    return Profile.create(profile).then((profileResult) => {
        if (!profileResult) {
            throw new ApolloError(localeService.translate('PROFILE_CREATE_ERROR'))
        }

        let salt = RandomString.generate()
        let login = new Login({
            _id: loginId,
            nickname: user.nickname,
            normalizedNickName: user.nickname.toUpperCase(),
            salt: salt,
            verificationToken: RandomString.generate(),
            password: crypto.createHmac('sha256', process.env.PROFILE_HASH_SECRET || config.profileHashSecret)
                .update(user.password + salt)
                .digest('hex'),
            email: user.email,
            profileId: profileResult._id
        })
        return Login.create(login).then((loginResult) => {

            // Send email
            const email = new Email()
            email.send({
                template: 'newUser',
                user: {
                    firstName: profileResult.firstName,
                    lastName: loginResult.lastName,
                    email: loginResult.email
                },
                data: {
                    verificationLink: `verify/${loginResult.nickname}/${loginResult.verificationToken}`
                }
            })

            return true
        })
            .catch(async (err) => {
                try {
                    await Profile.findOneAndRemove({ _id: profileResult._id }, { useFindAndModify: false })
                }
                catch (ex) {
                    // Suppress if there are any errors. There shouldn't be but if there are, the only drawback will be bloat in the database
                    console.error(ex)
                }
                throw err
            })
    })
}

exports.getProfile = async (userId) => {
    return Profile.findOne({ _id: mongoose.Types.ObjectId(userId) })
}

exports.getProfiles = async (userIds) => {
    return Profile.find({
        _id: {
            $in: userIds
        }
    })
}

exports.updateProfile = async (args) => {
    return Profile.findOneAndUpdate({ _id: mongoose.Types.ObjectId(args.user._id) }, args.user, { new: true, returnNewDocument: true, useFindAndModify: false })
}

exports.confirmProfile = async (username, verificationToken) => {
    return Login.findOneAndUpdate({ normalizedNickName: username.toUpperCase(), verificationToken: verificationToken }, { userConfirmed: true }, { new: true, returnNewDocument: true, useFindAndModify: false })
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
                throw new ApolloError(localeService.translate('PROFILE_NOT_FOUND'))
            }
        })
}

exports.getAllProfiles = async () => {
    return Profile.find({})
}

exports.createPasswordReset = async (username) => {
    return Login.findOne({ normalizedNickName: username.toUpperCase() }).populate('passwordReset').then(async (result) => {
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

            return Login.findOneAndUpdate({ normalizedNickName: username.toUpperCase() }, { passwordReset: pwReset._id }, { new: true, returnNewDocument: true, useFindAndModify: false })
                .populate('profileId')
                .then((result) => {
                    if (result != null) {
                        // Send email
                        const email = new Email()
                        email.send({
                            template: 'resetPassword',
                            user: {
                                firstName: result.profileId.firstName,
                                lastName: result.profileId.lastName,
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
    return Login.findOne({ normalizedNickName: username.toUpperCase() }).populate('passwordReset').then((user) => {
        if (user == null || user.passwordReset == null || user.passwordReset.verificationToken != verificationToken) {
            throw new ApolloError(localeService.translate('PROFILE_INVALID_TOKEN'))
        }

        user.salt = RandomString.generate()
        user.password = crypto.createHmac('sha256', process.env.PROFILE_HASH_SECRET || config.profileHashSecret)
            .update(newPassword + user.salt)
            .digest('hex')

        user.passwordReset = null
        return Login.findOneAndUpdate({ _id: user._id }, user, { useFindAndModify: false })
            .then((result) => {
                if (result != null) {
                    Reset.findOneAndRemove({ _id: result.passwordReset._id }, { useFindAndModify: false }).then((result))

                    return true
                }
                else return false
            })
    })
}

exports.searchUser = async (args) => {
    const search = args.search.split(' ')
    const familyIds = await getFamilyMemberIds(args.familyId)
    const groupIds = await getGroupMemberIds(args.groupId)
    let userIdsFilterOut = [...familyIds, ...groupIds]

    if (search.length == 1) {
        let nickname = search[0]

        return Login.findOne({ normalizedNickName: nickname.toUpperCase(), profileId: { $nin: userIdsFilterOut } })
            .populate('profileId')
            .then((result) => {
                if (result) return result.profileId
                else return null
            })
    }
    else if (search.length > 1) {
        let firstName = search[0]
        let lastName = search[search.length - 1]

        return Profile.find({ $and: [
            { _id: { $nin: userIdsFilterOut } },
            { firstName: { $regex : new RegExp(firstName, "i") } }, 
            { lastName: { $regex : new RegExp(lastName, "i") } }, 
            { 'permissions.showRealName': Const.PERMISSION_PUBLIC }
        ] })
    }
    
    return null
}

function getFamilyMemberIds(familyId) {
    if (!familyId || familyId.length != 24) return []
    return Family.findOne({ _id: mongoose.Types.ObjectId(familyId) })
        .then((family) => {
            if (family) {
                return [family.ownerId, ...family.adminIds, ...family.memberIds, ...family.pendingIds]
            }

            return []
        })
}

function getGroupMemberIds(groupId) {
    if (!groupId || groupId.length != 24) return []
    return Group.findOne({ _id: mongoose.Types.ObjectId(groupId) })
        .then((group) => {
            if (group) {
                return [group.ownerId, ...group.adminIds, ...group.memberIds, ...group.pendingIds, ...group.invitedIds]
            }

            return []
        })
}