const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

// API Compatibility Test Script
// Tests CoOwner API endpoints against backend

const BACKEND_BASE_URL = 'localhost:7279';

// Test data for different endpoint categories
const testEndpoints = {
    // ✅ Profile Management - Should work
    profile: [
        'GET /api/coowner/profile',
        'GET /api/coowner/my-profile'
    ],

    // ✅ Registration & Promotion - Should work  
    registration: [
        'GET /api/coowner/eligibility',
        'GET /api/coowner/statistics'
    ],

    // ✅ Ownership Management - Should work
    ownership: [
        'GET /api/coowner/ownership'
    ],

    // ✅ Schedule Management - Should work
    schedule: [
        'GET /api/coowner/schedule',
        'GET /api/coowner/schedule/my-schedule',
        'GET /api/coowner/schedule/conflicts'
    ],

    // ⚠️ Booking Management - Mixed compatibility
    bookings: [
        'GET /api/coowner/booking/history',  // Backend has (singular)
        'GET /api/coowner/bookings/my-bookings',  // Backend has (plural)
        'GET /api/coowner/bookings/availability'  // Backend has
    ],

    // ✅ Fund Management - Should work
    funds: [
        'GET /api/coowner/funds',
        'GET /api/coowner/costs',
        'GET /api/coowner/fund/balance/1',  // Test with vehicleId = 1
        'GET /api/coowner/fund/additions/1',
        'GET /api/coowner/fund/usages/1',
        'GET /api/coowner/fund/summary/1'
    ],

    // ✅ Analytics - Should work
    analytics: [
        'GET /api/coowner/analytics',
        'GET /api/coowner/analytics/my-usage-history',
        'GET /api/coowner/analytics/group-summary'
    ],

    // ⚠️ Groups - Compatibility issues (singular vs plural)
    groups: [
        'GET /api/coowner/group',  // Backend has (singular)
        'GET /api/coowner/group/fund'  // Backend has
    ],

    // ⚠️ Payment Management - Mixed compatibility
    payments: [
        'GET /api/coowner/payments/gateways',  // Backend has
        'GET /api/coowner/payments/my-payments'  // Backend has
    ],

    // ✅ Vehicle Management - Should work
    vehicles: [
        'GET /api/coowner/vehicles/available',
        'GET /api/coowner/vehicles/my-vehicles'
    ],

    // ✅ Dashboard - Should work
    dashboard: [
        'GET /api/coowner/dashboard',
        'GET /api/coowner/dashboard/quick-stats'
    ],

    // ✅ Test Endpoints - Should work
    test: [
        'GET /api/coowner/test/eligibility-scenarios',
        'GET /api/coowner/test/promotion-workflow'
    ]
};

// Known issues to test specifically
const problematicEndpoints = [
    // ❌ These should return 404 (not implemented)
    'GET /api/coowner/my-profile/avatar',
    'GET /api/coowner/profile/notification-settings',
    'GET /api/coowner/groups/1',  // Plural form - should fail
    'GET /api/coowner/groups/1/members',  // Should fail
    'GET /api/coowner/bookings/vehicle/1',  // Should fail or work?
    'GET /api/Payment/invoices'  // Old API - different base path
];

async function testEndpoint(method, path) {
    return new Promise((resolve) => {
        const options = {
            hostname: BACKEND_BASE_URL.split(':')[0],
            port: parseInt(BACKEND_BASE_URL.split(':')[1]),
            path: path,
            method: method,
            agent: agent,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let statusCode = res.statusCode;
            let status = 'UNKNOWN';

            if (statusCode === 401) {
                status = '✅ EXISTS (AUTH REQUIRED)';
            } else if (statusCode === 404) {
                status = '❌ NOT FOUND';
            } else if (statusCode === 405) {
                status = '⚠️ METHOD NOT ALLOWED';
            } else if (statusCode >= 200 && statusCode < 300) {
                status = '✅ SUCCESS';
            } else if (statusCode >= 400) {
                status = '⚠️ CLIENT ERROR';
            } else if (statusCode >= 500) {
                status = '🚫 SERVER ERROR';
            }

            resolve({
                path,
                method,
                statusCode,
                status,
                compatible: statusCode === 401 || (statusCode >= 200 && statusCode < 300)
            });
        });

        req.on('error', (e) => {
            resolve({
                path,
                method,
                statusCode: 'ERROR',
                status: '🚫 CONNECTION ERROR',
                compatible: false,
                error: e.message
            });
        });

        req.setTimeout(3000, () => {
            req.destroy();
            resolve({
                path,
                method,
                statusCode: 'TIMEOUT',
                status: '⏱️ TIMEOUT',
                compatible: false
            });
        });

        req.end();
    });
}

async function runCompatibilityTest() {
    console.log('🔍 CoOwner API Compatibility Test');
    console.log('=' * 50);
    console.log(`Testing against: https://${BACKEND_BASE_URL}`);
    console.log('\\n');

    const results = {
        compatible: 0,
        incompatible: 0,
        total: 0,
        byCategory: {}
    };

    // Test by category
    for (const [category, endpoints] of Object.entries(testEndpoints)) {
        console.log(`\\n📁 ${category.toUpperCase()} APIs:`);
        console.log('-'.repeat(40));

        const categoryResults = {
            compatible: 0,
            total: 0,
            endpoints: []
        };

        for (const endpoint of endpoints) {
            const [method, path] = endpoint.split(' ');
            const result = await testEndpoint(method, path);

            console.log(`${result.status} ${method} ${path}`);
            if (result.statusCode && result.statusCode !== 'ERROR' && result.statusCode !== 'TIMEOUT') {
                console.log(`   └─ Status: ${result.statusCode}`);
            }
            if (result.error) {
                console.log(`   └─ Error: ${result.error}`);
            }

            categoryResults.endpoints.push(result);
            categoryResults.total++;
            results.total++;

            if (result.compatible) {
                categoryResults.compatible++;
                results.compatible++;
            } else {
                results.incompatible++;
            }
        }

        const categoryPercent = Math.round((categoryResults.compatible / categoryResults.total) * 100);
        console.log(`\\n📊 ${category} Compatibility: ${categoryResults.compatible}/${categoryResults.total} (${categoryPercent}%)`);

        results.byCategory[category] = {
            ...categoryResults,
            percentage: categoryPercent
        };
    }

    // Test problematic endpoints
    console.log('\\n\\n🚨 TESTING KNOWN PROBLEMATIC ENDPOINTS:');
    console.log('-'.repeat(50));

    for (const endpoint of problematicEndpoints) {
        const [method, path] = endpoint.split(' ');
        const result = await testEndpoint(method, path);

        console.log(`${result.status} ${method} ${path}`);
        if (result.statusCode === 404) {
            console.log('   └─ ✅ Expected: Endpoint should not exist');
        } else if (result.compatible) {
            console.log('   └─ ⚠️ Unexpected: This endpoint exists but should not');
        }
    }

    // Summary
    const totalPercent = Math.round((results.compatible / results.total) * 100);

    console.log('\\n\\n📈 COMPATIBILITY SUMMARY:');
    console.log('=' * 50);
    console.log(`Total Endpoints Tested: ${results.total}`);
    console.log(`Compatible: ${results.compatible} (${totalPercent}%)`);
    console.log(`Incompatible: ${results.incompatible} (${100 - totalPercent}%)`);
    console.log('\\n');

    // Category breakdown
    console.log('📊 CATEGORY BREAKDOWN:');
    console.log('-'.repeat(30));
    for (const [category, data] of Object.entries(results.byCategory)) {
        const icon = data.percentage >= 90 ? '🟢' : data.percentage >= 70 ? '🟡' : '🔴';
        console.log(`${icon} ${category}: ${data.percentage}% (${data.compatible}/${data.total})`);
    }

    console.log('\\n');

    // Recommendations
    if (totalPercent >= 90) {
        console.log('🎉 EXCELLENT! API compatibility is very high.');
        console.log('✅ Ready for production with minor fixes.');
    } else if (totalPercent >= 80) {
        console.log('✅ GOOD! API compatibility is acceptable.');
        console.log('⚠️ Some endpoints need attention before production.');
    } else if (totalPercent >= 70) {
        console.log('⚠️ FAIR! API compatibility needs improvement.');
        console.log('🔧 Significant work needed before production.');
    } else {
        console.log('🚨 POOR! API compatibility is low.');
        console.log('🛠️ Major rework needed for production readiness.');
    }

    console.log('\\n📋 RECOMMENDED ACTIONS:');
    console.log('1. Review API_COMPATIBILITY_ANALYSIS.md for details');
    console.log('2. Fix Groups API (singular vs plural)');
    console.log('3. Remove deprecated Payment endpoints');
    console.log('4. Test with authentication tokens');
    console.log('5. Implement missing backend endpoints if needed');

    return results;
}

// Run the test
runCompatibilityTest()
    .then(results => {
        console.log('\\n✅ Compatibility test completed!');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Test failed:', error);
        process.exit(1);
    });