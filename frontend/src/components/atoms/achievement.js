import React, { useState } from 'react'
import Block from "./block"
import Paragraph from './paragraph'
import Divider from './divider'


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
            {props.level !== "NONE" &&
                <Block className={`achievement-level --level-${props.level}`}>
                    {props.level &&
                        <i class="icofont-medal"></i>
                    }
                </Block>
            }
            <Block className="achievement-image">
                <i class={props.icon || "icofont-not-allowed"}></i>
            </Block>

            <Paragraph color={"secondary"} >{props.name || "Testi"}</Paragraph>
            <Paragraph style={{ margin: "0" }} color={"secondary"} size={4}>{(props.points ? props.points : 0) + " - pistettä" || "0 - pistettä"}   </Paragraph>
            <Divider color={"secondary"} />
            <Paragraph size={4} color={"secondary"}>{props.description || "Tämä on testi kuvaus"}</Paragraph>
        </Block>
    )
}
export default Achievement