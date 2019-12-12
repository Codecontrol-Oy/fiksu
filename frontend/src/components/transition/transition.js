import React, { useState, useEffect } from 'react'



const Transition = props => {

    const [classes, setClasses] = useState(() => {
        let classesNew = ["transition"]
        if (!props.transition) classesNew.push("fade-in-right")

        if (props.transition === "slow-fade-from-top") classesNew.push("slow-fade-in-top")

        return classesNew
    })

    return <div className={classes.join(" ")}>{props.children}</div>
}
export default Transition