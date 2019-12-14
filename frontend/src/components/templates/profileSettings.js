import React, { useState, useEffect } from 'react'
import ProfileCard from '../molecules/profileCard'
import Heading from "../atoms/heading"
import GridRow from '../grid/row'
import Grid from '../grid/grid'
import Divider from "../atoms/divider"
import Block from "../atoms/block"
import InputGroup from "../molecules/inputGroup"
import { GET_USER_ELECTRICITY_GRAPH, QUERY_CONSUMPTION_TYPES, GET_USER_ENERGY_SAVINGS, GET_USER_MEASUREMENTS, GET_ME, GET_MY_USER } from '../../graphqlQueries'
import { useQuery, useMutation } from "@apollo/react-hooks"
import Option from '../atoms/option'
import SelectGroup from "../molecules/selectGroup"
import Button from "../atoms/button"
import { MUTATION_ADD_NEW_CONSUMPTION, MUTATION_REMOVE_CONSUMPTION, MUTATION_ADD_NEW_MEASUREMENT, MUTATION_REMOVE_MEASUREMENT, MUTATION_UPDATE_USER, MUTATION_DELETE_USER } from '../../graphqlMutations'
import List from '../atoms/list'
import ListItem from '../molecules/listItem'
import ListItemAction from '../atoms/listItemAction'
import Form from '../atoms/form'
import LineChart from '../molecules/lineChart'
import Switch from "../atoms/switch"
import SwitchInputGroup from "../molecules/switchInputGroup"
import Label from "../atoms/label"
import Select from '../atoms/select'
import GridContainer from '../grid/container'
import PublicityOptions from '../molecules/publicityOptions'
import Input from "../atoms/input"
import LoadingSpinner from "../atoms/loadingSpinner"
import Modal from '../atoms/modal'
import { withRouter } from "react-router-dom"
import * as constants from '../../constants'


const ProfileSettings = props => {

    const [namePublicity, setNamePublicity] = useState("")
    const [emailPublicity, setEmailPublicity] = useState("")
    const [birthdatePublicity, setBirthdatePublicity] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [city, setCity] = useState("")
    const [displayModal, setDisplayModal] = useState(false)
    const [emailNotifications, setEmailNotifications] = useState(false)

    const { loading, error, data } = useQuery(GET_MY_USER, {

        variables: {
            id: localStorage.getItem("userId")
        },
        onCompleted(data) {
            console.log(data)
            setNamePublicity(data.user.permissions && data.user.permissions.showRealName)
            setEmailPublicity(data.user.permissions && data.user.permissions.showEmail)
            setBirthdatePublicity(data.user.permissions && data.user.permissions.showBirthDate)
            setEmailNotifications(data.user.permissions && data.user.permissions.allowEmailNotifications)
            setFirstName(data.user.firstName)
            setLastName(data.user.lastName)
            setBirthDate(data.user.birthDate && data.user.birthDate.substr(0, 10))
            setCity(data.user.address && data.user.address.city)

        }
    })

    const [updateUser, { loading: mloading, error: mError, data: mData }] = useMutation(MUTATION_UPDATE_USER, {
        onCompleted(data) {
            console.log(data)
        },
        refetchQueries: [{ query: GET_MY_USER, variables: { id: localStorage.getItem("userId") } }]

    })

    const [deleteUser, { loading: dLoading, error: dError, data: dData }] = useMutation(MUTATION_DELETE_USER, {
        variables: {
            id: localStorage.getItem("userId")
        },
        onCompleted(data) {
            setDisplayModal(false)
            localStorage.removeItem("userId")
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("token")
            props.history.push(constants.ROUTE_REGISTER)
        },
        onError(data) {
            console.log(data)
            setDisplayModal(false)
        }

    })
    return (
        <ProfileCard>
            <Modal display={displayModal} id={"profile-card"}>
                <GridContainer align={"center"} justify={"center"} direction={"column"}>
                    <GridRow>
                        <Heading color={"secondary"} variant={5}>Oletko varma että haluat poistaa käyttäjätilin?</Heading>
                    </GridRow>
                    <GridRow style={{ marginBottom: "1rem" }} justify={"around"}>
                        <Button onClick={() => deleteUser()} style={{ width: "5rem" }} basic>Kyllä</Button>
                        <Button onClick={() => setDisplayModal(false)} style={{ width: "5rem" }} alert>Ei</Button>
                    </GridRow>
                </GridContainer>


            </Modal>
            <Heading variant={2} color={"secondary"}>Asetukset</Heading>
            <GridContainer justify="center" direction="column" align="center">
                <GridRow wrap direction="row" justify="center">
                    <Grid sizeS={12} sizeM={6} sizeL={5}    >
                        <Heading align={"left"} color={"secondary"} variant={4}>Profiilitiedot</Heading>
                        <Divider />
                        <Block className="privacy-settings-wrapper">
                            <GridRow align={"center"}>
                                <Grid sizeS={7} sizeM={8} sizeL={8}>
                                    <Label name={"Etunimi"} />
                                </Grid>
                                <Grid sizeS={5} sizeM={4} sizeL={4}>
                                    <Input value={firstName} onChange={(e) => setFirstName(e.currentTarget.value)} color={"secondary"} style={{ width: '100%' }} underline />
                                </Grid>
                            </GridRow>
                            <GridRow align={"center"}>
                                <Grid sizeS={7} sizeM={8} sizeL={8}>
                                    <Label name={"Sukunimi"} />
                                </Grid>
                                <Grid sizeS={5} sizeM={4} sizeL={4}>
                                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} color={"secondary"} style={{ width: '100%' }} underline />
                                </Grid>
                            </GridRow>
                            <GridRow align={"center"}>
                                <Grid sizeS={7} sizeM={8} sizeL={8}>
                                    <Label name={"Kaupunki"} />
                                </Grid>
                                <Grid sizeS={5} sizeM={4} sizeL={4}>
                                    <Input value={city} onChange={(e) => setCity(e.target.value)} color={"secondary"} type={"text"} style={{ width: '100%' }} underline />
                                </Grid>
                            </GridRow>
                            <GridRow align={"center"}>
                                <Grid sizeS={7} sizeM={8} sizeL={8}>
                                    <Label name={"Syntymäaika"} />
                                </Grid>
                                <Grid sizeS={5} sizeM={4} sizeL={4}>
                                    <Input value={birthDate} onChange={(e) => setBirthDate(e.target.value)} color={"secondary"} type={"date"} style={{ width: '100%' }} underline />
                                </Grid>
                            </GridRow>
                        </Block>
                    </Grid>
                </GridRow>
                <GridRow wrap direction="row" justify="center">
                    <Grid sizeS={12} sizeM={6} sizeL={5}>
                        <Heading align={"left"} color={"secondary"} variant={4}>Julkisuus asetukset</Heading>
                        <Divider />
                        <Block className="privacy-settings-wrapper">
                            <GridRow align={"center"}>
                                <Grid sizeS={7} sizeM={8} sizeL={8}>
                                    <Label name={"Nimen näkyvyys"} />
                                </Grid>
                                <Grid sizeS={5} sizeM={4} sizeL={4}>
                                    <Select color={"secondary"} value={namePublicity} onChange={(e) => setNamePublicity(e.currentTarget.value)} style={{ width: "100%" }} underline>
                                        <PublicityOptions />
                                    </Select>
                                </Grid>
                            </GridRow>
                            <GridRow align={"center"}>
                                <Grid sizeS={7} sizeM={8} sizeL={8}>
                                    <Label name={"Sähköpostin näkyvyys"} />
                                </Grid>
                                <Grid sizeS={5} sizeM={4} sizeL={4}>
                                    <Select color={"secondary"} value={emailPublicity} onChange={(e) => setEmailPublicity(e.currentTarget.value)} style={{ width: "100%" }} underline>
                                        <PublicityOptions />
                                    </Select>
                                </Grid>
                            </GridRow>
                            <GridRow align={"center"}>
                                <Grid sizeS={7} sizeM={8} sizeL={8}>
                                    <Label name={"Syntymäajan näkyvyys"} />
                                </Grid>
                                <Grid sizeS={5} sizeM={4} sizeL={4}>
                                    <Select color={"secondary"} value={birthdatePublicity} onChange={(e) => setBirthdatePublicity(e.currentTarget.value)} style={{ width: "100%" }} underline>
                                        <PublicityOptions />
                                    </Select>
                                </Grid>
                            </GridRow>
                            <GridRow style={{ marginTop: "1rem" }} justify={"center"} align={"center"}>
                                <Button basic rounded
                                    style={{ width: "10rem" }}
                                    onClick={() => updateUser({
                                        variables: {
                                            User: {
                                                _id: localStorage.getItem("userId"),
                                                firstName: firstName,
                                                lastName: lastName,
                                                birthDate: birthDate,
                                                address: {
                                                    city: city
                                                },
                                                permissions: {
                                                    showRealName: namePublicity,
                                                    showEmail: emailPublicity,
                                                    showBirthDate: birthdatePublicity,
                                                    allowEmailNotifications: emailNotifications
                                                }

                                            }
                                        }

                                    })}
                                >
                                    {mloading ?
                                        <LoadingSpinner />
                                        :
                                        "Tallenna"

                                    }
                                </Button>
                            </GridRow>
                        </Block>
                    </Grid>
                </GridRow>
                <GridRow wrap direction="row" justify="center">
                    <Grid sizeS={12} sizeM={6} sizeL={5}    >
                        <Heading align={"left"} color={"secondary"} variant={4}>Ilmoitus asetukset</Heading>
                        <Divider />
                        <Block className="privacy-settings-wrapper">
                            <GridRow wrap>
                            </GridRow>
                            <GridRow align={"center"}>
                                <Grid sizeS={8} sizeM={8} sizeL={8}>
                                    <Label name={"Sähköposti ilmoitukset"} />
                                </Grid>
                                <Grid sizeS={4} sizeM={4} sizeL={4}>
                                    <Switch onClick={() => setEmailNotifications(!emailNotifications)} value={emailNotifications} />
                                </Grid>
                            </GridRow>
                        </Block>
                    </Grid>
                </GridRow>
                <GridRow wrap direction="row" justify="center">
                    <Grid sizeS={12} sizeM={6} sizeL={5}    >
                        <Heading align={"center"} color={"secondary"} variant={4}>Poista käyttäjätilini</Heading>
                        <Divider />
                        <Block className="privacy-settings-wrapper">
                            <GridRow direction={"column"} justify={"center"} align={"center"}>
                                <Label name={"Tätä toimintoa ei voi peruuttaa!"} />
                                <Button
                                    alert
                                    rounded
                                    onClick={() => setDisplayModal(true)}
                                    style={{ width: "10rem", marginTop: "1.5rem" }}
                                >
                                    Poista käyttäjätilini
                                    </Button>

                            </GridRow>
                        </Block>
                    </Grid>
                </GridRow>
            </GridContainer>
        </ProfileCard>
    )
}
export default withRouter(ProfileSettings)