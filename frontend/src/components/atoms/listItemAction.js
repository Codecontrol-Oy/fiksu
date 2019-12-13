import React from 'react'
const ListItemAction = props => 
  <li onClick={(e) => props.onClick && props.onClick(e)} className="listItem-action">
    {props.icon &&
     <span className="listItem-icon"><i className={props.icon}></i></span>
    }
    {props.children}
  </li>
export default ListItemAction