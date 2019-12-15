import React, { useState } from 'react'


const Heading = props => {

  const [classes, setClasses] = useState(() => {
    let classes = []

    if (props.color === "secondary") classes.push("text-secondary")
    if (props.align === "center") classes.push("text-center")
    if (props.align === "left") classes.push("text-left")
    if (props.align === "right") classes.push("text-right")
    if (props.icon) classes.push("header-icon")
    if (props.group) classes.push("input-heading")
    if (props.badge) classes.push("badge")
    return classes
  })

  const Tag = `h${props.variant ? props.variant : 1}`

  return <Tag style={props.style} className={classes.join(" ")} data-badge={props.badge}>{props.children}</Tag>

}
export default Heading