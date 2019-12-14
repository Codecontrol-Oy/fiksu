import React from 'react'
import Heading from '../atoms/heading'
const InputHeading = props =>  <div className="input-heading-group">
  <Heading group variant={props.variation} color={props.color}  data-badge={props.badge} for={props.id}>
    {props.name}
  </Heading>
  {props.children}
</div>
export default InputHeading