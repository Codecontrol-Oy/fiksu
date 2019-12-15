
import gql from "graphql-tag"

const GET_ME = gql`
{
  me {
    _id
    createdAt
    firstName
    lastName
    loginInfo {
        nickname
        email
    }
    birthDate
    address {
        city
    }
    permissions {
        showRealName
        showEmail
        showBirthDate
        allowPushNotifications
        allowEmailNotifications
    }
    token
    challenges {
      createdAt
      title
      description
      from
      to
    }
  }
}
`
const QUERY_CONSUMPTION_TYPES = gql`
      query {
        getConsumptionTypes {
        _id,
          title,
          description,
        amount,
        amountType
        }
      }`;

const GET_USER_CONSUMPTIONS = gql`
    query Consumptions($id: String!, $from: Date!, $to: Date!, $yesterday: Date!) {
      getSavedConsumptions(userId: $id, from: $from, to: $to) {
        consumptionType {
          title,
          description,
          amount, 
          amountType
        },
        value
      },
      measurements(userId: $id, from: $yesterday, to: $to) {
        value
      }
    }
    `;

const GET_USER_ENERGY_SAVINGS = gql`
query GetEnergySavings($id: String!, $from: Date!, $to: Date!) {
  getSavedConsumptions(householdId: $id, from: $from, to: $to) {
    consumptionType {
      title,
      description,
      amount, 
      amountType
    },
    _id,
    value,
    date
  }
}
`

const GET_USER_MEASUREMENTS = gql`
query Measurements($id: String!, $from: Date!, $to: Date!) {
  measurements(householdId: $id, from: $from, to: $to) {
        _id,
        userId,
        value,
        date
  }
}
`
const GET_USER_FAMILIES = gql`
  query GetUserFamilies($id: ID!) {
    getUserFamilies(_id: $id) {
      _id
      createdAt
      name
      ownerId
      memberIds
      adminIds
      isOwner
      isAdmin
      permissions {
        visibility
      }
      owner {
      ... User
      }
      members {
      ... User
      }
      pending {
        ... User
      }
      admins {
      ... User
      }
          detailedPoints {
      info {
        ... User
      }
      ecopoints
      elctricpoints
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
  }
`
const GET_USER_PENDING_FAMILIES = gql`
  query GetUserPendingFamilies($id: ID) {
    getUserPendingFamilies(_id: $id) {
      _id
      createdAt
      name
      ownerId
      memberIds
      adminIds
      pendingIds
      permissions {
        visibility
      }
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
      firstName
      lastName
      loginInfo {
          nickname
          email
      }
  }
`
const GET_USER_ELECTRICITY_GRAPH = gql`
query GetElectricityGraph($id: ID!, $from: Date, $to: Date) {
  getElectricityGraph(householdId: $id, from: $from, to: $to) {
      ...GraphData
  }
}

fragment GraphData on GraphData {
    data {
        x
        y
    }
}`

const GET_USER_ECOACTION_GRAPH = gql`
query GetUserEcoActionsGraph($userId: ID, $from: Date!, $to: Date!, $fullRange: Boolean!) {
  getUserEcoActionsGraph(userId: $userId, from: $from, to: $to, fullRange: $fullRange) {
      ...GraphData
  }
}

fragment GraphData on GraphData {
    data {
        x
        y
    }
}`

const SEARCH_USER = gql`
query SearchUser($search: String, $familyId: ID, $groupId: ID) {
  searchUser(search: $search, familyId: $familyId, groupId: $groupId) {
      ...User
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

const GET_USER_ECOACTIONS = gql`
query UserEcoActions($id: ID!, $from: Date!, $to: Date!) {
  getSavedEcoActions(userId: $id, from: $from, to: $to) {
      ...SavedEcoAction
  }
}

fragment SavedEcoAction on SavedEcoAction {
    _id
    userId
    ecoActionTypeId
    value
    date
    ecoActionType {
        ...EcoAction
    }
}

fragment EcoAction on EcoActionType {
    title
    description
}`

const GET_ECOACTION_TYPES = gql`
query EcoActions {
  getEcoActionTypes {
      ...EcoAction
  }
}

fragment EcoAction on EcoActionType {
    title
    description
    _id
}`

const GET_ALL_GROUPS = gql`
query GetAllGroups($limit: Int, $offset: Int) {
  getAllGroups(limit: $limit, offset: $offset) {
      ... Groups
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

fragment Groups on Groups {
    groups {
        ... Group
    }
    totalCount
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

const GET_GROUP = gql`
query GetGroup($id: ID!) {
  getGroup(_id: $id) {
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

const SEARCH_GROUP = gql`
query SearchGroup($search: String!, $limit: Int, $offset: Int) {
  searchGroup(search: $search, limit: $limit, offset: $offset) {
      ... Groups
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

fragment Groups on Groups {
    groups {
        ... Group
    }
    totalCount
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

const GET_USER_GROUPS = gql`
query GetUserGroups($id: ID!) {
  getUserGroups(_id: $id) {
    _id
    createdAt
    name
    ownerId
    memberIds
    adminIds
    invites {
      ... User
    }
    pending {
      ... User
    }
    isOwner
    permissions {
      visibility
    }
    isAdmin
    owner {
     ... User
    }
    members {
     ... User
    }
    admins {
     ... User
    }
    detailedPoints {
      info {
        ... User
      }
      ecopoints
      elctricpoints
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

const GET_USER_INVITED_GROUPS = gql`
query GetUserInvitedGroups($id: ID) {
  getUserInvitedGroups(_id: $id) {
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

const GET_USER_APPLIED_GROUPS = gql`
query GetUserAppliedGroups($id: ID) {
  getUserAppliedGroups(_id: $id) {
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

const GET_MY_USER = gql`
query GetMyUser($id: ID!){
  user(id: $id) {
    _id
    createdAt
    firstName
    lastName
    loginInfo {
        nickname
        email
    }
    birthDate
    address {
        city
    }
    permissions {
        showRealName
        showEmail
        showBirthDate
        allowPushNotifications
        allowEmailNotifications
    }
    token
    challenges {
      createdAt
      title
      description
      from
      to
    }
  }
}`

const GET_TOP_FAMILIES = gql`
query getTopFamilyResults($top: Int!, $from: Date!, $to: Date!) {
  getTopFamilyResults(top: $top, from: $from, to:$to) {
    household {
      _id
      name
      members {
        _id
      }
    }
    position
    points
  }
}
`
const GET_TOP_GROUPS = gql`
  query getTopGroupResults($top: Int!, $from: Date!, $to: Date!) {
  getTopGroupResults(top: $top, from: $from, to: $to) {
    household {
      _id
      name
      members {
        _id
      }
    }
    position
    points
  }
}
`

export {
  GET_ME,
  QUERY_CONSUMPTION_TYPES,
  GET_USER_CONSUMPTIONS,
  GET_USER_ENERGY_SAVINGS,
  GET_USER_MEASUREMENTS,
  GET_USER_FAMILIES,
  GET_USER_PENDING_FAMILIES,
  GET_USER_ELECTRICITY_GRAPH,
  SEARCH_USER,
  GET_USER_ECOACTIONS,
  GET_ECOACTION_TYPES,
  GET_TOP_FAMILIES,
  GET_TOP_GROUPS,
  GET_USER_ECOACTION_GRAPH,
  GET_ALL_GROUPS,
  GET_GROUP,
  SEARCH_GROUP,
  GET_USER_GROUPS,
  GET_USER_INVITED_GROUPS,
  GET_USER_APPLIED_GROUPS,
  GET_MY_USER
}