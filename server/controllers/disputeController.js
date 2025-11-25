const Dispute = require('../models/Dispute')

module.exports = {
  createDispute: async (req,res)=>{
    try{
      const payload = req.body
      const d = await Dispute.create(payload)
      res.json(d)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  getDisputes: async (req,res)=>{
    try{
      const q = {}
      if(req.query.status) q.status = req.query.status
      const list = await Dispute.find(q).sort({ createdAt:-1 }).limit(500)
      res.json(list)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  getDisputeById: async (req,res)=>{
    try{ const d = await Dispute.findById(req.params.id); if(!d) return res.status(404).json({ message:'Not found' }); res.json(d) }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  updateDisputeStatus: async (req,res)=>{
    try{ const d = await Dispute.findById(req.params.id); if(!d) return res.status(404).json({ message:'Not found' }); Object.assign(d, req.body); await d.save(); res.json(d) }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  addMessage: async (req,res)=>{
    try{ const d = await Dispute.findById(req.params.id); if(!d) return res.status(404).json({ message:'Not found' }); d.messages = d.messages || []; d.messages.push({ from: req.body.from, text: req.body.text, createdAt: new Date() }); await d.save(); res.json(d) }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  resolveDispute: async (req,res)=>{
    try{ const d = await Dispute.findById(req.params.id); if(!d) return res.status(404).json({ message:'Not found' }); d.status = 'resolved'; d.resolution = req.body.resolution || ''; await d.save(); res.json(d) }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  }
}
