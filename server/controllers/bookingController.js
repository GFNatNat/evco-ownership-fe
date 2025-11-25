const Booking = require('../models/Booking')
const Group = require('../models/Group')

function computePriority(group, recentMap, lastBookingDays, uid, reqLenH){
  const member = group.members.find(m=>String(m.userId)===String(uid)) || { share:0 }
  const share = (member.share||0)/100
  const totalUsage = Object.values(recentMap).reduce((a,b)=>a+b,0) || 1
  const usageRatio = (recentMap[uid]||0)/totalUsage
  const fairness = share - usageRatio
  const recency = Math.min((lastBookingDays[uid]||30)/30,1)
  const lenPenalty = Math.min(reqLenH/8,1)
  const score = 0.45*fairness + 0.25*recency + 0.2*share - 0.1*lenPenalty
  return score
}

module.exports = {
  createBooking: async (req,res)=>{
    try{
      const payload = req.body
      const b = await Booking.create(payload)
      res.json(b)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  getAllBookings: async (req,res)=>{
    try{
      const q = {}
      if(req.query.groupId) q.groupId = req.query.groupId
      const list = await Booking.find(q).sort({ startAt:1 }).limit(500)
      res.json(list)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  getBookingById: async (req,res)=>{
    try{ const b = await Booking.findById(req.params.id); if(!b) return res.status(404).json({ message:'Not found' }); res.json(b) }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  updateBooking: async (req,res)=>{
    try{ const b = await Booking.findByIdAndUpdate(req.params.id, req.body, { new:true }); res.json(b) }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  cancelBooking: async (req,res)=>{
    try{ await Booking.findByIdAndUpdate(req.params.id, { status:'cancelled' }); res.json({ ok:true }) }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  getVehicleCalendar: async (req,res)=>{
    try{
      const vehicleId = req.params.vehicleId
      // vehicleId could be groupId reference; we return bookings for group
      const list = await Booking.find({ groupId: vehicleId, status: { $in:['pending','approved'] } }).sort({ startAt:1 })
      res.json(list)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  requestBookingWithPriority: async (req,res)=>{
    try{
      const { groupId, startAt, endAt, userId } = req.body
      const group = await Group.findById(groupId)
      if(!group) return res.status(404).json({ message:'Group not found' })

      const overlaps = await Booking.find({ groupId, status: { $in:['pending','approved'] }, $or: [ { startAt: { $lt: new Date(endAt) }, endAt: { $gt: new Date(startAt) } } ] })

      const since = new Date(Date.now() - 30*24*3600*1000)
      const recent = await Booking.find({ groupId, status:'approved', endAt: { $gte: since } })
      const recentMap = {}
      const lastBookingDays = {}
      for(const b of recent){
        const hours = (new Date(b.endAt) - new Date(b.startAt))/3600000
        recentMap[String(b.userId)] = (recentMap[String(b.userId)]||0)+hours
        const days = (Date.now() - new Date(b.endAt))/(24*3600*1000)
        lastBookingDays[String(b.userId)] = Math.min(lastBookingDays[String(b.userId)]||days, days)
      }

      const candidates = overlaps.map(b=>({ id:b._id, userId: String(b.userId), startAt:b.startAt, endAt:b.endAt, existing:true }))
      candidates.push({ id:'new', userId, startAt, endAt, existing:false })

      const scored = candidates.map(c=>{
        const reqLen = (new Date(c.endAt)-new Date(c.startAt))/3600000
        return { ...c, score: computePriority(group, recentMap, lastBookingDays, String(c.userId), reqLen) }
      }).sort((a,b)=>b.score-a.score)

      const winner = scored[0]
      if(String(winner.userId)===String(userId) && winner.id==='new'){
        const booking = await Booking.create({ groupId, userId, startAt, endAt, status:'approved' })
        return res.json(booking)
      }
      return res.status(409).json({ message:'Conflict', winner, suggestions: scored.slice(0,3) })

    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },

  getUserHistory: async (req,res)=>{
    try{
      const userId = req.params.userId
      const list = await Booking.find({ userId }).sort({ startAt:-1 }).limit(500)
      res.json(list)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  }
}
