const Cost = require('../models/Cost')

module.exports = {
  createPayment: async (req,res)=>{
    try{
      // creates a cost entry
      const payload = req.body
      const cost = await Cost.create(payload)
      res.json(cost)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  getPayments: async (req,res)=>{
    try{
      const q = {}
      if(req.query.groupId) q.groupId = req.query.groupId
      const list = await Cost.find(q).sort({ createdAt:-1 }).limit(500)
      res.json(list)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  getPaymentById: async (req,res)=>{
    try{ const p = await Cost.findById(req.params.id); if(!p) return res.status(404).json({ message:'Not found' }); res.json(p) }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  splitByOwnership: async (req,res)=>{
    try{
      const { costId } = req.params
      const cost = await Cost.findById(costId)
      if(!cost) return res.status(404).json({ message:'Not found' })
      // cost already stored with splitDetail
      res.json(cost)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  splitByUsage: async (req,res)=>{
    try{
      const { costId, usageMap } = req.body
      const cost = await Cost.findById(costId)
      if(!cost) return res.status(404).json({ message:'Not found' })
      // compute split by usage
      const total = Object.values(usageMap).reduce((a,b)=>a+Number(b||0),0)||1
      cost.splitDetail = cost.splitDetail.map(s=>({ ...s, amount: Math.round((Number(usageMap[String(s.userId)])||0)/total * cost.amount) }))
      await cost.save()
      res.json(cost)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  getMonthlyReport: async (req,res)=>{
    try{
      const { groupId } = req.params
      // simple aggregation example
      const pipeline = [ { $match: { groupId: require('mongoose').Types.ObjectId(groupId) } }, { $group: { _id: { month: { $month: '$createdAt' }, year:{ $year: '$createdAt' } }, total: { $sum: '$amount' } } } ]
      const r = await Cost.aggregate(pipeline)
      res.json(r)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  }
}
