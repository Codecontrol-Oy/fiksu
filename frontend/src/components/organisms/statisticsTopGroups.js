import React, {useState} from 'react'
import Block from '../atoms/block'
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import Grid from '../grid/grid'
import { useQuery } from "@apollo/react-hooks"
import { GET_TOP_FAMILIES, GET_TOP_GROUPS } from '../../graphqlQueries'
import Paragraph from '../atoms/paragraph'
import Heading from '../atoms/heading'
import DonutChart from '../molecules/donutChart'
const StatisticsTopGroups = props => {

    const today = new Date()
    const tomorrow = new Date()
    const lastMonth = new Date()
    tomorrow.setDate(today.getDate() + 1)
    lastMonth.setDate(today.getDate() -31)

    const [ dateTomorrow, setDateTomorrow ] = useState(tomorrow)
    const [ dateLastMonth, setDateLastMonth ] = useState(lastMonth)
    const { loading: groupLoading, error: groupError, data: groupData } = useQuery(GET_TOP_GROUPS, {
        variables: {
            top: 3,
            from: dateLastMonth,
            to: dateTomorrow
        }
    })
    const calculateData = (data) => {
        let result = []
        let ecoPoints = 0
        let electricPoints = 0
        data.group.detailedPoints.map(h => {
            ecoPoints += h.ecopoints
            electricPoints += h.electricpoints
        })
        result.push({
            angle: ecoPoints,
            label: ecoPoints.toFixed(1).toString(),
            subLabel: 'Ekopisteet'
        })
        result.push({
            angle: electricPoints,
            label: electricPoints.toFixed(1).toString(),
            subLabel: 'Sähkönkäyttöpisteet'
        })
        return result
    }

    return (
        <Block className="top-households-wrapper">
            <GridContainer size={12} align={"center"}>
                <GridRow>
                    <Grid size={12}>
                    <Heading variant={2} style={{textTransform: 'uppercase'}}>Ryhmät</Heading>
                    <Paragraph>Parhaiten menestyneet ryhmät. Pisteytyksessä huomiodaan ryhmän jäsenten oma panos sähkönkulutukseen ja ekotekoihin.</Paragraph>
                    <Block style={{ textAlign: 'center'}}>
                        {groupData && groupData.getTopGroupResults && groupData.getTopGroupResults.length > 0 && groupData.getTopGroupResults.map(group => (group.position < 4) && <Grid sizeS={12} sizeM={6} sizeL={3}>
                            <Block>
                            <i className={`statistics-medal ${(group.position > 0 && group.position < 4 ? 'icofont-medal' : 'icofont-trophy statistics-diplom')} ${(group.position == 1 ? 'gold' : (group.position == 2 ? 'silver' : (group.position == 3 ? 'bronze' : 'diplom')) )}`}></i>
                            <Heading variant={2} style={{textTransform: 'uppercase'}} icon={true}>{`${group.group.name}`}</Heading>
                        </Block>
                        <Block>
                            <DonutChart primary={"white"} data={calculateData(group)} title="Kokonaispisteet"/>
                        </Block>
                        </Grid>)
                        }
                    </Block>
                    </Grid>
                </GridRow>
            </GridContainer>
        </Block>
    )
}
export default StatisticsTopGroups