import React, { useEffect, useState } from 'react'
import Block from "./block"
import Heading from './heading'
import ReactDOM from "react-dom"
import { useSwipeable, Swipeable } from 'react-swipeable'

const MobileNavbar = props => {

    const [mountNode, setMountNode] = useState(null)
    const [classes, setClasses] = useState([])
    const [render, setRender] = useState(false)
    useEffect(() => {
        let mountNode = document.getElementById("mobile-navbar")

        setMountNode(mountNode)

    }, [])

    useEffect(() => {

        if (render === true && props.display === false) {
            setClasses(["mobile-navbar-wrapper-close"])

            setTimeout(() => {
                setClasses([])
                setRender(props.display)

            }, 250)

        }
        else {
            setRender(props.display)

        }
    }, [props.display])


    return mountNode && render ? ReactDOM.createPortal(
        <Block className={"mobile-navbar-wrapper " + (classes.join(' '))}>
            <Block className="mobile-navbar-inner">
                {props.children}
            </Block>
        </Block>,
        mountNode
    )
        :
        ""
}
export default MobileNavbar