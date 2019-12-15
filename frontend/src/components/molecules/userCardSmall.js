import React from 'react'
import Paragraph from '../atoms/paragraph'
import Block from "../atoms/block"
import Heading from '../atoms/heading'

const UserCardSmall = props => {
    return (
        <Block className="user-card-wrapper">
            <i class={props.icon}></i>
            <Heading color={"secondary"} variant={3}>182-pistettä</Heading>
            <Paragraph variant={3} color={"secondary"}>{props.text}</Paragraph>
        </Block>)
}
export default UserCardSmall