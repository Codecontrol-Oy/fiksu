import React, { useState, useEffect } from 'react'
import ProfileCard from '../molecules/profileCard'
import Heading from "../atoms/heading"
import GridRow from '../grid/row'
import Grid from '../grid/grid'
import Divider from "../atoms/divider"
import Block from "../atoms/block"
import InputGroup from "../molecules/inputGroup"
import { QUERY_CONSUMPTION_TYPES, GET_USER_CONSUMPTIONS, GET_USER_ENERGY_SAVINGS } from '../../graphqlQueries'
import { useQuery, useMutation } from "@apollo/react-hooks"
import Option from '../atoms/option'
import SelectGroup from "../molecules/selectGroup"
import Button from "../atoms/button"
import { MUTATION_ADD_NEW_CONSUMPTION, MUTATION_REMOVE_CONSUMPTION } from '../../graphqlMutations'
import List from '../atoms/list'
import ListItem from '../molecules/listItem'  
import ListItemAction from '../atoms/listItemAction'
import Form from '../atoms/form'
const ProfileElectricity = props => {

  var today = new Date();
  var tomorrow = new Date();
  var yesterday = new Date();
  tomorrow.setDate(today.getDate() + 1);
  yesterday.setDate(today.getDate() - 1);

  const [selectedType, setSelectedType] = useState(null)
  const [readingType, setReadingType] = useState(null)
  const [date, setDate] = useState(today.toJSON().slice(0, 10))
  const [reading, setReading] = useState("")
  const [removeSavingsFrom, setRemoveSavingsFrom] = useState(yesterday)
  const [removeSavingsTo, setRemoveSavingsTo] = useState(tomorrow)

  const { loading, error, data } = useQuery(QUERY_CONSUMPTION_TYPES)
  const { loading: sLoading, error: sError, data: sData } = useQuery(GET_USER_ENERGY_SAVINGS, {
    variables: {
      id: localStorage.getItem('userId'), from: removeSavingsFrom, to: removeSavingsTo
    }
  })

  const [saveConsumption, { loading: mutationLoading, error: mutationError, data: mData }] = useMutation(MUTATION_ADD_NEW_CONSUMPTION,
    {
      
      onCompleted(data) {
        setSelectedType(null)
        setReadingType("")
        setDate(today)
        setReading("")
      },
      refetchQueries: ['GetEnergySavings']
    }
  )
  const [removeConsumption, { loading: rLoading, error: rError, data: rData }] = useMutation(MUTATION_REMOVE_CONSUMPTION, {
    refetchQueries: ['GetEnergySavings']
  })

  return (
    <ProfileCard>
      <Heading variant={3} color={"secondary"}>Sähkönkäyttö ja ekoteot</Heading>
      <GridRow wrap>
        <Grid size={4} sizeS={12} sizeM={6}>
          <Block className="new-electricity-consumption">
            <Heading variant={3} color={"secondary"}>Olen säästänyt kulutuksessa</Heading>
            <Form
              onSubmit={e  => saveConsumption(
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
    </ProfileCard>
  )
}
export default ProfileElectricity