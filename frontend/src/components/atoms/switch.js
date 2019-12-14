import React, { useState, useEffect } from 'react'
import Block from './block'
import Button from "./button"


const Switch = props => {
    const [on, setOn] = useState(props.value ? props.value : false)

    useEffect(() => {

        setOn(props.value)
    }, [props.value])

    const onClick = () => {
        setOn(!on)

        if (props.onClick) {
            props.onClick(on)
        }
    }
    return (
        <Block id={props.id} className={"switch-wrapper " + (on ? "switch-on" : "")
        }>
            <Button onClick={() => onClick()} disabled={props.disabled} />
        </Block >
    )
}
export default Switch