import React, { useState } from 'react'
import Block from "./block"
import Paragraph from './paragraph'
import Divider from './divider'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Heading from "./heading"

const Achievement = props => {

    const [classes, setClasses] = useState([])

    const [showProgress, setShowProgress] = useState(props.level === "NONE" ? true : false)

    const [maxValue, setMaxValue] = useState(() => {
        if (props.level === "NONE") return 1.0
        if (props.level === "BRONZE") return 3.0
        if (props.level === "SILVER") return 5.0
    })
    const [nextLevel, setNextLevel] = useState(() => {
        if (props.level === "NONE") return "BRONZE"
        if (props.level === "BRONZE") return "SILVER"
        if (props.level === "SILVER") return "GOLD"
    })



    const openAchievement = e => {
        let newClasses = []
        newClasses.push("achievement-open")
        setClasses(newClasses)
    }
    return (
        <Block
            onMouseLeave={() => setShowProgress(!showProgress)}
            onMouseEnter={() => setShowProgress(!showProgress)}
            onTouchStart={() => setShowProgress(!showProgress)}
            onTouchEnd={() => setShowProgress(!showProgress)}
            className={classes.length === 0 ? "achievement " : classes.join(' ')}>
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
            <Block className={"achievement-progress " + (showProgress ? "progress-show" : "progress-hide")}>
                <Block className={"achievement-progress-inner"}>
                    <Heading style={{ padding: 0, margin: "0.5rem" }} variant={5}>
                        Seuraavaan tasoon
                    </Heading>
                    <CircularProgressbarWithChildren maxValue={maxValue} value={props.points}>
                        {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}
                        <Block className={`achievement-progress-level --level-${nextLevel}`}>
                            {props.level &&
                                <i class="icofont-medal"></i>
                            }
                        </Block>
                    </CircularProgressbarWithChildren>
                    <Paragraph size={3}>
                        {`${(props.points / maxValue * 100).toFixed(0)}%`}
                    </Paragraph>
                    <Heading style={{ padding: 0, margin: "0.5rem" }} variant={5}>
                        {
                            nextLevel === "BRONZE" ?
                                "Pronssi "
                                :
                                nextLevel === "SILVER" ?
                                    "Hopea "
                                    :
                                    nextLevel === "GOLD" ?
                                        "Kulta "
                                        :
                                        props.level === "GOLD" ?
                                            "Ylin Taso"
                                            : ""
                        }
                        taso
                    </Heading>
                </Block>
            </Block>
            <Block className="achievement-image">
                <i class={props.icon || "icofont-not-allowed"}></i>
            </Block>

            <Paragraph color={"secondary"} >{props.name || "Testi"}</Paragraph>
            <Paragraph style={{ margin: "0" }} color={"secondary"} size={4}>{(props.points ? props.points : 0) + " - pistettä"}   </Paragraph>
            <Divider color={"secondary"} />
            <Paragraph size={4} color={"secondary"}>{props.description || "Tämä on testi kuvaus"}</Paragraph>
        </Block>
    )
}
export default Achievement