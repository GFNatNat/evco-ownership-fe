const express = require("express");
const router = express.Router();
const groupCtrl = require("../../controllers/groupController");

// CRUD
router.post("/", groupCtrl.createGroup);
router.get("/", groupCtrl.getGroups);
router.get("/:id", groupCtrl.getGroupById);
router.put("/:id", groupCtrl.updateGroup);
router.delete("/:id", groupCtrl.deleteGroup);

// Members
router.post("/:groupId/members", groupCtrl.addMember);
router.delete("/:groupId/members/:userId", groupCtrl.removeMember);
router.put("/:groupId/members/:userId/role", groupCtrl.setGroupAdmin);

// Ownership percentage
router.put("/:groupId/ownership", groupCtrl.updateOwnership);

// Voting
router.post("/:groupId/vote", groupCtrl.createVote);
router.get("/:groupId/votes", groupCtrl.getVotes);

// Fund
router.get("/:groupId/fund", groupCtrl.getGroupFund);
router.post("/:groupId/fund/topup", groupCtrl.topupFund);
router.post("/:groupId/fund/expense", groupCtrl.createFundExpense);

module.exports = router;
