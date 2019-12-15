import React, { useState, useEffect } from 'react'
import Grid from '../grid/grid'
import InputGroup from '../molecules/inputGroup'
import Fieldset from '../atoms/fieldset'
import { useQuery, useMutation } from "@apollo/react-hooks"
import { MUTATION_RESET_PASSWORD, MUTATION_CONFIRM_NEW_PASSWORD } from '../../graphqlMutations'
import GridContainer from "../grid/container"
import Block from "../atoms/block"
import Form from "../atoms/form"
import Button from "../atoms/button"
import Popup from "../molecules/popup"
import GridRow from '../grid/row'
import Heading from '../atoms/heading'
import Paragraph from '../atoms/paragraph'
import Divider from '../atoms/divider'
import queryString from 'query-string'
import { withRouter } from "react-router-dom"

const NewPassword = props => {

    const [user, setUser] = useState(null)
    const [password, setPassword] = useState(null)
    const [token, setToken] = useState(null)
    const [newPassword, { loading, error, data }] = useMutation(MUTATION_CONFIRM_NEW_PASSWORD, {
        variables: {
            nickname: user,
            verificationToken: token,
            newPassword: password
        },
    })
    useEffect(() => {
        const values = queryString.parse(props.location.search)
        console.log(values)
        setToken(values.token)

    }, [])

    return (
        <GridContainer justify={"center"} size={12}>
            <Block className="password-reset-wrapper">
                <Form
                    onSubmit={() => {
                        newPassword()
                    }}
                >
                    <GridRow justify={"center"} direction={"column"} align={"center"}>
                        <Heading variant={3}>Uusi salasana</Heading>
                        <Paragraph> Kirjoita uusi salasanasi!</Paragraph>
                        <Divider />
                        <InputGroup style={{ marginTop: "1rem" }} underline required value={user && user} onChange={(e) => setUser(e.currentTarget.value)} placeholder={"Käyttäjänimi"} />
                        <InputGroup type={"password"} style={{ marginTop: "1rem" }} underline required value={password && password} onChange={(e) => setPassword(e.currentTarget.value)} placeholder={"Uusi salasana"} />

                        <Button style={{ width: "15rem" }} basic rounded type={"submit"}>Tallenna salasana</Button>
                        {data &&
                            <Popup style={{ marginTop: '1rem' }} variant={"success"} message={"Salasana on muutettu onnistuneesti!"} />

                        }
                        {error &&
                            <Popup style={{ marginTop: '1rem' }} variant={"error"} message={error.message} />
                        }
                    </GridRow>
                </Form>
            </Block>
        </GridContainer>
    )
}
export default withRouter(NewPassword)