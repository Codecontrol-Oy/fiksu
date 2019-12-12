
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

export { GET_ME, QUERY_CONSUMPTION_TYPES }