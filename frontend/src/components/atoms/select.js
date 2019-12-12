import React, { useState, useEffect } from 'react'


const Select = props => {


    const [classes, setClasses] = useState(() => {
        let classNames = []
        if (props.rounded) classNames.push("input-rounded")
        if (props.basic) classNames.push("input-basic")
        if (props.underline) classNames.push("input-underline")
        if (props.error) classNames.push("input-error")

        if (props.color === "secondary") classNames.push("text-secondary")

        return classNames
    })

    useEffect(() => {
        let index = classes.indexOf('input-error')
        if (props.error && index === -1) {
            let newClasses = classes
            newClasses.push("input-error")
            setClasses([...newClasses])


        }
        else {

            if (!props.error && index != -1) {
                classes.splice(index, 1)
                setClasses([...classes])
            }
        }

    }, [props.error])

    const onChange = (e) => {
        let dataset = e.target.options[e.target.selectedIndex].dataset
        props.onChange(e, dataset)
    }

    return <select value={props.value} id={props.id} name={props.name}  {...(props.onChange && { onChange: (e) => onChange(e) })} className={"input " + (classes.join(' '))}>{props.children}</select>
}
export default Select