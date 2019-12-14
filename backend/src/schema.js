const { gql } = require('apollo-server')
const typeDefs = gql`

  """
  Mutations Fixu
  """
  type Mutation {
    createUser(user: UserInput!): Boolean
    updateUser(user: UserUpdateInput!): User
    deleteUser(_id: String!): User
    createOrUpdateHousing(housing: HousingInput!): HousingInfo
    deleteHousing(_id: String!): HousingInfo
    createMeasurement(measurement: MeasurementInput!): Measurement
    deleteMeasurement(_id: ID!): Measurement
    logIn(nickname: String, password: String): User
    refreshToken(token: String!): User
    approveFriendRequest(id: ID!): Friend
    addFriend(nickname: String!): Friend
    unFriend(friendId: ID!): Friend,
    createChallenge(challenge: ChallengeInput!): Challenge
    removeChallenge(_id: ID!): Challenge
    createSavedConsumption(savedConsumption: SavedConsumptionInput!): SavedConsumption
    removeSavedConsumption(_id: ID!): SavedConsumption
    confirmUser(nickname: String!, verificationToken: String): Boolean
    createPasswordReset(nickname: String!): Boolean
    confirmPasswordReset(nickname: String!, verificationToken: String!, newPassword: String!): Boolean
    createTip(tip: TipInput!): Tip
    updateTip(tip: TipInput!): Tip
    deleteTip(_id: ID!): Tip
    addRole(userId: ID!, role: String!): [String]
    removeRole(userId: ID!, role: String!): [String]
    createFamily(family: FamilyInput!): Family
    addFamilyMember(familyId: ID!, userId: ID!): Family
    removeFamilyMember(familyId: ID!, userId: ID!): Family
    approveFamilyMember(familyId: ID!): Family
    promoteFamilyMember(familyId: ID!, userId: ID!): Family
    demoteFamilyMember(familyId: ID!, userId: ID!): Family
    updateFamily(family: FamilyUpdateInput!): Family
    deleteFamily(_id: ID!): Family
    createGroup(group: GroupInput!): Group
    updateGroup(group: GroupUpdateInput!): Group
    inviteToGroup(groupId: ID!, userId: ID!): Group
    applyToGroup(groupId: ID!, userId: ID!): Group
    approveToGroup(groupId: ID!, userId: ID!): Group
    promoteGroupMember(groupId: ID!, userId: ID!): Group
    demoteGroupMember(groupId: ID!, userId: ID!): Group
    removeGroupMember(groupId: ID!, userId: ID!): Group
    deleteGroup(_id: ID!): Group
    createSavedEcoAction(savedEcoAction: SavedEcoActionInput!): SavedEcoAction
    removeSavedEcoAction(_id: ID!): SavedEcoAction
  },

  """
  Querys for Fixu
  """
  type Query {
    user(id: ID): User
    users: [User]
    me: User
    measurements(householdId: String!, from: Date!, to: Date!): [Measurement]
    friendMeasurements(householdId: String!, from: Date!, to: Date!): [Measurement]
    serverInfo: ServerInfo
    getFriends: [Friend]
    getRoles(userId: ID!): [String]
    getFriendRequests: [Friend]
    getChallenge(_id: ID!): Challenge
    getChallenges(userId: ID!): [Challenge]
    getConsumptionTypes: [ConsumptionType]
    getSavedConsumptions(householdId: String!, from: Date!, to: Date!): [SavedConsumption]
    getAllSavedConsumptions(householdId: String!): [SavedConsumption]
    getTopList(topListInput: TopListInput!): [TopListItem]
    getTip(_id: ID!): Tip
    getAllTips(filter: TipFilterInput): [Tip]
    getFamily(_id: ID!): Family
    getUserFamilies(_id: ID!): [Family]
    getUserPendingFamilies(_id: ID): [Family]
    getAllFamilies: [Family]
    emailTaken(email: String!): Boolean
    getGroup(_id: ID!): Group
    searchGroup(search: String!, limit: Int, offset: Int): Groups
    getUserGroups(_id: ID!): [Group]
    getUserInvitedGroups(_id: ID): [Group]
    getAllGroups(limit: Int, offset: Int): Groups
    getElectricityGraph(householdId: ID!, from: Date!, to: Date!): [GraphData]
    searchUser(search: String, familyId: ID, groupId: ID): [User]
    getEcoActionTypes: [EcoActionType]
    getSavedEcoActions(userId: ID!, from: Date!, to: Date!): [SavedEcoAction]
    getAllSavedEcoActions(userId: ID!): [SavedEcoAction]
  }

  """
  Inputs for Fixu
  """
  input FamilyInput {
    name: String!
    permissions: VisibilityPermissionsInput
  }

  input FamilyUpdateInput {
    _id: ID!
    name: String!
    permissions: VisibilityPermissionsInput
  }

  input GroupInput {
    name: String!
    description: String
    permissions: VisibilityPermissionsInput
  }

  input GroupUpdateInput {
    _id: ID!
    name: String!
    description: String
    permissions: VisibilityPermissionsInput
  }

  input VisibilityPermissionsInput {
    visibility: VISIBILITYPERMISSION
  }

  input UserInput {
    _id: String,
    nickname: String!
    password: String!
    firstName: String!
    lastName: String!
    email: String!
    birthDate: Date!
    address: UserAddress!
  }

  input UserAddress {
    city: String!
  }

  input UserUpdateInput {
    _id: String!,
    firstName: String!
    lastName: String!
    birthDate: Date!
    address: UserAddress!
    permissions: UserPermissionsInput
  }

  input UserPermissionsInput {
    showRealName: PERMISSIONTYPE
    showEmail: PERMISSIONTYPE
    showBirthDate: PERMISSIONTYPE
    allowPushNotifications: Boolean
    allowEmailNotifications: Boolean
  }

  input HousingInput {
    _id: ID
    postalCode: String!
    address: String!
    housingType: HOUSINGTYPE!
    heatingType: HEATINGTYPE!
    userId: String!
  }

  input MeasurementInput {
    householdId: ID!
    value: Float!
    date: Date!
  }

  input ChallengeInput {
    userId: ID!
    title: String
    description: String
    limit: Float
    from: Date
    to: Date
  }

  input SavedConsumptionInput {
    householdId: ID!
    consumptionTypeId: String
    value: Float
    date: Date
  }

  input SavedEcoActionInput {
    ecoActionTypeId: String
    value: Float
    date: Date
  }

  input TopListInput {
    userId: String
    challengeId: String
    friends: [String]
    from: Date
    to: Date
  }

  input TipInput {
    _id: ID
    title: String!
    description: String!
    enabled: Boolean
    visibleDate: Date!
  }

  input TipFilterInput {
    date: Date
  }

  """
  Types for Fixu
  """
  type Family {
    _id: ID!
    createdAt: Date!
    name: String!
    ownerId: ID!
    memberIds: [ID!]!
    adminIds: [ID]
    pendingIds: [ID]
    owner: User!
    members: [User]
    admins: [User]
    pending: [User]
    isOwner: Boolean
    isAdmin: Boolean
    permissions: VisibilityPermissions
  }

  type Group {
    _id: ID!
    createdAt: Date!
    name: String!
    description: String
    ownerId: ID!
    memberIds: [ID!]!
    adminIds: [ID]
    pendingIds: [ID]
    owner: User!
    members: [User]
    admins: [User]
    pending: [User]
    invites: [User]
    permissions: VisibilityPermissions
  }

  type Groups {
    groups: [Group]
    totalCount: Int
  }

  type User {
      _id: ID!
      createdAt: Date!
      firstName: String
      lastName: String
      birthDate: Date
      address: Address
      token: String
      refreshToken: String
      housing: HousingInfo
      challenges: [Challenge]
      friends: [Friend]
      permissions: Permissions
      loginId: ID
      loginInfo: Login
  }

  type Login {
    _id: ID!
    nickname: String
    email: String
    profileId: ID
    profile: User
  }

  type Address {
    city: String
  }

  type Permissions {
    showRealName: PERMISSIONTYPE
    showEmail: PERMISSIONTYPE
    showBirthDate: PERMISSIONTYPE
    allowPushNotifications: Boolean
    allowEmailNotifications: Boolean
  }

  type VisibilityPermissions {
    visibility: VISIBILITYPERMISSION
  }

  type ServerInfo {
      buildNumber: String
      commitMessage: String
      commit: String
  }

  type HousingInfo {
    _id: ID
    postalCode: String
    address: String
    housingType: HOUSINGTYPE
    heatingType: HEATINGTYPE
    userId: String
    user: User
  }

  type Measurement {
    _id: ID
    householdId: ID
    userId: String
    household: Family
    user: User
    value: Float
    date: Date
  }

  type GraphData {
    data: [GraphPoint]
  }

  type GraphPoint {
    x: String
    y: Float
  }

  type Friend {
    userId: String!
    user: User
    friendId: String!
    friend: User
  }

  type Challenge {
    _id: ID!
    userId: ID!
    user: User
    createdAt: Date
    title: String
    description: String
    limit: Float
    from: Date
    to: Date
  }

  type ConsumptionType {
    _id: ID
    title: String
    description: String
    amount: Float
    amountType: String
  }

  type EcoActionType {
    _id: ID
    title: String
    description: String
    amount: Float
  }

  type SavedConsumption {
    _id: ID
    householdId: ID
    userId: String
    consumptionTypeId: String
    consumptionType: ConsumptionType
    value: Float
    date: Date
  }

  type SavedEcoAction {
    _id: ID!
    userId: ID
    ecoActionTypeId: ID
    ecoActionType: EcoActionType
    value: Float
    date: Date
  }

  type TopListItem {
    position: Int
    user: User
    value: Float
  }

  type Tip {
    _id: ID!
    title: String
    description: String
    enabled: Boolean
    visibleDate: Date
    createdBy: User
    updatedBy: User
  }

  """
  Enums
  """
  enum HOUSINGTYPE {
    HOUSE
    APARTMENT
    ROWHOUSE
  }

  enum HEATINGTYPE {
    OIL
    WOOD
    ELECTRICITY
    GAS
  }

  enum PERMISSIONTYPE {
    NONE
    FRIENDS_ONLY
    PUBLIC
  }

  enum VISIBILITYPERMISSION {
    NONE
    PUBLIC
  }

  """
  Custom type for dates
  """
  scalar Date
`
module.exports = {
    typeDefs
};