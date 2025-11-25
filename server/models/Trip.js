const mongoose = require('mongoose')
const Schema = mongoose.Schema


const TripSchema = new Schema({
groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
startAt: Date,
endAt: Date,
startOdometer: Number,
endOdometer: Number,
startPhotoUrl: String,
endPhotoUrl: String,
notes: String,
createdAt: { type: Date, default: Date.now }
})


module.exports = mongoose.model('Trip', TripSchema)