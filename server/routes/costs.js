const express = require('express')
const router = express.Router()
const Cost = require('../models/Cost')
const Group = require('../models/Group')
const { auth, requireGroupRole } = require('../middleware/auth')

// create cost
router.post('/', auth(), requireGroupRole('groupId', ['groupAdmin', 'member']), async (req,res)=>{
  const payload = req.body
  const { group } = req
  const members = group.members.map(m=>({ userId: m.userId, share: m.share }))
  const { amount, splitMethod, usageMap = {}, wShare = 0.6 } = payload
  let splitDetail = []
  if(splitMethod === 'byShare'){
    splitDetail = members.map(m => ({ userId: m.userId, amount: Math.round((m.share/100)*amount) }))
  } else if(splitMethod === 'byUsage'){
    const total = Object.values(usageMap).reduce((a,b)=>a+(Number(b)||0),0) || 1
    splitDetail = members.map(m => ({ userId: m.userId, amount: Math.round(((Number(usageMap[m.userId])||0)/total)*amount) }))
  } else if(splitMethod === 'hybrid'){
    const total = Object.values(usageMap).reduce((a,b)=>a+(Number(b)||0),0) || 1
    splitDetail = members.map(m=>{
      const sharePart = m.share/100
      const usagePart = (Number(usageMap[m.userId])||0)/total
      const factor = wShare*sharePart + (1-wShare)*usagePart
      return { userId: m.userId, amount: Math.round(factor*amount) }
    })
  }
  const creatorIsAdmin = req.groupMember.role === 'groupAdmin' || req.user.role === 'admin'
  const cost = await Cost.create({ groupId: group._id, type: payload.type, amount, incurredAt: payload.incurredAt||new Date(), splitMethod, splitDetail, status: creatorIsAdmin ? 'approved' : 'pending', createdBy: req.user.id })
  res.json(cost)
})

// list
router.get('/', auth(), async (req,res)=>{
  const { groupId } = req.query
  const q = {}
  if(groupId) q.groupId = groupId
  const costs = await Cost.find(q).sort({ createdAt:-1 }).limit(200)
  res.json(costs)
})

// approve
router.post('/:id/approve', auth(), async (req,res)=>{
  const cost = await Cost.findById(req.params.id)
  if(!cost) return res.status(404).json({ message:'Not found' })
  const group = await Group.findById(cost.groupId)
  const member = group.members.find(m=>String(m.userId)===String(req.user.id))
  if(!(req.user.role==='admin' || (member && member.role==='groupAdmin'))) return res.status(403).json({ message:'Forbidden' })
  cost.status = 'approved'
  cost.approvals.push({ userId: req.user.id, decision:'approved', at: new Date() })
  await cost.save()
  res.json(cost)
})

// pay
router.post('/:id/pay', auth(), async (req,res)=>{
  const { userId, paymentRef } = req.body
  const cost = await Cost.findById(req.params.id)
  if(!cost) return res.status(404).json({ message:'Not found' })
  const entry = cost.splitDetail.find(s => String(s.userId) === String(userId))
  if(!entry) return res.status(400).json({ message:'Not owed' })
  entry.paid = true
  entry.paidAt = new Date()
  entry.paymentRef = paymentRef
  await cost.save()
  res.json(cost)
})

module.exports = router