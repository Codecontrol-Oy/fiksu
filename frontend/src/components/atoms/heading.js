import React, { useState, useEffect } from 'react'


const Heading = props => {

    const [classes, setClasses] = useState(() => {
        let classes = []

        if (props.color === "secondary") classes.push("text-secondary")
        if (props.align === "center") classes.push("text-center")
        if (props.align === "left") classes.push("text-left")
        if (props.align === "right") classes.push("text-right")

        return classes
    })

    const Tag = `h${props.variant ? props.variant : 1}`

    return <Tag className={classes.join(" ")} >{props.children}</Tag>

}
export default Heading