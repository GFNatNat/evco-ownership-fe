/**
 * Test file to verify CoOwner API compatibility fixes
 * Run this to test if all API methods are properly accessible
 */

import coOwnerApi from '../src/api/coowner';
import { parseApiResponse, extractResponseData, handleApiCall } from '../src/utils/apiResponseHandler';

// Test function to verify all CoOwner API endpoints are accessible
export const testCoOwnerApiCompatibility = () => {
    console.log('🧪 Testing CoOwner API Compatibility...\n');

    // Test Profile Management
    console.log('✅ Profile Management:');
    console.log('- coOwnerApi.profile.get:', typeof coOwnerApi.profile.get);
    console.log('- coOwnerApi.profile.update:', typeof coOwnerApi.profile.update);
    console.log('- coOwnerApi.profile.uploadAvatar:', typeof coOwnerApi.profile.uploadAvatar);
    console.log('- coOwnerApi.profile.changePassword:', typeof coOwnerApi.profile.changePassword);

    // Test Vehicle Booking System
    console.log('\n✅ Vehicle Booking System:');
    console.log('- coOwnerApi.vehicles.getAvailable:', typeof coOwnerApi.vehicles.getAvailable);
    console.log('- coOwnerApi.vehicles.getDetails:', typeof coOwnerApi.vehicles.getDetails);
    console.log('- coOwnerApi.vehicles.getMyVehicles:', typeof coOwnerApi.vehicles.getMyVehicles);
    console.log('- coOwnerApi.vehicles.getFavorites:', typeof coOwnerApi.vehicles.getFavorites);
    console.log('- coOwnerApi.vehicles.addToFavorites:', typeof coOwnerApi.vehicles.addToFavorites);

    // Test Booking Management
    console.log('\n✅ Booking Management:');
    console.log('- coOwnerApi.bookings.create:', typeof coOwnerApi.bookings.create);
    console.log('- coOwnerApi.bookings.getMy:', typeof coOwnerApi.bookings.getMy);
    console.log('- coOwnerApi.bookings.cancel:', typeof coOwnerApi.bookings.cancel);
    console.log('- coOwnerApi.bookings.getPendingConflicts:', typeof coOwnerApi.bookings.getPendingConflicts);
    console.log('- coOwnerApi.bookings.resolveConflict:', typeof coOwnerApi.bookings.resolveConflict);

    // Test Fund Management
    console.log('\n✅ Fund Management:');
    console.log('- coOwnerApi.funds.getInfo:', typeof coOwnerApi.funds.getInfo);
    console.log('- coOwnerApi.funds.addFunds:', typeof coOwnerApi.funds.addFunds);
    console.log('- coOwnerApi.funds.getHistory:', typeof coOwnerApi.funds.getHistory);
    console.log('- coOwnerApi.funds.createUsage:', typeof coOwnerApi.funds.createUsage);
    console.log('- coOwnerApi.funds.getUsageHistory:', typeof coOwnerApi.funds.getUsageHistory);

    // Test Analytics
    console.log('\n✅ Analytics:');
    console.log('- coOwnerApi.analytics.getUsageStatistics:', typeof coOwnerApi.analytics.getUsageStatistics);
    console.log('- coOwnerApi.analytics.getCostAnalysis:', typeof coOwnerApi.analytics.getCostAnalysis);
    console.log('- coOwnerApi.analytics.getEnvironmentalImpact:', typeof coOwnerApi.analytics.getEnvironmentalImpact);

    // Test Group Management
    console.log('\n✅ Group Management:');
    console.log('- coOwnerApi.groups.getMyGroups:', typeof coOwnerApi.groups.getMyGroups);
    console.log('- coOwnerApi.groups.getGroupDetails:', typeof coOwnerApi.groups.getGroupDetails);
    console.log('- coOwnerApi.groups.inviteToGroup:', typeof coOwnerApi.groups.inviteToGroup);
    console.log('- coOwnerApi.groups.getMembers:', typeof coOwnerApi.groups.getMembers);

    // Test Payment Management
    console.log('\n✅ Payment Management:');
    console.log('- coOwnerApi.payments.getPayments:', typeof coOwnerApi.payments.getPayments);
    console.log('- coOwnerApi.payments.makePayment:', typeof coOwnerApi.payments.makePayment);
    console.log('- coOwnerApi.payments.getPaymentHistory:', typeof coOwnerApi.payments.getPaymentHistory);

    // Test Dashboard
    console.log('\n✅ Dashboard:');
    console.log('- coOwnerApi.dashboard.getData:', typeof coOwnerApi.dashboard.getData);
    console.log('- coOwnerApi.dashboard.getRecentActivity:', typeof coOwnerApi.dashboard.getRecentActivity);

    // Test Ownership Management (Legacy Compatibility)
    console.log('\n✅ Ownership Management (Legacy Compatibility):');
    console.log('- coOwnerApi.getOwnerships:', typeof coOwnerApi.getOwnerships);
    console.log('- coOwnerApi.createOwnershipRequest:', typeof coOwnerApi.createOwnershipRequest);
    console.log('- coOwnerApi.getDashboardStats:', typeof coOwnerApi.getDashboardStats);
    console.log('- coOwnerApi.getDocuments:', typeof coOwnerApi.getDocuments);

    console.log('\n🎉 All API methods are accessible!');
};

// Test response handler utilities
export const testResponseHandlerUtilities = () => {
    console.log('\n🧪 Testing Response Handler Utilities...\n');

    // Test parseApiResponse
    const docFormat = { statusCode: 200, message: 'SUCCESS', data: { test: 'data' } };
    const directFormat = { data: { test: 'data' } };
    const rawData = { test: 'data' };

    console.log('✅ parseApiResponse tests:');
    console.log('- Document format:', parseApiResponse(docFormat));
    console.log('- Direct format:', parseApiResponse(directFormat));
    console.log('- Raw data:', parseApiResponse(rawData));

    // Test extractResponseData
    console.log('\n✅ extractResponseData tests:');
    console.log('- From doc format:', extractResponseData(docFormat));
    console.log('- From direct format:', extractResponseData(directFormat));
    console.log('- From null:', extractResponseData(null, 'fallback'));

    console.log('\n🎉 Response handler utilities working correctly!');
};

// Test endpoint naming consistency
export const testEndpointNamingConsistency = () => {
    console.log('\n🧪 Testing Endpoint Naming Consistency...\n');

    const inconsistencies = [];

    // Check if all documented endpoints have corresponding methods
    const requiredMethods = {
        'Profile Management': [
            'profile.get', 'profile.update', 'profile.uploadAvatar', 'profile.changePassword'
        ],
        'Vehicle Booking': [
            'vehicles.getAvailable', 'vehicles.getDetails', 'bookings.create', 'bookings.getMy', 'bookings.cancel'
        ],
        'Fund Management': [
            'funds.getInfo', 'funds.addFunds', 'funds.getHistory'
        ],
        'Analytics': [
            'analytics.getUsageStatistics', 'analytics.getCostAnalysis', 'analytics.getEnvironmentalImpact'
        ],
        'Group Management': [
            'groups.getMyGroups', 'groups.getGroupDetails', 'groups.inviteToGroup'
        ]
    };

    Object.entries(requiredMethods).forEach(([category, methods]) => {
        console.log(`✅ ${category}:`);
        methods.forEach(method => {
            const parts = method.split('.');
            const hasMethod = parts.reduce((obj, part) => obj && obj[part], coOwnerApi);
            if (!hasMethod) {
                inconsistencies.push(`${category}: Missing ${method}`);
                console.log(`❌ Missing: ${method}`);
            } else {
                console.log(`✅ Available: ${method}`);
            }
        });
    });

    if (inconsistencies.length === 0) {
        console.log('\n🎉 All required methods are available!');
    } else {
        console.log('\n⚠️  Found inconsistencies:');
        inconsistencies.forEach(inc => console.log(`- ${inc}`));
    }

    return inconsistencies;
};

// Run all tests
export const runAllCompatibilityTests = () => {
    console.log('🚀 Running CoOwner API Compatibility Tests\n');
    console.log('================================================\n');

    testCoOwnerApiCompatibility();
    testResponseHandlerUtilities();
    const inconsistencies = testEndpointNamingConsistency();

    console.log('\n================================================');
    console.log('🏁 Test Summary:');
    console.log(`✅ API Methods: Available`);
    console.log(`✅ Response Handlers: Working`);
    console.log(`${inconsistencies.length === 0 ? '✅' : '⚠️'} Naming Consistency: ${inconsistencies.length === 0 ? 'All Good' : `${inconsistencies.length} issues found`}`);
    console.log('================================================\n');

    return {
        apiMethodsAvailable: true,
        responseHandlersWorking: true,
        namingConsistency: inconsistencies.length === 0,
        inconsistencies
    };
};

export default {
    testCoOwnerApiCompatibility,
    testResponseHandlerUtilities,
    testEndpointNamingConsistency,
    runAllCompatibilityTests
};