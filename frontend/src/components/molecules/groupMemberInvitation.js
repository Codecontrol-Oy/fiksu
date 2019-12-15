import React from 'react'
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks"
import { GET_USER_INVITED_GROUPS } from '../../graphqlQueries'
import { MUTATION_APPROVE_GROUP_INVITATION, MUTATION_REMOVE_GROUP_MEMBER } from '../../graphqlMutations'
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

const GroupMemberInvitation = props => {

    const { loading: invitationsLoading, error: invitationsError, data: invitationsData } = useQuery(GET_USER_INVITED_GROUPS)
    const [ acceptInvitation, { loading: approveInvitationLoading, error: approveInvitationError, data: approveInvitationData }] = useMutation(MUTATION_APPROVE_GROUP_INVITATION, {
          refetchQueries: ['GetUserInvitedGroups','GetUserGroups']
    })
    const [removeGroupMember, { loading: removeGroupMemberLoading, error: removeGroupMemberError, data: removeGroupMemberData }] = useMutation(MUTATION_REMOVE_GROUP_MEMBER,
        {
          refetchQueries: ['GetUserInvitedGroups','GetUserGroups']
        }
      )
    return (
        <Block className="group-info">
            {invitationsData && invitationsData.getUserInvitedGroups.length > 0 &&
            <GridContainer size={12} direction={"column"}>
              <GridRow size={12}>
                <Grid sizeS={12} sizeM={12} sizeL={12}>
                  <Card>
                  <Heading color={"secondary"} variant={2}>Olet saanut kutsun ryhmään!</Heading>
                  <Paragraph color={"secondary"}>Hyväksymällä kutsun, liityt mukaan ryhmään.</Paragraph>
                  {invitationsData.getUserInvitedGroups.map((group) => <InputLabel color={"secondary"} variant={4} name={`Ryhmä: ${group.name}`}>
                    <Button onClick={() => acceptInvitation({
                      variables: {
                        groupId: group._id
                      }
                    })} style={{marginLeft: '5px'}} type="button" basic>
                      <i class={'icofont-ui-add'} style={{marginRight: '5px'}}></i> Hyväksy kutsu
                    </Button>
                    <Button onClick={() => removeGroupMember({
                      variables: {
                        groupId: group._id,
                        id: localStorage.getItem('userId')
                      }
                    })} style={{marginLeft: '5px'}} type="button" alert>
                      <i class={'icofont-ui-delete'} style={{marginRight: '5px'}}></i> Hylkää kutsu
                    </Button>
                    </InputLabel>)}
                  </Card>
                </Grid>
                <Divider />
               </GridRow>
            </GridContainer>
            }
        </Block>
    )
}

export default GroupMemberInvitation