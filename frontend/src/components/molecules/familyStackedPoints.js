import React, {useState} from 'react'
import StackedBarChart from './stackedBarChart'
import { GET_DETAILED_POINTS } from '../../graphqlQueries'
import { useQuery } from "@apollo/react-hooks"

const FamilyPoints = props => {
    const today = new Date()
    const tomorrow = new Date()
    const lastMonth = new Date()
    tomorrow.setDate(today.getDate() + 1)
    lastMonth.setDate(today.getDate() -31)

    const [ dateTomorrow, setDateTomorrow ] = useState(tomorrow)
    const [ dateLastMonth, setDateLastMonth ] = useState(lastMonth)
    const {loading, error, data } = useQuery(GET_DETAILED_POINTS, {
        variables: {
            householdId: props.family._id,
            to: dateTomorrow,
            from: dateLastMonth
        }
    })
    const handleData = () => {
        let resultA = []
        let resultB = []
        data.getDetailedPoints.map((item) => {
            resultA.push({
                x: `${(item.info.firstName && item.info.lastName ? item.info.firstName + " " + item.info.lastName : '[Piilotettu]')}`,
                y: item.ecopoints
            })
            resultB.push({
                x: `${(item.info.firstName && item.info.lastName ? item.info.firstName + " " + item.info.lastName : '[Piilotettu]')}`,
                y: item.electricpoints
            })
        })
        return [
            resultA,
            resultB
        ]
    }
    
    return (
        <React.Fragment>
            {data && data.getDetailedPoints && data.getDetailedPoints.length > 0 && <StackedBarChart data={handleData()} title={props.title} /> }
        </React.Fragment>    
    )
}

export default FamilyPoints