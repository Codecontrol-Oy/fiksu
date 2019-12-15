import React, { useEffect, useState } from 'react'
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

const MyGroupsInfo = props => {

    const [data, setData] = useState([{ angle: 8, label: "1", subLabel: "Jaakko" }, { angle: 5, label: "5", subLabel: "Teppo" }, { angle: 10, label: "5", subLabel: "Jippo" }])
    const { loading: gLoading, error: gError, data: gData } = useQuery(GET_USER_ELECTRICITY_GRAPH, {
        variables: {
            id: props.id
        }
    })

    useEffect(() => {

        console.log(props.data)
        const newData = props.data.map((item => {
            return { angle: item.ecopoints, label: item.ecopoints.toString(), subLabel: item.info.firstName }
        }))

        const myData = [{ angle: 8, label: "1", subLabel: "Jaakko" }, { angle: 5, label: "5", subLabel: "Teppo" }, { angle: 10, label: "5", subLabel: "Jippo" }]

        console.log(newData)
        setData(newData)
    }, [props.data])
    return (
        <GridContainer size={12}>
            <Block className="household-info-wrapper">
                <GridContainer size={12}>
                    <GridRow wrap>
                        <Grid sizeS={12} sizeM={4} sizeL={4}>
                            <Heading variant={2} color={"secondary"}>Ryhmä {props.name}</Heading>
                            {props.members && props.members.length > 0 &&

                                props.data.map((member => {

                                    return (
                                        <GridRow>
                                            <Grid sizeS={7} sizeM={7} sizeL={7}>
                                                <Paragraph color={"secondary"}>{member.info.firstName + " " + member.info.lastName}</Paragraph>
                                            </Grid>
                                            <Grid sizeS={4} sizeM={4} sizeL={4}>
                                                <Paragraph color={"secondary"}>{member.ecopoints + "pts"}</Paragraph>
                                            </Grid>
                                        </GridRow>
                                    )
                                }))
                            }

                        </Grid>
                        <Grid sizeS={12} sizeM={4} sizeL={4}>

                        </Grid>
                        <Grid size={12} sizeM={4} sizeL={4}>
                            <Block style={{ textAlign: 'center' }}>
                                <DonutChart width={320} height={320} data={data} title={"Ryhmän pisteet"} />
                            </Block>
                        </Grid>
                    </GridRow>
                </GridContainer>

            </Block>
        </GridContainer>
    )
}
export default MyGroupsInfo    