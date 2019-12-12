import React from 'react'
import Header from '../atoms/header'
import HeaderList from '../atoms/headerList'
import HeaderItem from "../atoms/headerItem"
import Grid from "../grid/grid"
import { Link } from "react-router-dom"


const HeaderBar = props => {

    return (
        <Header>
            <HeaderList>
                <Grid size={3}>
                    <HeaderItem><Link to="/register">Kirjaudu sisään</Link></HeaderItem>
                </Grid>
                <Grid size={2}>
                    <HeaderItem>UKK</HeaderItem>
                </Grid>
                <Grid size={2}>
                    <HeaderItem>Yhteystiedot</HeaderItem>
                </Grid>
            </HeaderList>
        </Header>
    )
}
export default HeaderBar