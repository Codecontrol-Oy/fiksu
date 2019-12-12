import React from 'react'
import AccountHeader from '../atoms/headerAccount'
import IconButton from "./iconButton"
import MenuList from '../atoms/menuList'
import MenuItem from '../atoms/menuItem'
import { Link, withRouter } from "react-router-dom"
import * as constants from '../../constants'

const AccountNavbar = props => {

    return (
        <AccountHeader>
            <MenuList>
                <MenuItem icon={"icofont-user"} onClick={() => props.history.push(constants.ROUTE_ACCOUNT)}>Profiili</MenuItem>
                <MenuItem icon={"icofont-energy-savings"} onClick={() => props.history.push(constants.ROUTE_ACCOUNT_ELECTRICITY)}>Energiankulutus</MenuItem>
                <MenuItem icon={"icofont-water-drop"} onClick={() => props.history.push(constants.ROUTE_ACCOUNT_ELECTRICITY)}>Vedenkulutus</MenuItem>
                <MenuItem icon={"icofont-ui-settings"} onClick={() => props.history.push(constants.ROUTE_ACCOUNT_SETTINGS)}>Asetukset</MenuItem>
            </MenuList>
        </AccountHeader>)
}
export default withRouter(AccountNavbar)