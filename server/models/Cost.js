const CostSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref:'Group' },
  type: String,
  amount: Number,
  incurredAt: Date,
  splitMethod: { type: String, enum:['byShare','byUsage','hybrid','custom'], default:'byShare' },
  splitDetail: [{ userId: Schema.Types.ObjectId, amount: Number, paid: { type:Boolean, default:false }, paidAt: Date, paymentRef: String }],
  createdBy: { type: Schema.Types.ObjectId, ref:'User' },
  status: { type: String, enum:['pending','approved','rejected'], default: 'pending' },
  approvals: [{ userId: Schema.Types.ObjectId, decision: String, at: Date }] // for majority/unanimous workflows
}, { timestamps:true })
