import React, { useState, useRef } from 'react'



const Button = props => {

  const t = ["basic-button"]
  let ref = useRef(null)

  const [classes, setClasses] = useState(() => {
    let newClasses = [""]

    if (props.basic) {
      newClasses.push("button-basic")
    }

    if (props.alert) {
      newClasses.push("button-alert")
    }

    return newClasses

  })


  return (
    <button
      disabled={props.disabled}
      ref={ref}
      className={classes.join(' ')}
      style={props.style}
      type={props.type ? props.type : "button"}
      form={props.form} id={props.id}
      onClick={(e) => { props.onClick && props.onClick(e) }}>
      <span className="button-inside">
        {props.children}
      </span>
    </button>
  )
}

export default Button