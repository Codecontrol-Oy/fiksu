import Measurement from '../db/models/measurementModel'
import SavedConsumption from '../db/models/savedConsumptionModel'
import mongoose from 'mongoose'
import { ApolloError } from 'apollo-server'

exports.getElectricityGraph = async (args) => {
    const from = new Date(args.from)
    const to = new Date(args.to)
    return Measurement.find({ userId: args.userId, date: { "$gte": from, "$lt": to } })
        .sort({date: 1})
        .then(async (measurements) => {
            // If not at least two measurements, return nothing
            if (measurements.length < 2) {
                return [{ data: [{
                    x: from.toISOString().slice(0, 10),
                    y: 0
                }, {
                    x: to.toISOString().slice(0, 10),
                    y: 0
                }] }, { data: [{
                    x: from.toISOString().slice(0, 10),
                    y: 0
                }, {
                    x: to.toISOString().slice(0, 10),
                    y: 0
                }] }]
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
            const savedConsumptions = await SavedConsumption.find({ userId: args.userId, date: { "$gte": from, "$lt": to } })
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
