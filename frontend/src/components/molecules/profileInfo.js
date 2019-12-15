import React from 'react'
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
import Button from "../atoms/button"

const ProfileInfo = props => {

    const { loading, error, data } = useQuery(GET_ME)
    const myData = [{ angle: 1, label: "1", subLabel: "ekopisteet" }, { angle: 5, label: "5", subLabel: "Sähkönkäyttöpisteet" }]

    return (
        <Block className="profile-info">
            <GridContainer size={12}>
                <GridRow>
                    <Button basic onClick={() => props.addSnack("testi", "success", 0, true, { vertical: "left", horizontal: "bottom" })}>Testi</Button>
                    <Grid sizeS={6} sizeM={4} sizeL={8}>
                        <Block className="profile-details">
                            {data &&
                                <Heading color={"secondary"} variant={4}>{data.me.firstName + " " + data.me.lastName} </Heading>
                            }
                        </Block>
                    </Grid>
                    <Grid sizeS={6} sizeM={4} sizeL={4}>
                        <Block style={{ textAlign: 'center' }}>
                            <DonutChart width={320} height={320} data={myData} title={"Sinun pisteesi"} />
                        </Block>
                    </Grid>
                </GridRow>
            </GridContainer>


        </Block>
    )
}
export default withSnackbar(ProfileInfo)