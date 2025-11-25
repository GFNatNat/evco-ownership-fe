const express = require('express')
const router = express.Router()
const Booking = require('../models/Booking')
const Trip = require('../models/Trip')
const Group = require('../models/Group')
const ServiceJob = require('../models/ServiceJob')
const { auth } = require('../middleware/auth')

// staff-only routes
// require auth with role 'staff' or 'admin'
function staffAuth(req, res, next){
  return auth(['staff','admin'])(req,res,next)
}

// Check-in: create a Trip record linked to a booking
router.post('/checkin', staffAuth, async (req,res) => {
  try{
    const { bookingId, startOdometer, startPhotoUrl } = req.body
    const booking = await Booking.findById(bookingId)
    if(!booking) return res.status(404).json({ message: 'Booking not found' })

    const trip = await Trip.create({
      bookingId: booking._id,
      groupId: booking.groupId,
      userId: booking.userId,
      startAt: new Date(),
      startOdometer: startOdometer || null,
      startPhotoUrl: startPhotoUrl || null,
      status: 'ongoing'
    })

    // update booking status
    booking.status = 'approved'
    await booking.save()

    res.json({ ok:true, trip })
  }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
})

// Check-out: complete the Trip
router.post('/checkout', staffAuth, async (req,res)=>{
  try{
    const { bookingId, endOdometer, endPhotoUrl } = req.body
    const trip = await Trip.findOne({ bookingId, status: 'ongoing' })
    if(!trip) return res.status(404).json({ message:'Active trip not found' })

    trip.endAt = new Date()
    trip.endOdometer = endOdometer || trip.endOdometer
    trip.endPhotoUrl = endPhotoUrl || trip.endPhotoUrl
    trip.status = 'completed'
    await trip.save()

    // mark booking as completed
    await Booking.findByIdAndUpdate(bookingId, { status: 'completed' })

    res.json({ ok:true, trip })
  }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
})

// Services: create/list/update service jobs
// ServiceJob model: { groupId, vehicle, title, description, status, assignedTo, cost }
router.post('/services', staffAuth, async (req,res)=>{
  try{
    const payload = req.body
    const job = await ServiceJob.create({ ...payload, createdBy: req.user.id })
    res.json(job)
  }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
})

router.get('/services', staffAuth, async (req,res)=>{
  try{
    const q = {}
    if(req.query.groupId) q.groupId = req.query.groupId
    const list = await ServiceJob.find(q).sort({ createdAt: -1 }).limit(500)
    res.json(list)
  }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
})

router.put('/services/:id', staffAuth, async (req,res)=>{
  try{
    const job = await ServiceJob.findById(req.params.id)
    if(!job) return res.status(404).json({ message:'Not found' })
    Object.assign(job, req.body)
    await job.save()
    res.json(job)
  }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
})

// Disputes monitoring (simple list)
router.get('/disputes', staffAuth, async (req,res)=>{
  try{
    // dispute model could be created; for now we return placeholder
    const disputes = await (require('../models/Dispute') || { find: async ()=>[] }).find({}).limit(200)
    res.json(disputes)
  }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
})

module.exports = router