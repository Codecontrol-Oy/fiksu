import React, {useState} from 'react'
import Block from '../atoms/block'
import { GET_USER_FAMILIES } from '../../graphqlQueries'
import { useQuery, useMutation } from "@apollo/react-hooks"
import { MUTATION_CREATE_FAMILY, MUTATION_REMOVE_FAMILY, MUTATION_REMOVE_FAMILY_MEMBER, MUTATION_PROMOTE_FAMILY_MEMBER, MUTATION_DEMOTE_FAMILY_MEMBER,MUTATION_CHANGE_FAMILY_VISIBILTY } from '../../graphqlMutations'
import Heading from '../atoms/heading'
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import Grid from "../grid/grid"
import Paragraph from "../atoms/paragraph"
import Form from "../atoms/form"
import InputHeading from '../molecules/inputHeading'
import Button from '../atoms/button'
import InputGroup from "../molecules/inputGroup"
import Card from "../atoms/card"
import Divider from "../atoms/divider"
import DonutChart from '../molecules/donutChart'
import FamilyMember from './familyMember'
import Option from '../atoms/option'
import SelectGroup from "../molecules/selectGroup"

const FamilyInfo = props => {

const [familyName, setFamilyname] = useState(undefined)

  const { loading: familyLoading, error: familyError, data: familyData } = useQuery(GET_USER_FAMILIES, {
    variables: {
      id: localStorage.getItem('userId')
    }
  })

  const [createFamily, { loading: createFamilyLoading, error: createFamilyError, data: createFamilyData }] = useMutation(MUTATION_CREATE_FAMILY,
    {
      onCompleted(data) {
        setFamilyname(undefined)
      },
      refetchQueries: ['GetUserFamilies']
    }
  )

  const [removeFamily, { loading: removeFamilyLoading, error: removeFamilyError, data: removeFamilyData }] = useMutation(MUTATION_REMOVE_FAMILY,
    {
      refetchQueries: ['GetUserFamilies']
    }
  )
  const [changeFamilyVisibility, { loading: visibilityFamilyLoading, error: visibilityFamilyError, data: visibilityFamilyData }] = useMutation(MUTATION_CHANGE_FAMILY_VISIBILTY,
    {
      refetchQueries: ['GetUserFamilies']
    }
  )
  const [removeFamilyMember, { loading: removeFamilyMemberLoading, error: removeFamilyMemberError, data: removeFamilyMemberData }] = useMutation(MUTATION_REMOVE_FAMILY_MEMBER,
    {
      refetchQueries: ['GetUserFamilies']
    }
  )

  const [demoteFamilyMember, { loading: demoteFamilyMemberLoading, error: demoteFamilyMemberError, data: demoteFamilyMemberData }] = useMutation(MUTATION_DEMOTE_FAMILY_MEMBER,
    {
      refetchQueries: ['GetUserFamilies']
    }
  )

  const [promoteFamilyMember, { loading: promoteFamilyMemberLoading, error: promoteFamilyMemberError, data: promoteFamilyMemberData }] = useMutation(MUTATION_PROMOTE_FAMILY_MEMBER,
    {
      refetchQueries: ['GetUserFamilies']
    }
  )

  const myData = [{angle: 1, label: "1", subLabel:"ekopisteet"}, {angle: 5, label: "5", subLabel: "Sähkönkäyttöpisteet"}]

  return (
    <Block className="family-info">
      <GridContainer size={12} direction={"column"}>
        <GridRow size={12}>
          <Grid>
            {familyData && familyData.getUserFamilies.length > 0 && familyData.getUserFamilies.map(family => <GridRow size={12}>
              <Grid sizeS={12} sizeM={6} sizeL={6}>
                <Card>
                  <InputHeading color={"secondary"} variant={2} name={`TALOUS ${family.name.toUpperCase()}`}>
                    {family.ownerId == localStorage.getItem('userId') && <Button
                      onClick={() => removeFamily({
                        variables: {
                          id: family._id
                        }
                      })} style={{marginLeft: '5px', verticalAlign: 'bottom'}} type="button" alert>
                      <i class={'icofont-ui-delete'} style={{marginRight: '5px'}}></i> Poista
                    </Button>}
                  </InputHeading>
                  <br /> 
                  <Heading color={"secondary"} variant={3}>Perustaja</Heading>
                  <FamilyMember key={`family-${family._id}-${family.ownerId}`} isOwner={family.isOwner} isAdmin={family.isAdmin} role={"perustaja"} id={family.ownerId} name={`${family.owner.firstName} ${family.owner.lastName}`} />
                  <Heading color={"secondary"} variant={3}>Pääkäyttäjät</Heading>
                  {family.admins && family.admins.length && family.admins.map(admin => <FamilyMember 
                    key={`family-${family._id}-${admin._id}`} 
                    isOwner={family.isOwner}
                    ownerId={family.ownerId}
                    isAdmin={family.isAdmin} 
                    role={"ylläpitäjä"}
                    adminUser={true}
                    delete={() => removeFamilyMember({
                      variables: {
                        id: admin._id,
                        familyId: family._id
                      }
                    })}
                    demote={() => demoteFamilyMember({
                      variables: {
                        id: admin._id,
                        familyId: family._id
                      }
                    })}
                    id={admin._id}
                    name={`${admin.firstName} ${admin.lastName}`} />)}
                  <Heading color={"secondary"} variant={3}>Jäsenet</Heading>
                  {family.members && family.members.length && family.members.map(member => <FamilyMember 
                    key={`family-${family._id}-${member._id}`} 
                    isOwner={family.isOwner} 
                    isAdmin={family.isAdmin}
                    ownerId={family.ownerId}
                    memberUser={true}
                    role={"jäsen"}
                    delete={() => removeFamilyMember({
                      variables: {
                        id: member._id,
                        familyId: family._id
                      }
                    })}
                    promote={() => promoteFamilyMember({
                      variables: {
                        id: member._id,
                        familyId: family._id
                      }
                    })}
                    id={member._id}
                    name={`${member.firstName} ${member.lastName}`} />)}
                  {(family.isOwner || family.isAdmin) && <Block>
                    <Paragraph color={"secondary"}>Alla voit säätää talouden näkyvyysasetuksia. <br />Mikäli asetat näkyvyyden piilotetuksi, taloutta ei löydy vertailusivuilla. </Paragraph>
                    <Block style={{textAlign: 'center'}}>
                    <SelectGroup underline color={"secondary"} value={family.permissions.visibility} onChange={(e, dataset) => changeFamilyVisibility({
                        variables: {
                          family: {
                            _id: family._id,
                            name: family.name,
                            permissions: {
                              visibility: e.currentTarget.value
                            }
                          }
                        }
                       }) 
                      }>
                      <Option key={'visibility-NONE'} selected={family.permissions.visibility == 'NONE' ? 'selected': undefined} value={'NONE'} text={'Piilotettu'} />
                      <Option key={'visibility-Public'} value={'PUBLIC'} text={'Julkinen'} />
                    </SelectGroup>
                    </Block>
                  </Block> }
                </Card>
              </Grid>
              <Grid sizeS={12} sizeM={6} sizeL={6}>
                <Block style={{textAlign: 'center'}}>
                  <DonutChart data={myData} title={"Talouden pisteet"} />
                </Block>
              </Grid>
              <Divider />
            </GridRow>
            )}
            {familyData && (!familyData.getUserFamilies.length || !familyData.getUserFamilies.some(x => x.isOwner)) && <Block>
              <Heading color={"secondary"} variant={4}>Et ole perustanut talutta palveluun.</Heading>
              <Paragraph color={"secondary"}>Voit luoda uuden talouden alla olevalla lomakkeella. <br /> Talouden luonnin jälkeen, voit kutsua henkilöitä liittymään talouteesi.</Paragraph>
              <Block style={{textAlign: 'center'}}>
                <Form
                  onSubmit={e => {
                    createFamily({
                      variables: {
                        family: {
                          "name": familyName,
                          "permissions": {
                            "visibility": "NONE"
                          }
                        }
                      }
                    })
                  }}>
                  <InputGroup required underline color={"secondary"} value={familyName} onChange={(e) => setFamilyname(e.target.value)} placeholder="Talouden nimi" basic id="familyname" type="text" />
                  <Button
                    type="submit"
                    basic > Tallenna</Button> 
                </Form>
                <br />
                <Divider />
              </Block>
            </Block>}
          </Grid>
        </GridRow>
      </GridContainer>
    </Block>
  )
}
export default FamilyInfo