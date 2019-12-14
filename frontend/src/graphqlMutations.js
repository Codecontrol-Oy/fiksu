
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
            userId
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
    MUTATION_UPDATE_USER,
    MUTATION_DELETE_USER
}
