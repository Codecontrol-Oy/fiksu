import React, { useState } from 'react'
import Block from '../atoms/block'
import { GET_ECOACTION_TYPES, GET_USER_ECOACTION_GRAPH } from '../../graphqlQueries'
import { useQuery, useMutation } from "@apollo/react-hooks"
import { MUTATION_CREATE_ECOACTION } from '../../graphqlMutations'
import Heading from '../atoms/heading'
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import Grid from "../grid/grid"
import Paragraph from "../atoms/paragraph"
import Button from '../atoms/button'
import InputGroup from "../molecules/inputGroup"
import Card from "../atoms/card"
import Option from '../atoms/option'
import SelectGroup from "../molecules/selectGroup"
import BarChart from '../molecules/barChart'
import Divider from '../atoms/divider'
import withSnackbar from "./withSnackbar"

const EcoInfo = props => {
  var today = new Date()
  var tomorrow = new Date()
  var yesterday = new Date()
  var lastMonth = new Date()
  today.setHours(today.getHours() + 6)
  tomorrow.setDate(today.getDate() + 1)
  yesterday.setDate(today.getDate() - 1)
  lastMonth.setDate(today.getDate() - 31)
  const [ecoDate, setEcoDate] = useState(new Date().toJSON().slice(0, 10))
  const [ecoDateGraphTo, setEcoDateGraphTo] = useState(tomorrow)
  const [ecoDateGraphFrom, setEcoDateGraphFrom] = useState(lastMonth)
  const [selectedEcoAction, setSelectedEcoAction] = useState('default')
  const [ecoActionTypeDescription, setEcoActionTypeDescription] = useState(undefined)
  const { loading: ecoGraphLoading, error: ecoGraphError, data: ecoGraphData } = useQuery(GET_USER_ECOACTION_GRAPH, {
    variables: {
      from: ecoDateGraphFrom,
      to: ecoDateGraphTo,
      fullRange: true
    }
  })
  const { loading: ecoActionTypeLoading, error: ecoActionTypeError, data: ecoActionTypeData } = useQuery(GET_ECOACTION_TYPES)
  const [createEcoAction, { loading: createEcoActionLoading, error: createEcoActionError, data: createEcoActionData }] = useMutation(MUTATION_CREATE_ECOACTION, {
    refetchQueries: ['EcoActions', 'UserEcoActions', 'GetUserEcoActionsGraph', 'GetUserAchievements'],
    onCompleted: data => {
      setEcoDate(new Date().toJSON().slice(0, 10))
      setSelectedEcoAction('default')
      setEcoActionTypeDescription(undefined)
      props.addSnack("Ekoteko tallennettu onnistuneesti!", "success")
    }
  })
  return <Block className="eco-info">
    <GridContainer size={12} direction="column">
      <GridRow size={12} direction="row">
        <Grid sizeS={12} sizeM={6} sizeL={6}>
          <Card>
            <Heading variant={2} color={"secondary"}>Syötä uusi ekoteko</Heading>
            <Paragraph color={"secondary"}>Valitse ekoteko listasta ja tallenna - Päivän hyvä työ tehty!</Paragraph>
            <Block style={{ textAlign: 'center' }}>
              <InputGroup max={today.toISOString().slice(0, 10)} required underline value={ecoDate} onChange={(e) => setEcoDate(e.target.value)} color={"secondary"} basic id="date" type="date" />
              <SelectGroup underline color={"secondary"} value={selectedEcoAction} onChange={(e, dataset) => { setEcoActionTypeDescription(dataset.type); setSelectedEcoAction(e.currentTarget.value); }}>
                <Option key={'defaultEcoAction'} value={'default'} text={'Valitse ekoteko'} />
                {ecoActionTypeData && ecoActionTypeData.getEcoActionTypes && ecoActionTypeData.getEcoActionTypes.map((item) => <Option key={item._id} type={item.description} value={item._id} text={item.title} />)}
              </SelectGroup>
              <Paragraph color={"secondary"}>{ecoActionTypeDescription}</Paragraph>
              {selectedEcoAction != 'default' && <Button onClick={() => createEcoAction({
                variables: {
                  savedEcoAction: {
                    ecoActionTypeId: selectedEcoAction,
                    value: 1,
                    date: ecoDate
                  }
                }
              })} style={{ marginLeft: '5px' }} type="button" basic>Tallenna</Button>}
            </Block>
          </Card>
        </Grid>
        <Grid sizeS={12} sizeM={6} sizeL={6}>
          <Card>
            <Block style={{ textAlign: 'center' }}>
              <Heading variant={2} color={"secondary"}>Kuukauden ekotekosi</Heading>
              {ecoGraphData && ecoGraphData.getUserEcoActionsGraph && <BarChart rangeA={ecoDateGraphFrom.getTime()} rangeB={ecoDateGraphTo.getTime()} data={ecoGraphData.getUserEcoActionsGraph} title="Kuukauden tiedot" />}
            </Block>
          </Card>
        </Grid>
        <Divider />
      </GridRow>
    </GridContainer>
  </Block>
}


export default withSnackbar(EcoInfo)