const mongoose = require("mongoose");

const ServiceJobSchema = new mongoose.Schema({
    bookingId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Booking", 
        required: true 
    },
    staffId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed", "cancelled"],
        default: "pending",
    },
    report: { type: String },
    photos: [{ type: String }],
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ServiceJob", ServiceJobSchema);
