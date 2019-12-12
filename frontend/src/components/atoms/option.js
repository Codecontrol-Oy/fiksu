import React from 'react'


const Option = props => {

    return <option disabled={props.disabled} data-type={props.type} value={props.value}>{props.text}</option>
}
export default Option