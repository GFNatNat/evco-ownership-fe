const Vehicle = require('../models/Vehicle') || null
const Group = require('../models/Group')

module.exports = {
  createVehicle: async (req,res)=>{
    try{
      const v = await (Vehicle.create ? Vehicle.create(req.body) : null)
      res.json(v)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  getVehicles: async (req,res)=>{
    try{
      const list = await (Vehicle.find ? Vehicle.find({}).limit(500) : [])
      res.json(list)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  getVehicleById: async (req,res)=>{
    try{ const v = await (Vehicle.findById ? Vehicle.findById(req.params.id) : null); if(!v) return res.status(404).json({ message:'Not found' }); res.json(v) }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  updateVehicle: async (req,res)=>{
    try{ const v = await (Vehicle.findByIdAndUpdate ? Vehicle.findByIdAndUpdate(req.params.id, req.body, { new:true }) : null); res.json(v) }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  deleteVehicle: async (req,res)=>{ try{ if(Vehicle.deleteOne) await Vehicle.findByIdAndDelete(req.params.id); res.json({ ok:true }) }catch(e){ console.error(e); res.status(500).json({ message: e.message }) } },
  assignVehicleToGroup: async (req,res)=>{
    try{
      const { vehicleId, groupId } = req.params
      const g = await Group.findById(groupId)
      if(!g) return res.status(404).json({ message:'Group not found' })
      // update group.vehicle
      g.vehicle = g.vehicle || {}
      g.vehicle._id = vehicleId
      await g.save()
      res.json(g)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  },
  checkIn: async (req,res)=>{
    res.status(501).json({ message:'use staff/checkin endpoint' })
  },
  checkOut: async (req,res)=>{
    res.status(501).json({ message:'use staff/checkout endpoint' })
  },
  uploadConditionImages: async (req,res)=>{
    if(!req.file) return res.status(400).json({ message:'No file' })
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    res.json({ ok:true, url })
  },
  getUsageHistory: async (req,res)=>{
    try{
      const Trip = require('../models/Trip')
      const list = await Trip.find({ groupId: req.params.vehicleId }).sort({ startAt:-1 }).limit(200)
      res.json(list)
    }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
  }
}
