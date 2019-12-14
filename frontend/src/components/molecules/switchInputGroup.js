import React, { useState } from 'react'
import Block from '../atoms/block'
import Label from '../atoms/label'
import Switch from '../atoms/switch'

const SwitchInputGroup = props => {
    const [id, setId] = useState(props.id ? props.id : "switch")
    return (
        <Block className="switch-group-wrapper">
            <Label for={id} name={props.label} />
            <Switch id={id} disabled={props.disabled} value={props.value} onClick={props.onClick} />
        </Block>
    )
}
export default SwitchInputGroup