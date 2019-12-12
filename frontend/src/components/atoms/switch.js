import React, { useState } from 'react'
import Block from './block'
import Button from "./button"


const Switch = props => {
    const [on, setOn] = useState(false)

    return (
        <Block onClick={() => setOn(!on)} className={"switch-wrapper " + (on ? "switch-on" : "")}>
            <Button />
        </Block>
    )
}
export default Switch