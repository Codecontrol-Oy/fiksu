import Group from '../db/models/groupModel'
import Profile from '../db/models/profileModel'
import mongoose from 'mongoose'
import { ApolloError } from 'apollo-server'
import Email from '../messageQueue/email'
import container from '#translate'
import Const from '#constants'
const localeService = container.resolve('localeService')

exports.createGroup = async (args, owner) => {
    let group = {
        name: args.group.name,
        description: args.group.description,
        ownerId: owner._id,
        permissions: {
            visibility: args.group?.permissions?.visibility ?? Const.PERMISSION_NONE
        }
    }

    return Group.create(group)
}

exports.getGroup = async (args) => {
    return Group.findOne({ _id: mongoose.Types.ObjectId(args._id) })
}

exports.searchGroup = async (args) => {
    const search = args.search

    return Group.find({
        $and: [
            { 'name': { '$regex': search, '$options': 'i' } },
            { 'permissions.visibility': Const.PERMISSION_PUBLIC },
        ]
    })
}

exports.updateGroup = async (args, user) => {
    let groupId = args.group._id
    return Group.findOne({ _id: mongoose.Types.ObjectId(groupId) })
        .then((group) => {
            if (!group) {
                throw new ApolloError(localeService.translate('GROUP_NOT_FOUND'))
            }

            // If not owner or admin
            if (group.ownerId != user._id && !group.adminIds.some(adminId => adminId == user._id)) {
                throw new ApolloError(localeService.translate('NO_UPDATE_PERMISSION'))
            }

            group.name = args.group.name
            group.description = args.group.description
            group.permissions = args.group.permissions

            return Group.findOneAndUpdate({ _id: mongoose.Types.ObjectId(groupId) }, group, { new: true, returnNewDocument: true, useFindAndModify: false })
        })
}

exports.inviteUserToGroup = async (args, user) => {
    let groupId = args.groupId
    let userId = args.userId

    return Group.findOne({ _id: mongoose.Types.ObjectId(groupId) })
        .then(async (group) => {
            if (!group) {
                throw new ApolloError(localeService.translate('GROUP_NOT_FOUND'))
            }

            // If not owner or admin
            if (group.ownerId != user._id && !group.adminIds.some(adminId => adminId == user._id)) {
                throw new ApolloError(localeService.translate('NO_UPDATE_PERMISSION'))
            }

            // Add to invited list (if not exists)
            if (group.invitedIds == null) {
                group.invitedIds = []
            }
            if (group.ownerId != userId &&
                !group.adminIds.some(adminId => adminId == userId) &&
                !group.memberIds.some(memberId => memberId == userId) &&
                !group.pendingIds.some(memberId => memberId == userId) &&
                !group.invitedIds.some(memberId => memberId == userId)) {
                group.invitedIds.push(userId)

                await Profile.findOne({ _id: mongoose.Types.ObjectId(userId) })
                    .populate('loginId')
                    .then((result) => {
                        // Send email
                        const email = new Email()
                        email.send({
                            template: 'newGroupMemberInvite',
                            user: {
                                firstName: result.firstName,
                                lastName: result.lastName,
                                email: result.loginId.email
                            },
                            group: {
                                name: group.name
                            }
                        })
                    })
            }

            return Group.findOneAndUpdate({ _id: mongoose.Types.ObjectId(groupId) }, group, { new: true, returnNewDocument: true, useFindAndModify: false })
        })
}

exports.acceptGroupInvitation = async (args, user) => {
    let groupId = args.groupId
    let userId = user._id

    return Group.findOne({ _id: mongoose.Types.ObjectId(groupId) })
        .then((group) => {
            if (!group) {
                throw new ApolloError(localeService.translate('GROUP_NOT_FOUND'))
            }

            // Move from invited to members
            if (group.invitedIds.some(memberId => memberId == userId)) {
                group.invitedIds.remove(userId)
                group.memberIds.push(userId)
                return Group.findOneAndUpdate({ _id: mongoose.Types.ObjectId(groupId) }, group, { new: true, returnNewDocument: true, useFindAndModify: false })
            }

            return null
        })
}


exports.applyToGroup = async (args, user) => {
    let groupId = args.groupId
    let userId = args.userId

    return Group.findOne({ _id: mongoose.Types.ObjectId(groupId) })
        .then(async (group) => {
            if (!group) {
                throw new ApolloError(localeService.translate('GROUP_NOT_FOUND'))
            }

            // Add to pending list (if not exists)
            if (group.pendingIds == null) {
                group.pendingIds = []
            }
            if (group.ownerId != userId &&
                !group.adminIds.some(adminId => adminId == userId) &&
                !group.memberIds.some(memberId => memberId == userId) &&
                !group.pendingIds.some(memberId => memberId == userId) &&
                !group.invitedIds.some(memberId => memberId == userId)) {
                group.pendingIds.push(userId)

                // TODO: Subscription notification in the future
            }

            return Group.findOneAndUpdate({ _id: mongoose.Types.ObjectId(groupId) }, group, { new: true, returnNewDocument: true, useFindAndModify: false })
        })
}

exports.approveUserToGroup = async (args, user) => {
    let groupId = args.groupId
    let userId = args.userId

    return Group.findOne({ _id: mongoose.Types.ObjectId(groupId) })
        .then((group) => {
            if (!group) {
                throw new ApolloError(localeService.translate('GROUP_NOT_FOUND'))
            }

            // If not owner or admin
            if (group.ownerId != user._id && !group.adminIds.some(adminId => adminId == user._id)) {
                throw new ApolloError(localeService.translate('NO_UPDATE_PERMISSION'))
            }

            // Move from pending to members
            if (group.pendingIds.some(memberId => memberId == userId)) {
                group.pendingIds.remove(userId)
                group.memberIds.push(userId)

                // TODO: Could possibly send an email that the user has been approved?
                return Group.findOneAndUpdate({ _id: mongoose.Types.ObjectId(groupId) }, group, { new: true, returnNewDocument: true, useFindAndModify: false })
            }

            return null
        })
}

exports.promoteGroupMember = async (args, user) => {
    let groupId = args.groupId
    let userId = args.userId

    return Group.findOne({ _id: mongoose.Types.ObjectId(groupId) })
        .then((group) => {
            if (!group) {
                throw new ApolloError(localeService.translate('GROUP_NOT_FOUND'))
            }

            // If not owner
            if (group.ownerId != user._id) {
                throw new ApolloError(localeService.translate('NO_UPDATE_PERMISSION'))
            }

            // Move from members to admins
            if (group.memberIds.some(memberId => memberId == userId)) {
                group.memberIds.remove(userId)
                group.adminIds.push(userId)
                return Group.findOneAndUpdate({ _id: mongoose.Types.ObjectId(groupId) }, group, { new: true, returnNewDocument: true, useFindAndModify: false })
            }

            return null
        })
}

exports.demoteGroupMember = async (args, user) => {
    let groupId = args.groupId
    let userId = args.userId

    return Group.findOne({ _id: mongoose.Types.ObjectId(groupId) })
        .then((group) => {
            if (!group) {
                throw new ApolloError(localeService.translate('GROUP_NOT_FOUND'))
            }

            // If not owner
            if (group.ownerId != user._id) {
                throw new ApolloError(localeService.translate('NO_UPDATE_PERMISSION'))
            }

            // Move from members to admins
            if (group.adminIds.some(adminId => adminId == userId)) {
                group.adminIds.remove(userId)
                group.memberIds.push(userId)
                return Group.findOneAndUpdate({ _id: mongoose.Types.ObjectId(groupId) }, group, { new: true, returnNewDocument: true, useFindAndModify: false })
            }

            return null
        })
}

exports.removeGroupMember = async (args, user) => {
    let groupId = args.groupId
    let userId = args.userId

    return Group.findOne({ _id: mongoose.Types.ObjectId(groupId) })
        .then(async (group) => {
            if (!group) {
                throw new ApolloError(localeService.translate('GROUP_NOT_FOUND'))
            }

            // Check if user exists in group
            if (group.ownerId == userId ||
                group.adminIds.some(adminId => adminId == userId) ||
                group.memberIds.some(memberId => memberId == userId) ||
                group.pendingIds.some(memberId => memberId == userId) ||
                group.invitedIds.some(memberId => memberId == userId)) {

                // Can't remove owner
                if (group.ownerId == userId) {
                    throw new ApolloError(localeService.translate('GROUP_NO_PERMISSION_OWNER'))
                }

                if (userId == user._id) { // Check if self
                    group.adminIds.remove(userId)
                    group.memberIds.remove(userId)
                    group.pendingIds.remove(userId)
                    group.invitedIds.remove(userId)
                }
                else {
                    let isAdmin = group.ownerId == user._id || group.adminIds.some(adminId => adminId == user._id)
                    if (!isAdmin) {
                        throw new ApolloError(localeService.translate('GROUP_NO_PERMISSION_MEMBER'))
                    }

                    if ((group.ownerId == user._id && group.adminIds.some(adminId => adminId == userId)) ||
                        group.memberIds.some(memberId => memberId == userId) ||
                        group.pendingIds.some(memberId => memberId == userId) ||
                        group.invitedIds.some(memberId => memberId == userId)) {

                        group.adminIds.remove(userId)
                        group.memberIds.remove(userId)
                        group.pendingIds.remove(userId)
                        group.invitedIds.remove(userId)
                    }
                    else {
                        throw new ApolloError(localeService.translate('GROUP_NO_PERMISSION_MEMBER'))
                    }
                }

                return Group.findOneAndUpdate({ _id: mongoose.Types.ObjectId(groupId) }, group, { new: true, returnNewDocument: true, useFindAndModify: false })
            }
            else {
                throw new ApolloError(localeService.translate('GROUP_MEMBER_NOT_FOUND'))
            }
        })
}

exports.deleteGroup = async (args, user) => {
    return Group.findOne({ _id: mongoose.Types.ObjectId(args._id) })
        .then((result) => {
            if (result) {
                if (result.ownerId == user._id) {
                    return Group.findOneAndRemove({ _id: mongoose.Types.ObjectId(args._id) }, { useFindAndModify: false })
                }
                else {
                    throw new ApolloError(localeService.translate('NO_UPDATE_PERMISSION'))
                }
            } else {
                throw new ApolloError(localeService.translate('GROUP_NOT_FOUND'))
            }
        })
}

exports.getUserGroups = async (args) => {
    let userId = args._id

    return Group.find()
        .or([
            { ownerId: userId },
            { memberIds: userId },
            { adminIds: userId }
        ])
}

exports.getUserAppliedGroups = async (userId) => {
    return Group.find({ pendingIds: userId })
}

exports.getUserInvitedGroups = async (userId) => {
    return Group.find({ invitedIds: userId })
}

exports.getAllGroups = async () => {
    return Group.find({})
}

exports.isInGroup = async (requester, userId) => {
    return Group.find({
        $and: [
            { $or: [{ ownerId: requester }, { memberIds: requester }, { adminIds: requester }] },
            { $or: [{ ownerId: userId }, { memberIds: userId }, { adminIds: userId }] }
        ]
    })
        .then((result) => result.length > 0)
}