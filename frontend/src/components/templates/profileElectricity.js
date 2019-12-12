import React, { useState, useEffect } from 'react'
import ProfileCard from '../molecules/profileCard'
import Heading from "../atoms/heading"
import GridRow from '../grid/row'
import Grid from '../grid/grid'
import Divider from "../atoms/divider"
import RadioInput from '../atoms/radioInput'
import RadioInputField from '../molecules/radioInputField'
import Block from "../atoms/block"
import InputGroup from "../molecules/inputGroup"
import Switch from "../atoms/switch"
import { QUERY_CONSUMPTION_TYPES } from '../../graphqlQueries'
import Select from "../atoms/select"
import { useQuery, useMutation } from "@apollo/react-hooks"
import Option from '../atoms/option'
import SelectGroup from "../molecules/selectGroup"
import Button from "../atoms/button"
import { MUTATION_ADD_NEW_CONSUMPTION } from '../../graphqlMutations'
import withSnackbar from "../molecules/withSnackbar"

const ProfileElectricity = props => {

    const { loading, error, data } = useQuery(QUERY_CONSUMPTION_TYPES)
    const [saveConsumption, { loading: mutationLoading, error: mutationError, mData }] = useMutation(MUTATION_ADD_NEW_CONSUMPTION,
        {
            onCompleted(data) {
                console.log(data)
                props.addSnack("Tallennettu onnistuneesti", "success", "fromSide");
            }
        },

    )
    const [selectedType, setSelectedType] = useState("")
    const [readingType, setReadingType] = useState("")
    const [date, setDate] = useState(null)
    const [reading, setReading] = useState(null)

    return (
        <ProfileCard>
            <Heading variant={3} color={"secondary"}>Sähkönkulutuksen hallinta</Heading>

            <GridRow>
                <Grid size={3}>
                    <Block className="new-electricity-consumption">
                        <Heading variant={3} color={"secondary"}>Lisää Lukema</Heading>
                        <InputGroup onChange={(e) => setDate(e.target.value)} color={"secondary"} basic id="date" type="date" />
                        <SelectGroup color={"secondary"} value={selectedType} onChange={(e, dataset) => { setSelectedType(e.currentTarget.value); setReadingType(dataset.type) }}>
                            <Option disabled text={"Valitse lukeman tyyppi"} />
                            {data && data.getConsumptionTypes && data.getConsumptionTypes.length > 0 &&
                                data.getConsumptionTypes.map((item => {
                                    return <Option type={item.amountType} value={item._id} text={item.description} />
                                }))
                            }
                        </SelectGroup>
                        <InputGroup value={reading} onChange={(e) => setReading(e.target.value)} color={"secondary"} placeholder={readingType} basic id="reading" type="number" />
                        <InputGroup color={"secondary"} placeholder="Muistiinpanot" basic id="notes" type="text" />
                        <Button onClick={() => saveConsumption(
                            {
                                variables: {
                                    savedConsumption: {
                                        "userId": localStorage.getItem("userId"),
                                        "consumptionTypeId": selectedType,
                                        "value": parseFloat(reading),
                                        "date": date,
                                    }


                                }
                            }
                        )
                        } basic > Tallenna</Button>
                    </Block>


                </Grid>
                <Grid>

                </Grid>
            </GridRow>
            <Divider />
            <GridRow>

            </GridRow>
        </ProfileCard>
    )
}
export default ProfileElectricity