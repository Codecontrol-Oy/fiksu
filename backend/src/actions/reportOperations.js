import Measurement from '../db/models/measurementModel'
import SavedConsumption from '../db/models/savedConsumptionModel'
import SavedEcoActions from '../db/models/savedEcoActionModel'
import mongoose from 'mongoose'
import { ApolloError } from 'apollo-server'

exports.getElectricityGraph = async (args, context) => {
    const from = new Date(args.from)
    const to = new Date(args.to)
    return Measurement.find({ householdId: args.householdId, date: { "$gte": from, "$lt": to } })
        .sort({ date: 1 })
        .then(async (measurements) => {
            // If not at least two measurements, return nothing
            if (measurements.length < 2) {
                return [{
                    data: [{
                        x: from.toISOString().slice(0, 10),
                        y: 0
                    }, {
                        x: to.toISOString().slice(0, 10),
                        y: 0
                    }]
                }, {
                    data: [{
                        x: from.toISOString().slice(0, 10),
                        y: 0
                    }, {
                        x: to.toISOString().slice(0, 10),
                        y: 0
                    }]
                }]
            }

            // Create the actual electricity line
            let actualElectricityLine = []
            measurements.map((measurement) => {
                actualElectricityLine.push({
                    x: measurement.date.toISOString().slice(0, 10),
                    y: measurement.value
                })
            })

            // Calculate savings
            const savedConsumptions = await SavedConsumption.find({ householdId: args.householdId, date: { "$gte": from, "$lt": to } })
                .populate('consumptionTypeId')
                .then((savings) => {
                    if (savings) {
                        let totalSavings = 0
                        savings.map((saving) => {
                            totalSavings += (saving.value * saving.consumptionTypeId.amount)
                        })

                        return totalSavings
                    }

                    return 0
                })

            // Create the "what it would've been without savings" line
            const first = measurements[0]
            const last = measurements[measurements.length - 1]
            last.value += savedConsumptions

            let savingsLine = []
            savingsLine.push({
                x: first.date.toISOString().slice(0, 10),
                y: first.value
            })
            savingsLine.push({
                x: last.date.toISOString().slice(0, 10),
                y: last.value
            })

            //console.log(JSON.stringify([{ data: actualElectricityLine }, { data: savingsLine }]))
            return [{ data: actualElectricityLine }, { data: savingsLine }]
        })
}

exports.getUserEcoActionsGraph = async (args, context) => {
    const userId = args?.userId ?? context.user._id
    const from = new Date(args.from)
    const to = new Date(args.to)
    const fullRange = args.fullRange
    return SavedEcoActions.find({ userId: userId, date: { "$gte": from, "$lt": to } })
        .sort({ date: 1 })
        .then(async (ecoActions) => {
            if (ecoActions.length <= 0) {
                return [{ data: generateDataSet(fullRange, from, to, null) }]
            }

            // Group by: https://stackoverflow.com/a/46802505
            const groups = ecoActions.reduce((groups, ecoAction) => {
                const date = ecoAction.date.toISOString().slice(0, 10)
                if (!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(ecoAction);
                return groups;
            }, {});

            const groupedEcoActions = Object.keys(groups).map((date) => {
                let actionsCount = 0
                groups[date].map((ecoAction) => {
                    actionsCount += parseInt(ecoAction.value)
                })

                return {
                    date: date,
                    value: actionsCount
                }
            })


            // Create the actual ecoaction line
            let actualEcoActionsLine = generateDataSet(fullRange, from, to, groupedEcoActions)

            //console.log(JSON.stringify([{ data: actualEcoActionsLine }]))
            return [{ data: actualEcoActionsLine }]
        })
}

function generateDataSet(fullRange, from, to, data) {        
    data = data ?? []
    const timeDiff = to.getTime() - from.getTime();
    const dateDiff = timeDiff / (1000 * 3600 * 24);

    let results = []
    let variableDate = new Date(from)
    for (let i = 0; i < dateDiff; i++) {
        let xValue = variableDate.toISOString().slice(0, 10)
        const index = data.findIndex(item => item.date === xValue)
        if (fullRange || index > -1) {
            results.push({
                x: xValue,
                y: index > -1 ? data[index].value : 0
            })
        }

        variableDate.setDate(variableDate.getDate() + 1)
    }

    if (!results.length) {
        results.push({ x: from.toISOString().slice(0, 10), y: 0 })
        results.push({ x: to.toISOString().slice(0, 10), y: 0 })
    }

    return results
}