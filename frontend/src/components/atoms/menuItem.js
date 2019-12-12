import React from 'react'

const MenuItem = props => {
    return (
        <li onClick={(e) => props.onClick && props.onClick(e)} className="menu-item">

            {props.icon &&
                <span className="menu-item-icon"><i class={props.icon}></i></span>
            }

            {props.children}</li>
    )
}
export default MenuItem