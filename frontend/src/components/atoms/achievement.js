import React, { useState } from 'react'
import Block from "./block"
import Paragraph from './paragraph'


const Achievement = props => {

    const [classes, setClasses] = useState([])

    const openAchievement = e => {
        let newClasses = []
        newClasses.push("achievement-open")
        setClasses(newClasses)
    }
    return (
        <Block className={classes.length === 0 ? "achievement " : classes.join(' ')}>
            {props.locked &&
                <Block className="achievement-locked">
                    <i className="icofont-ui-lock"></i>
                </Block>
            }
            <Block className="achievement-image">
                <i class="icofont-cycling"></i>
            </Block>

            <Paragraph color={"secondary"} >{props.name || "Testi"}</Paragraph>
        </Block>
    )
}
export default Achievement