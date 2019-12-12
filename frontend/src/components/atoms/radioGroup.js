import React, { useState } from 'react'

const RadioGroup = (props) => {

    const [active, setActive] = useState(null)
    const handleRadio = id => {
        setActive(id)
    }
    return (
        React.Children.map(props.children, child =>
            React.cloneElement(child, { handleRadio, active })
        ))

}
export default RadioGroup