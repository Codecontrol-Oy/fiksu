import React from 'react'
import Block from "../atoms/block"
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import ProfileAchievements from "../molecules/profileAchievements"
import ProfileFamily from '../molecules/profileFamily'
import ProfileBenefits from '../molecules/profileBenefits'
import ProfileInfo from "../molecules/profileInfo"

const Profile = props => {

    return (
        <Block className="profile-container">
            <GridContainer height={12} width={12} direction={"column"}>
                <Block id={"snackbars"} />

                <GridRow justify={"center"}>
                    <ProfileInfo />
                </GridRow>
                <GridRow justify={"center"}>
                    <ProfileFamily />
                </GridRow>
                <GridRow justify={"center"}>
                    <ProfileAchievements />
                </GridRow>
                <GridRow justify={"center"}>
                </GridRow>
            </GridContainer>
        </Block>
    )

}
export default Profile