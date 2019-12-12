import React, { useRef, useState } from 'react'
import Block from './block'
import useRipple from "../hooks/useRipple"


const RadioInput = props => {

    const [selected, setSelected] = useState(false)

    const ref = useRef(null)

    const [trigger] = useRipple()

    return (
        <Block ref={ref} onClick={() => { trigger(ref); setSelected(!selected) }} className="radio-input">
            {selected &&
                <Block className="radio-input-inner" />
            }
        </Block>
    )
}
export default RadioInput