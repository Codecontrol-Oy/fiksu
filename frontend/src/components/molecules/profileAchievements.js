import React from 'react'
import Block from '../atoms/block'
import Heading from "../atoms/heading"
import Divider from '../atoms/divider'
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import Achievement from "../atoms/achievement"
import Grid from '../grid/grid'
import { useQuery } from "@apollo/react-hooks"
import { GET_USER_ACHIEVEMENTS } from '../../graphqlQueries'


const ProfileAchievements = props => {
    return (
        <Block className="profile-achievements">
            <Heading align={"left"} color={"secondary"} variant={4}>Saavutukseni</Heading>
            <Divider />
            <GridContainer direction={"row"} width={12}>
                <GridRow wrap>
                    {props.data && props.data.ecoAchievements && props.data.ecoAchievements.length > 0 &&
                        props.data.ecoAchievements.map((item => {
                            return (
                                <Grid sizeL={2} sizeS={6} sizeM={3}>
                                    <Achievement
                                        icon={item.icon}
                                        points={(item.points ? item.points : 0)}
                                        level={item.level}
                                        type={item.type}
                                        description={item.description}
                                    />
                                </Grid>
                            )
                        }))
                    }
                    <Grid sizeL={2} sizeS={6} sizeM={3}>
                        <Achievement
                        />
                    </Grid>

                </GridRow>
            </GridContainer>
        </Block >
    )
}
export default ProfileAchievements