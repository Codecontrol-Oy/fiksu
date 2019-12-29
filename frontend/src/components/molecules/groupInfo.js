import React, { useState, useEffect } from 'react'
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
import GroupPoints from './groupPoints'
import GroupStackedPoints from './groupStackedPoints'
import Option from '../atoms/option'
import SelectGroup from "../molecules/selectGroup"
import Paragraph from "../atoms/paragraph"
import Modal from "../atoms/modal"
import withSnackbar from "./withSnackbar"

const GroupInfo = props => {

  const myData = [{ angle: 1, label: "1", subLabel: "ekopisteet" }, { angle: 5, label: "5", subLabel: "Sähkönkäyttöpisteet" }]
  const [displayModal, setDisplayModal] = useState(false)


  useEffect(() => {
    setDisplayModal(props.displayModal)
  }, [props.displayModal])

  const { loading: groupsLoading, error: groupsError, data: groupsData } = useQuery(GET_USER_GROUPS, {
    variables: {
      id: localStorage.getItem('userId')
    },
    onCompleted(groupsData) {
      if (groupsData && groupsData.getUserGroups.length > 0) {
        props.setHeaderName(groupsData.getUserGroups[0].name)
      }
    }
  })
  const [removeGroup, { loading: removeGroupLoading, error: removeGroupError, data: removeGroupData }] = useMutation(MUTATION_REMOVE_GROUP, {
    refetchQueries: ['GetUserGroups']
  })

  const [removeGroupMember, { loading: removeGroupMemberLoading, error: removeGroupMemberError, data: removeGroupMemberData }] = useMutation(MUTATION_REMOVE_GROUP_MEMBER,
    {
      onCompleted(data) {
        props.addSnack("Jäsen poistettu onnistuneesti!", "success")
      },
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
      onCompleted(data) {
        props.addSnack("Ryhmän näkyvyys muutettu onnistuneesti!", "success")
      },
      refetchQueries: ['GetUserGroups']
    }
  )

  return (
    <Block className="group-info">
      <GridContainer size={12} direction={"column"}>
        {groupsData && groupsData.getUserGroups.length > 0 && groupsData.getUserGroups.map(group => {

          if (group.isOwner) {
            props.setOwner(true)
          }
          return (
            <GridRow size={12}>
              <Block className="family-header">
                <GridContainer height={12} align="center" justify="start">
                  <Grid style={{ display: "flex", justifyContent: "flex-start" }} sizeL={9} sizeM={10} sizeS={8} sizeXL={1}>
                    <Heading color={"default"} style={{ margin: '0rem' }} variant={4}>
                      RYHMÄ {group.name.toUpperCase()}
                    </Heading>
                  </Grid>
                  <Grid style={{ display: 'flex', justifyContent: 'flex-end' }} sizeL={3} sizeM={2} sizeS={4} sizeXL={1}>
                    {group.isOwner &&
                      <Button onClick={() => setDisplayModal(true)} outlined color={'alert'}>Poista ryhmä</Button>
                    }
                  </Grid>
                </GridContainer>
                <Divider color={"secondary"} />
              </Block>
              <Grid sizeS={12} sizeM={12} sizeL={4}>
                {group.isOwner &&
                  <Modal display={displayModal} id={"profile-card"}>
                    <GridContainer align={"center"} justify={"center"} direction={"column"}>
                      <GridRow>
                        <Heading color={"default"} variant={5}>Oletko varma että haluat poistaa ryhmän {group.name.toUpperCase()}?</Heading>
                      </GridRow>
                      <GridRow style={{ marginBottom: "1rem" }} justify={"around"}>
                        <Button onClick={() => removeGroup({
                          variables: {
                            id: group._id
                          }
                        })} style={{ width: "5rem" }} basic>Kyllä</Button>
                        <Button onClick={() => setDisplayModal(false)} style={{ width: "5rem" }} alert>Ei</Button>
                      </GridRow>
                    </GridContainer>
                  </Modal>
                }

                <Card>
                  <Heading align={"left"} color={"secondary"} variant={2}>{group.name}</Heading>
                  <Heading align={"left"} color={"secondary"} variant={3}>Perustaja</Heading>
                  <FamilyMember key={`group-${group._id}-${group.ownerId}`} isOwner={group.isOwner} isAdmin={group.isAdmin} role={"perustaja"} id={group.ownerId} name={`${group.owner.firstName} ${group.owner.lastName}`} />
                  <Heading style={{ marginBottom: 0 }} align={"left"} color={"secondary"} variant={4}>Pääkäyttäjät</Heading>
                  <Divider color={"secondary"} />
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
                  <Heading style={{ marginBottom: 0 }} align={"left"} color={"secondary"} variant={4}>Jäsenet</Heading>
                  <Divider color={"secondary"} />
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
                    <Paragraph align={"left"} color={"secondary"}>Alla voit säätää ryhmän näkyvyysasetuksia. <br />Mikäli asetat näkyvyyden piilotetuksi, ryhmää ei löydy vertailusivuilla. </Paragraph>
                    <Block style={{ textAlign: 'center', display: "flex", justifyContent: "flex-start" }}>
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
                        <Option key={'visibility-NONE'} selected={group.permissions.visibility == 'NONE' ? 'selected' : undefined} value={'NONE'} text={'Piilotettu'} />
                        <Option key={'visibility-Public'} selected={group.permissions.visibility == 'PUBLIC' ? 'selected' : undefined} value={'PUBLIC'} text={'Julkinen'} />
                      </SelectGroup>
                    </Block>
                  </Block>}
                </Card>
              </Grid>
              <Grid sizeS={12} sizeM={12} sizeL={8}>
                <Block style={{ textAlign: 'center' }}>
                  <Heading variant={2} color={"secondary"}>Ryhmän kuukausitulos</Heading>
                  <GridRow size={12}>
                    <Grid sizeS={12} sizeM={6} sizeL={6}>
                      <GroupPoints group={group._id} title={'Pisteet henkilöittäin'} />
                    </Grid>
                    <Grid sizeS={12} sizeM={6} sizeL={6}>
                      <GroupStackedPoints group={group._id} title={'jaottelu henkilöittäin'} />
                    </Grid>
                  </GridRow>
                </Block>
              </Grid>
              <Divider />
            </GridRow>)
        }
          )
        }
      }
          
          
      </GridContainer>
    </Block>
  )
}

export default withSnackbar(GroupInfo)