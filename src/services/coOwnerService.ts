// CoOwner Service - Service layer wrapper for CoOwner API
import coOwnerApi from '../api/coowner';
import {
  CoOwnerProfile,
  UpdateCoOwnerProfileRequest,
  CoOwnerRegistrationRequest,
  EligibilityResponse,
  VehicleScheduleRequest,
  AvailabilityCheckRequest,
  OptimalSlotRequest,
  CreateBookingRequest,
  BookingResponse,
  FundBalance,
  CreateFundUsageRequest,
  VehicleUsageVsOwnership,
  GroupInviteRequest,
  GroupVoteRequest,
  PaymentRequest,
  BaseResponse
} from '../types/coowner';

class CoOwnerService {
  // ===== PROFILE MANAGEMENT =====

  /**
   * Get co-owner profile using backend standard endpoint
   */
  async getProfile(): Promise<BaseResponse<CoOwnerProfile>> {
    try {
      return await coOwnerApi.profile.get() as any;
    } catch (error) {
      console.error('Failed to get profile:', error);
      throw error;
    }
  }

  /**
   * Update co-owner profile using backend standard endpoint
   */
  async updateProfile(profileData: UpdateCoOwnerProfileRequest): Promise<BaseResponse<CoOwnerProfile>> {
    try {
      return await coOwnerApi.profile.update(profileData) as any;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }

  /**
   * Get detailed profile information (frontend specific)
   */
  async getMyProfile(): Promise<BaseResponse<CoOwnerProfile>> {
    try {
      return await coOwnerApi.profile.getMyProfile() as any;
    } catch (error) {
      console.error('Failed to get my profile:', error);
      throw error;
    }
  }

  // ===== REGISTRATION & PROMOTION =====

  /**
   * Register as a co-owner
   */
  async register(registrationData: CoOwnerRegistrationRequest): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.registration.register(registrationData) as any;
    } catch (error) {
      console.error('Failed to register as co-owner:', error);
      throw error;
    }
  }

  /**
   * Check eligibility for co-owner status
   */
  async checkEligibility(): Promise<BaseResponse<EligibilityResponse>> {
    try {
      return await coOwnerApi.registration.checkEligibility() as any;
    } catch (error) {
      console.error('Failed to check eligibility:', error);
      throw error;
    }
  }

  /**
   * Promote current user to co-owner
   */
  async promote(): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.registration.promote() as any;
    } catch (error) {
      console.error('Failed to promote to co-owner:', error);
      throw error;
    }
  }

  // ===== SCHEDULE MANAGEMENT =====

  /**
   * Get vehicle schedule for specific period
   */
  async getVehicleSchedule(vehicleId: number, request: VehicleScheduleRequest): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.schedule.getVehicleSchedule(vehicleId, request) as any;
    } catch (error) {
      console.error('Failed to get vehicle schedule:', error);
      throw error;
    }
  }

  /**
   * Check availability for specific time slot
   */
  async checkAvailability(request: AvailabilityCheckRequest): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.schedule.checkAvailability(request) as any;
    } catch (error) {
      console.error('Failed to check availability:', error);
      throw error;
    }
  }

  /**
   * Find optimal booking slots
   */
  async findOptimalSlots(request: OptimalSlotRequest): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.schedule.findOptimalSlots(request) as any;
    } catch (error) {
      console.error('Failed to find optimal slots:', error);
      throw error;
    }
  }

  /**
   * Get my personal schedule
   */
  async getMySchedule(params?: any): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.schedule.getMySchedule(params) as any;
    } catch (error) {
      console.error('Failed to get my schedule:', error);
      throw error;
    }
  }

  /**
   * Get schedule conflicts
   */
  async getScheduleConflicts(): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.schedule.getConflicts() as any;
    } catch (error) {
      console.error('Failed to get schedule conflicts:', error);
      throw error;
    }
  }

  // ===== BOOKING MANAGEMENT =====

  /**
   * Create new booking using backend standard endpoint
   */
  async createBooking(bookingData: CreateBookingRequest): Promise<BaseResponse<BookingResponse>> {
    try {
      return await coOwnerApi.bookings.create(bookingData) as any;
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw error;
    }
  }

  /**
   * Get booking history
   */
  async getBookingHistory(page: number = 1, pageSize: number = 10): Promise<BaseResponse<BookingResponse[]>> {
    try {
      return await coOwnerApi.bookings.getHistory(page, pageSize) as any;
    } catch (error) {
      console.error('Failed to get booking history:', error);
      throw error;
    }
  }

  /**
   * Get bookings for specific vehicle
   */
  async getVehicleBookings(vehicleId: number): Promise<BaseResponse<BookingResponse[]>> {
    try {
      return await coOwnerApi.bookings.getVehicleBookings(vehicleId) as any;
    } catch (error) {
      console.error('Failed to get vehicle bookings:', error);
      throw error;
    }
  }

  /**
   * Get booking availability
   */
  async getBookingAvailability(): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.bookings.getAvailability() as any;
    } catch (error) {
      console.error('Failed to get booking availability:', error);
      throw error;
    }
  }

  // ===== FUND MANAGEMENT =====

  /**
   * Get costs information
   */
  async getCosts(): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.funds.getCosts() as any;
    } catch (error) {
      console.error('Failed to get costs:', error);
      throw error;
    }
  }

  /**
   * Get fund balance for specific vehicle
   */
  async getFundBalance(vehicleId: number): Promise<BaseResponse<FundBalance>> {
    try {
      return await coOwnerApi.funds.getBalance(vehicleId) as any;
    } catch (error) {
      console.error('Failed to get fund balance:', error);
      throw error;
    }
  }

  /**
   * Get fund additions for specific vehicle
   */
  async getFundAdditions(vehicleId: number): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.funds.getAdditions(vehicleId) as any;
    } catch (error) {
      console.error('Failed to get fund additions:', error);
      throw error;
    }
  }

  /**
   * Get fund usages for specific vehicle
   */
  async getFundUsages(vehicleId: number): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.funds.getUsages(vehicleId) as any;
    } catch (error) {
      console.error('Failed to get fund usages:', error);
      throw error;
    }
  }

  /**
   * Get fund summary for specific vehicle
   */
  async getFundSummary(vehicleId: number): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.funds.getSummary(vehicleId) as any;
    } catch (error) {
      console.error('Failed to get fund summary:', error);
      throw error;
    }
  }

  /**
   * Create fund usage record
   */
  async createFundUsage(usageData: CreateFundUsageRequest): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.funds.createUsage(usageData) as any;
    } catch (error) {
      console.error('Failed to create fund usage:', error);
      throw error;
    }
  }

  /**
   * Get category-specific fund usages
   */
  async getCategoryUsages(vehicleId: number, category: string): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.funds.getCategoryUsages(vehicleId, category) as any;
    } catch (error) {
      console.error('Failed to get category usages:', error);
      throw error;
    }
  }

  // ===== ANALYTICS =====

  /**
   * Get general analytics
   */
  async getAnalytics(): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.analytics.get() as any;
    } catch (error) {
      console.error('Failed to get analytics:', error);
      throw error;
    }
  }

  /**
   * Get vehicle usage vs ownership analytics
   */
  async getVehicleUsageVsOwnership(vehicleId: number): Promise<BaseResponse<VehicleUsageVsOwnership>> {
    try {
      return await coOwnerApi.analytics.getVehicleUsageVsOwnership(vehicleId) as any;
    } catch (error) {
      console.error('Failed to get vehicle usage vs ownership:', error);
      throw error;
    }
  }

  /**
   * Get vehicle usage trends
   */
  async getVehicleUsageTrends(vehicleId: number): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.analytics.getVehicleUsageTrends(vehicleId) as any;
    } catch (error) {
      console.error('Failed to get vehicle usage trends:', error);
      throw error;
    }
  }

  /**
   * Get my usage history
   */
  async getMyUsageHistory(): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.analytics.getMyUsageHistory() as any;
    } catch (error) {
      console.error('Failed to get my usage history:', error);
      throw error;
    }
  }

  /**
   * Get group summary analytics
   */
  async getGroupSummary(): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.analytics.getGroupSummary() as any;
    } catch (error) {
      console.error('Failed to get group summary:', error);
      throw error;
    }
  }

  // ===== GROUP MANAGEMENT =====

  /**
   * Get my groups using corrected endpoint
   */
  async getMyGroups(): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.groups.getMyGroups() as any;
    } catch (error) {
      console.error('Failed to get my groups:', error);
      throw error;
    }
  }

  /**
   * Invite member to group
   */
  async inviteToGroup(inviteData: GroupInviteRequest): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.groups.invite(inviteData) as any;
    } catch (error) {
      console.error('Failed to invite to group:', error);
      throw error;
    }
  }

  /**
   * Remove member from group
   */
  async removeMember(memberId: number): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.groups.removeMember(memberId) as any;
    } catch (error) {
      console.error('Failed to remove member:', error);
      throw error;
    }
  }

  /**
   * Cast vote in group
   */
  async vote(voteData: GroupVoteRequest): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.groups.vote(voteData) as any;
    } catch (error) {
      console.error('Failed to cast vote:', error);
      throw error;
    }
  }

  /**
   * Get group fund information
   */
  async getGroupFund(): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.groups.getFund() as any;
    } catch (error) {
      console.error('Failed to get group fund:', error);
      throw error;
    }
  }

  // ===== PAYMENT MANAGEMENT =====

  /**
   * Make payment using backend standard endpoint
   */
  async makePayment(paymentData: PaymentRequest): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.payments.makePayment(paymentData) as any;
    } catch (error) {
      console.error('Failed to make payment:', error);
      throw error;
    }
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: number): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.payments.getById(paymentId) as any;
    } catch (error) {
      console.error('Failed to get payment:', error);
      throw error;
    }
  }

  /**
   * Get my payments
   */
  async getMyPayments(): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.payments.getMyPayments() as any;
    } catch (error) {
      console.error('Failed to get my payments:', error);
      throw error;
    }
  }

  /**
   * Cancel payment
   */
  async cancelPayment(paymentId: number): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.payments.cancelPayment(paymentId) as any;
    } catch (error) {
      console.error('Failed to cancel payment:', error);
      throw error;
    }
  }

  /**
   * Get payment gateways
   */
  async getPaymentGateways(): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.payments.getGateways() as any;
    } catch (error) {
      console.error('Failed to get payment gateways:', error);
      throw error;
    }
  }

  // ===== TEST ENDPOINTS (Development only) =====

  /**
   * Get eligibility test scenarios
   */
  async getEligibilityScenarios(): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.test.getEligibilityScenarios() as any;
    } catch (error) {
      console.error('Failed to get eligibility scenarios:', error);
      throw error;
    }
  }

  /**
   * Get promotion workflow test
   */
  async getPromotionWorkflow(): Promise<BaseResponse<any>> {
    try {
      return await coOwnerApi.test.getPromotionWorkflow() as any;
    } catch (error) {
      console.error('Failed to get promotion workflow:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const coOwnerService = new CoOwnerService();
export default coOwnerService;