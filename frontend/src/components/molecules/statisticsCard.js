import React from 'react'
import Block from "../atoms/block"
import GridContainer from '../grid/container'


const StatisticsCard = props => {

    return (
        <Block id={"profile-card"} className="profile-container statistics">
            <GridContainer height={12} width={12} direction={"column"}>
                <Block id={"modal"} />
                <Block id={"snackbars"} />
                {props.children}
            </GridContainer>
        </Block>
    )

}
export default StatisticsCard