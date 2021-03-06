import React, { useState, useEffect } from 'react';
import '../App.scss';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag'
import RegisterForm from '../components/RegisterForm';
import Transition from '../components/transition/transition';
import GridContainer from "../components/grid/container"
import Card from '../components/atoms/card';
import Grid from "../components/grid/grid"
import CardTitle from "../components/atoms/cardTitle"
import CardBody from '../components/atoms/cardBody';
import CardFooter from '../components/atoms/cardFooter';
import Heading from "../components/atoms/heading"
import Input from "../components/atoms/input"
import Paragraph from "../components/atoms/paragraph"
import InputLabel from '../components/atoms/inputLabel';
import Button from '../components/atoms/button';
import Popup from '../components/molecules/popup';
import { LOGIN_USER } from "../graphqlMutations"
import Form from '../components/atoms/form';
import Block from '../components/atoms/block';
import GridRow from "../components/grid/row"
import { Link } from "react-router-dom"
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks"
import InputGroup from "../components/molecules/inputGroup"
import { GET_ME } from '../graphqlQueries';
import LoadingSpinner from '../components/atoms/loadingSpinner';
import { withRouter } from 'react-router-dom'
import * as constants from '../constants'
import Modal from '../components/atoms/modal';
const queryString = require('query-string');

const Register = props => {

  const [errors, setErrors] = useState(null)
  const [register, setRegister] = useState(false)
  const [postLogin, { loading: mutationLoading, error: mutationError, data }] = useMutation(LOGIN_USER,
    {
      onError(error) {

        setErrors({ message: "Käyttäjätunnus tai salasana on väärä!" })
      },
      onCompleted(data) {
        localStorage.setItem("token", data.logIn.token)
        localStorage.setItem("refreshToken", data.logIn.refreshToken)
        localStorage.setItem("userId", data.logIn._id)
        props.history.push(constants.ROUTE_ACCOUNT)
        setErrors(false)
      }
    },
  )
  const [me, { loading, error, qdata }] = useLazyQuery(GET_ME)

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);

    if (parsed.register) setRegister(true)
    else setRegister(false)
  }, [])
  return (
    <>
      <GridContainer grow justify="center" align="center">

        <Grid style={{ display: "flex", justifyContent: "center" }} height={12} size={6}>

          <Card>
            {register === false &&

              <Block>
                <CardTitle>
                  <Heading variant={4}>Tervetuloa takaisin!</Heading>
                </CardTitle>
                <CardBody>
                  <Form
                    onSubmit={() => { postLogin({ variables: { nickname: document.getElementById("nickname").value, password: document.getElementById("password").value } }) }
                    }>
                    <GridContainer align="center" justify="center" height={12} grow direction="column" size={12}>
                      <GridRow justify="center" align="center">
                        <InputGroup placeholder={"Käyttäjätunnus"} required error={errors ? true : false} underline id="nickname" type="text" />
                      </GridRow>
                      <GridRow justify="center" align="center">
                        <InputGroup placeholder={"Salasana"} required error={errors} underline id="password" type="password" />
                      </GridRow>
                      <GridRow justify="center" align="center">

                        <Button
                          style={{ width: "15rem", marginTop: "2rem" }}
                          type={"submit"}
                          basic>
                          {mutationLoading ?
                            <LoadingSpinner />
                            :
                            "Kirjaudu"

                          }
                        </Button>
                      </GridRow>
                    </GridContainer>
                  </Form>
                </CardBody>
                <CardFooter>
                  <Paragraph onClick={(e) => setRegister(true)} weight={3} size={2}>Uusi käyttäjä? Luo tilisi täältä!</Paragraph>
                  <Paragraph onClick={(e) => props.history.push(constants.ROUTE_RESET_PASSWORD)} weight={3} size={2}>Unohtuiko salasana! Luo uusi täältä</Paragraph>

                </CardFooter>
              </Block>
            }
            {register === true &&
              <RegisterForm setRegister={setRegister} onClick={(e) => setRegister(false)} />

            }


          </Card>
        </Grid>
      </GridContainer >
    </>
  );
}
export default withRouter(Register)
