// CoOwner API TypeScript Interfaces
// Interfaces for all CoOwner API endpoints and request/response types

export interface CoOwnerProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    profileImageUrl?: string;
    status: number; // 0=Active, 1=Inactive, 2=Suspended
}

export interface UpdateCoOwnerProfileRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    profileImageUrl?: string;
}

// Registration & Promotion interfaces
export interface CoOwnerRegistrationRequest {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    licenseNumber: string;
    licenseExpiryDate: string;
}

export interface EligibilityResponse {
    isEligible: boolean;
    requirements: Array<{
        requirement: string;
        status: 'met' | 'not_met';
        description: string;
    }>;
    nextSteps?: string[];
}

export interface PromotionRequest {
    userId?: number; // For admin promotion
    reason?: string;
}

export interface CoOwnerStatistics {
    totalCoOwners: number;
    activeCoOwners: number;
    totalGroups: number;
    totalVehicles: number;
    monthlyGrowth: number;
}

// Schedule interfaces
export interface VehicleScheduleRequest {
    startDate: string;
    endDate: string;
    timeZone?: string;
}

export interface AvailabilityCheckRequest {
    vehicleId: number;
    startTime: string;
    endTime: string;
    purpose?: string;
}

export interface OptimalSlotRequest {
    vehicleId?: number;
    preferredDuration: number;
    preferredTimeSlots: string[];
    dateRange: {
        startDate: string;
        endDate: string;
    };
    priority: 'high' | 'medium' | 'low';
}

export interface ScheduleConflict {
    id: number;
    conflictType: 'double_booking' | 'maintenance_overlap' | 'availability_issue';
    description: string;
    affectedBookings: number[];
    suggestedResolution?: string;
    createdAt: string;
}

// Booking interfaces
export interface CreateBookingRequest {
    vehicleId: number;
    startTime: string;
    endTime: string;
    purpose: string;
    pickupLocationId?: number;
    dropoffLocationId?: number;
    additionalNotes?: string;
}

export interface BookingResponse {
    id: number;
    vehicleId: number;
    vehicleName: string;
    startTime: string;
    endTime: string;
    status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
    totalCost: number;
    estimatedDuration: number;
    confirmationCode: string;
    pickupLocation?: string;
    dropoffLocation?: string;
}

export interface BookingAvailability {
    vehicleId: number;
    availableSlots: Array<{
        startTime: string;
        endTime: string;
        isRecommended: boolean;
    }>;
}

// Fund Management interfaces
export interface FundBalance {
    vehicleId: number;
    currentBalance: number;
    totalContributions: number;
    totalUsages: number;
    myContribution: number;
    lastUpdated: string;
}

export interface FundAddition {
    id: number;
    vehicleId: number;
    amount: number;
    contributorId: number;
    contributorName: string;
    date: string;
    description?: string;
    paymentMethod: string;
}

export interface FundUsage {
    id: number;
    vehicleId: number;
    amount: number;
    category: 'fuel' | 'maintenance' | 'insurance' | 'parking' | 'tolls' | 'other';
    description: string;
    date: string;
    approvedBy?: number;
    receipts?: string[];
}

export interface FundSummary {
    vehicleId: number;
    totalBalance: number;
    monthlyAdditions: number;
    monthlyUsages: number;
    projectedRunway: number; // months
    topCategories: Array<{
        category: string;
        amount: number;
        percentage: number;
    }>;
}

export interface CreateFundUsageRequest {
    vehicleId: number;
    amount: number;
    category: 'fuel' | 'maintenance' | 'insurance' | 'parking' | 'tolls' | 'other';
    description: string;
    receiptFiles?: File[];
}

// Analytics interfaces
export interface VehicleUsageVsOwnership {
    vehicleId: number;
    vehicleName: string;
    myOwnershipPercentage: number;
    myActualUsagePercentage: number;
    fairnessScore: number; // 0-100, 100 being perfectly fair
    monthlyData: Array<{
        month: string;
        ownershipPercentage: number;
        usagePercentage: number;
    }>;
}

export interface VehicleUsageTrends {
    vehicleId: number;
    trends: Array<{
        period: string;
        totalHours: number;
        totalDistance: number;
        totalTrips: number;
        averageRating: number;
    }>;
    predictions: Array<{
        period: string;
        predictedUsage: number;
        confidence: number;
    }>;
}

export interface UsageHistory {
    trips: Array<{
        id: number;
        vehicleId: number;
        vehicleName: string;
        startTime: string;
        endTime: string;
        duration: number;
        distance: number;
        startLocation: string;
        endLocation: string;
        cost: number;
        rating?: number;
    }>;
    summary: {
        totalTrips: number;
        totalHours: number;
        totalDistance: number;
        totalCost: number;
        averageRating: number;
    };
}

export interface GroupSummary {
    groups: Array<{
        groupId: number;
        groupName: string;
        memberCount: number;
        vehicleCount: number;
        myRole: 'member' | 'admin' | 'owner';
        totalUsage: number;
        totalContribution: number;
        efficiency: number;
    }>;
    overallSummary: {
        totalGroups: number;
        totalVehicles: number;
        totalUsage: number;
        totalSavings: number;
    };
}

// Group Management interfaces
export interface GroupInviteRequest {
    email?: string;
    userId?: number;
    message: string;
    role: 'member' | 'admin';
}

export interface GroupVoteRequest {
    proposalId?: number;
    voteType: 'add_member' | 'remove_member' | 'purchase_vehicle' | 'major_expense' | 'rule_change';
    vote: 'approve' | 'reject' | 'abstain';
    comment?: string;
}

export interface GroupFund {
    groupId: number;
    totalBalance: number;
    memberContributions: Array<{
        memberId: number;
        memberName: string;
        contribution: number;
        percentage: number;
    }>;
    recentTransactions: Array<{
        id: number;
        type: 'addition' | 'usage';
        amount: number;
        description: string;
        date: string;
        memberId: number;
        memberName: string;
    }>;
}

// Payment interfaces
export interface PaymentRequest {
    amount: number;
    type: 'booking' | 'fund_contribution' | 'fine' | 'membership_fee';
    relatedId?: number; // booking ID, fund ID, etc.
    paymentMethod: 'credit_card' | 'debit_card' | 'bank_transfer' | 'digital_wallet';
    description?: string;
}

export interface PaymentResponse {
    id: number;
    amount: number;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    paymentMethod: string;
    transactionId?: string;
    createdAt: string;
    completedAt?: string;
}

export interface PaymentGateway {
    id: string;
    name: string;
    type: 'credit_card' | 'bank_transfer' | 'digital_wallet';
    isEnabled: boolean;
    fees: {
        percentage: number;
        fixedAmount?: number;
    };
    supportedCurrencies: string[];
}

// Test interfaces (Development only)
export interface EligibilityScenario {
    scenarioName: string;
    userProfile: {
        age: number;
        licenseYears: number;
        creditScore?: number;
        previousViolations: number;
    };
    expectedResult: boolean;
    requiredActions?: string[];
}

export interface PromotionWorkflow {
    steps: Array<{
        stepName: string;
        description: string;
        status: 'pending' | 'in_progress' | 'completed' | 'failed';
        estimatedTime: string;
        dependencies?: string[];
    }>;
    currentStep: number;
    overallProgress: number;
}

// Common response wrapper
export interface BaseResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
    errors?: string[];
}