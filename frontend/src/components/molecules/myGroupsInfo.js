import React, { useEffect, useState } from 'react'
import GridContainer from "../grid/container"
import { useQuery } from "@apollo/react-hooks"
import GridRow from "../grid/row"
import Grid from "../grid/grid"
import Block from "../atoms/block"
import Divider from '../atoms/divider'
import Heading from "../atoms/heading"
import GroupPoints from './groupPoints'
import GroupStackedPoints from './groupStackedPoints'
import Paragraph from '../atoms/paragraph'

const MyGroupsInfo = props => {
    console.log(props)
    return (
        <GridContainer size={12}>
            <Block className="household-info-wrapper">
                <GridContainer size={12}>
                    <GridRow wrap>
                        <Grid sizeS={12} sizeM={12} sizeL={4}>
                            <Heading variant={2} color={"secondary"}>Ryhmä {props.name}</Heading>
                            {props.members && props.members.length > 0 &&
                                props.data.map((member => {
                                    return (
                                        <>
                                            <GridRow>
                                                <Grid sizeS={7} sizeM={7} sizeL={7}>
                                                    <Paragraph color={"secondary"}>{(member.info.firstName && member.info.lastName ? member.info.firstName + " " + member.info.lastName : '[ Piilotettu ]')}</Paragraph>
                                                </Grid>
                                                <Grid sizeS={4} sizeM={4} sizeL={4}>
                                                    <Paragraph color={"secondary"}>{(member.ecopoints + member.electricpoints).toFixed(1) + " pistettä"}</Paragraph>
                                                </Grid>
                                            </GridRow>
                                            <Divider color={"secondary"} />
                                        </>
                                    )
                                }))
                            }
                        </Grid>
                        <Grid size={12} sizeM={6} sizeL={4}>
                            <Block style={{ textAlign: 'center' }}>
                            <GroupPoints group={props.id} title="Pisteet henkilöittäin"/>
                            </Block>
                        </Grid>
                        <Grid size={12} sizeM={6} sizeL={4}>
                            <Block style={{ textAlign: 'center' }}>
                                <GroupStackedPoints group={props.id} title="Jaottelu henkilöittäin" />
                            </Block>
                        </Grid>
                    </GridRow>
                </GridContainer>
            </Block>
        </GridContainer>
    )
}
export default MyGroupsInfo    