import React from 'react'
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import Grid from "../grid/grid"
import UserCardSmall from "../molecules/userCardSmall"
import Heading from "../atoms/heading"
import Divider from '../atoms/divider'
import Block from '../atoms/block'


const StatisticsTopUsers = props => {



    return (
        <Block className="top-users-wrapper">
            <Heading variant={4} color={"secondary"}>Kulutuksen pienentäjät Top 3
            </Heading>
            <Divider />
            <GridContainer justify={"center"} size={12}>
                <GridRow justify={"center"}>
                    <Grid sizeS={4} sizeM={4} sizeL={2}>
                        <UserCardSmall icon={"icofont-trophy-alt"} text={"Testi"} />
                    </Grid>
                    <Grid sizeS={4} sizeM={4} sizeL={2}>
                        <UserCardSmall icon={"icofont-trophy-alt"} text={"Testi"} />
                    </Grid>
                    <Grid sizeS={4} sizeM={4} sizeL={2}>
                        <UserCardSmall icon={"icofont-trophy-alt"} text={"Testi"} />
                    </Grid>
                </GridRow>
            </GridContainer>
        </Block>
    )
}
export default StatisticsTopUsers