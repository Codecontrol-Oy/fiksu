import Measurement from '../db/models/measurementModel'
import Family from '../db/models/familyModel'
import Group from '../db/models/groupModel'
import SavedConsumption from '../db/models/savedConsumptionModel'
import EcoActionType from '../db/models/ecoActionTypeModel'
import SavedEcoActions from '../db/models/savedEcoActionModel'
import { getFamilyMemberIds, getGroupMemberIds } from './profileOperations'
import mongoose from 'mongoose'
import { ApolloError } from 'apollo-server'
import Const from '#constants'

exports.getElectricityGraph = async (args, context) => {
    args.to = args.to ?? new Date()
    if (!args?.from) {
        args.from = new Date()
        args.from = new Date(args.from.setDate(args.to.getDate() - 31))
    }
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
            const savedConsumptions = await SavedConsumption.find({ householdId: args.householdId, date: { "$gte": from, "$lte": to } })
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
    args.to = args.to ?? new Date()
    if (!args?.from) {
        args.from = new Date()
        args.from = new Date(args.from.setDate(args.to.getDate() - 31))
    }
    const userId = args?.userId ?? context.user._id
    const from = new Date(args.from)
    const to = new Date(args.to)
    const fullRange = args.fullRange
    return SavedEcoActions.find({ userId: userId, date: { "$gte": from, "$lte": to } })
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

function getEcoActionAchievements(userId, from, to) {
    return SavedEcoActions.find({ userId: userId, date: { "$gte": from, "$lte": to } })
        .sort({ date: 1 })
        .populate('ecoActionTypeId')
        .then(async (ecoActions) => {
            let totalPoints = 0
            let results = []

            await EcoActionType.find({})
                .then((ecoActionTypes) => {
                    ecoActionTypes.map((ecoActionType) => {
                        if (ecoActionType && ecoActionType.hasAchievement) {
                            results.push({
                                id: ecoActionType._id.toString(),
                                userId: userId,
                                points: 0,
                                icon: ecoActionType.icon,
                                level: 'NONE',
                                type: ecoActionType.achievementType,
                                description: ecoActionType.achievementDescription
                            })
                        }
                    })
                })

            if (ecoActions.length <= 0) {
                return {
                    ecoAchievements: results,
                    combinedEcoAchievement: getCombinedEcoAchievements(userId, totalPoints)
                }
            }

            ecoActions.map((ecoAction) => {
                if (!ecoAction || !ecoAction.ecoActionTypeId) return
                let points = parseFloat(ecoAction.value * ecoAction.ecoActionTypeId.amount).toFixed(2)

                let index = results.findIndex((element) => element.id == ecoAction.ecoActionTypeId._id.toString())
                if (index > -1) {
                    results[index].points = (parseFloat(results[index].points) + parseFloat(points)).toFixed(2)
                    totalPoints += (ecoAction.value * ecoAction.ecoActionTypeId.amount)
                }
                // else block would be an achievement which has been removed
            })

            results.map((ecoAction) => {
                let points = parseFloat(ecoAction.points)
                let level = 'NONE'
                if (points >= parseFloat(Const.ACHIEVEMENT_LEVEL_2)) {
                    level = Const.ACHIEVEMENT_LEVEL_2_ENUM
                }
                else if (points >= parseFloat(Const.ACHIEVEMENT_LEVEL_1)) {
                    level = Const.ACHIEVEMENT_LEVEL_1_ENUM
                }
                else if (points >= parseFloat(Const.ACHIEVEMENT_LEVEL_0)) {
                    level = Const.ACHIEVEMENT_LEVEL_0_ENUM
                }

                ecoAction.level = level
            })

            return {
                ecoAchievements: results,
                combinedEcoAchievement: getCombinedEcoAchievements(userId, totalPoints)
            }
        })
}

function getCombinedEcoAchievements(userId, totalPoints) {
    // Combined EcoAction achievements
    let points = parseFloat(totalPoints)
    let combinedEcoAchievement = {
        userId: userId,
        points: parseFloat(totalPoints).toFixed(2),
        icon: Const.ACHIEVEMENT_COMBINED_ECO_ICON,
        level: 'NONE',
        type: Const.ACHIEVEMENT_COMBINED_ECO_TYPE,
        description: Const.ACHIEVEMENT_COMBINED_ECO_DESC
    }
    if (points >= parseFloat(Const.ACHIEVEMENT_COMBINED_LEVEL_2)) {
        combinedEcoAchievement.level = Const.ACHIEVEMENT_LEVEL_2_ENUM
    }
    else if (points >= parseFloat(Const.ACHIEVEMENT_COMBINED_LEVEL_1)) {
        combinedEcoAchievement.level = Const.ACHIEVEMENT_LEVEL_1_ENUM
    }
    else if (points >= parseFloat(Const.ACHIEVEMENT_COMBINED_LEVEL_0)) {
        combinedEcoAchievement.level = Const.ACHIEVEMENT_LEVEL_0_ENUM
    }

    return combinedEcoAchievement
}

async function getCombinedElectricitySavingAchievements(userId, from, to) {
    // Combined electricity archievement
    let electricityPoints = parseFloat(await getUserFamilyPoints(userId, from, to))
    let combinedElectricityAchievement = {
        userId: userId,
        points: parseFloat(electricityPoints).toFixed(2),
        icon: Const.ACHIEVEMENT_COMBINED_ELECTRICITY_ICON,
        level: 'NONE',
        type: Const.ACHIEVEMENT_COMBINED_ELECTRICITY_TYPE,
        description: Const.ACHIEVEMENT_COMBINED_ELECTRICITY_DESC
    }
    if (electricityPoints >= parseFloat(Const.ACHIEVEMENT_COMBINED_LEVEL_2)) {
        combinedElectricityAchievement.level = Const.ACHIEVEMENT_LEVEL_2_ENUM
    }
    else if (electricityPoints >= parseFloat(Const.ACHIEVEMENT_COMBINED_LEVEL_1)) {
        combinedElectricityAchievement.level = Const.ACHIEVEMENT_LEVEL_1_ENUM
    }
    else if (electricityPoints >= parseFloat(Const.ACHIEVEMENT_COMBINED_LEVEL_0)) {
        combinedElectricityAchievement.level = Const.ACHIEVEMENT_LEVEL_0_ENUM
    }

    return combinedElectricityAchievement
}


async function getUserAchievements(args, context) {
    args.to = args.to ?? new Date()
    if (!args?.from) {
        args.from = new Date()
        args.from = new Date(args.from.setDate(args.to.getDate() - 31))
    }
    const userId = args?.userId ?? context.user._id
    const from = new Date(args.from)
    const to = new Date(args.to)

    const ecoAchievements = await getEcoActionAchievements(userId, from, to)
    const combinedElectricityAchievement = await getCombinedElectricitySavingAchievements(userId, from, to)

    return {
        ecoAchievements: ecoAchievements?.ecoAchievements,
        combinedEcoAchievement: ecoAchievements?.combinedEcoAchievement,
        combinedElectricityAchievement: combinedElectricityAchievement
    }
}

async function getUserEcoPoints(args, context) {
    args.to = args.to ?? new Date()
    if (!args?.from) {
        args.from = new Date()
        args.from = new Date(args.from.setDate(args.to.getDate() - 31))
    }
    const userId = args?.userId ?? context.user._id
    const from = new Date(args.from)
    const to = new Date(args.to)
    return SavedEcoActions.find({ userId: userId, date: { "$gte": from, "$lte": to } })
        .sort({ date: 1 })
        .populate('ecoActionTypeId')
        .then(async (ecoActions) => {
            let totalPoints = 0
            if (ecoActions.length <= 0) { return totalPoints }

            ecoActions.map((ecoAction) => {
                if (!ecoAction || !ecoAction.ecoActionTypeId) return
                totalPoints += (ecoAction.value * ecoAction.ecoActionTypeId.amount)
            })

            return totalPoints.toFixed(2)
        })
}

async function getUserElectricPoints(args, context) {
    args.to = args.to ?? new Date()
    if (!args?.from) {
        args.from = new Date()
        args.from = new Date(args.from.setDate(args.to.getDate() - 31))
    }
    const userId = args?.userId ?? context.user._id
    const householdId = args.householdId
    const from = new Date(args.from)
    const to = new Date(args.to)

    return Measurement.find({ householdId: householdId, date: { "$gte": from, "$lte": to } })
        .sort({ date: 1 })
        .then(async (measurements) => {
            let totalPoints = 0
            if (measurements.length <= 0) {
                return totalPoints
            }

            // Calculate savings
            const savedConsumptions = await SavedConsumption.find({ householdId: householdId, userId: userId, date: { "$gte": from, "$lte": to } })
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

            const last = measurements[measurements.length - 1].value
            const lastPlusSavings = measurements[measurements.length - 1].value + savedConsumptions

            const calculatedPercentage = ((lastPlusSavings * 100 / last) - 100).toFixed(2)

            return parseFloat((parseFloat(Const.ELECTRICITY_SAVING_MULTIPLIER) * calculatedPercentage).toFixed(2))
        })
}

exports.getDetailedPoints = async (args) => {
    args.to = args.to ?? new Date()
    if (!args?.from) {
        args.from = new Date()
        args.from = new Date(args.from.setDate(args.to.getDate() - 31))
    }
    const userId = args.userId
    const householdId = args.householdId
    const groupId = args.groupId

    // Household stats
    if (householdId) {
        const familyMemberIds = await getFamilyMemberIds(householdId, true)
        let results = []
        familyMemberIds.map((familyMemberId) => {
            results.push({
                userId: familyMemberId,
                householdId: args.householdId,
                from: args.from,
                to: args.to
            })
        })

        return results
    }
    // Group stats
    else if (groupId) {
        const groupMemberIds = await getGroupMemberIds(groupId, true)
        let results = []
        groupMemberIds.map((groupMemberId) => {
            results.push({
                userId: groupMemberId,
                from: args.from,
                to: args.to
            })
        })

        return results
    }

    // Requester stats
    return [{
        userId: userId,
        from: args.from,
        to: args.to
    }]
}

async function getFamilyResults(args) {
    args.to = args.to ?? new Date()
    if (!args?.from) {
        args.from = new Date()
        args.from = new Date(args.from.setDate(args.to.getDate() - 31))
    }
    const familyId = args.familyId
    return getFamilyMemberIds(familyId, true)
        .then(async (familyMemberIds) => {
            let totalPoints = 0
            for (let i = 0; i < familyMemberIds.length; i++) {
                totalPoints += parseFloat(await getUserFamilyPoints(familyMemberIds[i], args.from, args.to, familyId))
                totalPoints += parseFloat(await getUserEcoPoints({
                    userId: familyMemberIds[i],
                    from: args.from,
                    to: args.to
                }))
            }

            //console.log(`Total points for ${familyId} = ${totalPoints} with args from ${args.from} to ${args.to}`)
            return parseFloat(totalPoints).toFixed(2)
        })
}

async function getGroupResults(args) {
    args.to = args.to ?? new Date()
    if (!args?.from) {
        args.from = new Date()
        args.from = new Date(args.from.setDate(args.to.getDate() - 31))
    }
    const groupId = args.groupId
    const groupMemberIds = await getGroupMemberIds(groupId, true)

    let totalPoints = 0
    for (let i = 0; i < groupMemberIds.length; i++) {
        totalPoints += parseFloat(await getUserFamilyPoints(groupMemberIds[i], args.from, args.to))
        totalPoints += parseFloat(await getUserEcoPoints({
            userId: groupMemberIds[i],
            from: args.from,
            to: args.to
        }))
    }

    return parseFloat(totalPoints).toFixed(2)
}

async function getUserFamilyPoints(userId, from, to, familyId) {
    to = to ?? new Date()
    if (!from) {
        from = new Date()
        from = new Date(from.setDate(to.getDate() - 31))
    }

    // Family points
    let memberFamilies = null
    if (!familyId) {
        memberFamilies = await getUserFamilies(userId)
    }
    else {
        memberFamilies = await getUserHousehold(familyId)
    }
    let totalFamilyPoints = 0
    for (let y = 0; y < memberFamilies.length; y++) {
        let points = await getUserElectricPoints({
            userId: userId,
            householdId: memberFamilies[y]._id,
            from: from,
            to: to
        })

        //console.log(`Member ${userId} in household ${memberFamilies[y].name} has ${points} points`)
        totalFamilyPoints += points
    }

    return totalFamilyPoints
}

exports.getTopFamilyResults = async (args, context) => {
    args.to = args.to ?? new Date()
    if (!args?.from) {
        args.from = new Date()
        args.from = new Date(args.from.setDate(args.to.getDate() - 31))
    }
    const userId = context.user._id
    return getAllPublicFamilies()
        .then(async (publicFamilies) => {
            if (!publicFamilies || !publicFamilies.length) return null

            let results = []
            for (let i = 0; i < publicFamilies.length; i++) {
                let houseHold = publicFamilies[i]
                results.push({
                    isMember: (houseHold.ownerId == userId ||
                        houseHold.adminIds.some(id => id === userId) ||
                        houseHold.memberIds.some(id => id === userId)),
                    householdId: houseHold._id,
                    points: parseFloat(await getFamilyResults({
                        familyId: houseHold._id.toString(),
                        from: args.from,
                        to: args.to
                    })).toFixed(2),
                    from: args.from,
                    to: args.to
                })
            }

            // Sort by highest to lowest
            results.sort((a, b) => b.points - a.points);

            for (let i = 0; i < results.length; i++) {
                results[i].position = i + 1
            }

            // Take only top X
            let limit = Math.min(args.top, results.length)
            let finalResults = results.slice(0, limit)

            // Add own results if not already there
            let ownResults = results.slice(limit)
            if (ownResults && ownResults.length) {
                ownResults = ownResults.filter(result => result.isMember)
                if (ownResults && ownResults.length) {
                    finalResults = [...finalResults, ...ownResults]
                }
            }

            return finalResults
        })
}

exports.getTopGroupResults = async (args, context) => {
    args.to = args.to ?? new Date()
    if (!args?.from) {
        args.from = new Date()
        args.from = new Date(args.from.setDate(args.to.getDate() - 31))
    }
    const userId = context.user._id
    return getAllPublicGroups()
        .then(async (publicGroups) => {
            if (!publicGroups || !publicGroups.length) return null

            let results = []
            for (let i = 0; i < publicGroups.length; i++) {
                let group = publicGroups[i]
                results.push({
                    isMember: (group.ownerId == userId ||
                        group.adminIds.some(id => id === userId) ||
                        group.memberIds.some(id => id === userId)),
                    groupId: group._id,
                    points: parseFloat(await getGroupResults({
                        groupId: group._id.toString(),
                        from: args.from,
                        to: args.to
                    })).toFixed(2),
                    from: args.from,
                    to: args.to
                })
            }

            // Sort by highest to lowest
            results.sort((a, b) => b.points - a.points);

            for (let i = 0; i < results.length; i++) {
                results[i].position = i + 1
            }

            // Take only top X
            let limit = Math.min(args.top, results.length)
            let finalResults = results.slice(0, limit)

            // Add own results if not already there
            let ownResults = results.slice(limit)
            if (ownResults && ownResults.length) {
                ownResults = ownResults.filter(result => result.isMember)
                if (ownResults && ownResults.length) {
                    finalResults = [...finalResults, ...ownResults]
                }
            }

            return finalResults
        })
}

function getAllPublicFamilies() {
    return Family.find({ 'permissions.visibility': Const.PERMISSION_PUBLIC })
}

function getAllPublicGroups() {
    return Group.find({ 'permissions.visibility': Const.PERMISSION_PUBLIC })
}

function getUserFamilies(groupMemberId) {
    return Family.find({ $or: [{ ownerId: groupMemberId }, { memberIds: groupMemberId }, { adminIds: groupMemberId }] })
}

function getUserHousehold(householdId) {
    return Family.find({ _id: householdId })
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

exports.getUserAchievements = getUserAchievements
exports.getUserFamilyPoints = getUserFamilyPoints
exports.getUserEcoPoints = getUserEcoPoints
exports.getUserElectricPoints = getUserElectricPoints
exports.getFamilyResults = getFamilyResults
exports.getGroupResults = getGroupResults