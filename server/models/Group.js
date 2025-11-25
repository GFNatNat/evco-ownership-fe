const mongoose = require('mongoose')
const Schema = mongoose.Schema
const MemberSchema = new Schema({ 
    userId: { type: Schema.Types.ObjectId, ref: 'User' }, 
    share: Number, 
    role: { type: String, enum: ['groupAdmin','member'], default:'member' } 
})
const GroupSchema = new Schema({ 
    name: String, 
    vehicle: { 
        model:String, 
        plate:String, 
        odometer:Number }, 
        members: [MemberSchema], 
        commonFund: { balance:Number, default:0 }, 
        createdAt:{type:Date, default:Date.now} 
    })
module.exports = mongoose.model('Group', GroupSchema)
