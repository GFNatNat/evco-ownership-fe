const express = require('express')
const router = express.Router()
const RefreshToken = require('../models/RefreshToken')
const { auth } = require('../middleware/auth')

// revoke all tokens for a user - admin only
router.post('/revoke-user', auth(['admin']), async (req,res)=>{
  const { userId } = req.body
  if(!userId) return res.status(400).json({ message:'userId required' })
  await RefreshToken.updateMany({ userId }, { revoked:true })
  res.json({ ok:true })
})

module.exports = router