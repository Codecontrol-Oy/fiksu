import React, { useState } from 'react'
import Block from "../atoms/block"
import Input from '../atoms/input'


const IconInput = props => {

    const [classes, setClasses] = useState(() => {
        let classNames = []

        if (props.basic) classNames.push("input-basic")
        if (props.rounded) classNames.push("input-rounded")

        return classNames
    })

    return (
        <Block style={props.wrapperStyle} className={"icon-input-wrapper " + (classes.join(' '))}>
            <i class={props.icon}></i>
            <Input underline={props.underline} id={props.id} type={props.type} basic={props.basic} rounded={props.rounded} placeholder={props.placeholder} style={props.inputStyle} onChange={props.onChange} />
        </Block>
    )
}
export default IconInput