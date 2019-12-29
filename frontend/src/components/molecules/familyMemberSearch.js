import React, { useState } from 'react'
import Block from '../atoms/block'
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
import Option from '../atoms/option'
import SelectGroup from "../molecules/selectGroup"
import InputLabel from '../atoms/inputLabel'
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks"
import { GET_USER_FAMILIES, SEARCH_USER } from '../../graphqlQueries'
import { MUTATION_ADD_FAMILY_MEMBER, MUTATION_REMOVE_FAMILY_MEMBER } from '../../graphqlMutations'

const FamilyMemberSearch = props => {

  const [search, setSearch] = useState(undefined)
  const [selectedFamily, setSelectedFamily] = useState('default')
  const { loading: familyLoading, error: familyError, data: familyData } = useQuery(GET_USER_FAMILIES, {
    variables: {
      id: localStorage.getItem('userId')
    }
  })
  const [searchUser, { loading: searchLoading, error: searchError, data: searchData }] = useLazyQuery(SEARCH_USER, {
    fetchPolicy: 'network-only'
  })
  const [addFamilyMember, { loading: addFamilyMemberLoading, error: addFamilyMemberError, data: addFamilyMemberData }] = useMutation(MUTATION_ADD_FAMILY_MEMBER, {
    refetchQueries: ['GetUserFamilies', 'SearchUser']
  })
  const [removeFamilyMember, { loading: removeFamilyMemberLoading, error: removeFamilyMemberError, data: removeFamilyMemberData }] = useMutation(MUTATION_REMOVE_FAMILY_MEMBER,
    {
      refetchQueries: ['GetUserFamilies', 'SearchUser']
    }
  )
  return (<Block className="family-info">
    {familyData && familyData.getUserFamilies.length > 0 && (familyData.getUserFamilies.some(x => x.isOwner) || familyData.getUserFamilies.some(x => x.isAdmin)) &&
      <GridContainer size={12} direction={"column"}>
        <GridRow size={12}>
          <Grid sizeS={12} sizeM={6} sizeL={6}>
            <Card>
              <Heading color={"secondary"} variant={4}>Talouden jäsenten kutsuminen</Heading>
              <Paragraph color={"secondary"}>Alla olevalla lomakkeella voit hakea taloutesi jäseniä ja kutsua heidät liittymään palvelussa olevaan talouteesi.<br />Voit hakea käyttäjiä käyttäjätunnuksella, tai etunimellä ja sukunimiellä.</Paragraph>
              <Block style={{ textAlign: 'center' }}>
                <Form
                  onSubmit={e => {
                    searchUser({
                      variables: {
                        search: search,
                        familyId: selectedFamily
                      }
                    })
                  }}>
                  <SelectGroup underline color={"secondary"} value={selectedFamily} onChange={(e, dataset) => { setSelectedFamily(e.currentTarget.value) }}>
                    <Option key={'defaultFamily'} value={'default'} text={'Valitse talous'} />
                    {familyData.getUserFamilies &&
                      familyData.getUserFamilies.map((item => (item.isOwner || item.isAdmin) && <Option key={item._id} value={item._id} text={item.name} />))
                    }
                  </SelectGroup>
                  <InputGroup required underline color={"secondary"} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Etunimi Sukunimi" basic id="searchFamilyMember" type="text" />

                  {selectedFamily != 'default' && <Button
                    type="submit"
                    basic > Hae käyttäjää</Button>}
                </Form>
                {searchData && searchData.searchUser && searchData.searchUser.length && <Block>
                  <Divider />
                  <Heading color={"secondary"} variant={4}>Hakutulokset</Heading>
                  {searchData.searchUser.map((user) => <InputLabel color={"secondary"} variant={4} name={`${(user.firstName && user.lastName ? user.firstName + " " + user.lastName : '[ Piilotettu ]')} 
                  ${user.loginInfo.nickname}`}>
                    <Button onClick={() => addFamilyMember({
                      variables: {
                        familyId: selectedFamily,
                        id: user._id
                      }
                    })} style={{ marginLeft: '5px' }} type="button" basic>
                      <i class={'icofont-ui-add'} style={{ marginRight: '5px' }}></i> Kutsu
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
          <Grid sizeS={12} sizeM={6} sizeL={6}>
            <Card>
              <Heading color={"secondary"} variant={4}>Vahvistamista odottavat talouden jäsenet</Heading>
              <Paragraph color={"secondary"}>Alla olevasta listasta näet henkilöt, jotka eivät vielä ole vahvistaneet kutsua talouteen.</Paragraph>
              {familyData && familyData.getUserFamilies.length && familyData.getUserFamilies.map((family) => (family.isAdmin || family.isOwner) && <Block>
                {family && (!family.pending || !family.pending.length) && <Block>
                  <Heading color={"secondary"} variant={3}>{family.name}</Heading>
                  <Heading color={"secondary"} variant={4}>Ei vahvistamattomia henkilöitä</Heading>
                  )}
              </Block>}
                {family && (family.pending && family.pending.length) && <Heading color={"secondary"} variant={4}>{family.name}</Heading>}
                {family.pending && family.pending.map((pending) => <InputLabel color={"secondary"} variant={4} name={`Nimi: ${(pending.firstName && pending.lastName ? pending.firstName + " " + pending.lastName : '[Piilotettu]')} Tunnus: ${pending.loginInfo.nickname}`}>
                  <Button onClick={() => removeFamilyMember({
                    variables: {
                      familyId: family._id,
                      id: pending._id
                    }
                  })} style={{ marginLeft: '5px' }} type="button" alert>
                    <i class={'icofont-ui-delete'} style={{ marginRight: '5px' }}></i> Poista
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

export default FamilyMemberSearch