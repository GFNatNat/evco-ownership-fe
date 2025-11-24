const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const RefreshToken = require('../models/RefreshToken')
const { signAccess, signRefresh, verifyRefresh } = require('../helpers/token')

// register (simple)
router.post('/register', async (req,res)=>{
  const { name, email, password, role } = req.body
  const hashed = await bcrypt.hash(password, 10)
  const u = await User.create({ name, email, password: hashed, role: role || 'coowner' })
  res.json({ user: u })
})

// login -> return access token and set refresh cookie
router.post('/login', async (req,res)=>{
  const { email, password } = req.body
  const u = await User.findOne({ email })
  if(!u) return res.status(400).json({ message:'Invalid credentials' })
  const ok = await bcrypt.compare(password, u.password)
  if(!ok) return res.status(400).json({ message:'Invalid credentials' })
  const access = signAccess(u)
  const refresh = await signRefresh(u)
  // send refresh as cookie
  res.cookie('refreshToken', refresh, { httpOnly:true, secure: process.env.COOKIE_SECURE==='true', sameSite:'lax', maxAge: 7*24*3600*1000 })
  return res.json({ accessToken: access, user: { id:u._id, name:u.name, email:u.email, role:u.role } })
})

// refresh endpoint reads cookie or body
router.post('/refresh', async (req,res)=>{
  const token = req.cookies.refreshToken || req.body.refreshToken
  if(!token) return res.status(401).json({ message:'No refresh token' })
  try{
    const dbToken = await verifyRefresh(token)
    // rotate token: revoke old and issue new
    dbToken.revoked = true
    const newToken = await signRefresh({ _id: dbToken.userId })
    dbToken.replacedByToken = newToken
    await dbToken.save()
    const user = await User.findById(dbToken.userId)
    const access = signAccess(user)
    res.cookie('refreshToken', newToken, { httpOnly:true, secure: process.env.COOKIE_SECURE==='true', sameSite:'lax' })
    return res.json({ accessToken: access })
  }catch(e){
    return res.status(401).json({ message: e.message || 'Invalid refresh token' })
  }
})

// logout - clear cookie and revoke that token
router.post('/logout', async (req,res)=>{
  const token = req.cookies.refreshToken || req.body.refreshToken
  if(token) {
    const rt = await RefreshToken.findOne({ token })
    if(rt) { rt.revoked = true; await rt.save() }
  }
  res.clearCookie('refreshToken')
  res.json({ ok:true })
})

// logout all devices (revoke all tokens for user)
router.post('/logout-all', async (req,res)=>{
  const { userId } = req.body
  if(!userId) return res.status(400).json({ message:'userId required' })
  await RefreshToken.updateMany({ userId }, { revoked:true })
  res.clearCookie('refreshToken')
  res.json({ ok:true })
})

module.exports = router