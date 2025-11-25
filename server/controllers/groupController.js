const Group = require('../models/Group')
const User = require('../models/User')

module.exports = {
  createGroup: async (req,res)=>{
    try{
      const payload = req.body
      const g = await Group.create(payload)
      res.json(g)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  getGroups: async (req,res)=>{
    try{
      const q = {}
      // optionally filter by user membership
      if(req.query.userId){ q['members.userId'] = req.query.userId }
      const list = await Group.find(q).limit(500)
      res.json(list)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  getGroupById: async (req,res)=>{
    try{
      const g = await Group.findById(req.params.id).populate('members.userId','name email')
      if(!g) return res.status(404).json({ message:'Not found' })
      res.json(g)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  updateGroup: async (req,res)=>{
    try{
      const g = await Group.findByIdAndUpdate(req.params.id, req.body, { new:true })
      res.json(g)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  deleteGroup: async (req,res)=>{
    try{
      await Group.findByIdAndDelete(req.params.id)
      res.json({ ok:true })
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  addMember: async (req,res)=>{
    try{
      const { groupId } = req.params
      const { userId, share, role } = req.body
      const g = await Group.findById(groupId)
      if(!g) return res.status(404).json({ message:'Group not found' })
      if(g.members.find(m=>String(m.userId)===String(userId))) return res.status(400).json({ message:'Member exists' })
      g.members.push({ userId, share, role: role||'member' })
      await g.save()
      res.json(g)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  removeMember: async (req,res)=>{
    try{
      const { groupId, userId } = req.params
      const g = await Group.findById(groupId)
      if(!g) return res.status(404).json({ message:'Group not found' })
      g.members = g.members.filter(m=>String(m.userId)!==String(userId))
      await g.save()
      res.json(g)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  setGroupAdmin: async (req,res)=>{
    try{
      const { groupId, userId } = req.params
      const { role } = req.body
      const g = await Group.findById(groupId)
      if(!g) return res.status(404).json({ message:'Group not found' })
      const member = g.members.find(m=>String(m.userId)===String(userId))
      if(!member) return res.status(404).json({ message:'Member not found' })
      member.role = role
      await g.save()
      res.json(g)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  updateOwnership: async (req,res)=>{
    try{
      const { groupId } = req.params
      const { ownership } = req.body // array [{userId, share}]
      const g = await Group.findById(groupId)
      if(!g) return res.status(404).json({ message:'Group not found' })
      // apply updates
      ownership.forEach(o=>{
        const m = g.members.find(x=>String(x.userId)===String(o.userId))
        if(m) m.share = o.share
      })
      await g.save()
      res.json(g)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  // Voting and Fund operations are left as simple placeholders here
  createVote: async (req,res)=>{
    res.status(501).json({ message:'Not implemented: createVote' })
  },
  getVotes: async (req,res)=>{
    res.status(501).json({ message:'Not implemented: getVotes' })
  },
  getGroupFund: async (req,res)=>{
    try{
      const g = await Group.findById(req.params.groupId)
      if(!g) return res.status(404).json({ message:'Group not found' })
      res.json(g.commonFund || { balance:0 })
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  topupFund: async (req,res)=>{
    try{
      const { amount, note } = req.body
      const g = await Group.findById(req.params.groupId)
      if(!g) return res.status(404).json({ message:'Group not found' })
      g.commonFund = g.commonFund || { balance:0 }
      g.commonFund.balance = (g.commonFund.balance || 0) + Number(amount || 0)
      await g.save()
      res.json(g.commonFund)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  createFundExpense: async (req,res)=>{
    try{
      const { amount, reason } = req.body
      const g = await Group.findById(req.params.groupId)
      if(!g) return res.status(404).json({ message:'Group not found' })
      g.commonFund.balance = (g.commonFund.balance || 0) - Number(amount || 0)
      await g.save()
      res.json(g.commonFund)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  }
}
