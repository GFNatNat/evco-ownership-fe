const BookingSchema = new Schema({
    groupId: { type: ObjectId, ref: 'OwnershipGroup' },
    vehicleId: { type: ObjectId, ref: 'Vehicle' },
    userId: { type: ObjectId, ref: 'User' },
    startAt: Date,
    endAt: Date,
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'] },
    createdAt: Date,
    priorityScore: Number, // computed for fair scheduling
    usageEstimatedKm: Number
});