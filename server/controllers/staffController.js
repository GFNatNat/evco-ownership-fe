// controllers/staffController.js
import * as GroupC from "./groupController.js";
import * as ContractC from "./contractController.js";
import * as DisputeC from "./disputeController.js";
import * as CheckinC from "./checkinController.js";
import * as VehicleC from "./vehicleController.js";
import * as ReportC from "./reportController.js";

export const StaffController = {
  // ---- GROUP MANAGEMENT (restricted) ----
  createGroup: GroupC.createGroup,
  updateGroup: GroupC.updateGroup,
  addMember: GroupC.addMember,
  removeMember: GroupC.removeMember,
  getGroupDetails: GroupC.getGroupDetails,

  // ---- CONTRACT MANAGEMENT ----
  createContract: ContractC.createContract,
  signContract: ContractC.signContract,
  getContract: ContractC.getContract,

  // ---- VEHICLE MANAGEMENT (no delete) ----
  createVehicle: VehicleC.createVehicle,
  updateVehicle: VehicleC.updateVehicle,
  getAllVehicles: VehicleC.getAllVehicles,
  getVehicleById: VehicleC.getVehicleById,

  // ---- CHECKIN / CHECKOUT ----
  generateQRCode: CheckinC.generateQRCode,
  checkInVehicle: CheckinC.checkInVehicle,
  checkOutVehicle: CheckinC.checkOutVehicle,
  getCheckinHistory: CheckinC.getCheckinHistory,

  // ---- DISPUTE (restricted) ----
  createDispute: DisputeC.createDispute,
  updateDispute: DisputeC.updateDispute,
  getAllDisputes: DisputeC.getAllDisputes,
  getDisputeById: DisputeC.getDisputeById,

  // ---- REPORT ACCESS ----
  generateFinancialReport: ReportC.generateFinancialReport,
  generateUsageReport: ReportC.generateUsageReport,
};
