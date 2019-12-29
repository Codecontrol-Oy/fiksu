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

    if (props.rounded) {
      newClasses.push("button-rounded")
    }
    if (props.outlined) {
      newClasses.push("button-outlined")
    }
    if (props.plain) {
      newClasses.push("button-plain")
    }
    if (props.color === "alert") {
      newClasses.push("text-alert")
    }
    if (props.color === "secondary") {
      newClasses.push("text-secondary")
    }
    if (props.color === "default") {
      newClasses.push("text-default")
    }
    if (props.color === "success") {
      newClasses.push("text-success")
    }

    return newClasses

  })


  return (
    <button
      disabled={props.disabled}
      style={props.style}
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