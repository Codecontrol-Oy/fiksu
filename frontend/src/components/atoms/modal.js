import React, { useEffect, useState } from 'react'
import Block from "./block"
import Heading from './heading'
import ReactDOM from "react-dom"

const Modal = props => {

    const [mountNode, setMountNode] = useState(null)

    const [render, setRender] = useState(false)
    useEffect(() => {
        let mountNode = document.getElementById("modal")

        setMountNode(mountNode)

    }, [props.id])

    useEffect(() => {
        setRender(props.display)

    }, [props.display])


    return mountNode && render ? ReactDOM.createPortal(
        <Block className="modal-wrapper">
            <Block className="modal-inner">
                {props.children}
            </Block>
        </Block>,
        mountNode
    )
        :
        ""
}
export default Modal