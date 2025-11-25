const mongoose = require('mongoose')
const Schema = mongoose.Schema


const RefreshTokenSchema = new Schema({
userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
token: { type: String, required: true, index: true },
revoked: { type: Boolean, default: false },
createdAt: { type: Date, default: Date.now },
replacedByToken: { type: String },
expiresAt: { type: Date }
})


module.exports = mongoose.model('RefreshToken', RefreshTokenSchema)