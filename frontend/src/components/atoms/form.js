import React from 'react'


const Form = props => {

    return <form onSubmit={(e) => { e.preventDefault(); props.onSubmit(e) }} className={props.className} action={props.action} method={props.method} id={props.id} style={props.style}>
        {props.children}
    </form>
}
export default Form