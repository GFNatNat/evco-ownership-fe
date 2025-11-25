const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const RefreshToken = require('../models/RefreshToken')
const { signAccess, signRefresh, verifyRefresh } = require('../helpers/token')

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt'

module.exports = {
  register: async (req,res)=>{
    try{
      const { name,email,password,role } = req.body
      if(!email || !password) return res.status(400).json({ message: 'email & password required' })
      const exists = await User.findOne({ email })
      if(exists) return res.status(400).json({ message: 'Email already used' })
      const hashed = await bcrypt.hash(password, 10)
      const u = await User.create({ name, email, password: hashed, role: role || 'coowner' })
      res.json({ user: { id:u._id, name:u.name, email:u.email, role:u.role } })
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  login: async (req,res)=>{
    try{
      const { email, password } = req.body
      const u = await User.findOne({ email })
      if(!u) return res.status(400).json({ message:'Invalid credentials' })
      const ok = await bcrypt.compare(password, u.password)
      if(!ok) return res.status(400).json({ message:'Invalid credentials' })
      const access = signAccess(u)
      const refresh = await signRefresh(u)
      res.cookie('refreshToken', refresh, { httpOnly:true, sameSite:'lax', maxAge:7*24*3600*1000 })
      res.json({ accessToken: access, user: { id:u._id, name:u.name, email:u.email, role:u.role } })
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  getUserProfile: async (req,res)=>{
    try{
      const id = req.params.id
      const u = await User.findById(id).select('-password')
      if(!u) return res.status(404).json({ message:'Not found' })
      res.json(u)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  updateUser: async (req,res)=>{
    try{
      const id = req.params.id
      const payload = req.body
      if(payload.password) payload.password = await bcrypt.hash(payload.password, 10)
      const u = await User.findByIdAndUpdate(id, payload, { new:true }).select('-password')
      res.json(u)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  uploadIdentityDocs: async (req,res)=>{
    try{
      const id = req.params.id
      if(!req.file) return res.status(400).json({ message:'No file uploaded' })
      const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      await User.findByIdAndUpdate(id, { idDocUrl: url })
      res.json({ ok:true, url })
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  uploadDriverLicense: async (req,res)=>{
    try{
      const id = req.params.id
      if(!req.file) return res.status(400).json({ message:'No file uploaded' })
      const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      await User.findByIdAndUpdate(id, { licenseUrl: url })
      res.json({ ok:true, url })
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  getAllUsers: async (req,res)=>{
    try{
      const users = await User.find().select('-password')
      res.json(users)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  updateRole: async (req,res)=>{
    try{
      const id = req.params.id
      const { role } = req.body
      if(!['admin','staff','coowner'].includes(role)) return res.status(400).json({ message:'Invalid role' })
      const u = await User.findByIdAndUpdate(id, { role }, { new:true }).select('-password')
      res.json(u)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  getUsersByGroup: async (req,res)=>{
    try{
      const groupId = req.params.groupId
      const Group = require('../models/Group')
      const g = await Group.findById(groupId).populate('members.userId','name email')
      if(!g) return res.status(404).json({ message:'Group not found' })
      res.json(g.members.map(m=>({ ...m._doc })))
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  }
}
