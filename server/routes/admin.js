const express = require('express')
const router = express.Router()
const User = require('../models/User')
const RefreshToken = require('../models/RefreshToken')
const Group = require('../models/Group')
const Booking = require('../models/Booking')
const Cost = require('../models/Cost')
const { auth } = require('../middleware/auth')

// admin-only
const adminAuth = auth(['admin'])

// list users
router.get('/users', adminAuth, async (req,res)=>{
  try{
    const users = await User.find().select('-password').limit(1000)
    res.json(users)
  }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
})

// revoke all tokens for a user
router.post('/revoke-user', adminAuth, async (req,res)=>{
  try{
    const { userId } = req.body
    if(!userId) return res.status(400).json({ message:'userId required' })
    await RefreshToken.updateMany({ userId }, { revoked: true })
    res.json({ ok:true })
  }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
})

// admin stats for dashboard
router.get('/stats', adminAuth, async (req,res)=>{
  try{
    const groups = await Group.countDocuments()
    const pendingBookings = await Booking.countDocuments({ status: 'pending' })
    const disputes = await (require('../models/Dispute') || { countDocuments: async ()=>0 }).countDocuments()
    const services = await (require('../models/ServiceJob') || { countDocuments: async ()=>0 }).countDocuments()
    res.json({ groups, pendingBookings, disputes, services })
  }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
})

module.exports = router
