import React from 'react'
import Block from '../atoms/block'
import Paragraph from '../atoms/paragraph'
import Select from "../atoms/select"



const SelectGroup = props => {


    return (
        <Block className="input-group-wrapper">
            <Select
                basic={props.basic}
                rounded={props.rounded}
                underline={props.underline}
                onChange={props.onChange}
                name={props.name}
                id={props.id}
                error={props.error && props.error}
                color={props.color}
                value={props.value}
            >
                {props.children}
            </Select>
            <Paragraph size={2}>{props.error && props.error.message}</Paragraph>
        </Block>
    )
}
export default SelectGroup