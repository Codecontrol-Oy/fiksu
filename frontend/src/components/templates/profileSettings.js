import React, { useState, useEffect } from 'react'
import ProfileCard from '../molecules/profileCard'
import Heading from "../atoms/heading"
import GridRow from '../grid/row'
import Grid from '../grid/grid'
import Divider from "../atoms/divider"
import Block from "../atoms/block"
import InputGroup from "../molecules/inputGroup"
import { GET_USER_ELECTRICITY_GRAPH, QUERY_CONSUMPTION_TYPES, GET_USER_ENERGY_SAVINGS, GET_USER_MEASUREMENTS, GET_ME } from '../../graphqlQueries'
import { useQuery, useMutation } from "@apollo/react-hooks"
import Option from '../atoms/option'
import SelectGroup from "../molecules/selectGroup"
import Button from "../atoms/button"
import { MUTATION_ADD_NEW_CONSUMPTION, MUTATION_REMOVE_CONSUMPTION, MUTATION_ADD_NEW_MEASUREMENT, MUTATION_REMOVE_MEASUREMENT, MUTATION_UPDATE_USER } from '../../graphqlMutations'
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
const ProfileSettings = props => {

    const [namePublicity, setNamePublicity] = useState("")
    const [emailPublicity, setEmailPublicity] = useState("")
    const [birthdatePublicity, setBirthdatePublicity] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [city, setCity] = useState("")
    const [emailNotifications, setEmailNotifications] = useState(false)

    const { loading, error, data } = useQuery(GET_ME, {
        onCompleted(data) {
            console.log(data)
            setNamePublicity(data.me.permissions && data.me.permissions.showRealName)
            setEmailPublicity(data.me.permissions && data.me.permissions.showEmail)
            setBirthdatePublicity(data.me.permissions && data.me.permissions.showBirthDate)
            setEmailNotifications(data.me.permissions && data.me.permissions.allowEmailNotifications)
            setFirstName(data.me.firstName)
            setLastName(data.me.lastName)
            setBirthDate(data.me.birthDate && data.me.birthDate)
            setCity(data.me.address && data.me.address.city)

        }
    })

    const [updateUser, { loading: mloading, error: mError, data: mData }] = useMutation(MUTATION_UPDATE_USER, {
        onCompleted(data) {
            console.log(data)
        },
        refetchQueries: ['me']

    })



    return (
        <ProfileCard>
            <Heading variant={2} color={"secondary"}>Asetukset</Heading>
            <GridContainer justify="center" direction="column" align="center">
                <GridRow wrap direction="row" justify="center">
                    <Grid sizeS={12} sizeM={6} sizeL={5}    >
                        <Heading align={"left"} color={"secondary"} variant={4}>Profiilitiedot</Heading>
                        <Divider />
                        <Block className="privacy-settings-wrapper">
                            <GridRow align={"center"}>
                                <Grid sizeS={8} sizeM={8} sizeL={8}>
                                    <Label name={"Etunimi"} />
                                </Grid>
                                <Grid sizeS={4} sizeM={4} sizeL={4}>
                                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} color={"secondary"} style={{ width: '100%' }} underline />
                                </Grid>
                            </GridRow>
                            <GridRow align={"center"}>
                                <Grid sizeS={8} sizeM={8} sizeL={8}>
                                    <Label name={"Sukunimi"} />
                                </Grid>
                                <Grid sizeS={4} sizeM={4} sizeL={4}>
                                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} color={"secondary"} style={{ width: '100%' }} underline />
                                </Grid>
                            </GridRow>
                            <GridRow align={"center"}>
                                <Grid sizeS={8} sizeM={8} sizeL={8}>
                                    <Label name={"Syntymäaika"} />
                                </Grid>
                                <Grid sizeS={4} sizeM={4} sizeL={4}>
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
                                <Grid sizeS={8} sizeM={8} sizeL={8}>
                                    <Label name={"Nimen näkyvyys"} />
                                </Grid>
                                <Grid sizeS={4} sizeM={4} sizeL={4}>
                                    <Select color={"secondary"} value={namePublicity} onChange={(e) => setNamePublicity(e.currentTarget.value)} style={{ width: "100%" }} underline>
                                        <PublicityOptions />
                                    </Select>
                                </Grid>
                            </GridRow>
                            <GridRow align={"center"}>
                                <Grid sizeS={8} sizeM={8} sizeL={8}>
                                    <Label name={"Sähköpostin näkyvyys"} />
                                </Grid>
                                <Grid sizeS={4} sizeM={4} sizeL={4}>
                                    <Select color={"secondary"} value={emailPublicity} onChange={(e) => setEmailPublicity(e.currentTarget.value)} style={{ width: "100%" }} underline>
                                        <PublicityOptions />
                                    </Select>
                                </Grid>
                            </GridRow>
                            <GridRow align={"center"}>
                                <Grid sizeS={8} sizeM={8} sizeL={8}>
                                    <Label name={"Syntymäajan näkyvyys"} />
                                </Grid>
                                <Grid sizeS={4} sizeM={4} sizeL={4}>
                                    <Select color={"secondary"} value={birthdatePublicity} onChange={(e) => setBirthdatePublicity(e.currentTarget.value)} style={{ width: "100%" }} underline>
                                        <PublicityOptions />
                                    </Select>
                                </Grid>
                            </GridRow>
                            <GridRow style={{ marginTop: "1rem" }} justify={"center"} align={"center"}>
                                <Button basic
                                    onClick={() => updateUser({
                                        variables: {
                                            User: {
                                                _id: localStorage.getItem("userId"),
                                                firstName: firstName,
                                                lastName: lastName,
                                                birthDate: "2000-12-12",
                                                address: {
                                                    city: "Pori"
                                                },
                                                permissions: {
                                                    showRealName: namePublicity,
                                                    showEmail: emailPublicity,
                                                    showBirthDate: birthdatePublicity,
                                                    allowPushNotifications: false,
                                                    allowEmailNotifications: false
                                                }

                                            }
                                        }

                                    })}
                                >Tallenna</Button>
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
                                    <Switch value={emailNotifications} />
                                </Grid>
                            </GridRow>
                        </Block>
                    </Grid>
                </GridRow>
            </GridContainer>
        </ProfileCard>
    )
}
export default ProfileSettings