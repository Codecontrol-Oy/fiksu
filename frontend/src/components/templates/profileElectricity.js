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
import { QUERY_CONSUMPTION_TYPES, GET_USER_CONSUMPTIONS } from '../../graphqlQueries'
import Select from "../atoms/select"
import { useQuery, useMutation } from "@apollo/react-hooks"
import Option from '../atoms/option'
import SelectGroup from "../molecules/selectGroup"
import Button from "../atoms/button"
import { MUTATION_ADD_NEW_CONSUMPTION } from '../../graphqlMutations'
import withSnackbar from "../molecules/withSnackbar"
import RadioGroup from "../atoms/radioGroup"
import TotalConsumptionChart from "../charts/totalConsumptionChart"
import TodaysSavingsChart from '../charts/todaysSavingsChart'

const ProfileElectricity = props => {

    var today = new Date();
    var tomorrow = new Date();
    var yesterday = new Date();
    tomorrow.setDate(today.getDate() + 1);
    yesterday.setDate(today.getDate() - 1);

    const [selectedType, setSelectedType] = useState("default")
    const [readingType, setReadingType] = useState("")
    const [date, setDate] = useState(today.toJSON().slice(0, 10))
    const [reading, setReading] = useState(null)



    const { loading, error, data } = useQuery(QUERY_CONSUMPTION_TYPES)
    const { qloading, qerror, qData } = useQuery(GET_USER_CONSUMPTIONS, {
        variables: {
            id: localStorage.getItem('userId'), from: today.toDateString(), to: tomorrow.toDateString(), yesterday: yesterday.toDateString()
        }
    })

    const [saveConsumption, { loading: mutationLoading, error: mutationError, mData }] = useMutation(MUTATION_ADD_NEW_CONSUMPTION,
        {
            onCompleted(data) {
                console.log(data)
                setSelectedType("default")
                setReadingType("")
                setDate(today)
                setReading("")

                console.log(readingType, reading, date, selectedType)
            },
            refetchQueries: [`${GET_USER_CONSUMPTIONS}`]
        },

    )


    return (
        <ProfileCard>
            <Heading variant={3} color={"secondary"}>Sähkönkulutuksen hallinta</Heading>

            <GridRow wrap>
                <Grid size={4} sizeS={12} sizeM={6}>
                    <Block className="new-electricity-consumption">
                        <Heading variant={3} color={"secondary"}>Olen säästänyt kulutuksessa</Heading>
                        <InputGroup underline value={date} onChange={(e) => setDate(e.target.value)} color={"secondary"} basic id="date" type="date" />
                        <SelectGroup underline color={"secondary"} value={selectedType} onChange={(e, dataset) => { setSelectedType(e.currentTarget.value); setReadingType(dataset.type) }}>
                            <Option value={"default"} disabled text={"Valitse lukeman tyyppi"} />
                            {data && data.getConsumptionTypes && data.getConsumptionTypes.length > 0 &&
                                data.getConsumptionTypes.map((item => {
                                    return <Option key={item._id} type={item.amountType} value={item._id} text={item.description} />
                                }))
                            }
                        </SelectGroup>
                        <InputGroup underline value={reading} onChange={(e) => setReading(e.target.value)} color={"secondary"} placeholder={readingType} basic id="reading" type="number" />
                        <InputGroup underline color={"secondary"} placeholder="Muistiinpanot" basic id="notes" type="text" />
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
                <Grid size={8} sizeM={6}>
                    {qData &&
                        <TodaysSavingsChart data={qData.getSavedConsumptions} measurements={qData.measurements} />
                    }
                    <TotalConsumptionChart />
                </Grid>
            </GridRow>
            <Divider />
            <GridRow>

            </GridRow>
        </ProfileCard>
    )
}
export default ProfileElectricity