require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const app = express()
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/evco', { useNewUrlParser:true, useUnifiedTopology:true })
  .then(()=>console.log('Mongo connected'))
  .catch(err=>console.error(err))

// Routes
const authRoutes = require('./routes/auth')
const groupRoutes = require('./routes/groups')
const costRoutes = require('./routes/costs')
const fileUploadRoutes = require('./routes/fileUpload')
const groupRoutes = require('./routes/group')
const licenseRoutes = require('./routes/license')
const paymentRoutes = require('./routes/payment')
const staffRoutes = require('./routes/staff')
const coownerRoutes = require('./routes/coowner')
const adminRoutes = require('./routes/admin')

app.use('/api/Auth', authRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/costs', costRoutes)
app.use('/api/FileUpload', fileUploadRoutes)
app.use('/api/group', groupRoutes)
app.use('/api/shared/license', licenseRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/staff', staffRoutes)
app.use('/api/coowner', coownerRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (req,res)=>res.json({ ok:true }))

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>console.log('Server listening on', PORT))