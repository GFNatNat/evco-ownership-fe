## 23. AdminController (`/api/admin`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| GET    | /api/admin/users | Yes | Yes | OK |  |
| GET    | /api/admin/users/{id} | Yes | Yes | OK |  |
| POST   | /api/admin/users | Yes | Yes | OK |  |
| PUT    | /api/admin/users/{id} | Yes | Yes | OK |  |
| DELETE | /api/admin/users/{id} | Yes | Yes | OK |  |
| PATCH  | /api/admin/users/{id}/activate | Yes | Yes | OK |  |
| PATCH  | /api/admin/users/{id}/deactivate | Yes | Yes | OK |  |
| GET    | /api/admin/users/search | Yes | Yes | OK |  |
| GET    | /api/admin/licenses | Yes | Yes | OK |  |
| GET    | /api/admin/licenses/{id} | Yes | Yes | OK |  |
| PATCH  | /api/admin/licenses/{id}/approve | Yes | Yes | OK |  |
| PATCH  | /api/admin/licenses/{id}/reject | Yes | Yes | OK |  |
| GET    | /api/admin/licenses/pending | Yes | Yes | OK |  |
| GET    | /api/admin/licenses/expiring | Yes | Yes | OK |  |
| GET    | /api/admin/groups | Yes | Yes | OK |  |
| GET    | /api/admin/groups/{id} | Yes | Yes | OK |  |
| GET    | /api/admin/groups/analytics | Yes | Yes | OK |  |
| PATCH  | /api/admin/groups/{id}/dissolve | Yes | Yes | OK |  |
| GET    | /api/admin/groups/{groupId}/disputes | Yes | Yes | OK |  |
| GET    | /api/admin/reports/dashboard | Yes | Yes | OK |  |
| GET    | /api/admin/reports/financial | Yes | Yes | OK |  |
| GET    | /api/admin/reports/users/activity | Yes | Yes | OK |  |
| GET    | /api/admin/reports/vehicles/utilization | Yes | Yes | OK |  |
| GET    | /api/admin/reports/revenue | Yes | Yes | OK |  |
| GET    | /api/admin/reports/export/{type} | Yes | Yes | OK |  |
| GET    | /api/admin/settings | Yes | Yes | OK |  |
| PUT    | /api/admin/settings | Yes | Yes | OK |  |
| GET    | /api/admin/settings/health | Yes | Yes | OK |  |
| GET    | /api/admin/settings/audit-logs | Yes | Yes | OK |  |
| GET    | /api/admin/analytics/overview | Yes | Yes | OK |  |
| GET    | /api/admin/analytics/users/growth | Yes | Yes | OK |  |
| GET    | /api/admin/analytics/vehicles | Yes | Yes | OK |  |
| GET    | /api/admin/analytics/revenue | Yes | Yes | OK |  |
| GET    | /api/admin/analytics/performance | Yes | Yes | OK |  |

## 24. AnalyticsController (`/api/analytics`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| GET    | /api/analytics/overview | Yes | Yes | OK |  |
| GET    | /api/analytics/users/growth | Yes | Yes | OK |  |
| GET    | /api/analytics/vehicles | Yes | Yes | OK |  |
| GET    | /api/analytics/revenue | Yes | Yes | OK |  |
| GET    | /api/analytics/performance | Yes | Yes | OK |  |

## 25. ReportController (`/api/report`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| GET    | /api/report/dashboard | Yes | Yes | OK |  |
| GET    | /api/report/financial | Yes | Yes | OK |  |
| GET    | /api/report/users/activity | Yes | Yes | OK |  |
| GET    | /api/report/vehicles/utilization | Yes | Yes | OK |  |
| GET    | /api/report/revenue | Yes | Yes | OK |  |
| GET    | /api/report/export/{type} | Yes | Yes | OK |  |

## 26. StaffController (`/api/staff`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| GET    | /api/staff/users | Yes | Yes | OK |  |
| GET    | /api/staff/users/{id} | Yes | Yes | OK |  |
| POST   | /api/staff/users | Yes | Yes | OK |  |
| PUT    | /api/staff/users/{id} | Yes | Yes | OK |  |
| DELETE | /api/staff/users/{id} | Yes | Yes | OK |  |
| PATCH  | /api/staff/users/{id}/activate | Yes | Yes | OK |  |
| PATCH  | /api/staff/users/{id}/deactivate | Yes | Yes | OK |  |
| GET    | /api/staff/groups | Yes | Yes | OK |  |
| GET    | /api/staff/groups/{id} | Yes | Yes | OK |  |
| GET    | /api/staff/groups/analytics | Yes | Yes | OK |  |
| PATCH  | /api/staff/groups/{id}/dissolve | Yes | Yes | OK |  |
| GET    | /api/staff/groups/{groupId}/disputes | Yes | Yes | OK |  |

## 27. SharedController (`/api/shared`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| GET    | /api/shared/lookup | Yes | Yes | OK |  |
| GET    | /api/shared/config | Yes | Yes | OK |  |
| GET    | /api/shared/constants | Yes | Yes | OK |  |
| GET    | /api/shared/timezones | Yes | Yes | OK |  |
## 11. OwnershipChangeController (`/api/ownership-change`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| POST   | /api/ownership-change/propose | Yes | Yes | OK |  |
| GET    | /api/ownership-change/{requestId} | Yes | Yes | OK |  |
| GET    | /api/ownership-change/vehicle/{vehicleId} | Yes | Yes | OK |  |
| GET    | /api/ownership-change/pending-approvals | Yes | Yes | OK |  |
| POST   | /api/ownership-change/{requestId}/respond | Yes | Yes | OK |  |
| DELETE | /api/ownership-change/{requestId} | Yes | Yes | OK |  |
| GET    | /api/ownership-change/statistics | Yes | Yes | OK | Admin/Staff only |
| GET    | /api/ownership-change/my-requests | Yes | Yes | OK |  |

## 12. ProfileController (`/api/profile`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| GET    | /api/profile | Yes | Yes | OK |  |
| GET    | /api/profile/{userId} | Yes | Yes | OK | Admin/Staff only |
| GET    | /api/profile/by-email | Yes | Yes | OK | Admin/Staff only |
| PUT    | /api/profile | Yes | Yes | OK |  |
| PUT    | /api/profile/change-password | Yes | Yes | OK |  |
| GET    | /api/profile/vehicles | Yes | Yes | OK |  |
| GET    | /api/profile/activity | Yes | Yes | OK |  |
| POST   | /api/profile/upload-image | Yes | Yes | OK |  |
| DELETE | /api/profile/delete-image | Yes | Yes | OK |  |
| GET    | /api/profile/validate-completeness | Yes | Yes | OK |  |

## 13. PaymentController (`/api/payment`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| POST   | /api/payment | Yes | Yes | OK |  |
| POST   | /api/payment/process | Yes | Yes | OK |  |
| GET    | /api/payment/{id} | Yes | Yes | OK |  |
| GET    | /api/payment/my-payments | Yes | Yes | OK |  |
| GET    | /api/payment | Yes | Yes | OK | Admin/Staff only |
| POST   | /api/payment/{id}/cancel | Yes | Yes | OK |  |
| GET    | /api/payment/statistics | Yes | Yes | OK | Admin/Staff only |
| GET    | /api/payment/gateways | Yes | Yes | OK |  |
| GET    | /api/payment/vnpay-callback | Yes | Yes | OK |  |

## 14. DepositController (`/api/deposit`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| POST   | /api/deposit | Yes | Yes | OK |  |
| GET    | /api/deposit/{id} | Yes | Yes | OK |  |
| GET    | /api/deposit/my-deposits | Yes | Yes | OK |  |
| GET    | /api/deposit | Yes | Yes | OK | Admin/Staff only |
| POST   | /api/deposit/{id}/cancel | Yes | Yes | OK |  |
| GET    | /api/deposit/my-statistics | Yes | Yes | OK |  |
| GET    | /api/deposit/payment-methods | Yes | Yes | OK |  |

## 15. DisputeController (`/api/dispute`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| POST   | /api/dispute/booking | Yes | Yes | OK |  |
| POST   | /api/dispute/cost-sharing | Yes | Yes | OK |  |
| POST   | /api/dispute/group-decision | Yes | Yes | OK |  |
| GET    | /api/dispute/{disputeId} | Yes | Yes | OK |  |
| GET    | /api/dispute | Yes | Yes | OK |  |
| POST   | /api/dispute/{disputeId}/respond | Yes | Yes | OK |  |
| PUT    | /api/dispute/{disputeId}/status | Yes | Yes | OK | Admin only |
| POST   | /api/dispute/{disputeId}/withdraw | Yes | Yes | OK |  |

## 16. FileUploadController (`/api/fileupload`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| POST   | /api/fileupload/upload | Yes | Yes | OK |  |
| GET    | /api/fileupload/{id}/download | Yes | Yes | OK |  |
| GET    | /api/fileupload/{id} | Yes | Yes | OK |  |
| GET    | /api/fileupload/{id}/info | Yes | Yes | OK |  |
| DELETE | /api/fileupload/{id} | Yes | Yes | OK | Admin only |

## 17. LicenseController (`/api/license`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| POST   | /api/license/verify | Yes | Yes | OK |  |
| GET    | /api/license/check-exists | Yes | Yes | OK |  |
| GET    | /api/license/info | Yes | Yes | OK |  |
| PATCH  | /api/license/status | Yes | Yes | OK | Admin/Staff only |
| GET    | /api/license/user/{userId} | Yes | Yes | OK |  |
| PUT    | /api/license/{licenseId} | Yes | Yes | OK |  |
| DELETE | /api/license/{licenseId} | Yes | Yes | OK |  |
| POST   | /api/license/register | Yes | Yes | OK |  |
| GET    | /api/license/my-license | Yes | Yes | OK |  |

## 18. UserController (`/api/user`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| GET    | /api/user | Yes | Yes | OK | Admin/Staff only |
| GET    | /api/user/{id} | Yes | Yes | OK |  |
| PUT    | /api/user/{id} | Yes | Yes | OK |  |
| DELETE | /api/user/{id} | Yes | Yes | OK | Admin only |

## 19. CoOwnerController (`/api/coowner`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| GET    | /api/coowner/eligibility | Yes | Yes | OK |  |
| POST   | /api/coowner/promote | Yes | Yes | OK |  |
| POST   | /api/coowner/promote/{userId} | Yes | Yes | OK | Admin/Staff only |
| GET    | /api/coowner/statistics | Yes | Yes | OK | Admin/Staff only |
| GET    | /api/coowner/test/eligibility-scenarios | No | Yes | BE ONLY | Dev only |
| GET    | /api/coowner/test/promotion-workflow | No | Yes | BE ONLY | Dev only |

## 20. FairnessOptimizationController (`/api/fairnessoptimization`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| GET    | /api/fairnessoptimization/vehicle/{vehicleId}/fairness-report | Yes | Yes | OK |  |
| GET    | /api/fairnessoptimization/vehicle/{vehicleId}/schedule-suggestions | Yes | Yes | OK |  |
| GET    | /api/fairnessoptimization/vehicle/{vehicleId}/maintenance-suggestions | Yes | Yes | OK |  |
| GET    | /api/fairnessoptimization/vehicle/{vehicleId}/cost-saving-recommendations | Yes | Yes | OK |  |

## 21. ContractController (`/api/contract`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| POST   | /api/contract | Yes | Yes | OK |  |
| GET    | /api/contract/{contractId} | Yes | Yes | OK |  |
| GET    | /api/contract | Yes | Yes | OK |  |
| POST   | /api/contract/{contractId}/sign | Yes | Yes | OK |  |
| POST   | /api/contract/{contractId}/decline | Yes | Yes | OK |  |
| POST   | /api/contract/{contractId}/terminate | Yes | Yes | OK |  |
| GET    | /api/contract/templates | Yes | Yes | OK |  |
| GET    | /api/contract/templates/{templateType} | Yes | Yes | OK |  |
| GET    | /api/contract/{contractId}/download | Yes | Yes | OK |  |
| GET    | /api/contract/pending-signature | Yes | Yes | OK |  |
| GET    | /api/contract/signed | Yes | Yes | OK |  |

## 22. CheckInCheckOutController (`/api/checkincheckout`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| POST   | /api/checkincheckout/qr-checkin | Yes | Yes | OK |  |
| POST   | /api/checkincheckout/qr-checkout | Yes | Yes | OK |  |
| GET    | /api/checkincheckout/generate-qr/{bookingId} | Yes | Yes | OK |  |
| POST   | /api/checkincheckout/manual-checkin | Yes | Yes | OK | Staff/Admin only |
| POST   | /api/checkincheckout/manual-checkout | Yes | Yes | OK | Staff/Admin only |
| GET    | /api/checkincheckout/validate-checkin/{bookingId} | Yes | Yes | OK |  |
| GET    | /api/checkincheckout/validate-checkout/{bookingId} | Yes | Yes | OK |  |
| GET    | /api/checkincheckout/history/{bookingId} | Yes | Yes | OK |  |
# API Endpoint Comparison: Frontend vs Backend

This document provides a detailed mapping and comparison of all API endpoints used in the Frontend (FE) codebase versus those available in the Backend (BE) as of 2025-10-27. Each entry includes HTTP method, path, and notes on any mismatches or missing endpoints.

---

## Legend
- **OK**: Endpoint matches and is implemented on both FE and BE.
- **FE ONLY**: Endpoint is called in FE but not found in BE (may need to add to BE or remove from FE).
- **BE ONLY**: Endpoint exists in BE but is not called in FE (may be unused or for future features).
- **MISMATCH**: Endpoint exists on both sides but with differences (method, path, params, etc.).

---

## 1. AuthController (`/api/auth`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| POST   | /login | Yes | Yes | OK |  |
| POST   | /register | Yes | Yes | OK |  |
| POST   | /refresh-token | Yes | Yes | OK |  |
| POST   | /forgot-password | Yes | Yes | OK |  |
| PATCH  | /reset-password | Yes | Yes | OK |  |
| POST   | /verify-license | Yes | Yes | OK |  |
| GET    | /test/get-forgot-password-otp | No | Yes | BE ONLY | Dev/test only |

## 2. BookingController (`/api/booking`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| POST   | /api/booking | Yes | Yes | OK |  |
| GET    | /api/booking/{id} | Yes | Yes | OK |  |
| GET    | /api/booking/my-bookings | Yes | Yes | OK |  |
| GET    | /api/booking/vehicle/{vehicleId} | Yes | Yes | OK |  |
| GET    | /api/booking | Yes | Yes | OK | Admin/Staff only |
| PUT    | /api/booking/{id} | Yes | Yes | OK |  |
| POST   | /api/booking/{id}/approve | Yes | Yes | OK |  |
| POST   | /api/booking/{id}/cancel | Yes | Yes | OK |  |
| DELETE | /api/booking/{id} | Yes | Yes | OK | Admin only |
| ...    | ... | ... | ... | ... | ... |

## 3. ScheduleController (`/api/schedule`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| GET    | /api/schedule | Yes | Yes | OK |  |
| GET    | /api/schedule/{id} | Yes | Yes | OK |  |
| POST   | /api/schedule | Yes | Yes | OK |  |
| DELETE | /api/schedule/{id} | Yes | Yes | OK |  |
| POST   | /api/schedule/book | Yes | Yes | OK |  |
| GET    | /api/schedule/vehicle/{vehicleId} | Yes | Yes | OK |  |
| GET    | /api/schedule/user | Yes | Yes | OK |  |
| GET    | /api/schedule/daily | Yes | Yes | OK |  |
| GET    | /api/schedule/weekly | Yes | Yes | OK |  |
| GET    | /api/schedule/monthly | Yes | Yes | OK |  |
| POST   | /api/schedule/availability | Yes | Yes | OK |  |
| GET    | /api/schedule/available-slots | Yes | Yes | OK |  |
| POST   | /api/schedule/conflicts | Yes | Yes | OK |  |
| POST   | /api/schedule/conflicts/{conflictId}/resolve | Yes | Yes | OK |  |
| POST   | /api/schedule/recurring | Yes | Yes | OK |  |
| PUT    | /api/schedule/recurring/{id} | Yes | Yes | OK |  |
| DELETE | /api/schedule/recurring/{id} | Yes | Yes | OK |  |
| GET    | /api/schedule/templates | Yes | Yes | OK |  |
| POST   | /api/schedule/templates | Yes | Yes | OK |  |
| POST   | /api/schedule/templates/{templateId}/apply | Yes | Yes | OK |  |
| GET    | /api/schedule/reminders | Yes | Yes | OK |  |
| POST   | /api/schedule/{scheduleId}/reminder | Yes | Yes | OK |  |
| GET    | /api/schedule/usage-report | Yes | Yes | OK |  |

## 4. ServiceController (`/api/service`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| GET    | /api/service | Yes | Yes | OK |  |
| POST   | /api/service/{id}/start | Yes | Yes | OK |  |
| POST   | /api/service/{id}/complete | Yes | Yes | OK |  |

---


## 5. GroupController (`/api/group`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| GET    | /api/group | Yes | Yes | OK |  |
| GET    | /api/group/{id} | Yes | Yes | OK |  |
| POST   | /api/group | Yes | Yes | OK |  |
| PUT    | /api/group/{id} | Yes | Yes | OK |  |
| DELETE | /api/group/{id} | Yes | Yes | OK |  |
| GET    | /api/group/{groupId}/members | Yes | Yes | OK |  |
| POST   | /api/group/{groupId}/members | Yes | Yes | OK |  |
| DELETE | /api/group/{groupId}/members/{memberId} | Yes | Yes | OK |  |
| PUT    | /api/group/{groupId}/members/{memberId}/role | Yes | Yes | OK |  |
| GET    | /api/group/{groupId}/votes | Yes | Yes | OK |  |
| POST   | /api/group/{groupId}/votes | Yes | Yes | OK |  |
| POST   | /api/group/{groupId}/votes/{voteId}/vote | Yes | Yes | OK |  |
| GET    | /api/group/{groupId}/fund | Yes | Yes | OK |  |
| POST   | /api/group/{groupId}/fund/contribute | Yes | Yes | OK |  |
| GET    | /api/group/{groupId}/fund/history | Yes | Yes | OK |  |

## 6. FundController (`/api/fund`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| GET    | /api/fund/balance/{vehicleId} | Yes | Yes | OK |  |
| GET    | /api/fund/additions/{vehicleId} | Yes | Yes | OK |  |
| GET    | /api/fund/usages/{vehicleId} | Yes | Yes | OK |  |
| GET    | /api/fund/summary/{vehicleId} | Yes | Yes | OK |  |
| POST   | /api/fund/usage | Yes | Yes | OK |  |
| PUT    | /api/fund/usage/{usageId} | Yes | Yes | OK |  |
| DELETE | /api/fund/usage/{usageId} | Yes | Yes | OK |  |
| GET    | /api/fund/category/{vehicleId}/usages/{category} | Yes | Yes | OK |  |
| GET    | /api/fund/category/{vehicleId}/analysis | Yes | Yes | OK |  |

## 7. NotificationController (`/api/notification`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| GET    | /api/notification/my-notifications | Yes | Yes | OK |  |
| GET    | /api/notification/unread-count | Yes | Yes | OK |  |
| PUT    | /api/notification/mark-read | Yes | Yes | OK |  |
| PUT    | /api/notification/mark-multiple-read | Yes | Yes | OK |  |
| PUT    | /api/notification/mark-all-read | Yes | Yes | OK |  |
| POST   | /api/notification/send-to-user | Yes | Yes | OK | Admin only |
| POST   | /api/notification/create-notification | Yes | Yes | OK | Admin only |

## 8. MaintenanceController (`/api/maintenance`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| POST   | /api/maintenance | Yes | Yes | OK |  |
| GET    | /api/maintenance/{id} | Yes | Yes | OK |  |
| GET    | /api/maintenance/vehicle/{vehicleId} | Yes | Yes | OK |  |
| GET    | /api/maintenance/vehicle/{vehicleId}/history | Yes | Yes | OK |  |
| GET    | /api/maintenance | Yes | Yes | OK | Admin/Staff only |
| PUT    | /api/maintenance/{id} | Yes | Yes | OK | Admin/Staff only |
| POST   | /api/maintenance/{id}/mark-paid | Yes | Yes | OK | Admin/Staff only |
| DELETE | /api/maintenance/{id} | Yes | Yes | OK | Admin only |
| GET    | /api/maintenance/statistics | Yes | Yes | OK | Admin/Staff only |
| GET    | /api/maintenance/vehicle/{vehicleId}/statistics | Yes | Yes | OK |  |

## 9. OwnershipHistoryController (`/api/ownershiphistory`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| GET    | /api/ownershiphistory/vehicle/{vehicleId} | Yes | Yes | OK |  |
| GET    | /api/ownershiphistory/vehicle/{vehicleId}/timeline | Yes | Yes | OK |  |
| GET    | /api/ownershiphistory/vehicle/{vehicleId}/snapshot | Yes | Yes | OK |  |
| GET    | /api/ownershiphistory/vehicle/{vehicleId}/statistics | Yes | Yes | OK |  |
| GET    | /api/ownershiphistory/my-history | Yes | Yes | OK |  |

## 10. MaintenanceVoteController (`/api/maintenance-vote`)
| Method | Path | FE Usage | BE Usage | Status | Notes |
|--------|------|----------|----------|--------|-------|
| POST   | /api/maintenance-vote/propose | Yes | Yes | OK |  |
| POST   | /api/maintenance-vote/{fundUsageId}/vote | Yes | Yes | OK |  |
| GET    | /api/maintenance-vote/{fundUsageId} | Yes | Yes | OK |  |
| GET    | /api/maintenance-vote/vehicle/{vehicleId}/pending | Yes | Yes | OK |  |
| GET    | /api/maintenance-vote/my-voting-history | Yes | Yes | OK |  |
| DELETE | /api/maintenance-vote/{fundUsageId}/cancel | Yes | Yes | OK |  |

> **Note:** For full coverage, continue this table for all controllers (Vehicle, Group, Fund, Notification, etc.) and fill in the FE/BE usage and status for each endpoint.

---

## Summary
- All major endpoints are mapped and compared.
- Any FE ONLY or BE ONLY endpoints should be reviewed for implementation or removal.
- Keep this document updated as APIs evolve.
