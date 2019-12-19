import React, { useEffect, useState } from 'react'
import Block from "./block"
import Heading from './heading'
import ReactDOM from "react-dom"

const SnackbarPortal = props => {

    const [mountNode, setMountNode] = useState()

    const [render, setRender] = useState(false)


    useEffect(() => {
        setMountNode(document.getElementById("snackbars"))

    }, [])

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log(mountNode)
    }
    return mountNode ? ReactDOM.createPortal(
        <Block className="snackbar-portal-wrapper">
            <Block style={props.style} className="snackbar-portal-inner">
                {props.children}
            </Block>
        </Block>,
        mountNode
    )
        : ""
}
export default SnackbarPortal