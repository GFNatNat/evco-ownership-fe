const jwt = require('jsonwebtoken')
const RefreshToken = require('../models/RefreshToken')
const crypto = require('crypto')


const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt'
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '15m'
const REFRESH_EXPIRES = process.env.REFRESH_EXPIRES || '7d' // supports '7d', '24h', '30m'


function parseExpiry(v){
if(!v) return 7*24*3600*1000
if(typeof v === 'number') return v
if(v.endsWith('d')) return parseInt(v)*24*3600*1000
if(v.endsWith('h')) return parseInt(v)*3600*1000
if(v.endsWith('m')) return parseInt(v)*60*1000
return 7*24*3600*1000
}


function signAccess(user){
return jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: ACCESS_EXPIRES })
}


async function createRefreshToken(user){
const token = crypto.randomBytes(40).toString('hex')
const expiresAt = new Date(Date.now() + parseExpiry(REFRESH_EXPIRES))
const rt = await RefreshToken.create({ userId: user._id, token, expiresAt })
return token
}


async function revokeRefreshToken(token, replacedBy){
const rt = await RefreshToken.findOne({ token })
if(!rt) return null
rt.revoked = true
if(replacedBy) rt.replacedByToken = replacedBy
await rt.save()
return rt
}


async function verifyRefreshToken(token){
const rt = await RefreshToken.findOne({ token })
if(!rt) throw new Error('Invalid refresh token')
if(rt.revoked) throw new Error('Revoked')
if(rt.expiresAt && rt.expiresAt < new Date()) throw new Error('Expired')
return rt
}


module.exports = { signAccess, createRefreshToken, revokeRefreshToken, verifyRefreshToken }