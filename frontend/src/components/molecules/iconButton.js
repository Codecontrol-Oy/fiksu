import React from 'react'
import Block from '../atoms/block'
import Button from '../atoms/button'
import Paragraph from '../atoms/paragraph'


const IconButton = props => {

  return (<Block className="icon-button-wrapper">
    <Button>
      <i class={props.icon}></i>
    </Button>
    <Paragraph color={props.color ? props.color : undefined}>{props.text}</Paragraph>
  </Block>)
}
export default IconButton