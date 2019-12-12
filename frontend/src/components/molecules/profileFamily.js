import React from 'react'
import Block from '../atoms/block'
import Header from '../atoms/header'
import Heading from "../atoms/heading"
import Divider from '../atoms/divider'


const ProfileFamily = props => {

    return (
        <Block className="profile-achievements">
            <Heading align={"left"} color={"secondary"} variant={4}>Perheeni</Heading>
            <Divider />
        </Block>
    )
}
export default ProfileFamily