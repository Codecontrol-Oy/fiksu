
import gql from "graphql-tag"
import { Mutation } from "react-apollo"

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

export { LOGIN_USER, CREATE_USER, GET_REFRESH_TOKEN, MUTATION_ADD_NEW_CONSUMPTION, MUTATION_REMOVE_CONSUMPTION, MUTATION_ADD_NEW_MEASUREMENT, MUTATION_REMOVE_MEASUREMENT }

