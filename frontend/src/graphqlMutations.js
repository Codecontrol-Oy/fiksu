
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

export { LOGIN_USER, CREATE_USER, GET_REFRESH_TOKEN, MUTATION_ADD_NEW_CONSUMPTION }

