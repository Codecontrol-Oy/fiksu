import React, { useRef, useState, useEffect } from 'react'
import Block from './block'
import useRipple from "../hooks/useRipple"


const RadioInput = props => {

  const [selected, setSelected] = useState(props.defaultSelected ? true : props.selected ? true : false)
  const [groupName, setGroupName] = useState(props.groupName ? props.groupName : "radiogroup")
  const [id, setId] = useState(props.id ? props.id : generateId())

  useEffect(() => {
    if (props.active !== id) {
      setSelected(false)
    }
  }, [props.active])

  function generateId() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
  }

  const ref = useRef(null)
  const [trigger] = useRipple()

  return (
    <Block
      ref={ref}
      id={id}
      selected={selected}
      name={groupName}
      onClick={() => {
        setSelected(!selected);
        props.handleRadio && props.handleRadio(id);
        props.selected === false && props.handleClick && props.handleClick(id, selected)
      }}
      className="radio-input">
      {selected &&
                <Block className="radio-input-inner" />
      }
    </Block>
  )
}
export default RadioInput