import React from 'react'
import AccountHeader from '../atoms/headerAccount'
import MenuList from '../atoms/menuList'
import MenuItem from '../atoms/menuItem'
import { GET_USER_FAMILIES, GET_USER_GROUPS } from '../../graphqlQueries'
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
  const { loading: groupLoading, error: groupError, data: groupData } = useQuery(GET_USER_GROUPS, {
    variables: {
      id: localStorage.getItem('userId')
    }
  })

  return (<AccountHeader>
    <MenuList>
      <MenuItem active={props.location.pathname === constants.ROUTE_ACCOUNT_PROFILE} icon={"icofont-user"} onClick={() => props.history.push(constants.ROUTE_ACCOUNT)}>Profiili</MenuItem>
      {familyData && familyData.getUserFamilies.length > 0 && <MenuItem active={props.location.pathname === constants.ROUTE_ACCOUNT_ELECTRICITY} icon={"icofont-energy-savings"} onClick={() => props.history.push(constants.ROUTE_ACCOUNT_ELECTRICITY)}>Energiankulutus</MenuItem>}
      <MenuItem active={props.location.pathname === constants.ROUTE_ACCOUNT_ECO} icon={"icofont-leaf"} onClick={() => props.history.push(constants.ROUTE_ACCOUNT_ECO)}>Ekoteot</MenuItem>
      <MenuItem alert={familyData && familyData.getUserFamilies.length > 0 && familyData.getUserFamilies.pending > 0 ? true : false} active={props.location.pathname === constants.ROUTE_ACCOUNT_FAMILY} icon={"icofont-users-alt-1"} onClick={() => props.history.push(constants.ROUTE_ACCOUNT_FAMILY)}>Taloudet</MenuItem>
      <MenuItem alert={groupData && groupData.getUserGroups.length > 0 && groupData.getUserGroups.pending > 0 ? true : false} active={props.location.pathname === constants.ROUTE_ACCOUNT_GROUP} icon={"icofont-users-social"} onClick={() => props.history.push(constants.ROUTE_ACCOUNT_GROUP)}>Ryhmät</MenuItem>
      <MenuItem active={props.location.pathname === constants.ROUTE_ACCOUNT_STATISTICS} icon={"icofont-win-trophy"} onClick={() => props.history.push(constants.ROUTE_ACCOUNT_STATISTICS)}>Tulokset</MenuItem>
      <MenuItem active={props.location.pathname === constants.ROUTE_ACCOUNT_SETTINGS} icon={"icofont-ui-settings"} onClick={() => props.history.push(constants.ROUTE_ACCOUNT_SETTINGS)}>Asetukset</MenuItem>
    </MenuList>
  </AccountHeader>
  )
}
export default withRouter(AccountNavbar)