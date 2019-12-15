import React, {useState} from 'react'
import Block from '../atoms/block'
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import Grid from '../grid/grid'
import { useQuery } from "@apollo/react-hooks"
import { GET_TOP_FAMILIES } from '../../graphqlQueries'
import Paragraph from '../atoms/paragraph'
import Heading from '../atoms/heading'
import DonutChart from '../molecules/donutChart'
const StatisticsTopHouseHolds = props => {

    const today = new Date()
    const tomorrow = new Date()
    const lastMonth = new Date()
    tomorrow.setDate(today.getDate() + 1)
    lastMonth.setDate(today.getDate() -31)
    const [ dateTomorrow, setDateTomorrow ] = useState(tomorrow)
    const [ dateLastMonth, setDateLastMonth ] = useState(lastMonth)
    const { loading: householdLoading, error: householdError, data: householdData } = useQuery(GET_TOP_FAMILIES, {
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
        data.household.detailedPoints.map(h => {
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
                    <Heading variant={2} style={{textTransform: 'uppercase'}}>Taloudet</Heading>
                    <Paragraph>Parhaiten menestyneet taloudet. Pisteytyksessä huomiodaan talouden yhteenlasketut ekoteot ja sähköä säästävät toimenpiteet.</Paragraph>
                    <Block style={{ textAlign: 'center'}}>
                        {householdData && householdData.getTopFamilyResults.length > 0 && householdData.getTopFamilyResults.map(household => <Grid sizeS={12} sizeM={6} sizeL={3}>
                            <Block>
                            <i className={`statistics-medal ${(household.position > 0 && household.position < 4 ? 'icofont-medal' : 'icofont-trophy statistics-diplom')} ${(household.position == 1 ? 'gold' : (household.position == 2 ? 'silver' : (household.position == 3 ? 'bronze' : 'diplom')) )}`}></i>
                            <Heading variant={2} style={{textTransform: 'uppercase'}} icon={true}>{`${household.household.name}`}</Heading>
                        </Block>
                        <Block>
                            <DonutChart primary={"white"} data={calculateData(household)} title="Kokonaispisteet"/>
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
export default StatisticsTopHouseHolds