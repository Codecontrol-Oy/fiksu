import React, { useState } from 'react'
import Block from '../atoms/block'
import { GET_USER_FAMILIES } from '../../graphqlQueries'
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks"
import { MUTATION_CREATE_FAMILY, MUTATION_REMOVE_FAMILY, MUTATION_REMOVE_FAMILY_MEMBER, MUTATION_PROMOTE_FAMILY_MEMBER, MUTATION_DEMOTE_FAMILY_MEMBER, MUTATION_CHANGE_FAMILY_VISIBILTY } from '../../graphqlMutations'
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
import FamilyMember from './familyMember'
import Option from '../atoms/option'
import SelectGroup from "../molecules/selectGroup"
import FamilyPoints from "./familyPoints"
import FamilyStackedPoints from './familyStackedPoints'
import withSnackbar from "./withSnackbar"
import { onError } from 'apollo-link-error'
import Modal from "../atoms/modal"

const FamilyInfo = props => {

  const [familyName, setFamilyname] = useState(undefined)
  const [displayModal, setDisplayModal] = useState(false)

  const { loading: familyLoading, error: familyError, data: familyData } = useQuery(GET_USER_FAMILIES, {
    variables: {
      id: localStorage.getItem('userId')
    }
  })

  const [createFamily, { loading: createFamilyLoading, error: createFamilyError, data: createFamilyData }] = useMutation(MUTATION_CREATE_FAMILY,
    {
      onCompleted(data) {
        setFamilyname(undefined)
        props.addSnack("Talous luotu onnistuneesti", "success")
      },
      refetchQueries: ['GetUserFamilies']
    }
  )

  const [removeFamily, { loading: removeFamilyLoading, error: removeFamilyError, data: removeFamilyData }] = useMutation(MUTATION_REMOVE_FAMILY,
    {
      refetchQueries: ['GetUserFamilies'],
      onCompleted() {
        props.addSnack("Talous poistettu onnistuneesti", "success")

      }
    }
  )
  const [changeFamilyVisibility, { loading: visibilityFamilyLoading, error: visibilityFamilyError, data: visibilityFamilyData }] = useMutation(MUTATION_CHANGE_FAMILY_VISIBILTY,
    {
      refetchQueries: ['GetUserFamilies'],
      onCompleted() {
        props.addSnack("Talouden asetukset muutettu onnistuneesti", "success")

      }
    }
  )
  const [removeFamilyMember, { loading: removeFamilyMemberLoading, error: removeFamilyMemberError, data: removeFamilyMemberData }] = useMutation(MUTATION_REMOVE_FAMILY_MEMBER,
    {
      refetchQueries: ['GetUserFamilies'],
      onCompleted() {
        props.addSnack("Jäsen poistettu onnistuneesti", "success")

      },
      onError() {
        props.addSnack("Jäsenen poisto epäonnistui", "error")

      }
    }
  )

  const [demoteFamilyMember, { loading: demoteFamilyMemberLoading, error: demoteFamilyMemberError, data: demoteFamilyMemberData }] = useMutation(MUTATION_DEMOTE_FAMILY_MEMBER,
    {
      refetchQueries: ['GetUserFamilies'],
      onCompleted() {
        props.addSnack("Jäsenen oikeudet muutettu onnistuneesti", "success")

      }
    }
  )

  const [promoteFamilyMember, { loading: promoteFamilyMemberLoading, error: promoteFamilyMemberError, data: promoteFamilyMemberData }] = useMutation(MUTATION_PROMOTE_FAMILY_MEMBER,
    {
      refetchQueries: ['GetUserFamilies'],
      onCompleted() {
        props.addSnack("Jäsenen oikeudet muutettu onnistuneesti", "success")

      }
    }
  )

  const myData = [{ angle: 1, label: "1", subLabel: "ekopisteet" }, { angle: 5, label: "5", subLabel: "Sähkönkäyttöpisteet" }]

  return (
    <Block className="family-info">
      <GridContainer size={12} direction={"column"}>
        <GridRow size={12}>
          <Grid>
            {familyData && familyData.getUserFamilies.length > 0 && familyData.getUserFamilies.map(family => <GridRow size={12}>
              <Grid sizeS={12} sizeM={12} sizeL={4}>
                <Modal display={displayModal} id={"profile-card"}>
                  <GridContainer align={"center"} justify={"center"} direction={"column"}>
                    <Heading variant={4} color={"secondary"}>Talouden poistaminen</Heading>
                    <Divider color={"secondary"} />
                    <GridRow>
                      <Heading color={"secondary"} variant={5}>Oletko varma että haluat poistaa talouden {family.name.toUpperCase()}?</Heading>
                    </GridRow>
                    <GridRow style={{ marginBottom: "1rem" }} justify={"around"}>
                      <Button onClick={() => removeFamily({
                        variables: {
                          id: family._id
                        }
                      })} style={{ width: "5rem" }} basic>Kyllä</Button>
                      <Button onClick={() => setDisplayModal(false)} style={{ width: "5rem" }} alert>Ei</Button>
                    </GridRow>
                  </GridContainer>


                </Modal>
                <Card>
                  <InputHeading color={"secondary"} variant={2} name={`TALOUS ${family.name.toUpperCase()}`}>
                    {family.ownerId == localStorage.getItem('userId') && <Button
                      onClick={() => setDisplayModal(true)} style={{ marginLeft: '5px', verticalAlign: 'bottom' }} type="button" alert>
                      <i class={'icofont-ui-delete'} style={{ marginRight: '5px' }}></i> Poista
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
                    <Block style={{ textAlign: 'center' }}>
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
                        <Option key={'visibility-NONE'} selected={family.permissions.visibility == 'NONE' ? 'selected' : undefined} value={'NONE'} text={'Piilotettu'} />
                        <Option key={'visibility-Public'} selected={family.permissions.visibility == 'PUBLIC' ? 'selected' : undefined} value={'PUBLIC'} text={'Julkinen'} />
                      </SelectGroup>
                    </Block>
                  </Block>}
                </Card>
              </Grid>
              <Grid sizeS={12} sizeM={12} sizeL={8}>
                <Block style={{ textAlign: 'center' }}>
                  <Heading variant={2} color={"secondary"}>Talouden kuukausitulos</Heading>
                  <GridRow size={12}>
                    <Grid sizeS={12} sizeM={6} sizeL={6}>
                      <FamilyPoints family={family} title={'Pisteet henkilöittäin'} />
                    </Grid>
                    <Grid sizeS={12} sizeM={6} sizeL={6}>
                      <FamilyStackedPoints family={family} title={'jaottelu henkilöittäin'} />
                    </Grid>
                  </GridRow>
                </Block>
              </Grid>
              <Divider />
            </GridRow>
            )}
            {familyData && (!familyData.getUserFamilies.length || !familyData.getUserFamilies.some(x => x.isOwner)) && <Block>
              <Heading color={"secondary"} variant={4}>Et ole perustanut taloutta palveluun.</Heading>
              <Paragraph color={"secondary"}>Voit luoda uuden talouden alla olevalla lomakkeella. <br /> Talouden luonnin jälkeen, voit kutsua henkilöitä liittymään talouteesi.</Paragraph>
              <Block style={{ textAlign: 'center' }}>
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
export default withSnackbar(FamilyInfo)