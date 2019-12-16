import React, { useRef, useState } from 'react'
import useRipple from "../hooks/useRipple"

const MenuItem = props => {
  const ref = useRef(null)
  const [trigger] = useRipple()

  const [classes, setClasses] = useState(() => {
    let newClasses = []
    if (props.hidden === "m-down") newClasses.push("hidden-m-down")
    return newClasses

  })
  return (
    <li onClick={(e) => { props.onClick && props.onClick(e) }} className={"menu-item ripple-test " + (props.active ? "menu-item-active " : "") + (classes.join(' '))}>
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