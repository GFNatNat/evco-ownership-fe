const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SplitDetailSchema = new Schema({ 
  userId: Schema.Types.ObjectId, 
  amount: Number, 
  paid: { type:Boolean, default:false }, 
  paidAt: Date, 
  paymentRef: String 
})
const CostSchema = new Schema({ 
  groupId:{type:Schema.Types.ObjectId, ref:'Group'}, 
  type:String, 
  amount:Number, 
  incurredAt:Date, 
  splitMethod:String, 
  splitDetail:[SplitDetailSchema], 
  createdBy:{type:Schema.Types.ObjectId, ref:'User'}, 
  status:{
    type:String, 
    enum:['pending','approved','rejected'], 
    default:'pending'
  }, 
  approvals:[{ 
    userId: Schema.Types.ObjectId, 
    decision:String, 
    at:Date 
  }], 
  createdAt:{type:Date, default:Date.now} 
})
module.exports = mongoose.model('Cost', CostSchema)
