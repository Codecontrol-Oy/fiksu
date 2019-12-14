import React from 'react'


const Block = React.forwardRef((props, ref) => (

  <div id={props.id} ref={ref} onClick={(e) => props.onClick && props.onClick()} className={props.className} style={props.style}>
    {props.children}
  </div>
))
export default Block