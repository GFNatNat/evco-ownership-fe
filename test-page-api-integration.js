/**
 * TEST PAGE API INTEGRATION
 * Script kiểm tra việc tích hợp API vào các pages
 * Đảm bảo các pages có thể lấy dữ liệu thật từ backend
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

// Test results storage
const testResults = {
    pages: {},
    summary: {
        totalPages: 0,
        passed: 0,
        failed: 0,
        warnings: 0
    }
};

/**
 * Kiểm tra xem file có import API không
 */
function checkApiImport(filePath, content) {
    const results = {
        hasCoOwnerApi: false,
        hasService: false,
        hasAxiosClient: false,
        imports: []
    };

    // Check coOwnerApi import
    if (content.includes("from '../../api/coowner'") ||
        content.includes('from "../../api/coowner"')) {
        results.hasCoOwnerApi = true;
        results.imports.push('coOwnerApi');
    }

    // Check service import
    if (content.includes("from '../../services/coOwnerService") ||
        content.includes('from "../../services/coOwnerService')) {
        results.hasService = true;
        results.imports.push('coOwnerService');
    }

    // Check axiosClient import
    if (content.includes("from '../../api/axiosClient") ||
        content.includes('from "../../api/axiosClient')) {
        results.hasAxiosClient = true;
        results.imports.push('axiosClient');
    }

    return results;
}

/**
 * Tìm tất cả API calls trong file
 */
function findApiCalls(content) {
    const apiCalls = [];

    // Pattern để tìm coOwnerApi calls
    const coOwnerApiPattern = /coOwnerApi\.([\w.]+)\(([^)]*)\)/g;
    let match;
    while ((match = coOwnerApiPattern.exec(content)) !== null) {
        apiCalls.push({
            type: 'coOwnerApi',
            method: match[1],
            params: match[2].trim(),
            fullCall: match[0]
        });
    }

    // Pattern để tìm service calls
    const servicePattern = /coOwnerService\.([\w.]+)\(([^)]*)\)/g;
    while ((match = servicePattern.exec(content)) !== null) {
        apiCalls.push({
            type: 'coOwnerService',
            method: match[1],
            params: match[2].trim(),
            fullCall: match[0]
        });
    }

    return apiCalls;
}

/**
 * Kiểm tra state management cho API data
 */
function checkStateManagement(content) {
    const states = [];

    // Check useState hooks
    const useStatePattern = /const\s+\[(\w+),\s*set\w+\]\s*=\s*useState/g;
    let match;
    while ((match = useStatePattern.exec(content)) !== null) {
        states.push(match[1]);
    }

    return states;
}

/**
 * Kiểm tra error handling
 */
function checkErrorHandling(content) {
    return {
        hasTryCatch: content.includes('try {') && content.includes('} catch'),
        hasErrorState: content.includes('setError') || content.includes('error'),
        hasLoadingState: content.includes('setLoading') || content.includes('loading'),
        hasAlertComponent: content.includes('<Alert') || content.includes('<Snackbar')
    };
}

/**
 * Kiểm tra useEffect cho data loading
 */
function checkDataLoading(content) {
    const results = {
        hasUseEffect: content.includes('useEffect'),
        loadFunctions: []
    };

    // Tìm các load functions
    const loadFunctionPattern = /(load\w+|fetch\w+|get\w+)\s*=\s*async\s*\(/g;
    let match;
    while ((match = loadFunctionPattern.exec(content)) !== null) {
        results.loadFunctions.push(match[1]);
    }

    return results;
}

/**
 * Kiểm tra response data handling
 */
function checkResponseHandling(content) {
    return {
        hasResponseData: content.includes('response.data') || content.includes('.data'),
        hasArrayCheck: content.includes('Array.isArray'),
        hasSafetyCheck: content.includes('?.') || content.includes('||'),
        hasDataMapping: content.includes('.map(') || content.includes('.filter(')
    };
}

/**
 * Phân tích một page file
 */
function analyzePage(filePath) {
    const fileName = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf8');

    const analysis = {
        fileName,
        filePath,
        apiImports: checkApiImport(filePath, content),
        apiCalls: findApiCalls(content),
        states: checkStateManagement(content),
        errorHandling: checkErrorHandling(content),
        dataLoading: checkDataLoading(content),
        responseHandling: checkResponseHandling(content),
        issues: [],
        warnings: [],
        passed: []
    };

    // Validate integration
    validateIntegration(analysis);

    return analysis;
}

/**
 * Validate API integration
 */
function validateIntegration(analysis) {
    // Check 1: Có import API không?
    if (!analysis.apiImports.hasCoOwnerApi && !analysis.apiImports.hasService) {
        analysis.issues.push('❌ Không import API (coOwnerApi hoặc coOwnerService)');
    } else {
        analysis.passed.push('✅ Có import API');
    }

    // Check 2: Có API calls không?
    if (analysis.apiCalls.length === 0) {
        analysis.issues.push('❌ Không có API calls nào được tìm thấy');
    } else {
        analysis.passed.push(`✅ Tìm thấy ${analysis.apiCalls.length} API calls`);
    }

    // Check 3: Có state management không?
    if (analysis.states.length === 0) {
        analysis.warnings.push('⚠️  Không tìm thấy state management (useState)');
    } else {
        analysis.passed.push(`✅ Có ${analysis.states.length} states`);
    }

    // Check 4: Có error handling không?
    if (!analysis.errorHandling.hasTryCatch) {
        analysis.warnings.push('⚠️  Không có try-catch blocks');
    } else {
        analysis.passed.push('✅ Có try-catch error handling');
    }

    if (!analysis.errorHandling.hasErrorState) {
        analysis.warnings.push('⚠️  Không có error state');
    } else {
        analysis.passed.push('✅ Có error state management');
    }

    if (!analysis.errorHandling.hasLoadingState) {
        analysis.warnings.push('⚠️  Không có loading state');
    } else {
        analysis.passed.push('✅ Có loading state');
    }

    // Check 5: Có useEffect để load data không?
    if (!analysis.dataLoading.hasUseEffect) {
        analysis.warnings.push('⚠️  Không có useEffect hook');
    } else {
        analysis.passed.push('✅ Có useEffect hook');
    }

    if (analysis.dataLoading.loadFunctions.length === 0) {
        analysis.warnings.push('⚠️  Không tìm thấy load/fetch functions');
    } else {
        analysis.passed.push(`✅ Có ${analysis.dataLoading.loadFunctions.length} load functions`);
    }

    // Check 6: Có handle response data không?
    if (!analysis.responseHandling.hasResponseData) {
        analysis.warnings.push('⚠️  Không xử lý response.data');
    } else {
        analysis.passed.push('✅ Xử lý response data');
    }

    if (!analysis.responseHandling.hasArrayCheck) {
        analysis.warnings.push('⚠️  Không kiểm tra Array.isArray');
    } else {
        analysis.passed.push('✅ Có kiểm tra array');
    }

    if (!analysis.responseHandling.hasSafetyCheck) {
        analysis.warnings.push('⚠️  Không có safety checks (?. hoặc ||)');
    } else {
        analysis.passed.push('✅ Có safety checks');
    }
}

/**
 * Print page analysis results
 */
function printPageAnalysis(analysis) {
    console.log(`\n${colors.cyan}${'='.repeat(80)}${colors.reset}`);
    console.log(`${colors.cyan}📄 FILE: ${analysis.fileName}${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(80)}${colors.reset}`);

    // API Imports
    console.log(`\n${colors.blue}📦 API IMPORTS:${colors.reset}`);
    if (analysis.apiImports.imports.length > 0) {
        analysis.apiImports.imports.forEach(imp => {
            console.log(`  ${colors.green}✓${colors.reset} ${imp}`);
        });
    } else {
        console.log(`  ${colors.red}✗ Không có imports${colors.reset}`);
    }

    // API Calls
    console.log(`\n${colors.blue}🔌 API CALLS (${analysis.apiCalls.length}):${colors.reset}`);
    if (analysis.apiCalls.length > 0) {
        const groupedCalls = {};
        analysis.apiCalls.forEach(call => {
            const key = call.type;
            if (!groupedCalls[key]) groupedCalls[key] = [];
            groupedCalls[key].push(call.method);
        });

        Object.keys(groupedCalls).forEach(type => {
            console.log(`  ${colors.green}${type}:${colors.reset}`);
            groupedCalls[type].forEach(method => {
                console.log(`    - ${method}`);
            });
        });
    } else {
        console.log(`  ${colors.yellow}Không tìm thấy API calls${colors.reset}`);
    }

    // States
    console.log(`\n${colors.blue}📊 STATE MANAGEMENT (${analysis.states.length}):${colors.reset}`);
    if (analysis.states.length > 0) {
        analysis.states.slice(0, 10).forEach(state => {
            console.log(`  - ${state}`);
        });
        if (analysis.states.length > 10) {
            console.log(`  ... và ${analysis.states.length - 10} states khác`);
        }
    } else {
        console.log(`  ${colors.yellow}Không tìm thấy states${colors.reset}`);
    }

    // Load Functions
    if (analysis.dataLoading.loadFunctions.length > 0) {
        console.log(`\n${colors.blue}🔄 DATA LOADING FUNCTIONS:${colors.reset}`);
        analysis.dataLoading.loadFunctions.forEach(fn => {
            console.log(`  - ${fn}()`);
        });
    }

    // Error Handling
    console.log(`\n${colors.blue}🛡️  ERROR HANDLING:${colors.reset}`);
    console.log(`  Try-Catch: ${analysis.errorHandling.hasTryCatch ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
    console.log(`  Error State: ${analysis.errorHandling.hasErrorState ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
    console.log(`  Loading State: ${analysis.errorHandling.hasLoadingState ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
    console.log(`  Alert Component: ${analysis.errorHandling.hasAlertComponent ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);

    // Response Handling
    console.log(`\n${colors.blue}📥 RESPONSE HANDLING:${colors.reset}`);
    console.log(`  Response Data: ${analysis.responseHandling.hasResponseData ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
    console.log(`  Array Check: ${analysis.responseHandling.hasArrayCheck ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
    console.log(`  Safety Check: ${analysis.responseHandling.hasSafetyCheck ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
    console.log(`  Data Mapping: ${analysis.responseHandling.hasDataMapping ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);

    // Validation Results
    console.log(`\n${colors.magenta}📋 VALIDATION RESULTS:${colors.reset}`);

    if (analysis.passed.length > 0) {
        console.log(`\n${colors.green}PASSED:${colors.reset}`);
        analysis.passed.forEach(msg => console.log(`  ${msg}`));
    }

    if (analysis.warnings.length > 0) {
        console.log(`\n${colors.yellow}WARNINGS:${colors.reset}`);
        analysis.warnings.forEach(msg => console.log(`  ${msg}`));
    }

    if (analysis.issues.length > 0) {
        console.log(`\n${colors.red}ISSUES:${colors.reset}`);
        analysis.issues.forEach(msg => console.log(`  ${msg}`));
    }

    // Overall status
    const status = analysis.issues.length === 0 ?
        (analysis.warnings.length === 0 ? 'EXCELLENT' : 'GOOD') :
        'NEEDS IMPROVEMENT';
    const statusColor = status === 'EXCELLENT' ? colors.green :
        status === 'GOOD' ? colors.yellow : colors.red;

    console.log(`\n${statusColor}STATUS: ${status}${colors.reset}`);
}

/**
 * Main test function
 */
function runTests() {
    console.log(`${colors.cyan}`);
    console.log('╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║          TEST PAGE API INTEGRATION - EVCO OWNERSHIP FRONTEND               ║');
    console.log('║                 Kiểm tra tích hợp API vào Pages                            ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝');
    console.log(colors.reset);

    // Define pages to test
    const pagesToTest = [
        'src/pages/CoOwner/BookingManagement.jsx',
        'src/pages/CoOwner/FundManagement.jsx',
        'src/pages/CoOwner/Group.jsx',
        'src/pages/CoOwner/VehicleAvailability.jsx',
        'src/pages/CoOwner/AccountOwnership.jsx',
        'src/pages/CoOwner/PaymentManagement.jsx',
        'src/pages/CoOwner/UsageAnalytics.jsx',
        'src/pages/Dashboard/CoOwnerDashboard.jsx'
    ];

    pagesToTest.forEach(pagePath => {
        const fullPath = path.join(process.cwd(), pagePath);
        if (fs.existsSync(fullPath)) {
            const analysis = analyzePage(fullPath);
            testResults.pages[pagePath] = analysis;
            testResults.summary.totalPages++;

            if (analysis.issues.length === 0) {
                testResults.summary.passed++;
            } else {
                testResults.summary.failed++;
            }

            testResults.summary.warnings += analysis.warnings.length;

            printPageAnalysis(analysis);
        } else {
            console.log(`${colors.yellow}⚠️  File not found: ${pagePath}${colors.reset}`);
        }
    });

    // Print summary
    printSummary();

    // Generate report
    generateReport();
}

/**
 * Print test summary
 */
function printSummary() {
    console.log(`\n${colors.cyan}${'='.repeat(80)}${colors.reset}`);
    console.log(`${colors.cyan}📊 TEST SUMMARY${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(80)}${colors.reset}`);

    console.log(`\n${colors.blue}Total Pages Tested: ${testResults.summary.totalPages}${colors.reset}`);
    console.log(`${colors.green}Passed: ${testResults.summary.passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${testResults.summary.failed}${colors.reset}`);
    console.log(`${colors.yellow}Total Warnings: ${testResults.summary.warnings}${colors.reset}`);

    const successRate = testResults.summary.totalPages > 0 ?
        ((testResults.summary.passed / testResults.summary.totalPages) * 100).toFixed(1) : 0;

    console.log(`\n${colors.magenta}Success Rate: ${successRate}%${colors.reset}`);

    if (successRate >= 80) {
        console.log(`\n${colors.green}✓ Overall Status: EXCELLENT${colors.reset}`);
    } else if (successRate >= 60) {
        console.log(`\n${colors.yellow}⚠ Overall Status: GOOD (cần cải thiện)${colors.reset}`);
    } else {
        console.log(`\n${colors.red}✗ Overall Status: NEEDS IMPROVEMENT${colors.reset}`);
    }
}

/**
 * Generate detailed report
 */
function generateReport() {
    const reportPath = path.join(process.cwd(), 'PAGE_API_INTEGRATION_REPORT.md');

    let report = '# Page API Integration Test Report\n\n';
    report += `**Generated:** ${new Date().toLocaleString('vi-VN')}\n\n`;

    report += '## Summary\n\n';
    report += `- **Total Pages Tested:** ${testResults.summary.totalPages}\n`;
    report += `- **Passed:** ${testResults.summary.passed}\n`;
    report += `- **Failed:** ${testResults.summary.failed}\n`;
    report += `- **Total Warnings:** ${testResults.summary.warnings}\n\n`;

    report += '## Detailed Results\n\n';

    Object.keys(testResults.pages).forEach(pagePath => {
        const analysis = testResults.pages[pagePath];
        const status = analysis.issues.length === 0 ? '✅ PASS' : '❌ FAIL';

        report += `### ${analysis.fileName} ${status}\n\n`;

        report += '#### API Integration\n\n';
        report += `- **API Imports:** ${analysis.apiImports.imports.join(', ') || 'None'}\n`;
        report += `- **API Calls:** ${analysis.apiCalls.length}\n`;
        report += `- **States:** ${analysis.states.length}\n`;
        report += `- **Load Functions:** ${analysis.dataLoading.loadFunctions.join(', ') || 'None'}\n\n`;

        if (analysis.apiCalls.length > 0) {
            report += '##### API Calls Used:\n\n';
            analysis.apiCalls.forEach(call => {
                report += `- \`${call.type}.${call.method}()\`\n`;
            });
            report += '\n';
        }

        report += '#### Error Handling\n\n';
        report += `- Try-Catch: ${analysis.errorHandling.hasTryCatch ? '✅' : '❌'}\n`;
        report += `- Error State: ${analysis.errorHandling.hasErrorState ? '✅' : '❌'}\n`;
        report += `- Loading State: ${analysis.errorHandling.hasLoadingState ? '✅' : '❌'}\n`;
        report += `- Alert Component: ${analysis.errorHandling.hasAlertComponent ? '✅' : '❌'}\n\n`;

        if (analysis.issues.length > 0) {
            report += '#### Issues\n\n';
            analysis.issues.forEach(issue => {
                report += `- ${issue}\n`;
            });
            report += '\n';
        }

        if (analysis.warnings.length > 0) {
            report += '#### Warnings\n\n';
            analysis.warnings.forEach(warning => {
                report += `- ${warning}\n`;
            });
            report += '\n';
        }

        report += '---\n\n';
    });

    report += '## Recommendations\n\n';
    report += '1. **API Integration:** Đảm bảo tất cả pages import và sử dụng coOwnerApi hoặc coOwnerService\n';
    report += '2. **Error Handling:** Sử dụng try-catch blocks và error states cho mọi API calls\n';
    report += '3. **Loading States:** Hiển thị loading indicator khi fetching data\n';
    report += '4. **Data Validation:** Kiểm tra Array.isArray và sử dụng optional chaining (?.)\n';
    report += '5. **User Feedback:** Hiển thị Alert/Snackbar để thông báo kết quả cho user\n\n';

    fs.writeFileSync(reportPath, report);
    console.log(`\n${colors.green}✓ Report saved to: ${reportPath}${colors.reset}\n`);
}

// Run tests
runTests();
