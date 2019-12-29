import React, { useState } from 'react'


const Grid = props => {

    const [style, setStyle] = useState({
        width: '100%',
        padding: '1rem'
    })
    const [classes, setClasses] = useState(() => {
        let className = []

        if (props.size >= 1 && props.size <= 12) className.push(`u-grid-${props.size}`)

        if (props.sizeS >= 1 && props.sizeS <= 12) className.push(`s-grid-${props.sizeS}`)
        if (props.sizeM >= 1 && props.sizeM <= 12) className.push(`m-grid-${props.sizeM}`)
        if (props.sizeL >= 1 && props.sizeL <= 12) className.push(`l-grid-${props.sizeL}`)
        if (props.sizeXL >= 1 && props.sizeXL <= 12) className.push(`xl-grid-${props.sizeXL}`)


        if (props.height >= 1 && props.height <= 12) className.push(`height-${props.height}`)

        if (props.grow) className.push("grow")


        return className
    })


    return <div id={props.id} className={classes.join(" ")} style={props.style}>{props.children}</div>
}

export default Grid