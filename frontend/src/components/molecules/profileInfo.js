import React, { useEffect, useState } from 'react'
import Block from '../atoms/block'
import UserIcon from '../../icons/userIcon.svg'
import { GET_ME } from '../../graphqlQueries'
import { useQuery } from "@apollo/react-hooks"
import Heading from '../atoms/heading'
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import Grid from "../grid/grid"
import DonutChart from "./donutChart"
import withSnackbar from "./withSnackbar"
import Achievement from '../atoms/achievement'
import Divider from '../atoms/divider'
import Paragraph from "../atoms/paragraph"
import LoadingSpinner from '../atoms/loadingSpinner'

const ProfileInfo = props => {

    const { loading, error, data } = useQuery(GET_ME)

    const [myData, setData] = useState([{ angle: 1, label: "0", subLabel: "Energiankulutus" }, { angle: 2, label: "0", subLabel: "EkoTeot" }])

    console.log(props.tip)
    useEffect(() => {
        if (props.data) {
            setData([
                {
                    angle: props.data.combinedElectricityAchievement ? props.data.combinedElectricityAchievement.points : 0,
                    label: props.data.combinedElectricityAchievement ? props.data.combinedElectricityAchievement.points.toString() : "0",
                    subLabel: "Energiankulutus"
                },
                {
                    angle: props.data.combinedEcoAchievement ? props.data.combinedEcoAchievement.points : 0,
                    label: props.data.combinedEcoAchievement ? props.data.combinedEcoAchievement.points.toString() : "0",
                    subLabel: "EkoTeot"
                }])
        }

    }, [props.data])

    return (
        <Block className="profile-info">

            <GridContainer wrap size={12}>
                <GridRow wrap >
                    <Grid sizeS={12} sizeL={6} sizeM={6}>
                        <GridRow wrap>
                            {props.loading &&
                                <LoadingSpinner />
                            }
                            {props.data && props.data.combinedEcoAchievement &&
                                <Grid sizeS={6} sizeM={6} sizeL={6}>
                                    <Block className="profile-combined-achievement">
                                        <Heading color={"secondary"} variant={3}>Ekoteot</Heading>
                                        <i className={props.data.combinedEcoAchievement.icon} />
                                        <Heading variant={4} color={"secondary"}>{props.data.combinedEcoAchievement.points || 0}{" - pistettä"}</Heading>
                                        <Divider color={"secondary"} />
                                        <Block className={`profile-combined-achievement-level --level-${props.data.combinedEcoAchievement.level}`}>
                                            {props.data && props.data.combinedEcoAchievement.level !== "NONE" &&
                                                <>
                                                    <i class="icofont-medal"></i>

                                                </>
                                            }
                                        </Block>
                                    </Block>
                                </Grid>
                            }
                            {props.data && props.data.combinedElectricityAchievement &&
                                <Grid sizeS={6} sizeM={6} sizeL={6}>
                                    <Block className="profile-combined-achievement">
                                        <Heading color={"secondary"} variant={3}>Energiankulutus</Heading>
                                        <i className={props.data.combinedElectricityAchievement.icon} />
                                        <Heading variant={4} color={"secondary"}>{props.data.combinedElectricityAchievement.points || 0}{" - pistettä"}</Heading>
                                        <Divider color={"secondary"} />
                                        <Block className={`profile-combined-achievement-level --level-${props.data.combinedElectricityAchievement.level}`}>
                                            {props.data && props.data.combinedElectricityAchievement.level !== "NONE" &&
                                                <>
                                                    <i class="icofont-medal"></i>
                                                </>
                                            }
                                        </Block>
                                    </Block>

                                </Grid>}

                            {props.data && (!props.data.combinedEcoAchievement && !props.data.combinedElectricityAchievement) &&
                                <Grid sizeS={12} sizeM={12} sizeL={12}>
                                    <Block className="profile-combined-achievement">
                                        <Heading color={"secondary"} variant={3}>Hei, {props.user.firstName}</Heading>
                                        <Paragraph color={"secondary"}>Kuukauden ajalta ei löydy merkattuja ekotekoja tai talouden sähkönsäästömerkintöjä.</Paragraph>
                                        <Paragraph color={"secondary"}>Ekotekoja voit kirjata EKOTEOT -välilehdeltä, ja mikäli olet mukana taloudessa, sähkömerkintöjä voit merkata ENERGIANKULUTUS välilehdeltä!</Paragraph>
                                        <Paragraph color={"secondary"}>Jos haluat perustaa oman talouden, voit tehdä sen TALOUDET -välilehdeltä.</Paragraph>
                                    </Block>
                                </Grid>
                            }
                            <Grid sizeS={12} sizeM={12} sizeL={12}>
                                {props.tip &&
                                    <Block className="profile-tip">
                                        <Heading color={"secondary"} variant={4}>{props.tip.title}</Heading>

                                        <Paragraph size={4} color={"secondary"}>
                                            {props.tip.description}
                                        </Paragraph>
                                    </Block>
                                }
                            </Grid>
                        </GridRow>
                    </Grid>


                    <Grid sizeS={12} sizeM={6} sizeL={6}>
                        {props.data &&
                            <Block style={{ textAlign: 'center' }}>
                                <DonutChart width={320} height={320} data={myData} title={"Sinun Ekopisteesi"} />
                            </Block>
                        }

                    </Grid>
                </GridRow>
            </GridContainer>


        </Block >
    )
}
export default withSnackbar(ProfileInfo)