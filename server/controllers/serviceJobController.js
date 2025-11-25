const ServiceJob = require('../models/ServiceJob')

module.exports = {
  createJob: async (req,res)=>{
    try{
      const payload = req.body
      const job = await ServiceJob.create(payload)
      res.json(job)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  getJobs: async (req,res)=>{
    try{
      const q = {}
      if(req.query.groupId) q.groupId = req.query.groupId
      const list = await ServiceJob.find(q).sort({ createdAt:-1 }).limit(500)
      res.json(list)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  getJobById: async (req,res)=>{
    try{ const job = await ServiceJob.findById(req.params.id); if(!job) return res.status(404).json({ message:'Not found' }); res.json(job) }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  updateJob: async (req,res)=>{
    try{ const job = await ServiceJob.findByIdAndUpdate(req.params.id, req.body, { new:true }); res.json(job) }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  deleteJob: async (req,res)=>{
    try{ await ServiceJob.findByIdAndDelete(req.params.id); res.json({ ok:true }) }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  approveJob: async (req,res)=>{
    try{ const job = await ServiceJob.findById(req.params.id); if(!job) return res.status(404).json({ message:'Not found' }); job.status = 'in-progress'; await job.save(); res.json(job) }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  rejectJob: async (req,res)=>{
    try{ const job = await ServiceJob.findById(req.params.id); if(!job) return res.status(404).json({ message:'Not found' }); job.status = 'cancelled'; await job.save(); res.json(job) }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  completeJob: async (req,res)=>{
    try{ const job = await ServiceJob.findById(req.params.id); if(!job) return res.status(404).json({ message:'Not found' }); job.status = 'completed'; await job.save(); res.json(job) }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  }
}
