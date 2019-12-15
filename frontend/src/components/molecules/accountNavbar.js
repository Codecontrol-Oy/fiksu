import React from 'react'
import AccountHeader from '../atoms/headerAccount'
import MenuList from '../atoms/menuList'
import MenuItem from '../atoms/menuItem'
import { GET_USER_FAMILIES } from '../../graphqlQueries'
import { useQuery } from "@apollo/react-hooks"
import {
  withRouter
} from "react-router-dom"
import * as constants from '../../constants'



const AccountNavbar = props => {
  const { loading: familyLoading, error: familyError, data: familyData } = useQuery(GET_USER_FAMILIES, {
    variables: {
      id: localStorage.getItem('userId')
    }
  })
  return (<AccountHeader>
    <MenuList>
      <MenuItem icon={"icofont-user"} onClick={() => props.history.push(constants.ROUTE_ACCOUNT)}>Profiili</MenuItem>
      {familyData && familyData.getUserFamilies.length > 0 && <MenuItem icon={"icofont-energy-savings"} onClick={() => props.history.push(constants.ROUTE_ACCOUNT_ELECTRICITY)}>Energiankulutus</MenuItem>}
      <MenuItem icon={"icofont-leaf"} onClick={() => props.history.push(constants.ROUTE_ACCOUNT_ECO)}>Ekoteot</MenuItem>
      <MenuItem icon={"icofont-users-alt-1"} onClick={() => props.history.push(constants.ROUTE_ACCOUNT_FAMILY)}>Taloudet</MenuItem>
      <MenuItem icon={"icofont-users-social"} onClick={() => props.history.push(constants.ROUTE_ACCOUNT_GROUP)}>Ryhmät</MenuItem>
      <MenuItem icon={"icofont-ui-settings"} onClick={() => props.history.push(constants.ROUTE_ACCOUNT_SETTINGS)}>Asetukset</MenuItem>
      <MenuItem icon={"icofont-win-trophy"} onClick={() => props.history.push(constants.ROUTE_ACCOUNT_STATISTICS)}>Tulokset</MenuItem>
    </MenuList>
  </AccountHeader>
  )
}
export default withRouter(AccountNavbar)