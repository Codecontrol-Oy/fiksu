import React from 'react'

const InputLabel = props => {

  return (
    <div className="input-label-group">
      <label className={`input-label ${props.badge ? 'badge' : ''}`} data-badge={props.badge} for={props.id}>
        {props.name}
      </label>
      {props.children}
    </div>
  )

}
export default InputLabel