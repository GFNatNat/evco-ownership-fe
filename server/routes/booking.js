const express = require('express')
const router = express.Router()
const Booking = require('../models/Booking')
const Group = require('../models/Group')
const { auth, requireGroupRole } = require('../middleware/auth')

// create booking with priority algorithm
router.post('/:groupId', auth(), requireGroupRole('groupId'), async (req,res)=>{
  const { groupId } = req.params
  const { startAt, endAt } = req.body
  const group = req.group
  const userId = req.user.id

  // find overlapping bookings
  const overlaps = await Booking.find({ groupId, status: { $in:['pending','approved'] }, $or: [ { startAt: { $lt: new Date(endAt) }, endAt: { $gt: new Date(startAt) } } ] })

  // compute recent usage (hours) for last 30 days
  const since = new Date(Date.now() - 30*24*3600*1000)
  const recent = await Booking.find({ groupId, status:'approved', endAt: { $gte: since } })
  const recentMap = {}
  const lastBookingDays = {}
  for(const b of recent){
    const hours = (new Date(b.endAt) - new Date(b.startAt)) / 3600000
    recentMap[b.userId] = (recentMap[b.userId] || 0) + hours
    const days = (Date.now() - new Date(b.endAt)) / (24*3600*1000)
    lastBookingDays[b.userId] = Math.min(lastBookingDays[b.userId] || days, days)
  }

  // candidates list
  const candidates = overlaps.map(b => ({ id: b._id, userId: b.userId, startAt: b.startAt, endAt: b.endAt, existing:true }))
  candidates.push({ id: 'new', userId, startAt, endAt, existing:false })

  // compute priority score helper (same logic as earlier)
  function computePriority(uid, reqLenH){
    const member = group.members.find(m=>String(m.userId)===String(uid)) || { share:0 }
    const share = (member.share||0)/100
    const totalUsage = Object.values(recentMap).reduce((a,b)=>a+b,0) || 1
    const usageRatio = (recentMap[uid]||0)/totalUsage
    const fairness = share - usageRatio
    const recency = Math.min((lastBookingDays[uid]||30)/30,1)
    const lenPenalty = Math.min(reqLenH/8,1)
    const score = 0.45*fairness + 0.25*recency + 0.2*share - 0.1*lenPenalty
    return score
  }

  const scored = candidates.map(c => {
    const reqLen = (new Date(c.endAt) - new Date(c.startAt))/3600000
    return { ...c, score: computePriority(String(c.userId), reqLen) }
  }).sort((a,b)=>b.score - a.score)

  const winner = scored[0]
  if(String(winner.userId) === String(userId) && winner.id === 'new'){
    // create approved booking
    const booking = await Booking.create({ groupId, userId, startAt, endAt, status:'approved' })
    return res.json(booking)
  }
  // otherwise return conflict with suggestions
  return res.status(409).json({ message:'Conflict: higher priority exists', winner, suggestions: scored.slice(0,3) })
})

// list bookings for group
router.get('/:groupId', auth(), async (req,res)=>{
  const { groupId } = req.params
  const list = await Booking.find({ groupId }).sort({ startAt:1 }).limit(500)
  res.json(list)
})

module.exports = router