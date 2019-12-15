import React from 'react'
import Paragraph from '../atoms/paragraph'
import Block from "../atoms/block"


const HouseholdBadge = props => {
    return (
        <Block className="household-badge-wrapper">
            <i class="icofont-home"></i>
            <Paragraph color={"secondary"} variant={3}>{props.name}</Paragraph>
        </Block>
    )
}
export default HouseholdBadge