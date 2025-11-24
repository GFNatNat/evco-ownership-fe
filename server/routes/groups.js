const express = require('express')
const router = express.Router()
const Group = require('../models/Group')
const Booking = require('../models/Booking')
const mongoose = require('mongoose')

// List groups (for demo we return sample if none)
router.get('/', async (req, res) => {
    const groups = await Group.find().limit(50)
    if (!groups.length) {
        // return demo
        return res.json([{ id: 'demo', name: 'Demo Group', vehicle: { model: 'VF8', plate: '30A-000.00', odometer: 12000 }, members: [] }])
    }
    res.json(groups)
})