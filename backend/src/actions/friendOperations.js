import Friend from '../db/models/friendModel'
import Profile from '../db/models/profileModel'
import Login from '../db/models/loginModel'
import mongoose from 'mongoose'
import { ApolloError } from 'apollo-server'
import Const from '../constants'
import Email from '../messageQueue/email'
import container from '#translate'
const localeService = container.resolve('localeService')

exports.getFriends = async (args) => {
    return Friend.find({ status: Const.STATUS_APPROVED })
        .or([{ userId: args._id }, { friendId: args._id }])
}

exports.getFriendRequests = async (args) => {
    return Friend.find({ friendId: args._id, status: Const.STATUS_PENDING })
}

exports.approveFriendRequest = async (userId, friendId) => {
    return Friend.findOneAndUpdate({ userId: mongoose.Types.ObjectId(userId), friendId: mongoose.Types.ObjectId(friendId) }, { status: Const.STATUS_APPROVED }, { new: true, returnNewDocument: true, useFindAndModify: false })
}

exports.addFriend = async (userId, nickname) => {
    return Login.findOne({ normalizedNickName: nickname.toUpperCase() })
        .populate('profileId')
        .then((friend) => {
            if (!friend) {
                throw new ApolloError(localeService.translate('FRIEND_NOT_FOUND'))
            }
            else if (userId == friend.profileId._id) {
                throw new ApolloError(localeService.translate('FRIEND_CANT_ASK_YOURSELF'))
            }
            else {
                return Friend.findOne()
                    .or([{ userId: userId, friendId: friend.profileId._id }, { userId: friend.profileId._id, friendId: userId }])
                    .then((result) => {
                        // Friend request not found, create a new one.
                        if (result == null) {
                            return Friend.create({
                                userId: userId,
                                friendId: friend.profileId._id
                            })
                                .then((created) => {
                                    return Profile.findOne({ _id: userId })
                                        .populate('loginId')
                                        .then((requester) => {
                                            // Send email
                                            const email = new Email()
                                            email.send({
                                                template: 'newFriendRequest',
                                                user: {
                                                    firstName: friend.profileId.firstName,
                                                    lastName: friend.profileId.lastName,
                                                    email: friend.email
                                                },
                                                friend: {
                                                    username: requester.loginId.nickname,
                                                }
                                            })

                                            created.userId = created.userId._id
                                            return created
                                        })
                                })
                        }

                        // Friend request already found. Approve it if receiver asked.
                        else if (result.userId != userId && result.status != Const.STATUS_APPROVED) {
                            return Friend.findOneAndUpdate({ userId: result.userId, friendId: result.friendId }, { status: Const.STATUS_APPROVED }, { new: true, returnNewDocument: true, useFindAndModify: false })
                        }

                        // Friend request already found. Requested again.
                        else {
                            return result
                        }
                    })
            }
        })
}

exports.unFriend = async (userId, friendId) => {
    return Friend.findOneAndRemove({}, { useFindAndModify: false })
        .or([{ userId: userId, friendId: friendId }, { userId: friendId, friendId: userId }])
} 