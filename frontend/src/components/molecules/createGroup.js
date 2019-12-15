import React, {useState} from 'react'
import Block from '../atoms/block'
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import Grid from "../grid/grid"
import { useMutation } from "@apollo/react-hooks"
import { MUTATION_CREATE_GROUP }  from '../../graphqlMutations'
import Heading from '../atoms/heading'
import Paragraph from "../atoms/paragraph"
import Form from "../atoms/form"
import Button from '../atoms/button'
import InputGroup from "../molecules/inputGroup"
import Option from '../atoms/option'
import SelectGroup from "../molecules/selectGroup"
import Divider from "../atoms/divider"
const CreateGroup = props => {

    const [groupName, setGroupName] = useState(undefined)
    const [groupDescription, setGroupDescription] = useState(undefined)
    const [groupVisibility, setGroupVisibility] = useState('PUBLIC')
    const [createGroup, { loading: createGroupLoading, error: createGroupError, data: createGroupData }] = useMutation(MUTATION_CREATE_GROUP,
        {
          onCompleted(data) {
            setGroupName('')
            setGroupDescription('')
            setGroupVisibility('PUBLIC')
          },
          refetchQueries: ['GetUserGroups']
        }
      )
    return (
        <Block className="family-info">
          <GridContainer size={12} direction={"column"}>
            <GridRow size={12}>
            <Grid sizeS={12} sizeM={12} sizeL={12}>
                <Block style={{ textAlign: 'center'}}>
                <Heading color={"secondary"} variant={3}>Ryhmän luonti</Heading>
                <Paragraph color={"secondary"}>Voit luoda uuden ryhmän alla olevalla lomakkeella. <br /> Huomioithan, että mikäli asetat ryhmäsi julkiseksi, ryhmän tulokset näkyvät tulossivuilla myös ryhmän ulkopuolisille.</Paragraph>
                </Block>
                <Block style={{textAlign: 'center'}}>
                <Form
                  onSubmit={e => {
                    createGroup({
                      variables: {
                        group: {
                          "name": groupName,
                          "description": groupDescription,
                          "permissions": {
                            "visibility": groupVisibility
                          }
                        }
                      }
                    })
                  }}>
                  <InputGroup required underline color={"secondary"} value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Ryhmän nimi" basic id="groupname" type="text" />
                  <InputGroup required underline color={"secondary"} value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)} placeholder="Ryhmän kuvaus" basic id="groupdescription" type="text" />
                  <SelectGroup underline color={"secondary"} value={groupVisibility} onChange={(e, dataset) => { setGroupVisibility(e.currentTarget.value)}}>
                      <Option key={'visibility-NONE'} selected={groupVisibility == 'NONE' ? 'selected': undefined} value={'NONE'} text={'Piilotettu'} />
                      <Option key={'visibility-Public'} selected={groupVisibility == 'PUBLIC' ? 'selected': undefined} value={'PUBLIC'} text={'Julkinen'} />
                    </SelectGroup>
                  <Button
                    type="submit"
                    basic > Tallenna</Button> 
                </Form>
                <br />
                <Divider />
              </Block>
            </Grid>
            </GridRow>
          </GridContainer>
        </Block>
    )
}

export default CreateGroup