const TripSchema = new Schema({
    bookingId: { type: ObjectId, ref: 'Booking' },
    startOdometer: Number,
    endOdometer: Number,
    startAt: Date,
    endAt: Date,
    notes: String,
    charges: [{ type: ObjectId, ref: 'Cost' }],
    checkInBy: { type: ObjectId, ref: 'User' },
    checkOutBy: { type: ObjectId, ref: 'User' }
});