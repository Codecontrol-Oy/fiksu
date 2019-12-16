import React, {useState} from 'react'
import Block from '../atoms/block'
import { GET_USER_ECOACTIONS } from '../../graphqlQueries'
import { useQuery, useMutation } from "@apollo/react-hooks"
import { MUTATION_REMOVE_ECO_ACTION } from '../../graphqlMutations'
import Heading from '../atoms/heading'
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import Grid from "../grid/grid"
import Paragraph from "../atoms/paragraph"
import InputGroup from "../molecules/inputGroup"
import Card from "../atoms/card"
import List from '../atoms/list'
import ListItem from '../molecules/listItem'
import ListItemAction from '../atoms/listItemAction'
const UserEcoActions = props => {
    var today = new Date()
    var tomorrow = new Date()
    var yesterday = new Date()
    var lastMonth = new Date()
    tomorrow.setDate(today.getDate() + 1)
    yesterday.setDate(today.getDate() - 1)
    lastMonth.setDate(today.getDate() - 31)

    const [ ecoDateFrom, setEcoDateFrom] = useState(yesterday.toJSON().slice(0, 10))
    const [ ecoDateTo, setEcoDateTo] = useState(tomorrow.toJSON().slice(0, 10))
    const { loading: ecoActionsLoading, error: ecoActionsError, data: ecoActionsData} = useQuery(GET_USER_ECOACTIONS, {
        variables: {
            id: localStorage.getItem('userId'), from: ecoDateFrom, to: ecoDateTo
        }
    })
    const [ removeEcoAction, {loading: removeEcoActionLoading, error: removeEcoActionError, data: removeEcoActionData}] = useMutation(MUTATION_REMOVE_ECO_ACTION, {
      refetchQueries: ['EcoActions','UserEcoActions','GetUserEcoActionsGraph','GetUserAchievements'],
    })
    return <Block className="eco-info">
    <GridContainer size={12} direction="column">
      <GridRow size={12} direction="row">
        <Grid sizeS={12} sizeM={12} sizeL={12}>
          <Card>
            <Heading variant={2} color={"secondary"}>Poista ekotekoja</Heading>
            <Paragraph color={"secondary"}>Aseta haettavien ekotekojen alue valitsemalla päivämäärät</Paragraph>
            <Block style={{textAlign: 'center'}}> 
            <InputGroup required underline value={ecoDateFrom} onChange={(e) => setEcoDateFrom(e.target.value)} color={"secondary"} basic id="dateFrom" type="date" />
            <InputGroup required underline value={ecoDateTo} onChange={(e) => setEcoDateTo(e.target.value)} color={"secondary"} basic id="dateTo" type="date" />
            </Block>
            <List>
                {ecoActionsData && ecoActionsData.getSavedEcoActions && ecoActionsData.getSavedEcoActions.map((item) => <Grid key={`grid-${item._id}`} sizeS={12} sizeM={4} sizeL={3}>
                <ListItem
                    key={`item-${item._id}`} action={<ListItemAction
                    icon={"icofont-leaf"} onClick={(e) => removeEcoAction(
                    {
                      variables: {
                        id: item._id
                      }
                    }
                )}>Poista</ListItemAction>} title={item.ecoActionType.title} description={(item.ecoActionType.description)} date={new Date(item.date).toLocaleDateString()} />
                </Grid>
                )}
            </List>
          </Card>  
        </Grid>
        </GridRow>
    </GridContainer>
</Block>
}


export default UserEcoActions