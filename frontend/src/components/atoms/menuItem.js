import React, { useRef } from 'react'
import useRipple from "../hooks/useRipple"

const MenuItem = props => {
  const ref = useRef(null)
  const [trigger] = useRipple()
  return (
    <li onClick={(e) => { props.onClick && props.onClick(e) }} className={"menu-item " + (props.active ? "menu-item-active" : "")}>
      {props.icon &&
        <span ref={ref} className="menu-item-icon">
          {props.alert &&
            <span className="menu-item-alert">
              <i className="icofont-exclamation"></i>
            </span>
          }

          <i className={props.icon}>
          </i></span>
      }
      {props.children}
    </li>
  )

}


export default MenuItem