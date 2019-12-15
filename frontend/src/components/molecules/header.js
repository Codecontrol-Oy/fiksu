import React, { useState } from 'react'
import Header from '../atoms/header'
import HeaderList from '../atoms/headerList'
import HeaderItem from "../atoms/headerItem"
import Grid from "../grid/grid"
import { Link, withRouter } from "react-router-dom"
import MobileNavbar from "../atoms/mobileNavbar"
import * as constants from '../../constants'
import Block from "../atoms/block"


const HeaderBar = props => {

    const [showMobileNav, setShowMobileNav] = useState(false)

    const logOut = props => {

        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("userId")
        props.history.push(constants.ROUTE_REGISTER)
        setShowMobileNav(false)
    }

    return (
        <Header>
            <HeaderList>
                <Grid size={3}>
                    <HeaderItem onClick={() => props.history.push(constants.ROUTE_REGISTER)}>Kirjaudu sisään</HeaderItem>
                </Grid>
                <Grid size={2}>
                    <HeaderItem>UKK</HeaderItem>
                </Grid>
                <Grid size={2}>
                    <HeaderItem>Yhteystiedot</HeaderItem>
                </Grid>
            </HeaderList>
            <Block className={"mobile-navbar-button"}>
                <i onClick={() => setShowMobileNav(!showMobileNav)} class="icofont-navigation-menu"></i>
            </Block>
            <MobileNavbar display={showMobileNav}>
                <HeaderList>
                    {!localStorage.getItem("token") &&
                        <HeaderItem onClick={() => { props.history.push(constants.ROUTE_REGISTER); setShowMobileNav(false) }} >Kirjaudu sisään</HeaderItem>
                    }
                    <HeaderItem onClick={() => { props.history.push(constants.ROUTE_HOMEPAGE); setShowMobileNav(false) }} >Etusivu</HeaderItem>
                    <HeaderItem onClick={() => { props.history.push(constants.ROUTE_ACCOUNT); setShowMobileNav(false) }} >Käyttäjätilini</HeaderItem>
                    <HeaderItem>UKK</HeaderItem>
                    <HeaderItem>Tietoturvaseloste</HeaderItem>
                    {localStorage.getItem("token") &&
                        <HeaderItem onClick={() => logOut()} >Kirjaudu ulos</HeaderItem>
                    }
                </HeaderList>
            </MobileNavbar>
        </Header>
    )
}
export default withRouter(HeaderBar)