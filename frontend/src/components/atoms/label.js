import React from 'react'

const Label = props => {

    return (
        <label className="input-label" for={props.id}>
            {props.name}
        </label>
    )

}
export default Label