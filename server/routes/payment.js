const express = require('express')
const router = express.Router()
const Cost = require('../models/Cost')
const { auth } = require('../middleware/auth')

// webhook receiver (stripe, etc.)
// This should verify signatures per provider in production
router.post('/webhook', express.raw({ type: 'application/json' }), async (req,res)=>{
  try{
    // parse provider payload
    // For now accept generic body
    const event = JSON.parse(req.body.toString())
    // example: if event.type === 'payment_intent.succeeded' -> reconcile
    console.log('payment webhook', event.type || 'unknown')
    // TODO: implement provider-specific handling
    res.status(200).send('ok')
  }catch(e){ console.error(e); res.status(400).send('err') }
})

// manual reconcile endpoint (protected)
router.post('/reconcile', auth(['staff','admin']), async (req,res)=>{
  try{
    const { costId, userId, paymentRef } = req.body
    const cost = await Cost.findById(costId)
    if(!cost) return res.status(404).json({ message:'Cost not found' })
    const entry = cost.splitDetail.find(s=>String(s.userId)===String(userId))
    if(!entry) return res.status(400).json({ message:'Entry not found' })
    entry.paid = true
    entry.paidAt = new Date()
    entry.paymentRef = paymentRef
    await cost.save()
    res.json(cost)
  }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
})

module.exports = router
