import React, {useState} from 'react'
import Block from '../atoms/block'
import Heading from '../atoms/heading'
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import Grid from "../grid/grid"
import Paragraph from "../atoms/paragraph"
import Form from "../atoms/form"
import InputHeading from './inputHeading'
import Button from '../atoms/button'
import InputGroup from "./inputGroup"
import Card from "../atoms/card"
import Divider from "../atoms/divider"
import Option from '../atoms/option'
import SelectGroup from "./selectGroup"
import InputLabel from '../atoms/inputLabel'
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks"
import { SEARCH_GROUP, GET_USER_APPLIED_GROUPS } from '../../graphqlQueries'
import { MUTATION_APPLY_TO_GROUP, MUTATION_REMOVE_GROUP_MEMBER } from '../../graphqlMutations'

const GroupMemberSearch = props => {

  const [ search, setSearch ] = useState(undefined)
  const [searchGroup, { loading: searchGroupLoading, error: searchGroupError, data: searchGroupData }] = useLazyQuery(SEARCH_GROUP, {
    fetchPolicy: 'network-only',
    onError: data => {
      console.log(data)
    }
  })
  const { loading: appliedGroupsLoading, error: appliedGroupsError, data: appliedGroupsData } = useQuery(GET_USER_APPLIED_GROUPS)
  const [applyToGroup, { loading: applyGroupMemberLoading, error: applyGroupMemberError, data: addGroupMemberData }] = useMutation(MUTATION_APPLY_TO_GROUP, {
    refetchQueries: ['GetUserAppliedGroups','SearchGroup'],
    onError: data => {
      console.log(data)
    }
  })
  const [removeGroupMember, { loading: removeGroupMemberLoading, error: removeGroupMemberError, data: removeGroupMemberData }] = useMutation(MUTATION_REMOVE_GROUP_MEMBER,
    {
      refetchQueries: ['GetUserAppliedGroups','GetUserGroups']
    }
  )
  return ( <Block className="group-info">
        <GridContainer size={12} direction={"column"}>
            <GridRow size={12}>
            <Grid sizeS={12} sizeM={6} sizeL={6}>
            <Card>
              <Heading color={"secondary"} variant={2}>Hakeminen ryhmään</Heading>
              <Paragraph color={"secondary"}>Alla olevalla lomakkeella voit hakea ryhmiä ja liittyä niihin.</Paragraph>
              <Block style={{textAlign: 'center'}}>
                <Form
                  onSubmit={e => {
                    searchGroup({
                      variables: {
                        search: search
                      }
                    })
                  }}>
                  <InputGroup required underline color={"secondary"} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ryhmän nimi" basic id="searchGroup" type="text" />
                  <Button type="submit" basic > Hae ryhmää</Button> 
                </Form>
                {searchGroupData && searchGroupData.searchGroup && searchGroupData.searchGroup.groups.length >0 && <Block>
                    <Heading color={"secondary"} variant={4}>Hakutulokset</Heading>
                    {searchGroupData.searchGroup.groups.map((group) => <InputLabel color={"secondary"} variant={4} name={group.name} >
                    <Button onClick={() => applyToGroup({
                      variables: {
                        groupId: group._id,
                        userId: localStorage.getItem('userId')
                      }
                    })} style={{marginLeft: '5px'}} type="button" basic>
                      <i class={'icofont-ui-add'} style={{marginRight: '5px'}}></i> Hae ryhmään
                    </Button>
                    </InputLabel>
                    )}
                </Block>}
                {searchGroupData && (!searchGroupData.searchGroup || !searchGroupData.searchGroup.groups.length) && <Block>
                    <Heading color={"secondary"} variant={4}>Ei hakutuloksia</Heading>
                    )}
                </Block>}
                </Block>
            </Card>
            </Grid>
            <Grid sizeS={12} sizeM={6} sizeL={6}>
            <Card>
              <Heading color={"secondary"} variant={2}>Vahvistamista odottavat pyynnöt ryhmiin</Heading>
              <Paragraph color={"secondary"}>Alla olevasta listasta näet pyyntösi ryhmiin, jotka eivät vielä ole vahvistaneet liittymistäsi.</Paragraph>
              {appliedGroupsData && appliedGroupsData.getUserAppliedGroups && !appliedGroupsData.getUserAppliedGroups.length &&
                <Block>
                    <Heading color={"secondary"} variant={4}>Ei odottavia pyyntöjä ryhmiin</Heading>
               </Block>}
               {appliedGroupsData && 
              appliedGroupsData.getUserAppliedGroups && 
              appliedGroupsData.getUserAppliedGroups.length > 0 && 
              appliedGroupsData.getUserAppliedGroups.map(group => <Block>
              <InputHeading variant={3} color={"secondary"} name={group.name}>
                <Button onClick={() => removeGroupMember({
                  variables: {
                    groupId: group._id,
                    userId: localStorage.getItem('userId')
                  }
                })} style={{marginLeft: '5px'}} type="button" alert>
                    <i class={'icofont-ui-delete'} style={{marginRight: '5px'}}></i> Poista
                </Button>
              </InputHeading>
              </Block>)} 
            </Card>
            </Grid>
            <Divider />
            </GridRow>
        </GridContainer>
    </Block>)
}

export default GroupMemberSearch