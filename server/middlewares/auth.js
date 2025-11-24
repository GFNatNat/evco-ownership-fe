const jwt = require('jsonwebtoken')
const Group = require('../models/Group')

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt'

function auth(roles = []){
  return (req,res,next)=>{
    const header = req.headers.authorization
    if(!header) return res.status(401).json({ message:'No token' })
    const token = header.split(' ')[1]
    try{
      const payload = jwt.verify(token, JWT_SECRET)
      req.user = payload
      if(roles.length && !roles.includes(payload.role)) return res.status(403).json({ message:'Forbidden' })
      next()
    }catch(e){
      return res.status(401).json({ message:'Invalid token' })
    }
  }
}

async function requireGroupRole(groupIdParam = 'groupId', allowedRoles = []){
  return async (req,res,next) => {
    try{
      const groupId = req.params[groupIdParam] || req.body.groupId
      if(!groupId) return res.status(400).json({ message:'groupId missing' })
      const group = await Group.findById(groupId)
      if(!group) return res.status(404).json({ message:'Group not found' })
      const member = group.members.find(m => String(m.userId) === String(req.user.id))
      if(!member) return res.status(403).json({ message:'Not a group member' })
      if(allowedRoles.length && !allowedRoles.includes(member.role) && !allowedRoles.includes(req.user.role)) return res.status(403).json({ message:'Insufficient group permission' })
      req.group = group
      req.groupMember = member
      next()
    }catch(e){ next(e) }
  }
}

module.exports = { auth, requireGroupRole }