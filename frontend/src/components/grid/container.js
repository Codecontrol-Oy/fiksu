import React, { useEffect, useState, useLayoutEffect } from 'react'


const GridContainer = props => {

    const [style, setStyle] = useState({
        display: 'flex',
        width: '100%',
        flexWrap: 'wrap'
    })

    const [classes, setClasses] = useState(() => {
        let classesNew = ["container-grid", "flex"]


        if (props.size >= 1 && props.size <= 12) classesNew.push(`u-grid-${props.size}`)

        if (props.height >= 1 && props.height <= 12) classesNew.push(`height-${props.height}`)


        if (props.direction === "column") classesNew.push("direction-column")
        if (props.direction === "row") classesNew.push("direction-row")

        if (props.justify === "center") classesNew.push("justify-center")
        if (props.justify === "start") classesNew.push("justify-start")
        if (props.justify === "end") classesNew.push("justify-end")
        if (props.justify === "around") classesNew.push("justify-around")
        if (props.justify === "evenly") classesNew.push("justify-evenly")
        if (props.justify === "stretch") classesNew.push("justify-stretch")

        if (props.align === "center") classesNew.push("align-center")
        if (props.align === "start") classesNew.push("align-start")
        if (props.align === "end") classesNew.push("align-end")
        if (props.align === "baseline") classesNew.push("align-baseline")

        if (props.grow) classesNew.push("grow")

        if (props.gutter >= 1 && props.gutter <= 10) classesNew.push(`gutter-${props.gutter}`)

        return classesNew
    })


    useLayoutEffect(() => {
        let classesNew = classes

        if (props.classNames) {
            props.classNames && props.classNames.length > 0 && props.classNames.map((item => {
                return classesNew.push(item)
            }))

            setClasses(classesNew)
        }


    }, [props.classNames])

    return <div id={props.id} className={classes.join(" ")} style={props.style}>{props.children}</div>
}
export default GridContainer