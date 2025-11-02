/**
 * REAL API TEST HELPER
 * Helper để test các API calls thực tế với backend
 * Chạy trong browser console hoặc React component
 */

import coOwnerApi from '../api/coowner';
import coOwnerService from '../services/coOwnerService';

/**
 * Test Results Logger
 */
class ApiTestLogger {
    constructor() {
        this.results = [];
        this.passed = 0;
        this.failed = 0;
    }

    log(endpoint, status, data, error) {
        const result = {
            endpoint,
            status,
            timestamp: new Date().toISOString(),
            data: data || null,
            error: error || null
        };

        this.results.push(result);

        if (status === 'success') {
            this.passed++;
            console.log(`✅ ${endpoint}`, data);
        } else {
            this.failed++;
            console.error(`❌ ${endpoint}`, error);
        }
    }

    summary() {
        console.log('\n' + '='.repeat(80));
        console.log('API TEST SUMMARY');
        console.log('='.repeat(80));
        console.log(`Total Tests: ${this.results.length}`);
        console.log(`Passed: ${this.passed}`);
        console.log(`Failed: ${this.failed}`);
        console.log(`Success Rate: ${((this.passed / this.results.length) * 100).toFixed(1)}%`);
        console.log('='.repeat(80) + '\n');

        return this.results;
    }
}

/**
 * API Test Suite
 */
export class CoOwnerApiTester {
    constructor() {
        this.logger = new ApiTestLogger();
    }

    /**
     * Test Profile APIs
     */
    async testProfileApis() {
        console.log('\n🧪 Testing Profile APIs...\n');

        // Test 1: Get Profile
        try {
            const response = await coOwnerService.getProfile();
            this.logger.log('GET /api/coowner/profile', 'success', response);
        } catch (error) {
            this.logger.log('GET /api/coowner/profile', 'failed', null, error.message);
        }

        // Test 2: Get My Profile
        try {
            const response = await coOwnerService.getMyProfile();
            this.logger.log('GET /api/coowner/my-profile', 'success', response);
        } catch (error) {
            this.logger.log('GET /api/coowner/my-profile', 'failed', null, error.message);
        }
    }

    /**
     * Test Vehicle APIs
     */
    async testVehicleApis() {
        console.log('\n🧪 Testing Vehicle APIs...\n');

        // Test 1: Get My Vehicles
        try {
            const response = await coOwnerApi.vehicles.getMyVehicles();
            this.logger.log('GET /api/coowner/vehicles/my-vehicles', 'success', response);
            return response.data;
        } catch (error) {
            this.logger.log('GET /api/coowner/vehicles/my-vehicles', 'failed', null, error.message);
            return [];
        }
    }

    /**
     * Test Booking APIs
     */
    async testBookingApis() {
        console.log('\n🧪 Testing Booking APIs...\n');

        // Test 1: Get My Bookings
        try {
            const response = await coOwnerApi.bookings.getMyBookings();
            this.logger.log('GET /api/coowner/bookings/my-bookings', 'success', response);
        } catch (error) {
            this.logger.log('GET /api/coowner/bookings/my-bookings', 'failed', null, error.message);
        }

        // Test 2: Get Booking History
        try {
            const response = await coOwnerService.getBookingHistory(1, 10);
            this.logger.log('GET /api/coowner/booking/history', 'success', response);
        } catch (error) {
            this.logger.log('GET /api/coowner/booking/history', 'failed', null, error.message);
        }

        // Test 3: Get Availability
        try {
            const response = await coOwnerApi.bookings.getAvailability();
            this.logger.log('GET /api/coowner/bookings/availability', 'success', response);
        } catch (error) {
            this.logger.log('GET /api/coowner/bookings/availability', 'failed', null, error.message);
        }
    }

    /**
     * Test Schedule APIs
     */
    async testScheduleApis(vehicleId) {
        console.log('\n🧪 Testing Schedule APIs...\n');

        if (!vehicleId) {
            console.warn('⚠️  No vehicleId provided, skipping schedule tests');
            return;
        }

        // Test 1: Get Vehicle Schedule
        try {
            const response = await coOwnerService.getVehicleSchedule(vehicleId, {
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            });
            this.logger.log(`GET /api/coowner/schedule/vehicle/${vehicleId}`, 'success', response);
        } catch (error) {
            this.logger.log(`GET /api/coowner/schedule/vehicle/${vehicleId}`, 'failed', null, error.message);
        }

        // Test 2: Get My Schedule
        try {
            const response = await coOwnerService.getMySchedule();
            this.logger.log('GET /api/coowner/schedule/my-schedule', 'success', response);
        } catch (error) {
            this.logger.log('GET /api/coowner/schedule/my-schedule', 'failed', null, error.message);
        }

        // Test 3: Check Availability
        try {
            const response = await coOwnerService.checkAvailability({
                vehicleId,
                startTime: new Date().toISOString(),
                endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
            });
            this.logger.log('POST /api/coowner/schedule/check-availability', 'success', response);
        } catch (error) {
            this.logger.log('POST /api/coowner/schedule/check-availability', 'failed', null, error.message);
        }
    }

    /**
     * Test Fund APIs
     */
    async testFundApis(vehicleId) {
        console.log('\n🧪 Testing Fund APIs...\n');

        // Test 1: Get Fund Info
        try {
            const response = await coOwnerApi.funds.getInfo();
            this.logger.log('GET /api/coowner/funds', 'success', response);
        } catch (error) {
            this.logger.log('GET /api/coowner/funds', 'failed', null, error.message);
        }

        // Test 2: Get My Contributions
        try {
            const response = await coOwnerApi.funds.getMyContributions();
            this.logger.log('GET /api/coowner/funds/my-contributions', 'success', response);
        } catch (error) {
            this.logger.log('GET /api/coowner/funds/my-contributions', 'failed', null, error.message);
        }

        if (vehicleId) {
            // Test 3: Get Fund Balance
            try {
                const response = await coOwnerService.getFundBalance(vehicleId);
                this.logger.log(`GET /api/coowner/fund/balance/${vehicleId}`, 'success', response);
            } catch (error) {
                this.logger.log(`GET /api/coowner/fund/balance/${vehicleId}`, 'failed', null, error.message);
            }

            // Test 4: Get Fund Summary
            try {
                const response = await coOwnerService.getFundSummary(vehicleId);
                this.logger.log(`GET /api/coowner/fund/summary/${vehicleId}`, 'success', response);
            } catch (error) {
                this.logger.log(`GET /api/coowner/fund/summary/${vehicleId}`, 'failed', null, error.message);
            }
        }
    }

    /**
     * Test Group APIs
     */
    async testGroupApis() {
        console.log('\n🧪 Testing Group APIs...\n');

        // Test 1: Get My Groups
        try {
            const response = await coOwnerService.getMyGroups();
            this.logger.log('GET /api/coowner/group', 'success', response);
            return response.data;
        } catch (error) {
            this.logger.log('GET /api/coowner/group', 'failed', null, error.message);
            return [];
        }
    }

    /**
     * Test Analytics APIs
     */
    async testAnalyticsApis() {
        console.log('\n🧪 Testing Analytics APIs...\n');

        // Test 1: Get Analytics
        try {
            const response = await coOwnerService.getAnalytics();
            this.logger.log('GET /api/coowner/analytics', 'success', response);
        } catch (error) {
            this.logger.log('GET /api/coowner/analytics', 'failed', null, error.message);
        }

        // Test 2: Get Usage Statistics
        try {
            const response = await coOwnerApi.analytics.getUsageStatistics();
            this.logger.log('GET /api/coowner/analytics/usage', 'success', response);
        } catch (error) {
            this.logger.log('GET /api/coowner/analytics/usage', 'failed', null, error.message);
        }

        // Test 3: Get My Usage History
        try {
            const response = await coOwnerService.getMyUsageHistory();
            this.logger.log('GET /api/coowner/analytics/my-usage-history', 'success', response);
        } catch (error) {
            this.logger.log('GET /api/coowner/analytics/my-usage-history', 'failed', null, error.message);
        }
    }

    /**
     * Test Payment APIs
     */
    async testPaymentApis() {
        console.log('\n🧪 Testing Payment APIs...\n');

        // Test 1: Get My Payments
        try {
            const response = await coOwnerService.getMyPayments();
            this.logger.log('GET /api/coowner/payments/my-payments', 'success', response);
        } catch (error) {
            this.logger.log('GET /api/coowner/payments/my-payments', 'failed', null, error.message);
        }

        // Test 2: Get Payment Gateways
        try {
            const response = await coOwnerService.getPaymentGateways();
            this.logger.log('GET /api/coowner/payments/gateways', 'success', response);
        } catch (error) {
            this.logger.log('GET /api/coowner/payments/gateways', 'failed', null, error.message);
        }
    }

    /**
     * Run All Tests
     */
    async runAllTests() {
        console.log('\n' + '='.repeat(80));
        console.log('🚀 STARTING COOWNER API TESTS');
        console.log('='.repeat(80));

        try {
            // Test Profile
            await this.testProfileApis();

            // Test Vehicles (and get vehicleId for other tests)
            const vehicles = await this.testVehicleApis();
            const vehicleId = vehicles?.[0]?.vehicleId || vehicles?.[0]?.id;

            // Test Bookings
            await this.testBookingApis();

            // Test Schedule (with vehicleId if available)
            await this.testScheduleApis(vehicleId);

            // Test Funds (with vehicleId if available)
            await this.testFundApis(vehicleId);

            // Test Groups
            await this.testGroupApis();

            // Test Analytics
            await this.testAnalyticsApis();

            // Test Payments
            await this.testPaymentApis();

        } catch (error) {
            console.error('❌ Test suite failed:', error);
        }

        // Print summary
        return this.logger.summary();
    }

    /**
     * Get test results
     */
    getResults() {
        return this.logger.results;
    }

    /**
     * Export results to JSON
     */
    exportResults() {
        const results = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.logger.results.length,
                passed: this.logger.passed,
                failed: this.logger.failed,
                successRate: ((this.logger.passed / this.logger.results.length) * 100).toFixed(1) + '%'
            },
            tests: this.logger.results
        };

        return JSON.stringify(results, null, 2);
    }
}

/**
 * Quick test function for specific endpoint
 */
export async function quickTest(apiCall, description) {
    console.log(`\n🧪 Testing: ${description}`);
    try {
        const response = await apiCall();
        console.log('✅ Success:', response);
        return { success: true, data: response };
    } catch (error) {
        console.error('❌ Failed:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Example Usage in React Component:
 * 
 * import { CoOwnerApiTester } from './utils/realApiTestHelper';
 * 
 * function TestComponent() {
 *   const runTests = async () => {
 *     const tester = new CoOwnerApiTester();
 *     const results = await tester.runAllTests();
 *     console.log('Test Results:', results);
 *   };
 * 
 *   return (
 *     <Button onClick={runTests}>
 *       Run API Tests
 *     </Button>
 *   );
 * }
 */

/**
 * Example Usage in Browser Console:
 * 
 * // Import the tester
 * const tester = new CoOwnerApiTester();
 * 
 * // Run all tests
 * await tester.runAllTests();
 * 
 * // Run specific test
 * await tester.testProfileApis();
 * 
 * // Export results
 * const json = tester.exportResults();
 * console.log(json);
 */

export default CoOwnerApiTester;
