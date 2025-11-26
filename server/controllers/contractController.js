import Contract from "../models/Contract.js";
import { writeAudit as wa2 } from "../utils/audit.js";

export const createContract = async (req, res, next) => {
  try {
    const payload = req.body; // parties, docUrl, groupId
    const c = await Contract.create(payload);
    await wa2({
      userId: req.user.id,
      action: "contract.create",
      entityType: "Contract",
      entityId: c._id,
      message: "Created contract",
      meta: payload,
      ip: req.ip,
    });
    res.status(201).json(c);
  } catch (err) {
    next(err);
  }
};

export const signContract = async (req, res, next) => {
  try {
    const c = await Contract.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "Not found" });
    c.signatures.push({
      userId: req.user.id,
      signedAt: new Date(),
      signatureUrl: req.body.signatureUrl,
      signatureMethod: req.body.signatureMethod || "e-sign",
    });
    // if all parties signed -> status signed
    if (
      c.parties.every((p) =>
        c.signatures.find((s) => s.userId.toString() === p.userId.toString())
      )
    )
      c.status = "signed";
    await c.save();
    await wa2({
      userId: req.user.id,
      action: "contract.sign",
      entityType: "Contract",
      entityId: c._id,
      message: "Signed contract",
      meta: null,
      ip: req.ip,
    });
    res.json(c);
  } catch (err) {
    next(err);
  }
};

export const getContract = async (req, res, next) => {
  try {
    const c = await Contract.findById(req.params.id);
    res.json(c);
  } catch (err) {
    next(err);
  }
};
