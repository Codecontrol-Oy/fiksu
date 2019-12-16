import React, { useState, useEffect } from 'react'
import GridContainer from "../grid/container"
import { useQuery } from "@apollo/react-hooks"
import GridRow from "../grid/row"
import Grid from "../grid/grid"
import Block from "../atoms/block"
import LineChart from "./lineChart"
import { GET_USER_ELECTRICITY_GRAPH } from '../../graphqlQueries'
import Divider from '../atoms/divider'
import Heading from "../atoms/heading"
import DonutChart from './donutChart'
import Paragraph from '../atoms/paragraph'

const HouseholdInfo = props => {

    const defaultData = [{ angle: 0, label: "0", subLabel: "ekopisteet" }, { angle: 0, label: "0", subLabel: "Sähkönkäyttöpisteet" }]

    const { loading: gLoading, error: gError, data: gData } = useQuery(GET_USER_ELECTRICITY_GRAPH, {
        variables: {
            id: props.id
        }
    })

    const [data, setData] = useState([])

    useEffect(() => {

        const newData = props.data.map((item => {
            return { angle: item.ecopoints, label: item.ecopoints.toString(), subLabel: item.info.firstName }
        }))
        setData(newData)
    }, [props.data])

    return (
        <GridContainer size={12}>
            <Block className="household-info-wrapper">
                <GridContainer size={12}>
                    <GridRow wrap>
                        <Grid sizeS={12} sizeM={3} sizeL={4}>
                            <Heading variant={2} color={"secondary"}>Talous {props.name}</Heading>
                            {props.members && props.members.length > 0 &&

                                props.members.map((member => {

                                    return (
                                        <Paragraph color={"secondary"}>{member.firstName + " " + member.lastName}</Paragraph>
                                    )
                                }))
                            }

                        </Grid>
                        <Grid sizeS={12} sizeM={5} sizeL={4}>
                            <Block>
                                {gData && gData.getElectricityGraph.length && <LineChart data={gData.getElectricityGraph} title="Sähkönkäyttö" />}
                            </Block>
                        </Grid>
                        <Grid size={12} sizeM={4} sizeL={4}>
                            <Block style={{ textAlign: 'center' }}>
                                {data.length > 0 && <DonutChart width={320} height={320} data={data} title={"Ekopisteet"} />}
                            </Block>
                        </Grid>
                    </GridRow>
                </GridContainer>

            </Block>
        </GridContainer>
    )
}
export default HouseholdInfo    