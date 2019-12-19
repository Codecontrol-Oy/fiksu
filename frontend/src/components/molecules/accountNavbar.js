import React from 'react'
import AccountHeader from '../atoms/headerAccount'
import MenuList from '../atoms/menuList'
import MenuItem from '../atoms/menuItem'
import { GET_USER_FAMILIES, GET_USER_INVITED_GROUPS, GET_USER_PENDING_FAMILIES } from '../../graphqlQueries'
import { useQuery } from "@apollo/react-hooks"
import {
  withRouter
} from "react-router-dom"
import * as constants from '../../constants'
import User_1 from '../../icons/user_2.svg'
import Users_group from '../../icons/users_social_1.svg'
import Leaf from '../../icons/leaf.svg'
import Trophy from '../../icons/win_trophy.svg'
import Settings from '../../icons/ui-settings.svg'
import Family from '../../icons/users-alt-1.svg'
import Energy from '../../icons/energy-savings.svg'






import { ReactSVG } from 'react-svg'
import Paragraph from '../atoms/paragraph'
import Block from "../atoms/block"

const AccountNavbar = props => {
  const { loading: familyLoading, error: familyError, data: familyData } = useQuery(GET_USER_FAMILIES, {
    variables: {
      id: localStorage.getItem('userId')
    }
  })
  const { loading: invitationsLoading, error: invitationsError, data: invitationsData } = useQuery(GET_USER_PENDING_FAMILIES)

  const { loading: groupInvitationsLoading, error: groupInvitationsError, data: groupInvitationsData } = useQuery(GET_USER_INVITED_GROUPS)


  return (
    <AccountHeader>
      <MenuList>
        <MenuItem
          active={props.location.pathname === constants.ROUTE_ACCOUNT_PROFILE}
          icon={User_1} onClick={() => props.history.push(constants.ROUTE_ACCOUNT)}
        >Profiili</MenuItem>
        {familyData && familyData.getUserFamilies && familyData.getUserFamilies.length > 0 &&
          <MenuItem
            active={props.location.pathname === constants.ROUTE_ACCOUNT_ELECTRICITY}
            icon={Energy}
            onClick={() => props.history.push(constants.ROUTE_ACCOUNT_ELECTRICITY)}
          >Energiankulutus</MenuItem>}
        <MenuItem
          active={props.location.pathname === constants.ROUTE_ACCOUNT_ECO}
          icon={Leaf}
          onClick={() => props.history.push(constants.ROUTE_ACCOUNT_ECO)}
        >Ekoteot</MenuItem>
        <MenuItem
          alert={invitationsData && invitationsData.getUserPendingFamilies && invitationsData.getUserPendingFamilies.length > 0 ? true : false}
          active={props.location.pathname === constants.ROUTE_ACCOUNT_FAMILY}
          icon={Family}
          onClick={() => props.history.push(constants.ROUTE_ACCOUNT_FAMILY)}
        >Taloudet</MenuItem>
        <MenuItem
          alert={groupInvitationsData && groupInvitationsData.getUserInvitedGroups && groupInvitationsData.getUserInvitedGroups.length > 0 ? true : false}
          active={props.location.pathname === constants.ROUTE_ACCOUNT_GROUP}
          icon={Users_group}
          onClick={() => props.history.push(constants.ROUTE_ACCOUNT_GROUP)}
        >Ryhmät</MenuItem>
        <MenuItem
          hidden={"m-down"}
          active={props.location.pathname === constants.ROUTE_ACCOUNT_SETTINGS}
          icon={Settings}
          onClick={() => props.history.push(constants.ROUTE_ACCOUNT_SETTINGS)}
        >Asetukset</MenuItem>
        <MenuItem
          active={props.location.pathname === constants.ROUTE_ACCOUNT_STATISTICS}
          icon={Trophy}
          onClick={() => props.history.push(constants.ROUTE_ACCOUNT_STATISTICS)}
        >Tulokset</MenuItem>
      </MenuList>
    </AccountHeader>
  )
}
export default withRouter(AccountNavbar)