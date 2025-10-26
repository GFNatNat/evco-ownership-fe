import axiosClient from './axiosClient';

/**
 * Fairness Optimization API - README 18 Compliant Implementation
 * Provides AI-powered fairness analysis and cost optimization features
 * All endpoints follow exact README 18 specifications
// All endpoints updated to use capitalized controller names (e.g., /api/FairnessOptimization) to match Swagger
 */

const fairnessOptimizationApi = {
    // ===== README 18 COMPLIANCE - 4 ENDPOINTS =====

    // 1. Create fairness report - GET /api/fairnessoptimization/vehicle/{vehicleId}/fairness-report (README 18 compliant)
    getFairnessReport: (vehicleId, params) => axiosClient.get(`/api/FairnessOptimization/vehicle/${vehicleId}/fairness-report`, {
        params: {
            startDate: params?.startDate,
            endDate: params?.endDate,
            includeRecommendations: params?.includeRecommendations !== false // default: true
        }
    }),

    // 2. Get schedule suggestions - GET /api/fairnessoptimization/vehicle/{vehicleId}/schedule-suggestions (README 18 compliant)
    getScheduleSuggestions: (vehicleId, params) => axiosClient.get(`/api/FairnessOptimization/vehicle/${vehicleId}/schedule-suggestions`, {
        params: {
            startDate: params?.startDate,
            endDate: params?.endDate,
            preferredDurationHours: params?.preferredDurationHours || 4,
            usageType: params?.usageType // Maintenance, Insurance, Fuel, Parking, Other
        }
    }),

    // 3. Get maintenance suggestions - GET /api/fairnessoptimization/vehicle/{vehicleId}/maintenance-suggestions (README 18 compliant)
    getMaintenanceSuggestions: (vehicleId, params) => axiosClient.get(`/api/FairnessOptimization/vehicle/${vehicleId}/maintenance-suggestions`, {
        params: {
            includePredictive: params?.includePredictive !== false, // default: true
            lookaheadDays: params?.lookaheadDays || 30 // default: 30, max: 365
        }
    }),

    // 4. Get cost saving recommendations - GET /api/fairnessoptimization/vehicle/{vehicleId}/cost-saving-recommendations (README 18 compliant)
    getCostSavingRecommendations: (vehicleId, params) => axiosClient.get(`/api/FairnessOptimization/vehicle/${vehicleId}/cost-saving-recommendations`, {
        params: {
            analysisPeriodDays: params?.analysisPeriodDays || 90, // default: 90, min: 7, max: 365
            includeFundOptimization: params?.includeFundOptimization !== false, // default: true
            includeMaintenanceOptimization: params?.includeMaintenanceOptimization !== false // default: true
        }
    }),

    // ===== UTILITY METHODS FOR FRONTEND INTEGRATION =====

    // Validate analysis parameters
    validateAnalysisParams: (params) => {
        const errors = [];

        if (params.startDate && params.endDate && new Date(params.startDate) > new Date(params.endDate)) {
            errors.push('Start date must be before end date');
        }

        if (params.preferredDurationHours && (params.preferredDurationHours < 1 || params.preferredDurationHours > 24)) {
            errors.push('Preferred duration must be between 1 and 24 hours');
        }

        if (params.lookaheadDays && (params.lookaheadDays < 1 || params.lookaheadDays > 365)) {
            errors.push('Lookahead days must be between 1 and 365');
        }

        if (params.analysisPeriodDays && (params.analysisPeriodDays < 7 || params.analysisPeriodDays > 365)) {
            errors.push('Analysis period must be between 7 and 365 days');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Format fairness score for display
    formatFairnessScore: (score) => {
        if (score >= 90) return { level: 'Excellent', color: '#4CAF50', bgColor: '#E8F5E8' };
        if (score >= 80) return { level: 'Good', color: '#8BC34A', bgColor: '#F1F8E9' };
        if (score >= 70) return { level: 'Fair', color: '#FF9800', bgColor: '#FFF3E0' };
        if (score >= 60) return { level: 'Poor', color: '#FF5722', bgColor: '#FBE9E7' };
        return { level: 'Critical', color: '#F44336', bgColor: '#FFEBEE' };
    },

    // Get usage pattern display info
    getUsagePatternInfo: (pattern) => {
        const patterns = {
            'Balanced': { name: 'Cân bằng', color: '#4CAF50', icon: '⚖️' },
            'Overutilized': { name: 'Sử dụng quá mức', color: '#F44336', icon: '📈' },
            'Underutilized': { name: 'Sử dụng ít', color: '#FF9800', icon: '📉' }
        };
        return patterns[pattern] || { name: pattern, color: '#757575', icon: '❓' };
    },

    // Get recommendation priority info
    getRecommendationPriorityInfo: (priority) => {
        const priorities = {
            'Low': { name: 'Thấp', color: '#4CAF50', bgColor: '#E8F5E8' },
            'Medium': { name: 'Trung bình', color: '#FF9800', bgColor: '#FFF3E0' },
            'High': { name: 'Cao', color: '#F44336', bgColor: '#FFEBEE' },
            'Critical': { name: 'Khẩn cấp', color: '#D32F2F', bgColor: '#FFCDD2' }
        };
        return priorities[priority] || { name: priority, color: '#757575', bgColor: '#F5F5F5' };
    },

    // Format currency amount
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount || 0);
    },

    // Format percentage
    formatPercentage: (value, decimalPlaces = 1) => {
        return `${(value || 0).toFixed(decimalPlaces)}%`;
    },

    // Calculate usage delta color
    getUsageDeltaColor: (delta) => {
        if (Math.abs(delta) <= 5) return '#4CAF50'; // Balanced
        if (Math.abs(delta) <= 15) return '#FF9800'; // Moderate imbalance
        return '#F44336'; // Significant imbalance
    },

    // Format fairness report for display
    formatFairnessReportForDisplay: (report) => {
        if (!report) return null;

        return {
            vehicleId: report.vehicleId,
            vehicleName: report.vehicleName,
            overview: {
                ...report.overview,
                fairnessScoreInfo: fairnessOptimizationApi.formatFairnessScore(report.overview?.fairnessScore || 0)
            },
            coOwnersDetails: (report.coOwnersDetails || []).map(coOwner => ({
                ...coOwner,
                usagePatternInfo: fairnessOptimizationApi.getUsagePatternInfo(coOwner.usagePattern),
                formattedExpectedCostShare: fairnessOptimizationApi.formatCurrency(coOwner.expectedCostShare),
                formattedActualCostShare: fairnessOptimizationApi.formatCurrency(coOwner.actualCostShare),
                formattedCostAdjustmentNeeded: fairnessOptimizationApi.formatCurrency(coOwner.costAdjustmentNeeded),
                usageDeltaColor: fairnessOptimizationApi.getUsageDeltaColor(coOwner.usageVsOwnershipDelta),
                formattedOwnershipPercentage: fairnessOptimizationApi.formatPercentage(coOwner.ownershipPercentage),
                formattedUsagePercentage: fairnessOptimizationApi.formatPercentage(coOwner.averageUsagePercentage),
                formattedUsageDelta: fairnessOptimizationApi.formatPercentage(coOwner.usageVsOwnershipDelta, 1)
            })),
            recommendations: (report.recommendations || []).map(rec => ({
                ...rec,
                priorityInfo: fairnessOptimizationApi.getRecommendationPriorityInfo(rec.priority)
            }))
        };
    },

    // Format schedule suggestions for display
    formatScheduleSuggestionsForDisplay: (suggestions) => {
        if (!suggestions) return null;

        return {
            vehicleId: suggestions.vehicleId,
            vehicleName: suggestions.vehicleName,
            coOwnerSuggestions: (suggestions.coOwnerSuggestions || []).map(suggestion => ({
                ...suggestion,
                formattedOwnershipPercentage: fairnessOptimizationApi.formatPercentage(suggestion.ownershipPercentage),
                formattedCurrentUsagePercentage: fairnessOptimizationApi.formatPercentage(suggestion.currentUsagePercentage),
                formattedRecommendedUsagePercentage: fairnessOptimizationApi.formatPercentage(suggestion.recommendedUsagePercentage),
                suggestedSlots: (suggestion.suggestedSlots || []).map(slot => ({
                    ...slot,
                    formattedStartTime: new Date(slot.startTime).toLocaleString('vi-VN'),
                    formattedEndTime: new Date(slot.endTime).toLocaleString('vi-VN'),
                    conflictRisk: slot.conflictProbability < 0.3 ? 'Low' : slot.conflictProbability < 0.7 ? 'Medium' : 'High',
                    conflictRiskColor: slot.conflictProbability < 0.3 ? '#4CAF50' : slot.conflictProbability < 0.7 ? '#FF9800' : '#F44336'
                }))
            })),
            optimalTimeSlots: (suggestions.optimalTimeSlots || []).map(slot => ({
                ...slot,
                peakTypeInfo: {
                    'Low': { name: 'Thấp', color: '#4CAF50' },
                    'Medium': { name: 'Trung bình', color: '#FF9800' },
                    'High': { name: 'Cao', color: '#F44336' }
                }[slot.peakType] || { name: slot.peakType, color: '#757575' },
                formattedUtilizationRate: fairnessOptimizationApi.formatPercentage(slot.utilizationRate)
            })),
            insights: suggestions.insights ? {
                ...suggestions.insights,
                formattedCurrentUtilizationRate: fairnessOptimizationApi.formatPercentage(suggestions.insights.currentUtilizationRate),
                formattedOptimalUtilizationRate: fairnessOptimizationApi.formatPercentage(suggestions.insights.optimalUtilizationRate),
                formattedPotentialEfficiencyGain: fairnessOptimizationApi.formatPercentage(suggestions.insights.potentialEfficiencyGain)
            } : null
        };
    },

    // Format maintenance suggestions for display
    formatMaintenanceSuggestionsForDisplay: (suggestions) => {
        if (!suggestions) return null;

        return {
            vehicleId: suggestions.vehicleId,
            vehicleName: suggestions.vehicleName,
            healthStatus: suggestions.healthStatus ? {
                ...suggestions.healthStatus,
                formattedCurrentOdometer: `${(suggestions.healthStatus.currentOdometer || 0).toLocaleString('vi-VN')} km`,
                formattedAverageDailyDistance: `${(suggestions.healthStatus.averageDailyDistance || 0).toFixed(1)} km/ngày`,
                formattedDistanceSinceLastMaintenance: `${(suggestions.healthStatus.distanceSinceLastMaintenance || 0).toLocaleString('vi-VN')} km`,
                healthScoreInfo: fairnessOptimizationApi.formatFairnessScore(suggestions.healthStatus.healthScore || 0)
            } : null,
            suggestions: (suggestions.suggestions || []).map(suggestion => ({
                ...suggestion,
                urgencyInfo: fairnessOptimizationApi.getRecommendationPriorityInfo(suggestion.urgency),
                formattedEstimatedCost: fairnessOptimizationApi.formatCurrency(suggestion.estimatedCost),
                formattedCostSavingIfDoneNow: fairnessOptimizationApi.formatCurrency(suggestion.costSavingIfDoneNow),
                formattedRecommendedOdometer: `${(suggestion.recommendedOdometerReading || 0).toLocaleString('vi-VN')} km`,
                formattedRecommendedDate: new Date(suggestion.recommendedDate).toLocaleDateString('vi-VN'),
                daysUntilRecommendedColor: suggestion.daysUntilRecommended <= 7 ? '#F44336' :
                    suggestion.daysUntilRecommended <= 30 ? '#FF9800' : '#4CAF50'
            })),
            costForecast: suggestions.costForecast ? {
                ...suggestions.costForecast,
                formattedEstimatedTotalCost: fairnessOptimizationApi.formatCurrency(suggestions.costForecast.estimatedTotalCost),
                formattedAverageMonthlyCost: fairnessOptimizationApi.formatCurrency(suggestions.costForecast.averageMonthlyCost),
                formattedCostPerCoOwnerAverage: fairnessOptimizationApi.formatCurrency(suggestions.costForecast.costPerCoOwnerAverage),
                monthlyForecasts: (suggestions.costForecast.monthlyForecasts || []).map(forecast => ({
                    ...forecast,
                    formattedEstimatedCost: fairnessOptimizationApi.formatCurrency(forecast.estimatedCost)
                }))
            } : null
        };
    },

    // Format cost saving recommendations for display
    formatCostSavingRecommendationsForDisplay: (recommendations) => {
        if (!recommendations) return null;

        return {
            vehicleId: recommendations.vehicleId,
            vehicleName: recommendations.vehicleName,
            summary: recommendations.summary ? {
                ...recommendations.summary,
                formattedTotalCostsIncurred: fairnessOptimizationApi.formatCurrency(recommendations.summary.totalCostsIncurred),
                formattedAverageMonthlyCost: fairnessOptimizationApi.formatCurrency(recommendations.summary.averageMonthlyCost),
                formattedCostPerKm: fairnessOptimizationApi.formatCurrency(recommendations.summary.costPerKm),
                formattedCostPerBooking: fairnessOptimizationApi.formatCurrency(recommendations.summary.costPerBooking),
                formattedPotentialSavings: fairnessOptimizationApi.formatCurrency(recommendations.summary.potentialSavings),
                formattedSavingsPercentage: fairnessOptimizationApi.formatPercentage(recommendations.summary.savingsPercentage),
                costBreakdowns: (recommendations.summary.costBreakdowns || []).map(breakdown => ({
                    ...breakdown,
                    formattedAmount: fairnessOptimizationApi.formatCurrency(breakdown.amount),
                    formattedPercentage: fairnessOptimizationApi.formatPercentage(breakdown.percentage),
                    trendInfo: {
                        'Stable': { name: 'Ổn định', color: '#4CAF50' },
                        'Increasing': { name: 'Tăng', color: '#F44336' },
                        'Decreasing': { name: 'Giảm', color: '#4CAF50' }
                    }[breakdown.trend] || { name: breakdown.trend, color: '#757575' }
                }))
            } : null,
            recommendations: (recommendations.recommendations || []).map(rec => ({
                ...rec,
                priorityInfo: fairnessOptimizationApi.getRecommendationPriorityInfo(rec.priority),
                formattedPotentialSavingsAmount: fairnessOptimizationApi.formatCurrency(rec.potentialSavingsAmount),
                formattedPotentialSavingsPercentage: fairnessOptimizationApi.formatPercentage(rec.potentialSavingsPercentage),
                formattedImplementationCost: fairnessOptimizationApi.formatCurrency(rec.implementationCost),
                formattedROI: fairnessOptimizationApi.formatPercentage(rec.roi),
                difficultyInfo: {
                    'Easy': { name: 'Dễ', color: '#4CAF50' },
                    'Medium': { name: 'Trung bình', color: '#FF9800' },
                    'Hard': { name: 'Khó', color: '#F44336' }
                }[rec.difficulty] || { name: rec.difficulty, color: '#757575' }
            }))
        };
    },

    // Get usage types for schedule suggestions
    getUsageTypes: () => [
        { value: 'Maintenance', label: 'Bảo trì' },
        { value: 'Insurance', label: 'Bảo hiểm' },
        { value: 'Fuel', label: 'Nhiên liệu' },
        { value: 'Parking', label: 'Đỗ xe' },
        { value: 'Other', label: 'Khác' }
    ]
};

export default fairnessOptimizationApi;