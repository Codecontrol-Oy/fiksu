import React from 'react'
import Label from "../atoms/label"
import RadioInput from '../atoms/radioInput'
import Block from '../atoms/block'


const RadioInputField = props => {

    return (
        <Block className="radio-input-field">
            <RadioInput active={props.active} id={props.id}/>
            <Label name={props.name} />
        </Block>
    )
}
export default RadioInputField