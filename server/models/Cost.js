const CostSchema = new Schema({
    groupId: { type: ObjectId, ref: 'OwnershipGroup' },
    vehicleId: { type: ObjectId, ref: 'Vehicle' },
    type: { type: String, enum: ['charging', 'maintenance', 'insurance', 'registration', 'cleaning', 'other'] },
    amount: Number,
    incurredAt: Date,
    createdBy: { type: ObjectId, ref: 'User' },
    splitMethod: { type: String, enum: ['byShare', 'byUsage', 'custom'], default: 'byShare' },
    splitDetail: [{ userId: ObjectId, amount: Number }],
    paid: { type: Boolean, default: false },
    paymentRef: String
});