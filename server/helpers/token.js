const jwt = require('jsonwebtoken')
const RefreshToken = require('../models/RefreshToken')
const crypto = require('crypto')

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh'
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '15m'
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || '7d'

function signAccess(user) {
  return jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: ACCESS_EXPIRES })
}

function signRefresh(user) {
  // create a random id for token storage
  const token = crypto.randomBytes(40).toString('hex')
  const expires = new Date(Date.now() + (parseExpiry(REFRESH_EXPIRES)))
  const rt = new RefreshToken({ userId: user._id, token, expiresAt: expires })
  return rt.save().then(()=>token)
}

function parseExpiry(v) {
  // supports '7d' or milliseconds number
  if (typeof v === 'number') return v
  if (v.endsWith('d')) return parseInt(v)*24*3600*1000
  if (v.endsWith('h')) return parseInt(v)*3600*1000
  if (v.endsWith('m')) return parseInt(v)*60*1000
  return 7*24*3600*1000
}

async function verifyRefresh(token) {
  const rt = await RefreshToken.findOne({ token })
  if (!rt || rt.revoked) throw new Error('Invalid refresh token')
  if (rt.expiresAt && rt.expiresAt < new Date()) throw new Error('Expired')
  return rt
}

module.exports = { signAccess, signRefresh, verifyRefresh }