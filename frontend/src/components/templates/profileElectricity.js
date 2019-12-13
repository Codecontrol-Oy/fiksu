import React, { useState, useEffect } from 'react'
import ProfileCard from '../molecules/profileCard'
import Heading from "../atoms/heading"
import GridRow from '../grid/row'
import Grid from '../grid/grid'
import Divider from "../atoms/divider"
import Block from "../atoms/block"
import InputGroup from "../molecules/inputGroup"
import { QUERY_CONSUMPTION_TYPES, GET_USER_ENERGY_SAVINGS, GET_USER_MEASUREMENTS } from '../../graphqlQueries'
import { useQuery, useMutation } from "@apollo/react-hooks"
import Option from '../atoms/option'
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

  const [selectedType, setSelectedType] = useState(undefined)
  const [measurement, setMeasurement] = useState(undefined)
  const [readingType, setReadingType] = useState(undefined)
  const [date, setDate] = useState(today.toJSON().slice(0, 10))
  const [measurementDate, setMeasurementDate] = useState(today.toJSON().slice(0, 10))
  const [reading, setReading] = useState("")
  const [removeSavingsFrom, setRemoveSavingsFrom] = useState(yesterday)
  const [removeSavingsTo, setRemoveSavingsTo] = useState(tomorrow)
  const [removeMeasurementFrom, setRemoveMeasurementFrom] = useState(yesterday)
  const [removeMeasurementTo, setRemoveMeasurementTo] = useState(tomorrow)
  const { loading, error, data } = useQuery(QUERY_CONSUMPTION_TYPES)
  const { loading: sLoading, error: sError, data: sData } = useQuery(GET_USER_ENERGY_SAVINGS, {
    variables: {
      id: localStorage.getItem('userId'), from: removeSavingsFrom, to: removeSavingsTo
    }
  })
  const { loading: mLoading, error: mError, data: mData } = useQuery(GET_USER_MEASUREMENTS, {
    variables: {
      id: localStorage.getItem('userId'), from: removeMeasurementFrom, to: removeMeasurementTo
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
      refetchQueries: ['GetEnergySavings']
    }
  )

  const [removeConsumption, { loading: rLoading, error: rError, data: rData }] = useMutation(MUTATION_REMOVE_CONSUMPTION, {
    refetchQueries: ['GetEnergySavings']
  })

  const [saveMeasurement, { loading: measurementLoading, error: measurementError, data: measurementData }] = useMutation(MUTATION_ADD_NEW_MEASUREMENT,
    {
      onCompleted(data) {
        setMeasurementDate(today)
        setMeasurement(undefined)
      },
      refetchQueries: ['Measurements']
    }
  )

  const [removeMeasurement, { loading: rmLoading, error: rmError, data: rmData }] = useMutation(MUTATION_REMOVE_MEASUREMENT, {
    refetchQueries: ['Measurements']
  })

  return (
    <ProfileCard>
      <Heading variant={3} color={"secondary"}>Sähkön säästötoimet</Heading>
      <GridRow direction="row">
        <Grid sizeS={12} sizeM={4} sizeL={4}>
          <Block className="new-electricity-consumption">
            <Heading variant={3} color={"secondary"}>Olen säästänyt kulutuksessa</Heading>
            <Form
              onSubmit={e => saveConsumption(
                {
                  variables: {
                    savedConsumption: {
                      "userId": localStorage.getItem("userId"),
                      "consumptionTypeId": selectedType,
                      "value": parseFloat(reading),
                      "date": date,
                    }
                  }
                }
              )
              }>
              <InputGroup required underline value={date} onChange={(e) => setDate(e.target.value)} color={"secondary"} basic id="date" type="date" />
              <SelectGroup underline color={"secondary"} value={selectedType} onChange={(e, dataset) => { setSelectedType(e.currentTarget.value); setReadingType(dataset.type) }}>
                {data && data.getConsumptionTypes && data.getConsumptionTypes.length > 0 &&
                data.getConsumptionTypes.map((item => <Option key={item._id} type={item.amountType} value={item._id} text={item.description} />))
                }
              </SelectGroup>
              <InputGroup required underline value={reading} onChange={(e) => setReading(e.target.value)} color={"secondary"} placeholder={readingType} basic id="reading" type="number" />
              <InputGroup underline color={"secondary"} placeholder="Muistiinpanot" basic id="notes" type="text" />
              <Button
                type="submit"
                basic > Tallenna</Button>
            </Form>
          </Block>
        </Grid>
        <Grid sizeS={12} sizeM={4} sizeL={4}>
          <Block className="new-electricity-consumption">
            <Heading variant={3} color={"secondary"}>Sähkömittarilukema</Heading>
            <Form
              onSubmit={e => saveMeasurement(
                {
                  variables: {
                    measurement: {
                      "userId": localStorage.getItem("userId"),
                      "value": parseFloat(measurement),
                      "date": measurementDate,
                    }
                  }
                }
              )
              }>
              <InputGroup required underline value={measurementDate} onChange={(e) => setMeasurementDate(e.target.value)} color={"secondary"} basic id="measurementDate" type="date" />
              <InputGroup required underline value={measurement} onChange={(e) => setMeasurement(e.target.value)} color={"secondary"} placeholder="Sähkömittarilukema" basic id="measurement" type="number" />
              <Button
                type="submit"
                basic > Tallenna</Button>
            </Form>
          </Block>
        </Grid>
        <Grid sizeS={12} sizeM={4} sizeL={4}>
          <Block>
            <LineChart data={[{ data: [{x: new Date("2019-01-01"), y:12234},{x: new Date("2019-03-03"), y:12252},{x: new Date("2019-07-07"), y:12266},{x: new Date("2019-12-12"), y:12298}]},{ data: [{x: new Date("2019-01-01"), y:12234},{x: new Date("2019-12-12"), y:12302}]}]} title="Sähkönkäyttö"/>
          </Block>
        </Grid>
      </GridRow>
      <Divider />
      <GridRow direction="row">
        <Block className="edit-electricity-consumption">
          <Heading variant={3} color={"secondary"}>Poista energiansäästötapahtumia</Heading>
          <Block>
            <InputGroup required underline value={removeSavingsFrom.toISOString().slice(0,10)} onChange={(e) => setRemoveSavingsFrom(new Date(e.target.value))} color={"secondary"} placeholder={removeSavingsFrom} basic id="from" type="date" />
            <InputGroup required underline value={removeSavingsTo.toISOString().slice(0,10)} onChange={(e) => setRemoveSavingsTo(new Date(e.target.value))} color={"secondary"} placeholder={removeSavingsTo} basic id="to" type="date" />
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
            <InputGroup required underline value={removeMeasurementFrom.toISOString().slice(0,10)} onChange={(e) => setRemoveMeasurementFrom(new Date(e.target.value))} color={"secondary"} placeholder={removeMeasurementFrom} basic id="MeasurementFrom" type="date" />
            <InputGroup required underline value={removeMeasurementTo.toISOString().slice(0,10)} onChange={(e) => setRemoveMeasurementTo(new Date(e.target.value))} color={"secondary"} placeholder={removeMeasurementTo} basic id="MeasurementTo" type="date" />
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
    </ProfileCard>
  )
}
export default ProfileElectricity