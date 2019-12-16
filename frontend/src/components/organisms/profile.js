import React, { useEffect } from 'react'
import Block from "../atoms/block"
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import ProfileAchievements from "../molecules/profileAchievements"
import ProfileFamily from '../molecules/profileFamily'
import ProfileBenefits from '../molecules/profileBenefits'
import ProfileInfo from "../molecules/profileInfo"
import ProfileGroups from "../molecules/profileGroups"
import { useQuery, useLazyQuery } from "@apollo/react-hooks"
import withSnackbar from '../molecules/withSnackbar'
import { GET_DAILY_TIP, GET_USER_ACHIEVEMENTS, GET_MY_USER } from '../../graphqlQueries'

const Profile = props => {



    let today = new Date()
    let prevMonth = new Date()

    prevMonth.setDate(1)
    prevMonth.setMonth(today.getMonth() - 1)


    const { loading: dLoading, dError, dData } = useQuery(GET_DAILY_TIP, {
        variables: {
            filter: {
                date: today.toJSON().slice(0, 10)
            }
        }
    })

    const { loading: uLoading, error: uError, data: uData } = useQuery(GET_MY_USER, {
        variables: {
            id: localStorage.getItem('userId')
        }
    })

    const { loading, error, data } = useQuery(GET_USER_ACHIEVEMENTS, {
        variables: {
            userId: localStorage.getItem("userId"),
            to: today.toJSON().slice(0, 10),
            from: prevMonth.toJSON().slice(0, 10),
        },
        onCompleted(data) {
            console.log(data)
        },
        onError(data) {
            console.log(data)
        }

    })


    return (
        <Block className="profile-container">
            {uData && uData.user &&
            <GridContainer height={12} width={12} direction={"column"}>
                <Block id={"snackbars"} />
                <GridRow justify={"center"}>
                     <ProfileInfo user={uData.user} data={data && data.getUserAchievements} />
                </GridRow>
                <GridRow justify={"center"}>
                    <ProfileAchievements data={data && data.getUserAchievements} />
                </GridRow>
                <GridRow justify={"center"}>
                    <ProfileFamily />
                </GridRow>
                <GridRow justify={"center"}>
                    <ProfileGroups />
                </GridRow>
            </GridContainer>}
        </Block>
    )

}
export default Profile