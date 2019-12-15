import React from 'react'
import Block from "../atoms/block"
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import StatisticsCard from "../molecules/statisticsCard"
import Heading from "../atoms/heading"
import StatisticsTopGroups from '../organisms/statisticsTopGroups'
import StatisticsTopHouseHolds from '../organisms/statisticsTopHouseHolds'
import Divider from '../atoms/divider'
import Paragraph from '../atoms/paragraph'
const Statistics = props => {

    return (
        <StatisticsCard >
            <GridContainer align={"center"} height={12} width={12} direction={"column"} className="statistics">
                <GridRow size={12}>
                    <Block className="statistics-header">
                        <i className={'icofont-crown statistics-header-icon'}></i>
                        <Heading variant={1} style={{textTransform: 'uppercase'}}>Hall of fame</Heading>
                        <Paragraph>Statistiikat lasketaan 31 päivän jaksolta. TOP 3 tulokset näytetään ryhmistä ja talouksista.</Paragraph>
                    </Block>
                    <StatisticsTopGroups />
                    <Divider />
                    <StatisticsTopHouseHolds />
                </GridRow>
            </GridContainer>
        </StatisticsCard>
    )

}
export default Statistics