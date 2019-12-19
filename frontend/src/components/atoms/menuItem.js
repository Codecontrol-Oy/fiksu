import React, { useRef, useState } from 'react'
import useRipple from "../hooks/useRipple"
import { ReactSVG } from 'react-svg'
import Paragraph from './paragraph'

const MenuItem = props => {
  const ref = useRef(null)
  const [trigger] = useRipple()

  const [classes, setClasses] = useState(() => {
    let newClasses = []
    if (props.hidden === "m-down") newClasses.push("hidden-m-down")
    return newClasses

  })
  return (
    <li onClick={(e) => { props.onClick && props.onClick(e) }} className={"menu-item ripple-test " + (props.active ? "menu-item-active " : "") + (classes.join(' '))}>
      {props.icon &&
        <span ref={ref} className="menu-item-icon">
          {props.alert &&
            <span className="menu-item-alert">
              <i className="icofont-exclamation"></i>
            </span>
          }
          <ReactSVG
            src={props.icon}
            afterInjection={(error, svg) => {
              if (error) {
                console.error(error)
                return
              }
              if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
                console.log(svg)
              }
              if (props.active) {
                svg.classList.add('new-menu-item-active')
              }

            }}
            beforeInjection={svg => {
              svg.classList.add('new-menu-item')
            }}
            evalScripts="always"
            fallback={() => <span>Error!</span>}
            loading={() => <span>Loading</span>}
            renumerateIRIElements={false}
            className="menu-item-wrapper"
            onClick={() => {
              console.log('wrapper onClick')
            }}
          />
        </span>
      }
      {/*
      <Paragraph size={3}>
        {props.children}
      </Paragraph>
      */}
    </li>
  )

}


export default MenuItem