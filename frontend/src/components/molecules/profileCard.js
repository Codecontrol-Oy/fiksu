import React from 'react'
import Block from "../atoms/block"
import GridContainer from '../grid/container'


const ProfileCard = props => {

    return (
        <Block className="profile-container">
            <GridContainer height={12} width={12} direction={"column"}>
                {props.children}
            </GridContainer>
        </Block>
    )

}
export default ProfileCard