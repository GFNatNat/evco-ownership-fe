// CoOwner API Testing Utility
// This file helps test the newly implemented API endpoints

import coOwnerService from './services/coOwnerService';

class CoOwnerAPITester {
    constructor() {
        this.testResults = [];
    }

    /**
     * Run comprehensive API tests
     */
    async runAllTests() {
        console.log('🚀 Starting CoOwner API Comprehensive Tests...\n');

        try {
            // Test authentication first
            await this.testAuthentication();

            // Test profile management
            await this.testProfileManagement();

            // Test schedule management
            await this.testScheduleManagement();

            // Test booking system
            await this.testBookingSystem();

            // Test fund management
            await this.testFundManagement();

            // Test analytics
            await this.testAnalytics();

            // Test group management
            await this.testGroupManagement();

            // Test payment system
            await this.testPaymentSystem();

            // Show summary
            this.showTestSummary();

        } catch (error) {
            console.error('❌ Test suite failed:', error);
        }
    }

    /**
     * Test authentication and basic connectivity
     */
    async testAuthentication() {
        console.log('🔐 Testing Authentication...');

        // Check if we can access protected endpoints
        try {
            const profileResponse = await coOwnerService.getProfile();
            this.logTestResult('Profile Access', 'SUCCESS', 'Can access profile endpoint');
        } catch (error) {
            if (error.response?.status === 401) {
                this.logTestResult('Profile Access', 'AUTH_REQUIRED', 'Authentication required (expected)');
            } else {
                this.logTestResult('Profile Access', 'FAILED', `Unexpected error: ${error.message}`);
            }
        }
    }

    /**
     * Test profile management endpoints
     */
    async testProfileManagement() {
        console.log('\n👤 Testing Profile Management...');

        const tests = [
            { name: 'Get Profile', method: () => coOwnerService.getProfile() },
            { name: 'Get My Profile', method: () => coOwnerService.getMyProfile() },
            { name: 'Check Eligibility', method: () => coOwnerService.checkEligibility() }
        ];

        for (const test of tests) {
            await this.runSingleTest(test.name, test.method);
        }
    }

    /**
     * Test schedule management endpoints
     */
    async testScheduleManagement() {
        console.log('\n📅 Testing Schedule Management...');

        const tests = [
            {
                name: 'Get Vehicle Schedule',
                method: () => coOwnerService.getVehicleSchedule(1, {
                    startDate: '2024-11-01',
                    endDate: '2024-11-30'
                })
            },
            {
                name: 'Check Availability',
                method: () => coOwnerService.checkAvailability({
                    vehicleId: 1,
                    startTime: '2024-11-10T09:00:00',
                    endTime: '2024-11-10T17:00:00'
                })
            },
            { name: 'Get My Schedule', method: () => coOwnerService.getMySchedule() },
            { name: 'Get Schedule Conflicts', method: () => coOwnerService.getScheduleConflicts() }
        ];

        for (const test of tests) {
            await this.runSingleTest(test.name, test.method);
        }
    }

    /**
     * Test booking system endpoints
     */
    async testBookingSystem() {
        console.log('\n🚗 Testing Booking System...');

        const tests = [
            { name: 'Get Booking History', method: () => coOwnerService.getBookingHistory() },
            { name: 'Get Vehicle Bookings', method: () => coOwnerService.getVehicleBookings(1) },
            { name: 'Get Booking Availability', method: () => coOwnerService.getBookingAvailability() }
        ];

        for (const test of tests) {
            await this.runSingleTest(test.name, test.method);
        }
    }

    /**
     * Test fund management endpoints
     */
    async testFundManagement() {
        console.log('\n💰 Testing Fund Management...');

        const tests = [
            { name: 'Get Costs', method: () => coOwnerService.getCosts() },
            { name: 'Get Fund Balance', method: () => coOwnerService.getFundBalance(1) },
            { name: 'Get Fund Additions', method: () => coOwnerService.getFundAdditions(1) },
            { name: 'Get Fund Usages', method: () => coOwnerService.getFundUsages(1) },
            { name: 'Get Fund Summary', method: () => coOwnerService.getFundSummary(1) },
            { name: 'Get Category Usages', method: () => coOwnerService.getCategoryUsages(1, 'fuel') }
        ];

        for (const test of tests) {
            await this.runSingleTest(test.name, test.method);
        }
    }

    /**
     * Test analytics endpoints
     */
    async testAnalytics() {
        console.log('\n📊 Testing Analytics...');

        const tests = [
            { name: 'Get Analytics', method: () => coOwnerService.getAnalytics() },
            { name: 'Get Vehicle Usage vs Ownership', method: () => coOwnerService.getVehicleUsageVsOwnership(1) },
            { name: 'Get Vehicle Usage Trends', method: () => coOwnerService.getVehicleUsageTrends(1) },
            { name: 'Get My Usage History', method: () => coOwnerService.getMyUsageHistory() },
            { name: 'Get Group Summary', method: () => coOwnerService.getGroupSummary() }
        ];

        for (const test of tests) {
            await this.runSingleTest(test.name, test.method);
        }
    }

    /**
     * Test group management endpoints
     */
    async testGroupManagement() {
        console.log('\n👥 Testing Group Management...');

        const tests = [
            { name: 'Get My Groups', method: () => coOwnerService.getMyGroups() },
            { name: 'Get Group Fund', method: () => coOwnerService.getGroupFund() }
        ];

        for (const test of tests) {
            await this.runSingleTest(test.name, test.method);
        }
    }

    /**
     * Test payment system endpoints
     */
    async testPaymentSystem() {
        console.log('\n💳 Testing Payment System...');

        const tests = [
            { name: 'Get My Payments', method: () => coOwnerService.getMyPayments() },
            { name: 'Get Payment Gateways', method: () => coOwnerService.getPaymentGateways() }
        ];

        for (const test of tests) {
            await this.runSingleTest(test.name, test.method);
        }
    }

    /**
     * Run a single test and log results
     */
    async runSingleTest(testName, testMethod) {
        try {
            const response = await testMethod();

            if (response && response.statusCode) {
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    this.logTestResult(testName, 'SUCCESS', `Status: ${response.statusCode}`);
                } else {
                    this.logTestResult(testName, 'WARNING', `Status: ${response.statusCode}`);
                }
            } else {
                this.logTestResult(testName, 'SUCCESS', 'Response received');
            }
        } catch (error) {
            if (error.response?.status === 401) {
                this.logTestResult(testName, 'AUTH_REQUIRED', 'Authentication required');
            } else if (error.response?.status === 404) {
                this.logTestResult(testName, 'NOT_FOUND', 'Endpoint not found');
            } else if (error.response?.status === 405) {
                this.logTestResult(testName, 'METHOD_NOT_ALLOWED', 'Wrong HTTP method');
            } else {
                this.logTestResult(testName, 'FAILED', error.message);
            }
        }
    }

    /**
     * Log test result
     */
    logTestResult(testName, status, message) {
        const statusIcon = {
            'SUCCESS': '✅',
            'AUTH_REQUIRED': '🔐',
            'NOT_FOUND': '❌',
            'METHOD_NOT_ALLOWED': '⚠️',
            'WARNING': '⚠️',
            'FAILED': '❌'
        };

        const result = {
            testName,
            status,
            message,
            timestamp: new Date().toISOString()
        };

        this.testResults.push(result);
        console.log(`${statusIcon[status] || '❓'} ${testName}: ${message}`);
    }

    /**
     * Show test summary
     */
    showTestSummary() {
        console.log('\n📋 Test Summary:');
        console.log('================');

        const summary = this.testResults.reduce((acc, result) => {
            acc[result.status] = (acc[result.status] || 0) + 1;
            return acc;
        }, {});

        Object.entries(summary).forEach(([status, count]) => {
            console.log(`${status}: ${count} tests`);
        });

        console.log(`\nTotal tests: ${this.testResults.length}`);

        // List failed endpoints
        const failedTests = this.testResults.filter(r => r.status === 'FAILED' || r.status === 'NOT_FOUND');
        if (failedTests.length > 0) {
            console.log('\n❌ Failed/Missing Endpoints:');
            failedTests.forEach(test => {
                console.log(`  - ${test.testName}: ${test.message}`);
            });
        }

        // List endpoints needing authentication
        const authTests = this.testResults.filter(r => r.status === 'AUTH_REQUIRED');
        if (authTests.length > 0) {
            console.log('\n🔐 Endpoints requiring authentication:');
            authTests.forEach(test => {
                console.log(`  - ${test.testName}`);
            });
        }
    }

    /**
     * Export test results as JSON
     */
    exportResults() {
        return {
            summary: {
                totalTests: this.testResults.length,
                timestamp: new Date().toISOString(),
                results: this.testResults
            }
        };
    }
}

// Export for use in browser console or testing
if (typeof window !== 'undefined') {
    window.CoOwnerAPITester = CoOwnerAPITester;
}

export default CoOwnerAPITester;

// Usage example:
/*
const tester = new CoOwnerAPITester();
tester.runAllTests().then(() => {
  console.log('All tests completed');
  const results = tester.exportResults();
  console.log('Test results:', results);
});
*/