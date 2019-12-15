import React, { useRef } from 'react'
import useRipple from "../hooks/useRipple"

const MenuItem = props => {
  const ref = useRef(null)
  const [trigger] = useRipple()
  return (
    <li onClick={(e) => { trigger(ref); props.onClick && props.onClick(e) }} className="menu-item">
      {props.icon &&
        <span ref={ref} className="menu-item-icon"><i className={props.icon}></i></span>
      }
      {props.children}
    </li>
  )

}


export default MenuItem