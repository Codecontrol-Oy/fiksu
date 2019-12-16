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
                    <Grid sizeS={12} sizeM={12} sizeL={4}>
                            <Heading variant={2} color={"secondary"}>Talous {props.name}</Heading>
                            {props.members && props.members.length > 0 &&
                                props.data.map((member => {
                                    return (
                                        <>
                                            <GridRow>
                                                <Grid sizeS={7} sizeM={7} sizeL={7}>
                                                    <Paragraph color={"secondary"}>{(member.info.firstName && member.info.lastName ? member.info.firstName + " " + member.info.lastName : '[ Piilotettu ]')}</Paragraph>
                                                </Grid>
                                                <Grid sizeS={4} sizeM={4} sizeL={4}>
                                                     <Paragraph color={"secondary"}>{member.ecopoints + " pistettä"}</Paragraph>
                                                </Grid>
                                            </GridRow>
                                            <Divider color={"secondary"} />
                                        </>
                                    )
                                }))
                            }
                        </Grid>
                        <Grid sizeS={12} sizeM={12} sizeL={8}>
                            <Block style={{textAlign: 'center'}}>
                            <Heading variant={2} color={"secondary"}>Talouden kuukausitulos</Heading>
                            <GridRow size={12}>
                            <Grid sizeS={12} sizeM={6} sizeL={6}>
                            {gData && gData.getElectricityGraph.length && <LineChart data={gData.getElectricityGraph} title="Sähkönkäyttö" />}
                            </Grid>
                            <Grid sizeS={12} sizeM={6} sizeL={6}>
                            {data.length > 0 && <DonutChart width={320} height={320} data={data} title={"Ekopisteet"} />}
                            </Grid>
                            </GridRow>
                            </Block> 
                        </Grid>
                    </GridRow>
                </GridContainer>

            </Block>
        </GridContainer>
    )
}
export default HouseholdInfo    