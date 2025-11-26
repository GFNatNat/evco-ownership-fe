import Dispute from "../models/Dispute.js";

export const getAllGroups = async (req, res) => {
  try {
    const g = await Group.find();
    res.json(g);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resolveDispute = async (req, res) => {
  try {
    const dispute = await Dispute.findByIdAndUpdate(
      req.params.id,
      { status: "resolved" },
      { new: true }
    );
    res.json(dispute);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
