import React, { useState } from 'react'
import Block from "../atoms/block"
import Paragraph from "../atoms/paragraph"


const Popup = props => {

    const [variant, setVariant] = useState(() => {

        let variant = "popup-default"
        if (props.variant === "success") variant = "popup-success"
        if (props.variant === "error") variant = "popup-error"
        if (props.variant === "warning") variant = "popup-warning"

        return variant
    })
    console.log(variant)
    return (
        <Block className={"popup " + variant}>
            <Block className="popup-text">
                <Paragraph weight={4} size={2}>{props.message}</Paragraph>
            </Block>
            <Block className="popup-icon">
                {props.variant === "success" &&
                    <i class="icofont-check-alt"></i>
                }
                {props.variant === "error" &&
                    <i class="icofont-close-line"></i>
                }
            </Block>
        </Block>
    )

}

export default Popup