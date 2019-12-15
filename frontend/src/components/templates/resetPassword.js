import React, { useState } from 'react'
import Grid from '../grid/grid'
import InputGroup from '../molecules/inputGroup'
import Fieldset from '../atoms/fieldset'
import { useQuery, useMutation } from "@apollo/react-hooks"
import { MUTATION_RESET_PASSWORD } from '../../graphqlMutations'
import GridContainer from "../grid/container"
import Block from "../atoms/block"
import Form from "../atoms/form"
import Button from "../atoms/button"
import Popup from "../molecules/popup"
import GridRow from '../grid/row'
import Heading from '../atoms/heading'
import Paragraph from '../atoms/paragraph'
import Divider from '../atoms/divider'
import { withRouter } from "react-router-dom"
import * as constants from '../../constants'

const ResetPassword = props => {

    const [user, setUser] = useState(null)
    const [resetPassword, { loading, error, data }] = useMutation(MUTATION_RESET_PASSWORD, {
        variables: {
            nickname: user
        },
        onCompleted(data) {
            setTimeout(() => {
                props.history.push(constants.ROUTE_REGISTER)
            }, 1500)
        }
    })
    return (
        <GridContainer justify={"center"} size={12}>
            <Block className="password-reset-wrapper">
                <Form
                    onSubmit={() => {
                        resetPassword()
                    }}
                >
                    <GridRow justify={"center"} direction={"column"} align={"center"}>
                        <Heading variant={3}>Salasanan uusiminen</Heading>
                        <Paragraph> Anna käyttäjänimesi niin lähetäme sinulle sähköpostin uuden salasanan aktivoimiseen.</Paragraph>
                        <Divider />
                        <InputGroup style={{ marginTop: "1rem" }} underline required value={user && user} onChange={(e) => setUser(e.currentTarget.value)} placeholder={"Käyttäjänimi"} />
                        <Button style={{ width: "15rem" }} basic rounded type={"submit"}>Resetoi salasana</Button>
                        {data &&
                            <Popup style={{ marginTop: '1rem' }} variant={"success"} message={"Ohjeet salasanan uusimiseen on lähetetty sähköpostiisi!"} />

                        }
                    </GridRow>
                </Form>
            </Block>
        </GridContainer>
    )
}
export default withRouter(ResetPassword)