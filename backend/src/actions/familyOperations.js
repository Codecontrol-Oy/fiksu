import Family from '../db/models/familyModel'
import Profile from '../db/models/profileModel'
import mongoose from 'mongoose'
import { ApolloError } from 'apollo-server'
import Email from '../messageQueue/email'
import container from '#translate'
const localeService = container.resolve('localeService')

exports.createFamily = async (args, owner) => {
    let family = {
        name: args.family.name,
        ownerId: owner._id
    }
    //family.memberIds.indexOf(owner._id) === -1 ? family.memberIds.push(owner._id) : console.log("This item already exists")

    return Family.create(family)
}

exports.getFamily = async (args) => {
    return Family.findOne({ _id: mongoose.Types.ObjectId(args._id) })
}

exports.updateFamily = async (args, user) => {
    let familyId = args.family._id
    return Family.findOne({ _id: mongoose.Types.ObjectId(familyId) })
        .then((family) => {
            if (!family) {
                throw new ApolloError(localeService.translate('FAMILY_NOT_FOUND'))
            }

            // If not owner or admin
            if (family.ownerId != user._id && !family.adminIds.some(adminId => adminId == user._id)) {
                throw new ApolloError(localeService.translate('NO_UPDATE_PERMISSION'))
            }

            family.name = args.family.name
            family.permissions = args.family.permissions

            if (family.ownerId == user._id) { // Only owner can edit
                family.adminIds = args.family.adminIds
            }

            /*
            // Admins can edit
            family.memberIds = args.family.memberIds*/

            return Family.findOneAndUpdate({ _id: mongoose.Types.ObjectId(familyId) }, family, { new: true, returnNewDocument: true, useFindAndModify: false })
        })
}

exports.addFamilyMember = async (args, user) => {
    let familyId = args.familyId
    let userId = args.userId

    return Family.findOne({ _id: mongoose.Types.ObjectId(familyId) })
        .then(async (family) => {
            if (!family) {
                throw new ApolloError(localeService.translate('FAMILY_NOT_FOUND'))
            }

            // If not owner or admin
            if (family.ownerId != user._id && !family.adminIds.some(adminId => adminId == user._id)) {
                throw new ApolloError(localeService.translate('NO_UPDATE_PERMISSION'))
            }

            // Add to pending list (if not exists)
            if (family.pendingIds == null) {
                family.pendingIds = []
            }
            if (family.ownerId != userId &&
                !family.adminIds.some(adminId => adminId == userId) &&
                !family.memberIds.some(memberId => memberId == userId) &&
                !family.pendingIds.some(memberId => memberId == userId)) {
                family.pendingIds.push(userId)

                await Profile.findOne({ _id: mongoose.Types.ObjectId(userId) })
                    .populate('loginId')
                    .then((result) => {
                        // Send email
                        const email = new Email()
                        email.send({
                            template: 'newFamilyMember',
                            user: {
                                firstName: result.firstName,
                                lastName: result.lastName,
                                email: result.loginId.email
                            },
                            family: {
                                name: family.name
                            }
                        })
                    })
            }

            return Family.findOneAndUpdate({ _id: mongoose.Types.ObjectId(familyId) }, family, { new: true, returnNewDocument: true, useFindAndModify: false })
        })
}

exports.approveFamilyMember = async (args, user) => {
    let familyId = args.familyId
    let userId = user._id

    return Family.findOne({ _id: mongoose.Types.ObjectId(familyId) })
        .then((family) => {
            if (!family) {
                throw new ApolloError(localeService.translate('FAMILY_NOT_FOUND'))
            }

            // Move from pending to members
            if (family.pendingIds.some(memberId => memberId == userId)) {
                family.pendingIds.remove(userId)
                family.memberIds.push(userId)
                return Family.findOneAndUpdate({ _id: mongoose.Types.ObjectId(familyId) }, family, { new: true, returnNewDocument: true, useFindAndModify: false })
            }

            return null
        })
}

exports.promoteFamilyMember = async (args, user) => {
    let familyId = args.familyId
    let userId = args.userId

    return Family.findOne({ _id: mongoose.Types.ObjectId(familyId) })
        .then((family) => {
            if (!family) {
                throw new ApolloError(localeService.translate('FAMILY_NOT_FOUND'))
            }

            // If not owner
            if (family.ownerId != user._id) {
                throw new ApolloError(localeService.translate('NO_UPDATE_PERMISSION'))
            }

            // Move from members to admins
            if (family.memberIds.some(memberId => memberId == userId)) {
                family.memberIds.remove(userId)
                family.adminIds.push(userId)
                return Family.findOneAndUpdate({ _id: mongoose.Types.ObjectId(familyId) }, family, { new: true, returnNewDocument: true, useFindAndModify: false })
            }

            return null
        })
}

exports.demoteFamilyMember = async (args, user) => {
    let familyId = args.familyId
    let userId = args.userId

    return Family.findOne({ _id: mongoose.Types.ObjectId(familyId) })
        .then((family) => {
            if (!family) {
                throw new ApolloError(localeService.translate('FAMILY_NOT_FOUND'))
            }

            // If not owner
            if (family.ownerId != user._id) {
                throw new ApolloError(localeService.translate('NO_UPDATE_PERMISSION'))
            }

            // Move from members to admins
            if (family.adminIds.some(adminId => adminId == userId)) {
                family.adminIds.remove(userId)
                family.memberIds.push(userId)
                return Family.findOneAndUpdate({ _id: mongoose.Types.ObjectId(familyId) }, family, { new: true, returnNewDocument: true, useFindAndModify: false })
            }

            return null
        })
}

exports.removeFamilyMember = async (args, user) => {
    let familyId = args.familyId
    let userId = args.userId

    return Family.findOne({ _id: mongoose.Types.ObjectId(familyId) })
        .then(async (family) => {
            if (!family) {
                throw new ApolloError(localeService.translate('FAMILY_NOT_FOUND'))
            }

            // Check if user exists in family
            if (family.ownerId == userId ||
                family.adminIds.some(adminId => adminId == userId) ||
                family.memberIds.some(memberId => memberId == userId) ||
                family.pendingIds.some(memberId => memberId == userId)) {

                // Can't remove owner
                if (family.ownerId == userId) {
                    throw new ApolloError(localeService.translate('FAMILY_NO_PERMISSION_OWNER'))
                }
                
                if (userId == user._id) { // Check if self
                    family.adminIds.remove(userId)
                    family.memberIds.remove(userId)
                    family.pendingIds.remove(userId)
                }
                else {
                    let isAdmin = family.ownerId == user._id || family.adminIds.some(adminId => adminId == user._id)
                    if (!isAdmin) {
                        throw new ApolloError(localeService.translate('FAMILY_NO_PERMISSION_MEMBER'))
                    }

                    if ((family.ownerId == user._id && family.adminIds.some(adminId => adminId == userId)) || family.memberIds.some(memberId => memberId == userId) || family.pendingIds.some(memberId => memberId == userId)) {
                        family.adminIds.remove(userId)
                        family.memberIds.remove(userId)
                        family.pendingIds.remove(userId)
                    }
                    else {
                        throw new ApolloError(localeService.translate('FAMILY_NO_PERMISSION_MEMBER'))
                    }
                }

                return Family.findOneAndUpdate({ _id: mongoose.Types.ObjectId(familyId) }, family, { new: true, returnNewDocument: true, useFindAndModify: false })
            }
            else {
                throw new ApolloError(localeService.translate('FAMILY_MEMBER_NOT_FOUND'))
            }
        })
}

exports.deleteFamily = async (args, user) => {
    return Family.findOne({ _id: mongoose.Types.ObjectId(args._id) })
        .then((result) => {
            if (result) {
                if (result.ownerId == user._id) {
                    return Family.findOneAndRemove({ _id: mongoose.Types.ObjectId(args._id) }, { useFindAndModify: false })
                }
                else {
                    throw new ApolloError(localeService.translate('NO_UPDATE_PERMISSION'))
                }
            } else {
                throw new ApolloError(localeService.translate('FAMILY_NOT_FOUND'))
            }
        })
}

exports.getUserFamilies = async (args) => {
    let userId = args._id

    return Family.find()
        .or([
            { ownerId: userId },
            { memberIds: userId },
            { adminIds: userId }
        ])
}

exports.getUserPendingFamilies = async (userId) => {
    return Family.find({ pendingIds: userId })
}

exports.getAllFamilies = async () => {
    return Family.find({})
}

exports.isInFamily = async (requester, userId) => {
    return Family.find({
        $and: [
            { $or: [{ ownerId: requester }, { memberIds: requester }, { adminIds: requester }] },
            { $or: [{ ownerId: userId }, { memberIds: userId }, { adminIds: userId }] }
        ]
    })
        .then((result) => result.length > 0)
}