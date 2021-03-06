import React from 'react'
import Block from '../atoms/block'
import Paragraph from '../atoms/paragraph'
import Input from "../atoms/input"



const InputGroup = props => {


    return (
        <Block style={props.style} className="input-group-wrapper">
            <Input
                required={props.required}
                basic={props.basic}
                rounded={props.rounded}
                underline={props.underline}
                onChange={props.onChange}
                name={props.name}
                placeholder={props.placeholder}
                id={props.id}
                error={props.error && props.error}
                type={props.type}
                color={props.color}
                value={props.value}
                onChange={props.onChange}
                min={props.min}
                max={props.max}
            />
            <Paragraph size={2}>{props.error && props.error.message ? props.error.message : props.error}</Paragraph>
        </Block>
    )
}
export default InputGroup