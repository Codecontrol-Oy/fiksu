import React, { useState } from 'react'
import Block from '../atoms/block'
import Heading from "../atoms/heading"
import Divider from '../atoms/divider'
import { useQuery } from "@apollo/react-hooks"
import { GET_USER_GROUPS } from '../../graphqlQueries'
import MyGroupsInfo from "./myGroupsInfo"
import LoadingSpinner from '../atoms/loadingSpinner'

const ProfileGroups = props => {

    const { loading, error, data } = useQuery(GET_USER_GROUPS, {
        variables: {
            id: localStorage.getItem("userId")
        }
    })
    return (
        <Block className="profile-achievements">
            {loading &&
                <LoadingSpinner />
            }
            {data && data.getUserGroups && data.getUserGroups.length > 0 &&
                <>
                    <Heading align={"left"} color={"secondary"} variant={4}>Ryhmäni - {data.getUserGroups.length}kpl</Heading>
                    <Divider />
                    {
                        data.getUserGroups.map((group => {
                            return <MyGroupsInfo loading={loading} data={group.detailedPoints} members={[...group.members, ...group.admins, group.owner]} name={group.name} id={group._id} />
                        }))
                    }
                </>
            }
        </Block>
    )
}
export default ProfileGroups