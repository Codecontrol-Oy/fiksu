import React, { useState } from 'react'
import Block from '../atoms/block'
import Heading from "../atoms/heading"
import Divider from '../atoms/divider'
import { useQuery } from "@apollo/react-hooks"
import { GET_USER_FAMILIES } from '../../graphqlQueries'
import HouseholdBadge from './householdBadge'
import DonutChart from "./donutChart"
import { GET_USER_ELECTRICITY_GRAPH, QUERY_CONSUMPTION_TYPES, GET_USER_ENERGY_SAVINGS, GET_USER_MEASUREMENTS, GET_USER_GROUPS } from '../../graphqlQueries'
import { useMutation } from "@apollo/react-hooks"
import Option from '../atoms/option'
import Paragraph from '../atoms/paragraph'
import SelectGroup from "./selectGroup"
import Button from "../atoms/button"
import HouseholdInfo from "./householdInfo"
import MyGroupsInfo from "./myGroupsInfo"



const ProfileGroups = props => {

    const { loading, error, data } = useQuery(GET_USER_GROUPS, {
        variables: {
            id: localStorage.getItem("userId")
        },
        onCompleted(data) {
            console.log(data)
        }
    })




    const myData = [{ angle: 8, label: "1", subLabel: "Jaakko" }, { angle: 5, label: "5", subLabel: "Teppo" }, { angle: 10, label: "5", subLabel: "Jippo" }]

    return (
        <Block className="profile-achievements">
            {data && data.getUserGroups && data.getUserGroups.length > 0 &&
                <>
                    <Heading align={"left"} color={"secondary"} variant={4}>Ryhmäni - {data.getUserGroups.length}kpl</Heading>
                    <Divider />
                    {

                        data.getUserGroups.map((household => {
                            return <MyGroupsInfo data={household.detailedPoints} members={[...household.members, ...household.admins, household.owner]} name={household.name} id={household._id} />
                        }))
                    }
                </>
            }
        </Block>
    )
}
export default ProfileGroups