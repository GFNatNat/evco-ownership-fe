const Group = require('../models/Group')


module.exports = function(requiredRoles = []){
return async (req, res, next) => {
try{
const groupId = req.params.groupId || req.body.groupId || req.query.groupId
if(!groupId) return res.status(400).json({ message: 'groupId missing' })
const group = await Group.findById(groupId)
if(!group) return res.status(404).json({ message: 'Group not found' })
const member = group.members.find(m => String(m.userId) === String(req.user.id))
if(!member) return res.status(403).json({ message: 'Not a group member' })
// check allowed roles (group-level) or global roles
if(requiredRoles.length){
const allowed = requiredRoles.includes(req.user.role) || requiredRoles.includes(member.role)
if(!allowed) return res.status(403).json({ message: 'Insufficient group permission' })
}
req.group = group
req.groupMember = member
next()
}catch(err){ next(err) }
}
}