const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RefreshTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref:'User' },
  token: String, // store the token string or better: a hashed identifier
  revoked: { type:Boolean, default:false },
  createdAt: { type: Date, default: Date.now },
  replacedByToken: String,
  expiresAt: Date
})

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema)