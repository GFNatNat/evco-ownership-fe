const express = require("express");
const router = express.Router();
const userCtrl = require("../../controllers/userController");

// Auth
router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);

// User profile
router.get("/:id", userCtrl.getUserProfile);
router.put("/:id", userCtrl.updateUser);

// Upload documents
router.post("/:id/upload-id", userCtrl.uploadIdentityDocs);
router.post("/:id/upload-license", userCtrl.uploadDriverLicense);

// Role
router.get("/", userCtrl.getAllUsers);
router.put("/:id/role", userCtrl.updateRole);

// Get users by group
router.get("/group/:groupId", userCtrl.getUsersByGroup);

module.exports = router;
