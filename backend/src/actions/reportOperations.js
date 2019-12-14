import Measurement from '../db/models/measurementModel'
import mongoose from 'mongoose'
import { ApolloError } from 'apollo-server'

exports.getElectricityGraph = async (args) => {
    const from = new Date(args.from)
    const to = new Date(args.to)
    return Measurement.find({ userId: args.userId, date: { "$gte": from, "$lt": to } })
        .sort({date: -1})
        .then((measurements) => {
            // Create the actual electricity line
            let actualElectricityLine = []
            measurements.map((measurement) => {
                actualElectricityLine.push({
                    x: measurement.date.toISOString().slice(0, 10),
                    y: measurement.value
                })
            })

            // Create the "what it would've been without savings" line
            const first = measurements[0]
            const last = measurements[measurements.length - 1]

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
