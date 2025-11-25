const express = require('express')
const router = express.Router()
const Booking = require('../models/Booking')
const Group = require('../models/Group')
const { auth } = require('../middleware/auth')
const requireGroupRole = require('../middleware/requireGroupRole')


function computePriority({ share, usageHours=0, totalUsage=1, daysSinceLastBooking=30, requestHours=1 }){
const shareRatio = (share||0)/100
const usageRatio = (usageHours||0) / (totalUsage || 1)
const fairness = shareRatio - usageRatio
const recency = Math.min(daysSinceLastBooking/30, 1)
const lenPenalty = Math.min(requestHours/8, 1)
const score = 0.45*fairness + 0.25*recency + 0.2*shareRatio - 0.1*lenPenalty
return score
}


// create booking with priority algorithm
router.post('/:groupId', auth(), requireGroupRole(['member']), async (req, res) => {
const { groupId } = req.params
const { startAt, endAt } = req.body
const userId = req.user.id
const group = await Group.findById(groupId)
if(!group) return res.status(404).json({ message: 'Group not found' })


// find overlaps
const overlaps = await Booking.find({ groupId, status: { $in: ['pending','approved'] }, $or: [ { startAt: { $lt: new Date(endAt) }, endAt: { $gt: new Date(startAt) } } ] })


// compute recent usage
const since = new Date(Date.now() - 30*24*3600*1000)
const recent = await Booking.find({ groupId, status: 'approved', endAt: { $gte: since } })
const recentMap = {}
const lastBookingDays = {}
for(const b of recent){
const hours = (new Date(b.endAt) - new Date(b.startAt)) / 3600000
recentMap[String(b.userId)] = (recentMap[String(b.userId)] || 0) + hours
const days = (Date.now() - new Date(b.endAt)) / (24*3600*1000)
lastBookingDays[String(b.userId)] = Math.min(lastBookingDays[String(b.userId)] || days, days)
}


const candidates = overlaps.map(b => ({ id: b._id, userId: String(b.userId), startAt: b.startAt, endAt: b.endAt, existing: true }))
candidates.push({ id: 'new', userId: String(userId), startAt, endAt, existing: false })


const scored = candidates.map(c => {
const reqLen = (new Date(c.endAt) - new Date(c.startAt)) / 3600000
const member = group.members.find(m => String(m.userId) === String(c.userId)) || { share: 0 }
const score = computePriority({ share: member.share || 0, usageHours: recentMap[c.userId] || 0, totalUsage: Object.values(recentMap).reduce((a,b)=>a+b,0) || 1, daysSinceLastBooking: lastBookingDays[c.userId] || 30, requestHours: reqLen })
return { ...c, score }
}).sort((a,b) => b.score - a.score)


const winner = scored[0]
if(String(winner.userId) === String(userId) && winner.id === 'new'){
const booking = await Booking.create({ groupId, userId, startAt, endAt, status: 'approved' })
return res.json(booking)
}
return res.status(409).json({ message: 'Conflict: higher priority exists', winner, suggestions: scored.slice(0,3) })
})


// list bookings
router.get('/:groupId', auth(), requireGroupRole(['member']), async (req, res) => {
const { groupId } = req.params
const list = await Booking.find({ groupId }).sort({ startAt: 1 }).limit(500)
res.json(list)
})


module.exports = router