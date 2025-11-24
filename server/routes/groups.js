const express = require('express')
const router = express.Router()
const Group = require('../models/Group')
const { auth } = require('../middleware/auth')

// list groups
router.get('/', auth(), async (req,res)=>{
  const groups = await Group.find().limit(200)
  res.json(groups)
})

// create group
router.post('/', auth(['admin','staff']), async (req,res)=>{
  const g = await Group.create(req.body)
  res.json(g)
})

module.exports = router