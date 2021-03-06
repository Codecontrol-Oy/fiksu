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
import Heading from '../atoms/heading'
import Divider from "../atoms/divider"
import { useSwipeable, Swipeable } from 'react-swipeable'

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

    const handlers = useSwipeable({ onSwipedRight: () => setShowMobileNav(false), trackMouse: true })

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
                    <HeaderItem onClick={() => props.history.push(constants.ROUTE_GDPR)}>Tietosuojaseloste</HeaderItem>
                </Grid>
                <Grid size={1}>
                </Grid>
                <Grid size={1}>
                </Grid>
                <Grid size={1}>
                </Grid>
                <Grid size={1}>
                </Grid>
                <Grid size={2}>
                    <HeaderItem onClick={() => props.history.push(constants.ROUTE_HOMEPAGE)}>Fiksu</HeaderItem>
                </Grid>
            </HeaderList>
            <Block onClick={() => setShowMobileNav(!showMobileNav)} className={"mobile-navbar-button"}>
                <i class="icofont-navigation-menu"></i>
            </Block>
            <Block handlers={{ ...handlers }}>
                <MobileNavbar onClick={() => setShowMobileNav(false)} handlers={{ ...handlers }} display={showMobileNav}>
                    <HeaderList>
                        {localStorage.getItem("token") &&
                            <Heading variant={3}>
                                Hei {data && data.user.firstName + " " + data.user.lastName + " "}!
                            </Heading>
                        }
                        {!localStorage.getItem("token") &&
                            <HeaderItem onClick={() => { props.history.push(constants.ROUTE_REGISTER); setShowMobileNav(false) }} >Kirjaudu sisään</HeaderItem>
                        }
                        <HeaderItem onClick={() => { props.history.push(constants.ROUTE_HOMEPAGE); setShowMobileNav(false) }} >Etusivu</HeaderItem>
                        <HeaderItem onClick={() => { props.history.push(constants.ROUTE_ACCOUNT); setShowMobileNav(false) }} >Käyttäjätilini</HeaderItem>
                        <HeaderItem onClick={() => { props.history.push(constants.ROUTE_GDPR); setShowMobileNav(false) }}>Tietosuojaseloste</HeaderItem>
                        <HeaderItem onClick={() => { props.history.push(constants.ROUTE_ACCOUNT_SETTINGS); setShowMobileNav(false) }}>Asetukset</HeaderItem>
                        {localStorage.getItem("token") &&
                            <HeaderItem onClick={() => logOut()} >Kirjaudu ulos</HeaderItem>
                        }
                    </HeaderList>
                </MobileNavbar>
            </Block>

        </Header>
    )
}
export default withRouter(HeaderBar)