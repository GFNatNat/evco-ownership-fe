const OwnershipGroupSchema = new Schema({
    name: String,
    vehicleId: { type: ObjectId, ref: 'Vehicle' },
    members: [{
        userId: { type: ObjectId, ref: 'User' },
        share: { type: Number }, // percentage (sum = 100)
        role: { type: String, enum: ['member', 'groupAdmin'] }
    }],
    commonFund: {
        balance: { type: Number, default: 0 },
        transactions: [{ type: ObjectId, ref: 'FundTx' }]
    },
    createdAt: Date,
    settings: {
        schedulingRule: { type: String, enum: ['shareBased', 'usageBased', 'hybrid'], default: 'hybrid' },
        bookingWindowDays: { type: Number, default: 30 }
    }
});