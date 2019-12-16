import React, { useState } from 'react'
import Block from '../atoms/block'
import Heading from "../atoms/heading"
import Divider from '../atoms/divider'
import { useQuery } from "@apollo/react-hooks"
import { GET_USER_FAMILIES } from '../../graphqlQueries'
import HouseholdInfo from "./householdInfo"

const ProfileFamily = props => {

    const { loading, error, data } = useQuery(GET_USER_FAMILIES, {
        variables: {
            id: localStorage.getItem("userId")
        },
        onCompleted(data) {
        }
    })

    const { loading: familyLoading, error: familyError, data: familyData } = useQuery(GET_USER_FAMILIES, {
        variables: {
            id: localStorage.getItem('userId')
        }
    })



    const myData = [{ angle: 1, label: "1", subLabel: "ekopisteet" }, { angle: 5, label: "5", subLabel: "Sähkönkäyttöpisteet" }]

    return (
        <Block className="profile-achievements">
            {data && data.getUserFamilies && data.getUserFamilies.length > 0 &&
                <>
                    <Heading align={"left"} color={"secondary"} variant={4}>Talouteni - {data.getUserFamilies.length}kpl</Heading>
                    <Divider />
                    {
                        data.getUserFamilies.map((household => {
                            return <HouseholdInfo data={household.detailedPoints} members={[...household.members, ...household.admins, household.owner]} name={household.name} id={household._id} />
                        }))
                    }
                </>
            }
        </Block>
    )
}
export default ProfileFamily