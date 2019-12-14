import React from 'react'
import Block from '../atoms/block'
import Heading from "../atoms/heading"
import Divider from '../atoms/divider'


const ProfileFamily = props => {

    return (
        <Block className="profile-achievements">
            <Heading align={"left"} color={"secondary"} variant={4}>Talouteni</Heading>
            <Divider />
        </Block>
    )
}
export default ProfileFamily