import React, { useState, useEffect } from 'react'
import ProfileCard from '../molecules/profileCard'
import Heading from "../atoms/heading"
import GridRow from '../grid/row'
import GridContainer from '../grid/container'
import Grid from '../grid/grid'
import Divider from "../atoms/divider"
import Block from "../atoms/block"
import InputGroup from "../molecules/inputGroup"
import { GET_USER_FAMILIES,GET_USER_ELECTRICITY_GRAPH, QUERY_CONSUMPTION_TYPES, GET_USER_ENERGY_SAVINGS, GET_USER_MEASUREMENTS } from '../../graphqlQueries'
import { useQuery, useMutation } from "@apollo/react-hooks"
import Option from '../atoms/option'
import Paragraph from '../atoms/paragraph'
import SelectGroup from "../molecules/selectGroup"
import Button from "../atoms/button"
import { MUTATION_ADD_NEW_CONSUMPTION, MUTATION_REMOVE_CONSUMPTION, MUTATION_ADD_NEW_MEASUREMENT, MUTATION_REMOVE_MEASUREMENT } from '../../graphqlMutations'
import List from '../atoms/list'
import ListItem from '../molecules/listItem'
import ListItemAction from '../atoms/listItemAction'
import Form from '../atoms/form'
import LineChart from '../molecules/lineChart'
const ProfileElectricity = props => {

    var today = new Date()
    var tomorrow = new Date()
    var yesterday = new Date()
    var lastMonth = new Date()
    tomorrow.setDate(today.getDate() + 1);
    yesterday.setDate(today.getDate() - 1);
    lastMonth.setDate(today.getDate() - 31);

    const [selectedType, setSelectedType] = useState('undefined')
    const [selectedFamily, setSelectedFamily] = useState('default')
    const [measurement, setMeasurement] = useState(undefined)
    const [readingType, setReadingType] = useState(undefined)
    const [date, setDate] = useState(today.toJSON().slice(0, 10))
    const [graphFrom, setGraphFrom] = useState(lastMonth)
    const [graphTo, setGraphTo] = useState(tomorrow)
    const [measurementDate, setMeasurementDate] = useState(today.toJSON().slice(0, 10))
    const [reading, setReading] = useState("")
    const [removeSavingsFrom, setRemoveSavingsFrom] = useState(yesterday)
    const [removeSavingsTo, setRemoveSavingsTo] = useState(tomorrow)
    const [removeMeasurementFrom, setRemoveMeasurementFrom] = useState(yesterday)
    const [removeMeasurementTo, setRemoveMeasurementTo] = useState(tomorrow)
    const { loading, error, data } = useQuery(QUERY_CONSUMPTION_TYPES)
    const { loading: sLoading, error: sError, data: sData } = useQuery(GET_USER_ENERGY_SAVINGS, {
        variables: {
            id: selectedFamily, from: removeSavingsFrom, to: removeSavingsTo
        }
    })
    const { loading: familyLoading, error: familyError, data: familyData } = useQuery(GET_USER_FAMILIES, {
        variables: {
          id: localStorage.getItem('userId')
        }
      })
    const { loading: mLoading, error: mError, data: mData } = useQuery(GET_USER_MEASUREMENTS, {
        variables: {
            id: selectedFamily, from: removeMeasurementFrom, to: removeMeasurementTo
        }
    })
    const { loading: gLoading, error: gError, data: gData } = useQuery(GET_USER_ELECTRICITY_GRAPH, {
        variables: {
            id: selectedFamily, from: graphFrom, to: graphTo
        }
    })
    const [saveConsumption, { loading: consumptionLoading, error: consumptionError, data: consumptionData }] = useMutation(MUTATION_ADD_NEW_CONSUMPTION,
        {
            onCompleted(data) {
                setSelectedType(undefined)
                setReadingType(undefined)
                setDate(today)
                setReading(undefined)
            },
            refetchQueries: ['GetEnergySavings', 'GetElectricityGraph', 'GetUserAchievements','getTopGroupResults']
        }
    )

    const [removeConsumption, { loading: rLoading, error: rError, data: rData }] = useMutation(MUTATION_REMOVE_CONSUMPTION, {
        refetchQueries: ['GetEnergySavings', 'GetElectricityGraph','GetUserAchievements','getTopGroupResults']
    })

    const [saveMeasurement, { loading: measurementLoading, error: measurementError, data: measurementData }] = useMutation(MUTATION_ADD_NEW_MEASUREMENT,
        {
            onCompleted(data) {
                setMeasurementDate(today)
                setMeasurement(undefined)
            },
            refetchQueries: ['Measurements', 'GetElectricityGraph','GetUserAchievements','getTopGroupResults']
        }
    )

    const [removeMeasurement, { loading: rmLoading, error: rmError, data: rmData }] = useMutation(MUTATION_REMOVE_MEASUREMENT, {
        refetchQueries: ['Measurements', 'GetElectricityGraph','getTopGroupResults']
    })

    return (
        <ProfileCard>
            <Heading variant={3} color={"secondary"}>Sähkön säästötoimet</Heading>
            <GridContainer size={12} direction={"column"}>
            <GridRow wrap direction="row">
                <Grid sizeS={12} sizeM={12} sizeL={12}>
                <Heading variant={4} color={"secondary"}>Valitse talous</Heading>
                <Paragraph color={"secondary"}>Valitse mille taloudelle haluat merkata sähkölukemia tai säästötoimia</Paragraph>
                <Block style={{textAlign: 'center'}}>
                {familyData && <SelectGroup underline color={"secondary"} value={selectedFamily} onChange={(e, dataset) => { setSelectedFamily(e.currentTarget.value) }}>
                <Option key={'defaultFamily'} value={'default'} text={'Valitse talous'} />
                    {familyData.getUserFamilies &&
                    familyData.getUserFamilies.map((item => <Option key={item._id} value={item._id} text={item.name} />))
                    }
                </SelectGroup>}
                </Block>
                </Grid>
            </GridRow>
            {familyData && familyData.getUserFamilies.length > 0 && selectedFamily != 'default' && <Block>
            <GridRow wrap direction="row">
                <Grid sizeS={12} sizeM={4} sizeL={4}>
                    <Block className="new-electricity-consumption">
                        <Heading variant={3} color={"secondary"}>Olen säästänyt kulutuksessa</Heading>
                        <Form
                            onSubmit={e => saveConsumption(
                                {
                                    variables: {
                                        savedConsumption: {
                                            "householdId": selectedFamily,
                                            "consumptionTypeId": selectedType,
                                            "value": parseFloat(reading),
                                            "date": date,
                                        }
                                    }
                                }
                            )
                            }>
                            <GridRow align={"center"} direction={"column"}>

                                <InputGroup required underline value={date} onChange={(e) => setDate(e.target.value)} color={"secondary"} basic id="date" type="date" />
                                <SelectGroup underline color={"secondary"} value={selectedType} onChange={(e, dataset) => { setSelectedType(e.currentTarget.value); setReadingType(dataset.type) }}>
                                   <Option key={'first_default_consumptionType'} type={'undefined'} value={'undefined'} text={'Valitse tapahtuma'} />
                                    {data && data.getConsumptionTypes && data.getConsumptionTypes.length > 0 &&
                                        data.getConsumptionTypes.map((item => <Option key={item._id} type={item.amountType} value={item._id} text={item.description} />))
                                    }
                                </SelectGroup>
                                <InputGroup required underline value={reading} onChange={(e) => setReading(e.target.value)} color={"secondary"} placeholder={readingType} basic id="reading" type="number" />
                                <InputGroup underline color={"secondary"} placeholder="Muistiinpanot" basic id="notes" type="text" />
                                {selectedType != 'undefined' && <Button
                                    type="submit"
                                    basic > Tallenna</Button>}
                            </GridRow>
                        </Form>
                    </Block>
                </Grid>
                <Grid sizeS={12} sizeM={4} sizeL={4}>
                    <Block className="new-electricity-consumption">
                        <Heading variant={3} color={"secondary"}>Kuukauden sähkötiedot</Heading>
                        <Form
                            onSubmit={e => saveMeasurement(
                                {
                                    variables: {
                                        measurement: {
                                            "householdId": selectedFamily,
                                            "value": parseFloat(measurement),
                                            "date": measurementDate,
                                        }
                                    }
                                }
                            )
                            }>
                            <GridRow align={"center"} direction={"column"}>
                                <InputGroup required underline value={measurementDate} onChange={(e) => setMeasurementDate(e.target.value)} color={"secondary"} basic id="measurementDate" type="date" />
                                <InputGroup required underline value={measurement} onChange={(e) => setMeasurement(e.target.value)} color={"secondary"} placeholder="Sähkömittarilukema" basic id="measurement" type="number" />
                                <Button
                                    type="submit"
                                    basic > Tallenna</Button>

                            </GridRow>
                        </Form>
                    </Block>
                </Grid>
                <Grid sizeS={12} sizeM={4} sizeL={4}>
                    <Block>
                        {gData && gData.getElectricityGraph.length && <LineChart data={gData.getElectricityGraph} title="Sähkönkäyttö" />}
                    </Block>
                </Grid>
            </GridRow>
            <Divider />
            <GridRow direction="row">
                <Block className="edit-electricity-consumption">
                    <Heading variant={3} color={"secondary"}>Poista energiansäästötapahtumia</Heading>
                    <Block>
                        <InputGroup required underline value={removeSavingsFrom.toISOString().slice(0, 10)} onChange={(e) => setRemoveSavingsFrom(new Date(e.target.value))} color={"secondary"} placeholder={removeSavingsFrom} basic id="from" type="date" />
                        <InputGroup required underline value={removeSavingsTo.toISOString().slice(0, 10)} onChange={(e) => setRemoveSavingsTo(new Date(e.target.value))} color={"secondary"} placeholder={removeSavingsTo} basic id="to" type="date" />
                    </Block>
                    <List>
                        {sData && sData.getSavedConsumptions && sData.getSavedConsumptions.map((item) => <Grid key={`grid-${item._id}`} sizeS={12} sizeM={4} sizeL={3}>
                            <ListItem
                                key={`item-${item._id}`} action={<ListItemAction
                                    icon={"icofont-energy-savings"} onClick={(e) => removeConsumption(
                                        {
                                            variables: {
                                                id: item._id
                                            }
                                        }
                                    )}>Poista</ListItemAction>} title={item.consumptionType.title} description={(item.consumptionType.description + ": " + item.value + " " + item.consumptionType.amountType)} date={new Date(item.date).toLocaleDateString()} />
                        </Grid>
                        )}
                    </List>
                </Block>
            </GridRow>
            <Divider />
            <GridRow direction="row">
                <Block className="edit-electricity-consumption">
                    <Heading variant={3} color={"secondary"}>Poista sähkömittarilukemia</Heading>
                    <Block>
                        <InputGroup required underline value={removeMeasurementFrom.toISOString().slice(0, 10)} onChange={(e) => setRemoveMeasurementFrom(new Date(e.target.value))} color={"secondary"} placeholder={removeMeasurementFrom} basic id="MeasurementFrom" type="date" />
                        <InputGroup required underline value={removeMeasurementTo.toISOString().slice(0, 10)} onChange={(e) => setRemoveMeasurementTo(new Date(e.target.value))} color={"secondary"} placeholder={removeMeasurementTo} basic id="MeasurementTo" type="date" />
                    </Block>
                    <List>
                        {mData && mData.measurements && mData.measurements.map((item) => <Grid key={`grid-${item._id}`} sizeS={12} sizeM={4} sizeL={3}>
                            <ListItem
                                key={`item-${item._id}`} action={<ListItemAction
                                    icon={"icofont-energy-savings"} onClick={(e) => removeMeasurement(
                                        {
                                            variables: {
                                                id: item._id
                                            }
                                        }
                                    )}>Poista</ListItemAction>} description={("Sähkömittarilukema: " + item.value)} date={new Date(item.date).toLocaleDateString()} />
                        </Grid>
                        )}
                    </List>
                </Block>
            </GridRow>
            </Block>}
            </GridContainer>
        </ProfileCard>
    )
}
export default ProfileElectricity