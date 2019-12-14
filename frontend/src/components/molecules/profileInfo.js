import React from 'react'
import Block from '../atoms/block'
import UserIcon from '../../icons/userIcon.svg'
import { GET_ME } from '../../graphqlQueries'
import { useQuery } from "@apollo/react-hooks"
import Heading from '../atoms/heading'
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import Grid from "../grid/grid"
const ProfileInfo = props => {

    const { loading, error, data } = useQuery(GET_ME)
    return (
        <Block className="profile-info">
            <GridContainer size={12}>
                <GridRow size={6}>
                    <Grid>
                        <Block className="profile-avatar">
                            <img src={UserIcon} />
                        </Block>
                    </Grid>
                    <Grid size={12}>
                        <Block className="profile-details">
                            {data &&
                                <Heading color={"secondary"} variant={4}>{data.me.firstName + " " + data.me.lastName} </Heading>
                            }
                        </Block>
                    </Grid>
                </GridRow>
            </GridContainer>


        </Block>
    )
}
export default ProfileInfo