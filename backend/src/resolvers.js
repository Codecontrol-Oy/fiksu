
import { AuthenticationError, ApolloError } from 'apollo-server'
import AuthHelper from './helpers/authHelpers'
import { logIn, refreshToken, emailTaken, createProfile, getProfile, getProfiles, getAllProfiles, deleteProfile, updateProfile, confirmProfile, createPasswordReset, confirmPasswordReset, searchUser } from './actions/profileOperations'
import { getLogin } from './actions/loginOperations'
import { getRoles, addRole, removeRole } from './actions/roleOperations'
import { getFamily, createFamily, addFamilyMember, updateFamily, removeFamilyMember, deleteFamily, getUserFamilies, getUserPendingFamilies, approveFamilyMember, promoteFamilyMember, demoteFamilyMember, getAllFamilies, isInFamily } from './actions/familyOperations'
import { getGroup, createGroup, searchGroup, updateGroup, inviteUserToGroup, applyToGroup, approveUserToGroup, promoteGroupMember, demoteGroupMember, removeGroupMember, deleteGroup, getUserGroups, getUserInvitedGroups, getAllGroups } from './actions/groupOperations'
import { getHousing, createOrUpdateHousing, removeHousing } from './actions/housingOperations'
import { getMeasurements, createMeasurement, deleteMeasurement } from './actions/measurementOperations'
import { getFriends, getFriendRequests, approveFriendRequest, addFriend, unFriend } from './actions/friendOperations'
import { getChallenges, getChallenge, createChallenge, removeChallenge, getTopList } from './actions/challengeOperations'
import { getConsumptionTypes, getConsumptionType } from './actions/consumptionTypeOperations'
import { getSavedConsumptions, getAllSavedConsumptions, createSavedConsumption, removeSavedConsumption } from './actions/savedConsumptionTypeOperations'
import { getTip, getAllTips, createTip, updateTip, deleteTip } from './actions/tipOperations'
import { getElectricityGraph } from './actions/reportOperations'
import Const from './constants'

const resolvers = {
  Query: {
    user: (obj, args, context) => {
      const authHelper = new AuthHelper(context.user)
      authHelper.validateAuthorization()

      if (!args.id) return getProfile(context.user._id)

      authHelper.validateSelfOrAdmin(args.id)

      return getProfile(args.id)
    },
    users: (obj, args, context) => {
      new AuthHelper(context.user).validateInRole(Const.ROLE_ADMIN)

      return getAllProfiles()
    },
    me: (obj, args, context, info) => context.user,
    measurements: (obj, args, context, info) => {
      new AuthHelper(context.user).validateAuthorization()
      return getMeasurements(args)
    },
    friendMeasurements: (obj, args, context, info) => {
      new AuthHelper(context.user).validateAuthorization()
      return getMeasurements(args)
    },
    serverInfo: (obj, args, context) => {
      if (!context.user) return null
      return { buildNumber: process.env.VERSION, commitMessage: process.env.COMMIT_MESSAGE, commit: process.env.COMMIT }
    },
    getRoles: (obj, args, context) => {
      new AuthHelper(context.user).validateSelfOrAdmin(args.userId)
      return getRoles(args.userId)
    },
    getFriends: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getFriends(context.user)
    },
    getFriendRequests: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getFriendRequests(context.user)
    },
    getChallenges: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getChallenges(args.userId)
    },
    getChallenge: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getChallenge(args)
    },
    getConsumptionTypes: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getConsumptionTypes()
    },
    getSavedConsumptions: (org, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getSavedConsumptions(args)
    },
    getAllSavedConsumptions: (org, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getAllSavedConsumptions(args)
    },
    getTopList: (org, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getTopList(args)
    },
    getTip: (org, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getTip(args)
    },
    getAllTips: (org, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getAllTips(args)
    },
    getFamily: (org, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getFamily(args)
    },
    getUserFamilies: (org, args, context) => {
      new AuthHelper(context.user).validateSelfOrAdmin(args._id)
      return getUserFamilies(args)
    },
    getUserPendingFamilies: (org, args, context) => {
      let userId = args._id ?? context.user._id
      new AuthHelper(context.user).validateSelfOrAdmin(userId)
      return getUserPendingFamilies(userId)
    },
    getAllFamilies: (org, args, context) => {
      new AuthHelper(context.user).validateAdmin()
      return getAllFamilies(args)
    },
    emailTaken: (org, args, context) => {
      return emailTaken(args.email)
    },
    getGroup: (org, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getGroup(args)
    },
    searchGroup: async (org, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return searchGroup(args)
        .then((data) => {
          const limit = args.limit
          const offset = args.offset ?? 0
          const totalCount = data.length
          const groups = limit === undefined ?
            data.slice(offset) :
            data.slice(offset, offset + limit)
          const result = {
            groups,
            totalCount,
          }
          return result
        })
    },
    getUserGroups: (org, args, context) => {
      new AuthHelper(context.user).validateSelfOrAdmin(args._id)
      return getUserGroups(args)
    },
    getUserInvitedGroups: (org, args, context) => {
      let userId = args._id ?? context.user._id
      new AuthHelper(context.user).validateSelfOrAdmin(userId)
      return getUserInvitedGroups(userId)
    },
    getAllGroups: (org, args, context) => {
      new AuthHelper(context.user).validateAdmin()
      return getAllGroups(args)
        .then((data) => {
          const limit = args.limit
          const offset = args.offset ?? 0
          const totalCount = data.length
          const groups = limit === undefined ?
            data.slice(offset) :
            data.slice(offset, offset + limit)
          const result = {
            groups,
            totalCount,
          }
          return result
        })
    },
    getElectricityGraph: (org, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getElectricityGraph(args)
    },
    searchUser: (org, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return searchUser(args)
    },
  },
  Mutation: {
    logIn: (obj, args) => logIn(args.nickname, args.password),
    refreshToken: (obj, args) => refreshToken(args.token),
    createUser: (obj, args) => createProfile(args),
    updateUser: (obj, args, context) => {
      new AuthHelper(context.user).validateSelfOrAdmin(args.user._id)
      return updateProfile(args)
    },
    confirmUser: (obj, args) => confirmProfile(args.nickname, args.verificationToken),
    createPasswordReset: (obj, args) => createPasswordReset(args.nickname),
    confirmPasswordReset: (obj, args) => confirmPasswordReset(args.nickname, args.verificationToken, args.newPassword),
    deleteUser: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return deleteProfile(args)
    },
    createOrUpdateHousing: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return createOrUpdateHousing(args, context)
    },
    deleteHousing: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return removeHousing(args)
    },
    createMeasurement: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return createMeasurement(args.measurement)
    },
    deleteMeasurement: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return deleteMeasurement(args)
    },
    approveFriendRequest: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return approveFriendRequest(args.id, context.user._id)
    },
    addFriend: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return addFriend(context.user._id, args.nickname)
    },
    unFriend: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return unFriend(context.user._id, args.friendId)
    },
    createChallenge: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return createChallenge(args)
    },
    removeChallenge: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return removeChallenge(args)
    },
    createSavedConsumption: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return createSavedConsumption(args)
    },
    removeSavedConsumption: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return removeSavedConsumption(args)
    },
    createTip: (obj, args, context) => {
      new AuthHelper(context.user).validateInRole(Const.ROLE_ADMIN)
      return createTip(args, context.user)
    },
    updateTip: (obj, args, context) => {
      new AuthHelper(context.user).validateInRole(Const.ROLE_ADMIN)
      return updateTip(args, context.user)
    },
    deleteTip: (obj, args, context) => {
      new AuthHelper(context.user).validateInRole(Const.ROLE_ADMIN)
      return deleteTip(args)
    },
    addRole: (obj, args, context) => {
      new AuthHelper(context.user).validateAdmin()
      return addRole(args)
    },
    removeRole: (obj, args, context) => {
      new AuthHelper(context.user).validateAdmin()
      return removeRole(args)
    },
    createFamily: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return createFamily(args, context.user)
    },
    addFamilyMember: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return addFamilyMember(args, context.user)
    },
    approveFamilyMember: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return approveFamilyMember(args, context.user)
    },
    promoteFamilyMember: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return promoteFamilyMember(args, context.user)
    },
    demoteFamilyMember: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return demoteFamilyMember(args, context.user)
    },
    updateFamily: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return updateFamily(args, context.user)
    },
    removeFamilyMember: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return removeFamilyMember(args, context.user)
    },
    deleteFamily: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return deleteFamily(args, context.user)
    },
    createGroup: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return createGroup(args, context.user)
    },
    updateGroup: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return updateGroup(args, context.user)
    },
    inviteToGroup: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return inviteUserToGroup(args, context.user)
    },
    applyToGroup: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return applyToGroup(args, context.user)
    },
    approveToGroup: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return approveUserToGroup(args, context.user)
    },
    promoteGroupMember: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return promoteGroupMember(args, context.user)
    },
    demoteGroupMember: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return demoteGroupMember(args, context.user)
    },
    removeGroupMember: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return removeGroupMember(args, context.user)
    },
    deleteGroup: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return deleteGroup(args, context.user)
    },
  },
  Measurement: {
    user: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getProfile(obj.userId)
    }
  },
  User: {
    loginInfo: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getLogin(obj.loginId)
    },
    housing: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getHousing(obj._id)
    },
    challenges: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getChallenges(obj._id)
    },
    friends: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getFriends(obj)
    },
    firstName: async (obj, args, context) => {
      const authHelper = new AuthHelper(context.user)
      authHelper.validateAuthorization()
      const permission = obj.permissions?.showRealName
      if (authHelper.isPublicVisible(permission) || await isInFamily(context.user._id, obj._id.toString()) || (authHelper.isFriendVisible(permission) && authHelper.isFriend(await getFriends(context.user), obj._id.toString())) || authHelper.isSelfOrAdmin(obj._id.toString())) {
        return obj.firstName
      }
      return null
    },
    lastName: async (obj, args, context) => {
      const authHelper = new AuthHelper(context.user)
      authHelper.validateAuthorization()
      const permission = obj.permissions?.showRealName
      if (authHelper.isPublicVisible(permission) || await isInFamily(context.user._id, obj._id.toString()) || (authHelper.isFriendVisible(permission) && authHelper.isFriend(await getFriends(context.user), obj._id.toString())) || authHelper.isSelfOrAdmin(obj._id.toString())) {
        return obj.lastName
      }
      return null
    },
    birthDate: async (obj, args, context) => {
      const authHelper = new AuthHelper(context.user)
      authHelper.validateAuthorization()
      const permission = obj.permissions?.showBirthDate
      if (authHelper.isPublicVisible(permission) || await isInFamily(context.user._id, obj._id.toString()) || (authHelper.isFriendVisible(permission) && authHelper.isFriend(await getFriends(context.user), obj._id.toString())) || authHelper.isSelfOrAdmin(obj._id.toString())) {
        return obj.birthDate
      }
      return null
    }
  },
  Login: {
    profile: async (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getProfile(obj.profileId)
    },
    email: async (obj, args, context) => {
      const authHelper = new AuthHelper(context.user)
      authHelper.validateAuthorization()
      const profile = await getProfile(obj.profileId)
      const permission = profile.permissions?.showEmail
      if (authHelper.isPublicVisible(permission) || await isInFamily(context.user._id, obj._id.toString()) || (authHelper.isFriendVisible(permission) && authHelper.isFriend(await getFriends(context.user), obj.profileId.toString())) || authHelper.isSelfOrAdmin(obj.profileId.toString())) {
        return obj.email
      }
      return null
    }
  },
  HousingInfo: {
    user: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getProfile(obj.userId)
    }
  },
  Friend: {
    userId: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      if (context.user._id == obj.userId) {
        return obj.userId
      }
      else {
        return obj.friendId
      }
    },
    friendId: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      if (context.user._id == obj.userId) {
        return obj.friendId
      }
      else {
        return obj.userId
      }
    },
    user: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      if (context.user._id == obj.userId) {
        return getProfile(obj.userId)
      }
      else {
        return getProfile(obj.friendId)
      }
    },
    friend: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      if (context.user._id == obj.userId) {
        return getProfile(obj.friendId)
      }
      else {
        return getProfile(obj.userId)
      }
    }
  },
  Challenge: {
    user: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getProfile(obj.userId)
    }
  },
  SavedConsumption: {
    consumptionType: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return getConsumptionType(obj)
    }
  },
  Tip: {
    createdBy: (obj, args, context) => {
      new AuthHelper(context.user).validateInRole(Const.ROLE_ADMIN)
      if (!obj.createdBy) return null
      return getProfile(obj.createdBy)
    },
    updatedBy: (obj, args, context) => {
      new AuthHelper(context.user).validateInRole(Const.ROLE_ADMIN)
      if (!obj.updatedBy) return null
      return getProfile(obj.updatedBy)
    }
  },
  Family: {
    owner: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      if (!obj.ownerId) return null
      return getProfile(obj.ownerId)
    },
    members: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      if (!obj.memberIds) return null
      return getProfiles(obj.memberIds)
    },
    admins: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      if (!obj.adminIds) return null
      return getProfiles(obj.adminIds)
    },
    pending: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      if (!obj.pendingIds) return null
      return getProfiles(obj.pendingIds)
    },
    isOwner: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return context.user._id == obj.ownerId
    },
    isAdmin: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      return obj.adminIds.some(adminId => adminId == context.user._id)
    }
  },
  Group: {
    owner: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      if (!obj.ownerId) return null
      return getProfile(obj.ownerId)
    },
    members: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      if (!obj.memberIds) return null
      return getProfiles(obj.memberIds)
    },
    admins: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      if (!obj.adminIds) return null
      return getProfiles(obj.adminIds)
    },
    pending: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      if (!obj.pendingIds) return null
      return getProfiles(obj.pendingIds)
    },
    invites: (obj, args, context) => {
      new AuthHelper(context.user).validateAuthorization()
      if (!obj.invitedIds) return null
      return getProfiles(obj.invitedIds)
    }
  }
}

module.exports = {
  resolvers
}