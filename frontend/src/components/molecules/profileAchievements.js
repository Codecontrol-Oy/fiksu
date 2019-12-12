import React from 'react'
import Block from '../atoms/block'
import Header from '../atoms/header'
import Heading from "../atoms/heading"
import Divider from '../atoms/divider'
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import Achievement from "../atoms/achievement"
import Grid from '../grid/grid'


const ProfileAchievements = props => {

    return (
        <Block className="profile-achievements">
            <Heading align={"left"} color={"secondary"} variant={4}>Saavutukseni</Heading>
            <Divider />
            <GridContainer direction={"row"} width={12}>
                <GridRow wrap>
                    <Grid size={1} sizeS={4}>
                        <Achievement />
                    </Grid>
                    <Grid size={1} sizeS={4}>
                        <Achievement />
                    </Grid>
                    <Grid size={1} sizeS={4}>
                        <Achievement />
                    </Grid>
                    <Grid size={1} sizeS={4}>
                        <Achievement />
                    </Grid>
                    <Grid size={1} sizeS={4}>
                        <Achievement />
                    </Grid>
                    <Grid size={1} sizeS={4}>
                        <Achievement />
                    </Grid>
                    <Grid size={1} sizeS={4}>
                        <Achievement locked />
                    </Grid>
                </GridRow>
            </GridContainer>
        </Block >
    )
}
export default ProfileAchievements