import React, { useState } from 'react'
import Header from '../atoms/header'
import HeaderList from '../atoms/headerList'
import HeaderItem from "../atoms/headerItem"
import Grid from "../grid/grid"
import { Link, withRouter } from "react-router-dom"
import MobileNavbar from "../atoms/mobileNavbar"
import * as constants from '../../constants'
import Block from "../atoms/block"
import { useQuery } from "@apollo/react-hooks"
import { GET_MY_USER } from '../../graphqlQueries'

const HeaderBar = props => {

    const [showMobileNav, setShowMobileNav] = useState(false)

    const { loading, error, data } = useQuery(GET_MY_USER, {
        variables: {
            id: localStorage.getItem("userId")
        }
    })

    const logOut = () => {

        props.history.push(constants.ROUTE_ACCOUNT)
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("userId")
        setShowMobileNav(false)
    }

    return (
        <Header>
            <HeaderList>
                <Grid size={2}>
                    {!localStorage.getItem("token") &&
                        <HeaderItem onClick={() => props.history.push(constants.ROUTE_REGISTER)}>Kirjaudu sisään</HeaderItem>
                    }
                    {localStorage.getItem("token") &&
                        <HeaderItem onClick={() => logOut()}>
                            {"Ulos "}
                            <i class="icofont-logout"></i>
                        </HeaderItem>
                    }

                </Grid>

                {localStorage.getItem("token") &&
                    <Grid size={2}>

                        <HeaderItem onClick={() => props.history.push(constants.ROUTE_ACCOUNT)}>
                            {data && data.user.firstName + " " + data.user.lastName + " "}
                        </HeaderItem>
                    </Grid>
                }
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