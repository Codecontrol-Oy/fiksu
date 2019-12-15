import React from 'react'
import Block from '../atoms/block'
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import { useQuery } from "@apollo/react-hooks"
import { GET_TOP_FAMILIES, GET_TOP_GROUPS } from '../../graphqlQueries'


const StatisticsTopHouseholds = props => {

    const { loading, error, data } = useQuery(GET_TOP_GROUPS, {
        variables: {
            top: 5,
            from: "2019-11-14",
            to: "2019-12-16"
        },
        onCompleted(data) {
            console.log(data)
        }
    })
    return (
        <Block className="top-households-wrapper">
            <GridContainer size={12} align={"center"}>
                <GridRow>

                </GridRow>
            </GridContainer>
        </Block>
    )
}
export default StatisticsTopHouseholds