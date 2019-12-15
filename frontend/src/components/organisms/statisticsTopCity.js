import React from 'react'
import Grid from "../grid/grid"
import GridRow from "../grid/row"
import Heading from '../atoms/heading'
import Block from "../atoms/block"
import Paragraph from '../atoms/paragraph'
import DonutChart from "../molecules/donutChart"
import Divider from "../atoms/divider"

const myData = [{ angle: 1, label: "1", subLabel: "ekopisteet" }, { angle: 5, label: "5", subLabel: "Sähkönkäyttöpisteet" }]

const StatisticsTopCity = props => {
    return (
        <>

            <Heading variant={2}>Suurin EkoTeko kaupunki</Heading>
            <Divider />
            <GridRow align={"center"} >
                <Grid sizeS={12} sizeM={6} sizeL={6}>
                    <Block className="top-city-info-wrapper">
                        <GridRow>
                            <Grid sizeS={6} sizeM={6} sizeL={6}>
                                <Paragraph color={"secondary"}>Käyttäjiä yhteensä</Paragraph>
                            </Grid>
                            <Grid sizeS={6} sizeM={6} sizeL={6}>
                                <Paragraph color={"secondary"}>183</Paragraph>
                            </Grid>
                        </GridRow>
                        <GridRow>
                            <Grid sizeS={6} sizeM={6} sizeL={6}>
                                <Paragraph color={"secondary"}>Ekopisteet</Paragraph>
                            </Grid>
                            <Grid sizeS={6} sizeM={6} sizeL={6}>
                                <Paragraph color={"secondary"}>183</Paragraph>
                            </Grid>
                        </GridRow>
                        <GridRow>
                            <Grid sizeS={6} sizeM={6} sizeL={6}>
                                <Paragraph color={"secondary"}>Sähkönkäyttö</Paragraph>
                            </Grid>
                            <Grid sizeS={6} sizeM={6} sizeL={6}>
                                <Paragraph color={"secondary"}>183</Paragraph>
                            </Grid>
                        </GridRow>
                    </Block>
                </Grid>
                <Grid sizeS={12} sizeM={6} sizeL={6}>
                    <Block style={{ textAlign: 'center' }}>
                        <DonutChart data={myData} title={"Talouden pisteet"} />
                    </Block>
                </Grid>
            </GridRow>
        </>
    )
}
export default StatisticsTopCity