import React from 'react'
import Block from "../atoms/block"
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import ProfileAchievements from "../molecules/profileAchievements"
import ProfileFamily from '../molecules/profileFamily'
import ProfileBenefits from '../molecules/profileBenefits'
import ProfileInfo from "../molecules/profileInfo"
import ProfileCard from "../molecules/profileCard"
import Heading from "../atoms/heading"
import StatisticsTopUsers from '../organisms/statisticsTopUsers'
import StatisticsTopCity from '../organisms/statisticsTopCity'
import StatisticsTopHouseholds from '../organisms/statisticsTopHouseholds'

const Statistics = props => {

    return (
        <ProfileCard>
            <Heading variant={3} color={"secondary"}>Tulokset</Heading>
            <GridContainer align={"center"} height={12} width={12} direction={"column"}>
                <StatisticsTopHouseholds />
            </GridContainer>
        </ProfileCard>
    )

}
export default Statistics