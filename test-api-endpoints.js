const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

const testEndpoints = [
    '/api/coowner/profile',
    '/api/coowner/my-profile',
    '/api/coowner/bookings',
    '/api/coowner/booking',
    '/api/coowner/groups',
    '/api/coowner/group',
    '/api/coowner/analytics',
    '/api/coowner/schedule/my-schedule',
    '/api/coowner/fund/balance/1',
    '/api/coowner/payments/gateways'
];

async function testEndpoint(endpoint) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 7279,
            path: endpoint,
            method: 'GET',
            agent: agent,
            headers: {
                'Accept': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            resolve({ endpoint, status: res.statusCode, exists: res.statusCode !== 404 });
        });

        req.on('error', (e) => {
            resolve({ endpoint, status: 'ERROR', exists: false, error: e.message });
        });

        req.setTimeout(3000, () => {
            req.destroy();
            resolve({ endpoint, status: 'TIMEOUT', exists: false });
        });

        req.end();
    });
}

async function runTests() {
    console.log('Testing CoOwner API Endpoints on localhost:7279...\n');

    for (const endpoint of testEndpoints) {
        const result = await testEndpoint(endpoint);
        const status = result.exists ? '✅ EXISTS' : '❌ NOT FOUND';
        console.log(`${status} - ${endpoint} (Status: ${result.status})`);
    }

    console.log('\n=== Summary ===');
    console.log('Check the results above to see which endpoints your backend actually supports.');
    console.log('Compare with COOWNER_API_COMPARISON.md for full analysis.');
}

runTests().catch(console.error);