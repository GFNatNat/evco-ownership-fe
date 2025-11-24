require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Connect MongoDB
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/evco'
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Mongo connected'))
    .catch(err => console.error('Mongo err', err))

// Routes
const authRoutes = require('./routes/auth')
const groupRoutes = require('./routes/groups')
const costRoutes = require('./routes/costs')
const fileUploadRoutes = require('./routes/fileUpload')
const groupRoutes = require('./routes/group')
const licenseRoutes = require('./routes/license')
const paymentRoutes = require('./routes/payment')

app.use('/api/Auth', authRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/costs', costRoutes)
app.use('/api/FileUpload', fileUploadRoutes)
app.use('/api/group', groupRoutes)
app.use('/api/shared/license', licenseRoutes)
app.use('/api/payment', paymentRoutes)

app.get('/', (req, res) => res.send({ ok: true }))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server listening ${PORT}`))