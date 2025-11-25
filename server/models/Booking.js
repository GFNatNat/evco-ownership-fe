const mongoose = require('mongoose')
const Schema = mongoose.Schema
const BookingSchema = new Schema({ 
    groupId:{type:Schema.Types.ObjectId,ref:'Group'}, 
    userId:{type:Schema.Types.ObjectId,ref:'User'}, 
    startAt:Date, 
    endAt:Date, 
    status:{
        type:String, 
        enum:['pending','approved','rejected','cancelled','completed'], 
        default:'pending'}, 
        createdAt:{type:Date, default:Date.now} 
    })
module.exports = mongoose.model('Booking', BookingSchema)