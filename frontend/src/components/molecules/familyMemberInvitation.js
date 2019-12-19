import React from 'react'
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks"
import { GET_USER_PENDING_FAMILIES } from '../../graphqlQueries'
import { MUTATION_APPROVE_FAMILY_INVITATION, MUTATION_REMOVE_FAMILY_MEMBER } from '../../graphqlMutations'
import Heading from '../atoms/heading'
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import Grid from "../grid/grid"
import Paragraph from "../atoms/paragraph"
import Card from "../atoms/paragraph"
import Block from '../atoms/block'
import InputLabel from '../atoms/inputLabel'
import Button from '../atoms/button'
import Divider from '../atoms/divider'
const FamilyMemberInvitation = props => {

  const { loading: invitationsLoading, error: invitationsError, data: invitationsData } = useQuery(GET_USER_PENDING_FAMILIES)
  const [acceptInvitation, { loading: approveInvitationLoading, error: approveInvitationError, data: approveInvitationData }] = useMutation(MUTATION_APPROVE_FAMILY_INVITATION, {
    refetchQueries: ['GetUserPendingFamilies', 'GetUserFamilies']
  })
  const [removeFamilyMember, { loading: removeFamilyMemberLoading, error: removeFamilyMemberError, data: removeFamilyMemberData }] = useMutation(MUTATION_REMOVE_FAMILY_MEMBER,
    {
      refetchQueries: ['GetUserPendingFamilies', 'GetUserFamilies']
    }
  )
  return (
    <>
      {invitationsData && invitationsData.getUserPendingFamilies.length > 0 &&
        <GridRow justify={"center"}>
          <Block className="family-info">

            <GridContainer size={12} direction={"column"}>
              <GridRow size={12}>
                <Grid sizeS={12} sizeM={12} sizeL={12}>
                  <Card>
                    <Heading color={"secondary"} variant={2}>Olet saanut kutsun talouteen!</Heading>
                    <Paragraph color={"secondary"}>Hyväksymällä kutsun, liityt mukaan talouteen.</Paragraph>
                    {invitationsData.getUserPendingFamilies.map((family) => <InputLabel color={"secondary"} variant={4} name={`Talous: ${family.name}`}>
                      <Button onClick={() => acceptInvitation({
                        variables: {
                          familyId: family._id
                        }
                      })} style={{ marginLeft: '5px' }} type="button" basic>
                        <i class={'icofont-ui-add'} style={{ marginRight: '5px' }}></i> Hyväksy kutsu
                    </Button>
                      <Button onClick={() => removeFamilyMember({
                        variables: {
                          familyId: family._id,
                          id: localStorage.getItem('userId')
                        }
                      })} style={{ marginLeft: '5px' }} type="button" alert>
                        <i class={'icofont-ui-delete'} style={{ marginRight: '5px' }}></i> Hylkää kutsu
                    </Button>
                    </InputLabel>)}
                  </Card>
                </Grid>
                <Divider />
              </GridRow>
            </GridContainer>

          </Block>
        </GridRow>
      }
    </>
  )
}

export default FamilyMemberInvitation