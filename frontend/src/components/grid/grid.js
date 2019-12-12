import React, { useState, useEffect, useLayoutEffect } from 'react'


const Grid = props => {

    const [style, setStyle] = useState({
        width: '100%',
        padding: '1rem'
    })
    const [classes, setClasses] = useState(() => {
        let className = []

        if (props.size >= 1 && props.size <= 12) className.push(`u-grid-${props.size}`)

        if (props.sizeS >= 1 && props.sizeS <= 12) className.push(`s-grid-${props.sizeS}`)


        if (props.height >= 1 && props.height <= 12) className.push(`height-${props.height}`)

        if (props.grow) className.push("grow")


        return className
    })


    return <div id={props.id} className={classes.join(" ")} style={props.style}>{props.children}</div>
}

export default Grid