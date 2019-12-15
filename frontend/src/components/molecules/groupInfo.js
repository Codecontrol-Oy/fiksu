import React, {useState} from 'react'
import Block from '../atoms/block'
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import Grid from "../grid/grid"
import Divider from "../atoms/divider"
import { GET_USER_GROUPS } from '../../graphqlQueries'
import { MUTATION_REMOVE_GROUP, MUTATION_PROMOTE_GROUP_MEMBER, MUTATION_DEMOTE_GROUP_MEMBER, MUTATION_REMOVE_GROUP_MEMBER, MUTATION_UPDATE_GROUP } from '../../graphqlMutations'
import { useQuery, useMutation } from "@apollo/react-hooks"
import Card from "../atoms/card"
import InputHeading from '../molecules/inputHeading'
import Button from '../atoms/button'
import Heading from '../atoms/heading'
import FamilyMember from './familyMember'
import DonutChart from '../molecules/donutChart'
import Option from '../atoms/option'
import SelectGroup from "../molecules/selectGroup"
import Paragraph from "../atoms/paragraph"

const GroupInfo = props => {

  const myData = [{angle: 1, label: "1", subLabel:"ekopisteet"}, {angle: 5, label: "5", subLabel: "Sähkönkäyttöpisteet"}]
  const { loading: groupsLoading, error: groupsError, data: groupsData } = useQuery(GET_USER_GROUPS, {
    variables: {
      id: localStorage.getItem('userId')
    }
  })
  const [removeGroup, { loading: removeGroupLoading, error: removeGroupError, data: removeGroupData }] = useMutation(MUTATION_REMOVE_GROUP, {
    refetchQueries: ['GetUserGroups']
  })

  const [removeGroupMember, { loading: removeGroupMemberLoading, error: removeGroupMemberError, data: removeGroupMemberData }] = useMutation(MUTATION_REMOVE_GROUP_MEMBER,
    {
      refetchQueries: ['GetUserGroups']
    }
  )

  const [demoteGroupMember, { loading: demoteGroupMemberLoading, error: demoteGroupMemberError, data: demoteGroupMemberData }] = useMutation(MUTATION_DEMOTE_GROUP_MEMBER,
    {
      refetchQueries: ['GetUserGroups']
    }
  )

  const [promoteGroupMember, { loading: promoteGroupMemberLoading, error: promoteGroupMemberError, data: promoteGroupMemberData }] = useMutation(MUTATION_PROMOTE_GROUP_MEMBER,
    {
      refetchQueries: ['GetUserGroups']
    }
  )

  const [changeGroupVisibility, { loading: visibilityGroupLoading, error: visibilityGroupError, data: visibilityGroupData }] = useMutation(MUTATION_UPDATE_GROUP,
    {
      refetchQueries: ['GetUserGroups']
    }
  )

  return (
        <Block className="group-info">
          <GridContainer size={12} direction={"column"}>
          {groupsData && groupsData.getUserGroups.length > 0 && groupsData.getUserGroups.map(group => <GridRow size={12}>
            <Grid sizeS={12} sizeM={6} sizeL={6}>
            <Card>
            <InputHeading color={"secondary"} variant={2} name={`RYHMÄ ${group.name.toUpperCase()}`}>
                    {group.ownerId == localStorage.getItem('userId') && <Button
                      onClick={() => removeGroup({
                        variables: {
                          id: group._id
                        }
                      })} style={{marginLeft: '5px', verticalAlign: 'bottom'}} type="button" alert>
                      <i className={'icofont-ui-delete'} style={{marginRight: '5px'}}></i> Poista</Button>}
                  </InputHeading>
                  <Heading color={"secondary"} variant={3}>Perustaja</Heading>
                  <FamilyMember key={`group-${group._id}-${group.ownerId}`} isOwner={group.isOwner} isAdmin={group.isAdmin} role={"perustaja"} id={group.ownerId} name={`${group.owner.firstName} ${group.owner.lastName}`} />
                  <Heading color={"secondary"} variant={3}>Pääkäyttäjät</Heading>
                  {group.admins && group.admins.length > 0 && group.admins.map(admin => <FamilyMember 
                    key={`group-${group._id}-${group._id}`} 
                    isOwner={group.isOwner}
                    ownerId={group.ownerId}
                    isAdmin={group.isAdmin} 
                    role={"ylläpitäjä"}
                    adminUser={true}
                    delete={() => removeGroupMember({
                      variables: {
                        userId: admin._id,
                        groupId: group._id
                      }
                    })}
                    demote={() => demoteGroupMember({
                      variables: {
                        userId: admin._id,
                        groupId: group._id
                      }
                    })}
                    id={admin._id}
                    name={`${admin.firstName} ${admin.lastName}`} />)}
                  <Heading color={"secondary"} variant={3}>Jäsenet</Heading>
                  {group.members && group.members.length > 0 && group.members.map(member => <FamilyMember 
                    key={`group-${group._id}-${member._id}`} 
                    isOwner={group.isOwner} 
                    isAdmin={group.isAdmin}
                    ownerId={group.ownerId}
                    memberUser={true}
                    role={"jäsen"}
                    delete={() => removeGroupMember({
                      variables: {
                        userId: member._id,
                        groupId: group._id
                      }
                    })}
                    promote={() => promoteGroupMember({
                      variables: {
                        userId: member._id,
                        groupId: group._id
                      }
                    })}
                    id={member._id}
                    name={`${member.firstName} ${member.lastName}`} />)}
                    {(group.isOwner || group.isAdmin) && <Block>
                    <Paragraph color={"secondary"}>Alla voit säätää ryhmän näkyvyysasetuksia. <br />Mikäli asetat näkyvyyden piilotetuksi, ryhmää ei löydy vertailusivuilla. </Paragraph>
                    <Block style={{textAlign: 'center'}}>
                    <SelectGroup underline color={"secondary"} value={group.permissions.visibility} onChange={(e, dataset) => changeGroupVisibility({
                        variables: {
                          group: {
                            _id: group._id,
                            name: group.name,
                            decription: group.decription,
                            permissions: {
                              visibility: e.currentTarget.value
                            }
                          }
                        }
                       }) 
                      }>
                      <Option key={'visibility-NONE'} selected={group.permissions.visibility == 'NONE' ? 'selected': undefined} value={'NONE'} text={'Piilotettu'} />
                      <Option key={'visibility-Public'} selected={group.permissions.visibility == 'PUBLIC' ? 'selected': undefined} value={'PUBLIC'} text={'Julkinen'} />
                    </SelectGroup>
                    </Block>
                  </Block> }
                    </Card>
                </Grid>
                <Grid sizeS={12} sizeM={6} sizeL={6}>
                <Block style={{textAlign: 'center'}}>
                  <Heading variant={2} color={"secondary"}>Ryhmän kuukausitulos</Heading>
                  <DonutChart data={myData} title={"Ryhmäpisteet"} />
                  </Block> 
                </Grid>
              <Divider />
            </GridRow>)}
          </GridContainer>
        </Block>
    )
}

export default GroupInfo