const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads')
if(!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, UPLOAD_DIR) },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`
    cb(null, name)
  }
})
const upload = multer({ storage })

// KYC upload (protected: user must be authenticated)
const { auth } = require('../middleware/auth')
router.post('/kyc', auth(), upload.single('file'), async (req,res)=>{
  try{
    if(!req.file) return res.status(400).json({ message:'No file' })
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    // optionally associate with user record
    // const User = require('../models/User'); await User.findByIdAndUpdate(req.user.id, { kycUrl: url })
    res.json({ ok:true, url })
  }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
})

// generic file upload (staff/admin) for service photos
router.post('/service', auth(['staff','admin']), upload.single('file'), async (req,res)=>{
  try{
    if(!req.file) return res.status(400).json({ message:'No file' })
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    res.json({ ok:true, url })
  }catch(e){ console.error(e); res.status(500).json({ message: e.message }) }
})

module.exports = router
