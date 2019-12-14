
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
  getSavedConsumptions(userId: $id, from: $from, to: $to) {
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
  measurements(userId: $id, from: $from, to: $to) {
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
query GetElectricityGraph($id: String!, $from: Date!, $to: Date!) {
  getElectricityGraph(userId: $id, from: $from, to: $to) {
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

export { 
  GET_ME, 
  QUERY_CONSUMPTION_TYPES, 
  GET_USER_CONSUMPTIONS, 
  GET_USER_ENERGY_SAVINGS,
  GET_USER_MEASUREMENTS,
  GET_USER_FAMILIES,
  GET_USER_PENDING_FAMILIES,
  GET_USER_ELECTRICITY_GRAPH,
  SEARCH_USER
}