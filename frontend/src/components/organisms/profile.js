import React from 'react'
import Block from "../atoms/block"
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import ProfileAchievements from "../molecules/profileAchievements"
import ProfileFamily from '../molecules/profileFamily'
import ProfileBenefits from '../molecules/profileBenefits'
import ProfileInfo from "../molecules/profileInfo"
import ProfileGroups from "../molecules/profileGroups"
import { useQuery } from "@apollo/react-hooks"
import withSnackbar from '../molecules/withSnackbar'
import { GET_DAILY_TIP } from '../../graphqlQueries'

const Profile = props => {

    const { loading, error, data } = useQuery(GET_DAILY_TIP, {
        variables: {
            filter: {
                date: "2019-12-12",
            }
        },
        onCompleted(data) {
            console.log(data)
        }
    })
    return (
        <Block className="profile-container">
            <GridContainer height={12} width={12} direction={"column"}>
                <Block id={"snackbars"} />
                <GridRow justify={"center"}>
                    <ProfileInfo />
                </GridRow>
                <GridRow justify={"center"}>
                    <ProfileAchievements />
                </GridRow>
                <GridRow justify={"center"}>
                    <ProfileFamily />
                </GridRow>
                <GridRow justify={"center"}>
                    <ProfileGroups />
                </GridRow>
            </GridContainer>
        </Block>
    )

}
export default withSnackbar(Profile)