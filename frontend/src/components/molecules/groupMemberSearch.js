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
import { SEARCH_USER, GET_USER_GROUPS } from '../../graphqlQueries'
import { MUTATION_INVITE_TO_GROUP, MUTATION_REMOVE_GROUP_MEMBER, MUTATION_APPROVE_TO_GROUP } from '../../graphqlMutations'

const GroupMemberSearch = props => {

  const [ search, setSearch ] = useState(undefined)
  const [ selectedGroup, setSelectedGroup ] = useState('default')
  const { loading: groupsLoading, error: groupsError, data: groupsData } = useQuery(GET_USER_GROUPS, {
    variables: {
      id: localStorage.getItem('userId')
    }
  })
  const [searchUser, { loading: searchLoading, error: searchError, data: searchData }] = useLazyQuery(SEARCH_USER, {
    fetchPolicy: 'network-only'
  })
  const [addGroupMember, { loading: addGroupMemberLoading, error: addGroupMemberError, data: addGroupMemberData }] = useMutation(MUTATION_INVITE_TO_GROUP, {
    refetchQueries: ['GetUserGroups','SearchUser']
  })
  const [removeGroupMember, { loading: removeGroupMemberLoading, error: removeGroupMemberError, data: removeGroupMemberData }] = useMutation(MUTATION_REMOVE_GROUP_MEMBER,
    {
      refetchQueries: ['GetUserGroups']
    }
  )
  const [approveGroupMember, { loading: approveGroupMemberLoading, error: approveGroupMemberError, data: approveGroupMemberData }] = useMutation(MUTATION_APPROVE_TO_GROUP,
    {
      refetchQueries: ['GetUserGroups']
    }
  )
  return ( <Block className="group-info">
        {groupsData && groupsData.getUserGroups.length > 0&& (groupsData.getUserGroups.some(x => x.isOwner) || groupsData.getUserGroups.some(x => x.isAdmin)) && 
        <GridContainer size={12} direction={"column"}>
            <GridRow size={12}>
            <Grid sizeS={12} sizeM={4} sizeL={4}>
            <Card>
              <Heading color={"secondary"} variant={4}>Kutsuminen ryhmään</Heading>
              <Paragraph color={"secondary"}>Alla olevalla lomakkeella voit hakea ryhmääsi jäseniä ja kutsua heidät liittymään ryhmääsi.<br/>Voit hakea käyttäjiä käyttäjätunnuksella, tai etunimellä ja sukunimiellä.</Paragraph>
              <Block style={{textAlign: 'center'}}>
                <Form
                  onSubmit={e => {
                    searchUser({
                      variables: {
                        search: search,
                        groupId: selectedGroup
                      }
                    })
                  }}>
               <SelectGroup underline color={"secondary"} value={selectedGroup} onChange={(e, dataset) => { setSelectedGroup(e.currentTarget.value) }}>
               <Option key={'defaultGroup'} value={'default'} text={'Valitse ryhmä'} />
                {groupsData.getUserGroups &&
                 groupsData.getUserGroups.map((item => (item.isOwner || item.isAdmin) && <Option key={item._id} value={item._id} text={item.name} />))
                }
              </SelectGroup>
              <InputGroup required underline color={"secondary"} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Etunimi Sukunimi" basic id="searchGroupMember" type="text" />
                  
              {selectedGroup != 'default' && <Button
                    type="submit"
                    basic > Hae käyttäjää</Button> }
                </Form>
                {searchData && searchData.searchUser && searchData.searchUser.length && <Block>
                    <Divider />
                    <Heading color={"secondary"} variant={3}>Hakutulokset</Heading>
                    {searchData.searchUser.map((user) => <InputLabel color={"secondary"} variant={4} name={`${(user.firstName && user.lastName ? user.firstName + " " + user.lastName : '[ Piilotettu ]')} 
                  ${user.loginInfo.nickname}`}>
                    <Button onClick={() => addGroupMember({
                      variables: {
                        groupId: selectedGroup,
                        userId: user._id
                      }
                    })} style={{marginLeft: '5px'}} type="button" basic>
                      <i class={'icofont-ui-add'} style={{marginRight: '5px'}}></i> Kutsu
                    </Button>
                    </InputLabel>
                    )}
                </Block>}
                {searchData && (!searchData.searchUser || !searchData.searchUser.length) && <Block>
                    <Divider />
                    <Heading color={"secondary"} variant={4}>Ei hakutuloksia</Heading>
                    )}
                </Block>}
                </Block>
            </Card>
            </Grid>
            <Grid sizeS={12} sizeM={4} sizeL={4}>
            <Card>
              <Heading color={"secondary"} variant={3}>Kutsutut ryhmäjäsenet</Heading>
              <Paragraph color={"secondary"}>Alla olevasta listasta näet henkilöt, jotka eivät vielä ole vahvistaneet kutsua Ryhmään.</Paragraph>
              {groupsData && groupsData.getUserGroups.length && groupsData.getUserGroups.map((group) => (group.isAdmin || group.isOwner) && <Block>
                {group && (!group.invites || !group.invites.length) && <Block>
                    <Heading color={"secondary"} variant={3}>{group.name}</Heading>
                    <Heading color={"secondary"} variant={4}>Ei vahvistamattomia henkilöitä</Heading>
                    )}
              </Block>}
              {group && (group.invites && group.invites.length > 0) && <Heading color={"secondary"} variant={4}>{group.name}</Heading>}
                {group.invites && group.invites.map((invited) => <InputLabel color={"secondary"} variant={4} name={`Nimi: ${(invited.firstName && invited.lastName ? invited.firstName + " " + invited.lastName : '[Piilotettu]')} Tunnus: ${invited.loginInfo.nickname}`}>
                    <Button onClick={() => removeGroupMember({
                      variables: {
                        groupId: group._id,
                        userId: invited._id
                      }
                    })} style={{marginLeft: '5px'}} type="button" alert>
                      <i class={'icofont-ui-delete'} style={{marginRight: '5px'}}></i> Poista
                    </Button>
                    </InputLabel>
                )}
              </Block>)}
            </Card>
            </Grid>
            <Grid sizeS={12} sizeM={4} sizeL={4}>
            <Card>
              <Heading color={"secondary"} variant={3}>Ryhmään pyytäneet ryhmäjäsenet</Heading>
              <Paragraph color={"secondary"}>Alla olevasta listasta näet henkilöt, jotka eivät vielä ole pyytäneet pääsyä Ryhmään.</Paragraph>
              {groupsData && groupsData.getUserGroups.length && groupsData.getUserGroups.map((group) => (group.isAdmin || group.isOwner) && <Block>
                {group && (!group.pending || !group.pending.length) && <Block>
                  <Heading color={"secondary"} variant={3}>{group.name}</Heading>
                    <Heading color={"secondary"} variant={4}>Ei vahvistamattomia henkilöitä</Heading>
                    )}
              </Block>}
              {group && (group.pending && group.pending.length > 0) && <Heading color={"secondary"} variant={4}>{group.name}</Heading>}
                {group.pending && group.pending.map((invited) => <InputLabel color={"secondary"} variant={4} name={`Nimi: ${(invited.firstName && invited.lastName ? invited.firstName + " " + invited.lastName : '[Piilotettu]')} Tunnus: ${invited.loginInfo.nickname}`}>
                    <Button onClick={() => approveGroupMember({
                      variables: {
                        groupId: group._id,
                        userId: invited._id
                      }
                    })} style={{marginLeft: '5px'}} type="button" basic>
                      <i class={'icofont-ui-delete'} style={{marginRight: '5px'}}></i> Hyväksy
                    </Button>
                    <Button onClick={() => removeGroupMember({
                      variables: {
                        groupId: group._id,
                        userId: invited._id
                      }
                    })} style={{marginLeft: '5px'}} type="button" alert>
                      <i class={'icofont-ui-delete'} style={{marginRight: '5px'}}></i> Hylkää
                    </Button>
                    </InputLabel>
                )}
              </Block>)}
            </Card>
            </Grid>
            </GridRow>
        </GridContainer>}
    </Block>)
}

export default GroupMemberSearch