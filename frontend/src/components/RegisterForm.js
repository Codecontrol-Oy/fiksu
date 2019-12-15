import React, { useState } from 'react';
import '../App.scss';
import { useMutation } from '@apollo/react-hooks';
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
import { LOGIN_USER, CREATE_USER } from "../graphqlMutations"
import Form from '../components/atoms/form';
import Fieldset from './atoms/fieldset';
import IconInput from './molecules/iconInput';
import GridRow from './grid/row';
import InputGroup from './molecules/inputGroup';
import { withRouter } from "react-router-dom"
import * as constants from '../constants'

const Register = props => {

  const [errors, setErrors] = useState(null)
  const [createUser, { loading: mutationLoading, error: mutationError, data }] = useMutation(CREATE_USER,
    {
      onError(error) {
        console.log(error.graphQLErrors[0].extensions.exception.errors)
        setErrors(error.graphQLErrors[0].extensions.exception.errors)
      },
      onCompleted(data) {

        setTimeout(() => {
          props.history.push(constants.ROUTE_HOMEPAGE)
        }, 1500)
      }
    },

  )


  console.log(errors)
  return (
    <Transition>
      <CardTitle>
        <Heading variant={4}>Uuden tilin luonti on helppoa, ja mikä parasta, ilmaista!</Heading>
      </CardTitle>

      <CardBody>
        <Form onSubmit={e => {
          createUser({
            variables: {

              user: {
                "nickname": document.getElementById("nickName").value,
                "password": document.getElementById("password").value,
                "firstName": document.getElementById("firstName").value,
                "lastName": document.getElementById("lastName").value,
                "email": document.getElementById("email").value,
                "birthDate": document.getElementById("birthDate").value,
                "address": {
                  "city": document.getElementById("city").value,
                }
              }


            }
          });
        }}>
          <GridContainer align="center" direction="column">
            <GridRow align="center" justify="center">
              <InputGroup required placeholder="Etunimi" error={errors && errors.firstName && errors.firstName} underline id="firstName" type="text" />
            </GridRow>
            <GridRow align="center" justify="center">
              <InputGroup required placeholder="Sukunimi" error={errors && errors.lastName && errors.lastName} underline id="lastName" type="text" />
            </GridRow>
            <GridRow align="center" justify="center">
              <InputGroup required placeholder="Syntymäaika" error={errors && errors.birthDate && errors.birthDate} underline id="birthDate" type="date" />
            </GridRow>

            <GridRow align="center" justify="center">

              <InputGroup required placeholder="Kaupunki" error={errors && errors["address.city"] && errors["address.city"]} underline id="city" type="text" />
            </GridRow>
          </GridContainer>
          <Fieldset title={"Käyttäjätunnus"}>
            <GridContainer align="center" direction="column">

              <GridRow align="center" justify="center">
                <IconInput required id="nickName" type="text" icon="icofont-user-alt-4" placeholder="Käyttäjänimi" underline />
              </GridRow>
              <GridRow align="center" justify="center">
                <IconInput required id="email" type="email" icon="icofont-email" placeholder="Sähköpostiosoite" underline />

              </GridRow>
              <GridRow align="center" justify="center">
                <IconInput required id="password" error={errors && errors.password && errors.password} type="password" icon="icofont-lock" placeholder="Salasana" underline />
              </GridRow>



            </GridContainer>



          </Fieldset>

          <GridContainer justify="center" align="center" direction="column" size={12}>
            <Button style={{ width: '15rem', margin: '1.5rem' }} type="submit" basic>Luo käyttäjä</Button>
          </GridContainer>





        </Form>
      </CardBody>
      <CardFooter>
        <Paragraph onClick={props.onClick} weight={3} size={2}>Omistatko jo tilin ? Kirjaudu sisään täältä!</Paragraph>
      </CardFooter>
    </Transition>
  );
}
export default withRouter(Register)