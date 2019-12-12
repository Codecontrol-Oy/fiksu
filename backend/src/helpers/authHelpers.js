import { AuthenticationError, ApolloError } from 'apollo-server'
import Const from '../constants'
import container from '#translate'
const localeService = container.resolve('localeService')

export default class AuthHelper {
    constructor(user) {
        this.user = user
    }

    isSelf(userId) {
        return (this.user._id == userId)
    }

    isFriend(friends, userId) {
        if (!friends || !friends.some(friend => friend.friendId == userId || friend.userId == userId)) return false

        return true
    }

    isPublicVisible(permission) {
        return permission == Const.PERMISSION_PUBLIC
    }

    isFriendVisible(permission) {
        return permission == Const.PERMISSION_FRIEND_ONLY || permission == Const.PERMISSION_PUBLIC
    }

    isSelfOrAdmin(userId) {
        if (this.user._id != userId) {
            return this.isInRole(Const.ROLE_ADMIN)
        }
        return true
    }

    isAuthenticated() {
        return this.user ? true : false
    }

    isInRole(roles) {
        if (!this.user) return false

        if (!this.user.roles || !this.user.roles.some(r => roles.indexOf(r) >= 0)) return false

        return true
    }

    /*
     * Validate that the request was authenticated
     * throw AuthenticationError exception if not
     */
    validateAuthorization() {
        if (!this.user) throw new AuthenticationError(localeService.translate('MUST_AUTHENTICATE'))
    }

    /*
     * Validate that the user is authenticated and in the role(s)
     * throw AuthenticationError or ApolloError if not
     */
    validateInRole(roles) {
        if (!this.user) throw new AuthenticationError(localeService.translate('MUST_AUTHENTICATE'))

        if (!this.user.roles || !this.user.roles.some(r => roles.indexOf(r) >= 0)) {
            throw new ApolloError(localeService.translate('INSUFFICIENT_PRIVILEGES'), 'UNAUTHORIZED')
        }
    }

    /*
     * Validate that the request was authenticated and user is trying own data (or is admin)
     * throw AuthenticationError exception if not
     */
    validateSelfOrAdmin(userId) {
        if (!this.user) throw new AuthenticationError(localeService.translate('MUST_AUTHENTICATE'))

        if (this.user._id != userId) {
            this.validateInRole(Const.ROLE_ADMIN)
        }
    }

    /*
     * Validate that the request was authenticated and is admin
     * throw AuthenticationError exception if not
     */
    validateAdmin() {
        this.validateInRole(Const.ROLE_ADMIN)
    }
}