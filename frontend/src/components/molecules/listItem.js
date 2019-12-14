import React from 'react'
import Paragraph from '../atoms/paragraph'
import Label from '../atoms/label'
const ListItem = props => 
  <li className="listItem">
    <div className="top">
      {props.title && <Label name={props.title} />}
      {props.date && <Label name={props.date} />}
      {props.description && <Paragraph>{props.description}</Paragraph>}
    </div>
    {props.action && 
      <div className="bottom">
        {props.action}
      </div>
    }
  </li>
export default ListItem