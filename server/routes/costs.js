const express = require('express')
const router = express.Router()
const Cost = require('../models/Cost')

// create cost (and optionally compute split server-side)
router.post('/', async (req, res) => {
    const payload = req.body
    // expected payload: { groupId, type, amount, splitMethod, members: [{ userId, share }], usageMap? }
    // simple server-side split byShare
    const { groupId, amount, splitMethod, members, usageMap } = payload
    let splitDetail = []
    if (splitMethod === 'byShare') {
        splitDetail = members.map(m => ({ userId: m.userId, amount: Math.round((m.share / 100) * amount) }))
    } else if (splitMethod === 'byUsage') {
        const totalUsage = Object.values(usageMap || {}).reduce((a, b) => a + b, 0) || 1
        splitDetail = members.map(m => ({ userId: m.userId, amount: Math.round((usageMap[m.userId] || 0) / totalUsage * amount) }))
    } else if (splitMethod === 'hybrid') {
        const { wShare = 0.6, wUsage = 0.4 } = payload
        const totalUsage = Object.values(usageMap || {}).reduce((a, b) => a + b, 0) || 1
        splitDetail = members.map(m => {
            const sharePart = m.share / 100
            const usagePart = (usageMap[m.userId] || 0) / totalUsage
            const factor = wShare * sharePart + wUsage * usagePart
            return { userId: m.userId, amount: Math.round(factor * amount) }
        })
    }
    const cost = await Cost.create({ ...payload, splitDetail })
    res.json(cost)
})

// list costs
router.get('/', async (req, res) => {
    const costs = await Cost.find().sort({ createdAt: -1 }).limit(200)
    res.json(costs)
})

module.exports = router