import React from 'react'
import Paragraph from './paragraph'


const Fieldset = props => {

    return <fieldset className="fieldset" style={props.style}><legend><Paragraph weight={4}>{props.title}</Paragraph></legend>{props.children}</fieldset>
}
export default Fieldset