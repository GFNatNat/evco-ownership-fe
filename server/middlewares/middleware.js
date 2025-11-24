const jwt = require('jsonwebtoken')
const Group = require('../models/Group')
const { JWT_SECRET } = process.env

function auth(roles = []) {
  return async (req,res,next) => {
    const h = req.headers.authorization
    if(!h) return res.status(401).json({ message:'No token' })
    const token = h.split(' ')[1]
    try {
      const payload = jwt.verify(token, JWT_SECRET)
      req.user = payload
      // global roles check
      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ message:'Forbidden' })
      }
      next()
    } catch(e) {
      return res.status(401).json({ message:'Invalid token' })
    }
  }
}

// group-level check middleware factory
async function requireGroupRole(groupIdParam = 'groupId', allowedRoles = []) {
  return async (req, res, next) => {
    try {
      const groupId = req.params[groupIdParam] || req.body.groupId
      if(!groupId) return res.status(400).json({ message:'Group ID required' })
      const group = await Group.findById(groupId)
      if(!group) return res.status(404).json({ message:'Group not found' })
      // find membership
      const member = group.members.find(m => String(m.userId) === String(req.user.id))
      if(!member) return res.status(403).json({ message:'Not a member of group' })
      if (allowedRoles.length && !allowedRoles.includes(member.role) && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message:'Insufficient group permissions' })
      }
      req.group = group
      req.groupMember = member
      next()
    } catch(e) {
      next(e)
    }
  }
}

module.exports = { auth, requireGroupRole }
