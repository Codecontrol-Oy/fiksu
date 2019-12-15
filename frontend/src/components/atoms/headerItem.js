
import React from 'react'

const HeaderItem = props => {

    return <li onClick={() => props.onClick && props.onClick()} className="header-item">{props.children}</li>
}
export default HeaderItem