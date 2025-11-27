// controllers/adminController.js
import * as GroupC from "./groupController.js";
import * as ContractC from "./contractController.js";
import * as DisputeC from "./disputeController.js";
import * as ReportC from "./reportController.js";
import * as VehicleC from "./vehicleController.js";

export const AdminController = {
  // ---- GROUP MANAGEMENT ----
  createGroup: GroupC.createGroup,
  updateGroup: GroupC.updateGroup,
  deleteGroup: GroupC.deleteGroup,
  addMember: GroupC.addMember,
  removeMember: GroupC.removeMember,
  getGroupDetails: GroupC.getGroupDetails,
  getGroupFund: GroupC.getGroupFund,
  updateGroupFund: GroupC.updateGroupFund,

  // ---- CONTRACT MANAGEMENT ----
  createContract: ContractC.createContract,
  signContract: ContractC.signContract,
  getContract: ContractC.getContract,

  // ---- VEHICLE MANAGEMENT ----
  createVehicle: VehicleC.createVehicle,
  updateVehicle: VehicleC.updateVehicle,
  deleteVehicle: VehicleC.deleteVehicle,
  getAllVehicles: VehicleC.getAllVehicles,
  getVehicleById: VehicleC.getVehicleById,

  // ---- DISPUTE MANAGEMENT ----
  createDispute: DisputeC.createDispute,
  updateDispute: DisputeC.updateDispute,
  resolveDispute: DisputeC.resolveDispute,
  getAllDisputes: DisputeC.getAllDisputes,
  getDisputeById: DisputeC.getDisputeById,

  // ---- REPORTS ----
  generateFinancialReport: ReportC.generateFinancialReport,
  generateUsageReport: ReportC.generateUsageReport,
};
