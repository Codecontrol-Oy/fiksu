import React, { useState } from 'react'


const Paragraph = props => {

    const [classes, setClasses] = useState(() => {
        let newClasses = ["paragraph"]

        if (props.size >= 1 && props.size <= 6) newClasses.push(`font-size-${props.size}`)
        if (props.weight >= 1 && props.weight <= 8) newClasses.push(`weight-${props.weight}00`)

        if (props.color === "secondary") newClasses.push("text-secondary")

        return newClasses
    })

    return <p onClick={props.onClick && props.onClick} style={props.style} className={classes.join(" ")}>{props.children}</p>
}
export default Paragraph