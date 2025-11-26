// src/models/Vote.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const VoteItemSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    option: String,
    weight: Number,
  },
  { _id: false }
);

const VoteSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "OwnershipGroup",
      required: true,
    },

    title: String,
    description: String,

    options: [String],

    startAt: Date,
    endAt: Date,

    votes: [VoteItemSchema],
  },
  {
    timestamps: true,
  }
);

const Vote = mongoose.model("Vote", VoteSchema);
export default Vote;
