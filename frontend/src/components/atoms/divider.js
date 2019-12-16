import React, { useState } from 'react'
const Divider = props => {
    const [classes, setClasses] = useState(() => {
        let newClasses = []

        if (props.color === "secondary") newClasses.push("divider-secondary")

        return newClasses
    })
    return (
        <hr className={"divider " + (classes.length > 0 && classes.join(' '))} />
    )
}

export default Divider