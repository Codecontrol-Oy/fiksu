import React from 'react'
import Block from "../atoms/block"
import GridContainer from '../grid/container'


const ProfileCard = props => {

    return (
        <Block id={"profile-card"} className="profile-container">
            <GridContainer height={12} width={12} direction={"column"}>
                <Block id={"modal"} />
                <Block id={"snackbars"} />
                {props.children}
            </GridContainer>
        </Block>
    )

}
export default ProfileCard