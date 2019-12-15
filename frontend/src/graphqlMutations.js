
import gql from "graphql-tag"

const LOGIN_USER = gql`
    mutation LogIn($nickname: String!, $password: String!) {
      logIn(nickname: $nickname, password: $password) {
        _id,
        token
        refreshToken
      }
    }
    `

const CREATE_USER = gql`
mutation CreateUser($user: UserInput!) {
  createUser(user: $user)
}
`
const GET_REFRESH_TOKEN = gql`
mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
        token
    }
}
`
const MUTATION_ADD_NEW_CONSUMPTION = gql`
        mutation NewConsumption($savedConsumption: SavedConsumptionInput!) {
            createSavedConsumption(savedConsumption: $savedConsumption) {
                _id,
                userId
            }
        }
      `

const MUTATION_REMOVE_CONSUMPTION = gql`
      mutation removeConsumption($id: ID!) {
        removeSavedConsumption(_id: $id) {
              _id,
              userId
          }
      }
    `

const MUTATION_ADD_NEW_MEASUREMENT = gql`
    mutation CreateMeasurement($measurement: MeasurementInput!) {
      createMeasurement(measurement: $measurement) {
            _id,
            userId,

        }
    }
`

const MUTATION_REMOVE_MEASUREMENT = gql`
      mutation DeleteMeasurement($id: ID!) {
        deleteMeasurement(_id: $id) {
              _id,
              userId
          }
      }
`

const MUTATION_CREATE_FAMILY = gql`
mutation CreateFamily($family: FamilyInput!) {
  createFamily(family: $family) {
      _id
      createdAt
      name
      ownerId
      memberIds
      adminIds
      owner {
          ... User
      }
      members {
          ... User
      }
      admins {
          ... User
      }
  }
}

fragment User on User {
    firstName
    lastName
    loginInfo {
        nickname
        email
    }
}`

const MUTATION_REMOVE_FAMILY = gql`
mutation DeleteFamily($id: ID!) {
    deleteFamily(_id: $id) {
        _id
    }
  }
`

const MUTATION_REMOVE_FAMILY_MEMBER = gql`
mutation RemoveFamilyMember($id: ID!, $familyId: ID!) {
    removeFamilyMember(familyId: $familyId, userId: $id) {
        _id
    }
  }
`
const MUTATION_PROMOTE_FAMILY_MEMBER = gql`
mutation PromoteFamilyMember($familyId: ID!, $id: ID!) {
    promoteFamilyMember(familyId: $familyId, userId: $id) {
        _id
    }
}`

const MUTATION_DEMOTE_FAMILY_MEMBER = gql`
mutation DemoteFamilyMember($familyId: ID!, $id: ID!) {
    demoteFamilyMember(familyId: $familyId, userId: $id) {
        _id
    }
}`

const MUTATION_UPDATE_USER = gql`
mutation UpdateUser($User: UserUpdateInput!) {
   updateUser(user:$User) {
      _id
    firstName
    lastName
    birthDate
    permissions {
      showEmail
      showRealName
      showBirthDate
      allowEmailNotifications
    }
    address {
      city
    }
  }
}`
const MUTATION_DELETE_USER = gql`
mutation deleteUser($id: String!) {
  deleteUser(_id: $id) {
    _id
  }
}`

const MUTATION_ADD_FAMILY_MEMBER = gql`
mutation AddFamilyMember($familyId: ID!, $id: ID!) {
    addFamilyMember(familyId: $familyId, userId: $id) {
        _id
    }
}
`

const MUTATION_APPROVE_FAMILY_INVITATION = gql`
mutation ApproveFamilyMember($familyId: ID!) {
    approveFamilyMember(familyId: $familyId) {
        _id
    }
  }
`
const MUTATION_CHANGE_FAMILY_VISIBILTY = gql`
mutation UpdateFamily($family: FamilyUpdateInput!) {
    updateFamily(family: $family) {
        _id
    }
  }`

const MUTATION_CREATE_ECOACTION = gql`
mutation CreateSavedEcoAction($savedEcoAction: SavedEcoActionInput!) {
    createSavedEcoAction(savedEcoAction: $savedEcoAction) {
        ...SavedEcoAction
    }
  }
  fragment SavedEcoAction on SavedEcoAction {
      _id
      userId
      ecoActionTypeId
      value
      date
}`

const MUTATION_REMOVE_ECO_ACTION = gql`
mutation RemoveSavedEcoAction($id: ID!) {
    removeSavedEcoAction(_id: $id) {
        ...SavedEcoAction
    }
  }
  
  fragment SavedEcoAction on SavedEcoAction {
      _id
      userId
      ecoActionTypeId
      value
      date
}`

const MUTATION_CREATE_GROUP = gql`
mutation CreateGroup($group: GroupInput!) {
    createGroup(group: $group) {
        ... Group
    }
  }
  
  fragment User on User {
      _id
      firstName
      lastName
      loginInfo {
          nickname
          email
      }
  }
  
  fragment Group on Group {
      _id
      createdAt
      name
      description
      ownerId
      memberIds
      adminIds
      owner {
        ... User
      }
      members {
        ... User
      }
      admins {
        ... User
      }
      permissions {
          visibility
      }
  }`

  const MUTATION_UPDATE_GROUP = gql`
  mutation UpdateGroup($group: GroupUpdateInput!) {
    updateGroup(group: $group) {
        ... Group
    }
  }
  
  fragment User on User {
      _id
      firstName
      lastName
      loginInfo {
          nickname
          email
      }
  }
  
  fragment Group on Group {
      _id
      createdAt
      name
      description
      ownerId
      memberIds
      adminIds
      owner {
        ... User
      }
      members {
        ... User
      }
      admins {
        ... User
      }
      permissions {
          visibility
      }
  }`

const MUTATION_APPLY_TO_GROUP = gql`
mutation ApplyToGroup($groupId: ID!, $userId: ID!) {
    applyToGroup(groupId: $groupId, userId: $userId) {
        ... Group
    }
  }
  
  fragment User on User {
      _id
      firstName
      lastName
      loginInfo {
          nickname
          email
      }
  }
  
  fragment Group on Group {
      _id
      createdAt
      name
      description
      ownerId
      memberIds
      adminIds
      owner {
        ... User
      }
      members {
        ... User
      }
      admins {
        ... User
      }
      invites {
        ... User
      }
      pending {
        ... User
      }
      permissions {
          visibility
      }
  }`

const MUTATION_INVITE_TO_GROUP = gql`
mutation InviteToGroup($groupId: ID!, $userId: ID!) {
    inviteToGroup(groupId: $groupId, userId: $userId) {
        ... Group
    }
  }
  
  fragment User on User {
      _id
      firstName
      lastName
      loginInfo {
          nickname
          email
      }
  }
  
  
  fragment Group on Group {
      _id
      createdAt
      name
      description
      ownerId
      memberIds
      adminIds
      owner {
        ... User
      }
      members {
        ... User
      }
      admins {
        ... User
      }
      invites {
        ... User
      }
      pending {
        ... User
      }
      permissions {
          visibility
      }
  }`

const MUTATION_APPROVE_TO_GROUP = gql`
mutation ApproveToGroup($groupId: ID!, $userId: ID!) {
    approveToGroup(groupId: $groupId, userId: $userId) {
        ... Group
    }
  }
  
  fragment User on User {
      _id
      firstName
      lastName
      loginInfo {
          nickname
          email
      }
  }
  
  
  fragment Group on Group {
      _id
      createdAt
      name
      description
      ownerId
      memberIds
      adminIds
      owner {
        ... User
      }
      members {
        ... User
      }
      admins {
        ... User
      }
      invites {
        ... User
      }
      pending {
        ... User
      }
      permissions {
          visibility
      }
  }`

const MUTATION_PROMOTE_GROUP_MEMBER = gql`
mutation PromoteGroupMember($groupId: ID!, $userId: ID!) {
    promoteGroupMember(groupId: $groupId, userId: $userId) {
        _id
        createdAt
        name
        ownerId
        memberIds
        adminIds
        pendingIds
        owner {
            ... User
        }
        members {
            ... User
        }
        admins {
            ... User
        }
        pending {
            ... User
        }
    }
  }
  
  fragment User on User {
      _id
      firstName
      lastName
      loginInfo {
          nickname
          email
      }
  }`

const MUTATION_DEMOTE_GROUP_MEMBER = gql`
mutation DemoteGroupMember($groupId: ID!, $userId: ID!) {
    demoteGroupMember(groupId: $groupId, userId: $userId) {
        _id
        createdAt
        name
        ownerId
        memberIds
        adminIds
        pendingIds
        owner {
            ... User
        }
        members {
            ... User
        }
        admins {
            ... User
        }
        pending {
            ... User
        }
    }
  }
  
  fragment User on User {
      _id
      firstName
      lastName
      loginInfo {
          nickname
          email
      }
}`
const MUTATION_REMOVE_GROUP_MEMBER = gql`
mutation RemoveGroupMember($groupId: ID!, $userId: ID!) {
    removeGroupMember(groupId: $groupId, userId: $userId) {
        _id
        createdAt
        name
        ownerId
        memberIds
        adminIds
        pendingIds
        owner {
            ... User
        }
        members {
            ... User
        }
        admins {
            ... User
        }
        pending {
            ... User
        }
    }
  }
  
  fragment User on User {
      _id
      firstName
      lastName
      loginInfo {
          nickname
          email
      }
  }`

const MUTATION_REMOVE_GROUP = gql`
mutation DeleteGroup($id: ID!) {
    deleteGroup(_id: $id) {
      _id
      createdAt
      name
      ownerId
      memberIds
      adminIds
      owner {
       ... User
      }
      members {
       ... User
      }
      admins {
       ... User
      }
    }
  }
  
  fragment User on User {
      _id
      firstName
      lastName
      loginInfo {
          nickname
          email
      }
  }`

const MUTATION_APPROVE_GROUP_INVITATION = gql`mutation AcceptGroupInvitation($groupId: ID!) {
  acceptGroupInvitation(groupId: $groupId) {
     ... Group
  }
}

fragment User on User {
    _id
    firstName
    lastName
    loginInfo {
        nickname
        email
    }
}


fragment Group on Group {
    _id
    createdAt
    name
    description
    ownerId
    memberIds
    adminIds
    owner {
      ... User
    }
    members {
      ... User
    }
    admins {
      ... User
    }
    invites {
      ... User
    }
    pending {
      ... User
    }
    permissions {
        visibility
    }
}`

export { 
  LOGIN_USER, 
  CREATE_USER, 
  GET_REFRESH_TOKEN, 
  MUTATION_ADD_NEW_CONSUMPTION, 
  MUTATION_REMOVE_CONSUMPTION, 
  MUTATION_ADD_NEW_MEASUREMENT, 
  MUTATION_REMOVE_MEASUREMENT,
  MUTATION_CREATE_FAMILY,
  MUTATION_REMOVE_FAMILY,
  MUTATION_REMOVE_FAMILY_MEMBER,
  MUTATION_PROMOTE_FAMILY_MEMBER,
  MUTATION_DEMOTE_FAMILY_MEMBER,
  MUTATION_ADD_FAMILY_MEMBER,
  MUTATION_APPROVE_FAMILY_INVITATION,
  MUTATION_CHANGE_FAMILY_VISIBILTY,
  MUTATION_CREATE_ECOACTION,
  MUTATION_REMOVE_ECO_ACTION,
  MUTATION_CREATE_GROUP,
  MUTATION_UPDATE_GROUP,
  MUTATION_APPLY_TO_GROUP,
  MUTATION_INVITE_TO_GROUP,
  MUTATION_APPROVE_TO_GROUP,
  MUTATION_PROMOTE_GROUP_MEMBER,
  MUTATION_DEMOTE_GROUP_MEMBER,
  MUTATION_REMOVE_GROUP_MEMBER,
  MUTATION_APPROVE_GROUP_INVITATION,
  MUTATION_REMOVE_GROUP,
  MUTATION_UPDATE_USER,
  MUTATION_DELETE_USER
}

