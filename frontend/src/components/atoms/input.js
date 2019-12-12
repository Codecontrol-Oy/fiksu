import React, { useState, useEffect } from 'react'


const Input = props => {



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
    return <input value={props.value} id={props.id} name={props.name} placeholder={props.placeholder} {...(props.onChange && { onChange: (e) => props.onChange(e) })} className={"input " + (classes.join(' '))} type={props.type ? props.type : "text"} />
}
export default Input