const UserSchema = new Schema({
    name: String,
    email: { type: String, unique: true, index: true },
    phone: String,
    password: String, // dùng cho Auth
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    resetOtp: String,
    resetOtpExpires: Date,
    otpVerified: { type: Boolean, default: false },
    refreshToken: String,
    expiresRefreshToken: Date,
    licenseNumber: String,
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
module.exports = mongoose.model('User', UserSchema)