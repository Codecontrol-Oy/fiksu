import React, {useState} from 'react'
import DonutChart from './donutChart'
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
        let result = []
        data.getDetailedPoints.map((item) => {
            console.log(item)
            result.push({
                label: `${(item.ecopoints + item.electricpoints).toFixed(1)}`,
                subLabel: `${item.info.firstName} ${item.info.lastName}`,
                angle: item.ecopoints + item.electricpoints
            })
        })
        return result
    }
    
    return (
        <React.Fragment>
            {data && data.getDetailedPoints && data.getDetailedPoints.length > 0 && <DonutChart data={handleData()} title={props.title} /> }
        </React.Fragment>    
    )
}

export default FamilyPoints