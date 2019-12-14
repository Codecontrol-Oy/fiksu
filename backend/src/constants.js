module.exports = {
    /* Defaults */
    DEFAULT_LANGUAGE_CODE: 'fi',
    DEFAULT_MIN_PASSWORD_LENGTH: 8,
    REFRESH_ENDPOINT: "/refreshToken",
    HERO_FILENAME: "hero.png",
    ELECTRICITY_SAVING_MULTIPLIER: 1,

    /* Permission Enums */
    PERMISSION_NONE: 'NONE',
    PERMISSION_FRIEND_ONLY: 'FRIENDS_ONLY',
    PERMISSION_PUBLIC: 'PUBLIC',

    /* Friend status Enums */
    STATUS_PENDING: 'PENDING',
    STATUS_APPROVED: 'APPROVED',
    STATUS_REJECTED: 'REJECTED',

    /* Mongo Models */
    MONGO_CHALLENGE: 'challenge',
    MONGO_CONSUMPTION_TYPE: 'consumptionType',
    MONGO_FRIEND: 'friend',
    MONGO_HOUSING: 'housing',
    MONGO_MEASUREMENT: 'measurement',
    MONGO_PROFILE: 'profile',
    MONGO_RESET: 'reset',
    MONGO_SAVED_CONSUMPTION: 'savedConsumption',
    MONGO_TIPS: 'tips',
    MONGO_FAMILY: 'family',
    MONGO_LOGIN: 'login',
    MONGO_GROUP: 'group',
    MONGO_ECOACTION_TYPE: 'ecoActionType',
    MONGO_SAVED_ECOACTIONS: 'savedEcoAction',

    /* Roles */
    ROLE_ADMIN: 'admin',
    ROLE_MANAGER: 'manager',
}