const VehicleSchema = new Schema({
    vin: String,
    plate: String,
    model: String,
    make: String,
    year: Number,
    groupId: { type: ObjectId, ref: 'OwnershipGroup' },
    status: { type: String, enum: ['active', 'maintenance', 'sold', 'decommissioned'] },
    odometer: Number,
    lastServiceAt: Date
});