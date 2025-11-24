const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const bcrypt = require('bcryptjs')

const User = require('../models/User')
const Group = require('../models/Group')
const Booking = require('../models/Booking')
const Cost = require('../models/Cost')
const RefreshToken = require('../models/RefreshToken')

async function run(){
  await mongoose.connect(process.env.MONGO_URI)
  await User.deleteMany(); await Group.deleteMany(); await Booking.deleteMany(); await Cost.deleteMany(); await RefreshToken.deleteMany()

  const pass = await bcrypt.hash('123456', 10)
  const admin = await User.create({ name:'Admin', email:'admin@ev.co', password:pass, role:'admin' })
  const staff = await User.create({ name:'Staff', email:'staff@ev.co', password:pass, role:'staff' })
  const a = await User.create({ name:'Lưu Bảo', email:'bao@ev.co', password:pass, role:'coowner' })
  const b = await User.create({ name:'Minh', email:'minh@ev.co', password:pass, role:'coowner' })
  const c = await User.create({ name:'Hà', email:'ha@ev.co', password:pass, role:'coowner' })

  const group = await Group.create({ name:'VF8 Shared Group', vehicle:{model:'VF8',plate:'30A-123.45',odometer:12000}, members:[ { userId: a._id, share:40, role:'groupAdmin' }, { userId: b._id, share:30, role:'member' }, { userId: c._id, share:30, role:'member' } ], commonFund:{ balance:2000000 } })

  const now = new Date()
  const yesterday = new Date(now.getTime() - 24*3600*1000)
  await Booking.create({ groupId: group._id, userId: a._id, startAt: new Date(yesterday.getTime()+9*3600*1000), endAt: new Date(yesterday.getTime()+11*3600*1000), status:'approved' })
  await Cost.create({ groupId: group._id, type:'charging', amount:500000, incurredAt: new Date(), splitMethod:'byShare', splitDetail:[ { userId: a._id, amount:200000 }, { userId: b._id, amount:150000 }, { userId: c._id, amount:150000 } ], status:'approved', createdBy: staff._id })

  console.log('Seed completed')
  process.exit(0)
}

run().catch(e=>{ console.error(e); process.exit(1) })