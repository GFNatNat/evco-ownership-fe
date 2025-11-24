const UserSchema = new Schema({
    name: String,
    email: { type: String, unique: true, index: true },
    phone: String,
    passwordHash: String,
    roles: [{ type: String, enum: ['admin', 'staff', 'coowner'] }],
    verified: { type: Boolean, default: false },
    idDocs: { // CMND/CCCD, driver's license
        idType: String,
        idNumber: String,
        idFrontUrl: String,
        idBackUrl: String,
        licenseUrl: String,
        verifiedAt: Date,
        verifiedBy: { type: ObjectId, ref: 'User' }
    },
    wallet: {
        balance: { type: Number, default: 0 },
        lastTopupAt: Date
    },
    createdAt: Date,
    updatedAt: Date
});