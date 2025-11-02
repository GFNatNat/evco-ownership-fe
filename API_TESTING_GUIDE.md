# Hướng dẫn Test API Integration

## Tổng quan

Tài liệu này hướng dẫn cách test việc tích hợp API vào các pages để đảm bảo frontend có thể lấy được dữ liệu thật từ backend.

## Công cụ đã chuẩn bị

### 1. Test Script (`test-page-api-integration.js`)

Script Node.js để phân tích static code và kiểm tra việc tích hợp API.

**Chạy:**
```bash
node test-page-api-integration.js
```

**Kết quả:**
- Phân tích tất cả pages trong `src/pages/CoOwner/`
- Kiểm tra API imports, calls, error handling
- Tạo report file `PAGE_API_INTEGRATION_REPORT.md`

### 2. API Test Helper (`src/utils/realApiTestHelper.js`)

Helper class để test các API calls thực tế với backend.

**Sử dụng trong component:**
```javascript
import { CoOwnerApiTester } from '../utils/realApiTestHelper';

const tester = new CoOwnerApiTester();
await tester.runAllTests();
```

**Sử dụng trong browser console:**
```javascript
// Import helper
import { CoOwnerApiTester } from './utils/realApiTestHelper';

// Tạo instance
const tester = new CoOwnerApiTester();

// Chạy all tests
const results = await tester.runAllTests();

// Export results
const json = tester.exportResults();
console.log(json);
```

### 3. API Test UI Component (`src/components/test/ApiTestUI.jsx`)

Component React với giao diện trực quan để test API.

**Thêm vào routes:**
```javascript
// In AppRouter.jsx
import ApiTestUI from '../components/test/ApiTestUI';

<Route path="/test/api" element={<ApiTestUI />} />
```

**Truy cập:**
```
http://localhost:3000/test/api
```

## Quy trình Test

### Bước 1: Static Code Analysis

Chạy script phân tích code để kiểm tra cấu trúc:

```bash
node test-page-api-integration.js
```

**Kiểm tra:**
- ✅ Tất cả pages có import API
- ✅ Tất cả pages có API calls
- ✅ Có error handling (try-catch)
- ✅ Có loading states
- ✅ Có data validation (Array.isArray, safety checks)
- ✅ Có user feedback (Alert/Snackbar)

**Kết quả mong đợi:** 100% success rate

### Bước 2: Backend Connection Check

Đảm bảo backend đang chạy và có thể kết nối:

1. Kiểm tra `API_CONFIG.baseURL` trong `src/api/axiosClient.js`
   ```javascript
   export const API_CONFIG = {
     baseURL: process.env.REACT_APP_API_BASE_URL || 'https://localhost:7279',
     // ...
   };
   ```

2. Test kết nối cơ bản:
   ```bash
   curl https://localhost:7279/api/health
   # hoặc
   curl http://localhost:5000/api/health
   ```

### Bước 3: Authentication

Đăng nhập với tài khoản CoOwner để có access token:

1. Mở ứng dụng: `http://localhost:3000`
2. Đăng nhập với credentials
3. Kiểm tra localStorage:
   ```javascript
   localStorage.getItem('accessToken')
   localStorage.getItem('refreshToken')
   ```

### Bước 4: Test API Endpoints

#### Option A: Sử dụng API Test UI (Khuyến nghị)

1. Navigate đến: `http://localhost:3000/test/api`
2. Click "Chạy tất cả tests"
3. Xem kết quả real-time
4. Export results nếu cần

#### Option B: Browser Console

1. Mở Developer Tools (F12)
2. Chạy commands:

```javascript
// Import tester
const { CoOwnerApiTester } = await import('./utils/realApiTestHelper');

// Create instance
const tester = new CoOwnerApiTester();

// Run all tests
const results = await tester.runAllTests();

// Or run specific category
await tester.testProfileApis();
await tester.testVehicleApis();
await tester.testBookingApis();
// ... etc
```

#### Option C: Manual Testing trong Pages

Truy cập từng page và kiểm tra:

1. **BookingManagement** (`/coowner/bookings`)
   - ✅ Load danh sách bookings
   - ✅ Load danh sách xe
   - ✅ Tạo booking mới
   - ✅ Hủy booking

2. **FundManagement** (`/coowner/funds`)
   - ✅ Load fund information
   - ✅ Load contributions
   - ✅ Nạp tiền vào quỹ

3. **Group** (`/coowner/group`)
   - ✅ Load my groups
   - ✅ Load group members
   - ✅ Mời thành viên

4. **VehicleAvailability** (`/coowner/availability`)
   - ✅ Load my vehicles
   - ✅ Xem lịch trình xe
   - ✅ Tìm slot khả dụng

5. **AccountOwnership** (`/coowner/ownership`)
   - ✅ Load ownerships
   - ✅ Load ownership requests
   - ✅ Tạo ownership request

6. **PaymentManagement** (`/coowner/payments`)
   - ✅ Load payments
   - ✅ Load gateways
   - ✅ Make payment

7. **UsageAnalytics** (`/coowner/analytics`)
   - ✅ Load usage statistics
   - ✅ Load cost analysis
   - ✅ Environmental impact

8. **CoOwnerDashboard** (`/coowner/dashboard`)
   - ✅ Load dashboard stats
   - ✅ Load quick actions data

### Bước 5: Kiểm tra Response Data

Đối với mỗi API call, kiểm tra:

#### 1. Response Structure
```javascript
{
  statusCode: 200,
  message: "Success",
  data: { /* actual data */ },
  isSuccess: true
}
```

#### 2. Data Types
- Arrays được handle đúng
- Objects có đủ properties
- Dates được parse đúng format

#### 3. Empty States
- API trả về empty array `[]` thay vì null
- Pages handle empty data gracefully
- Show appropriate messages

#### 4. Error Responses
```javascript
{
  statusCode: 400/401/403/404/500,
  message: "Error message",
  data: null,
  isSuccess: false
}
```

### Bước 6: Error Handling Test

Test các trường hợp lỗi:

1. **Network Error**
   - Tắt backend
   - Reload page
   - Kiểm tra error message hiển thị

2. **401 Unauthorized**
   - Clear localStorage
   - Refresh page
   - Nên redirect về login

3. **500 Internal Server Error**
   - Test với invalid data
   - Kiểm tra error message

4. **Timeout**
   - Set timeout ngắn trong axiosClient
   - Test với slow endpoint

## Test Checklist

### Pre-Test Setup
- [ ] Backend đang chạy
- [ ] Database có dữ liệu test
- [ ] Environment variables configured
- [ ] Test user account có sẵn

### API Integration Test
- [ ] Tất cả API endpoints được định nghĩa
- [ ] coOwnerApi exports đầy đủ methods
- [ ] coOwnerService wraps API calls đúng
- [ ] axiosClient config đúng baseURL

### Page Integration Test
- [ ] BookingManagement loads data
- [ ] FundManagement loads data
- [ ] Group loads data
- [ ] VehicleAvailability loads data
- [ ] AccountOwnership loads data
- [ ] PaymentManagement loads data
- [ ] UsageAnalytics loads data
- [ ] CoOwnerDashboard loads data

### Error Handling Test
- [ ] Try-catch blocks work
- [ ] Error states update
- [ ] Loading states show/hide
- [ ] Alert messages display
- [ ] Network errors handled
- [ ] Auth errors redirect

### Data Validation Test
- [ ] Array.isArray checks work
- [ ] Optional chaining works
- [ ] Default values applied
- [ ] Null/undefined handled
- [ ] Date parsing works

## Common Issues và Solutions

### Issue 1: API Call Returns 404
**Nguyên nhân:** Endpoint path không đúng

**Solution:**
```javascript
// Kiểm tra endpoint trong coOwnerApi
// Đảm bảo match với backend routes
coOwnerApi.endpoint.method()
```

### Issue 2: CORS Error
**Nguyên nhân:** Backend chưa config CORS

**Solution:**
```csharp
// Backend: Program.cs
builder.Services.AddCors(options => {
  options.AddPolicy("AllowFrontend", policy => {
    policy.WithOrigins("http://localhost:3000")
          .AllowAnyHeader()
          .AllowAnyMethod();
  });
});
```

### Issue 3: 401 Unauthorized
**Nguyên nhân:** Missing hoặc expired token

**Solution:**
```javascript
// Kiểm tra token trong localStorage
console.log(localStorage.getItem('accessToken'));

// Refresh token hoặc login lại
```

### Issue 4: Data không hiển thị
**Nguyên nhân:** Response structure không đúng

**Solution:**
```javascript
// Check response structure
console.log('Response:', response);
console.log('Response.data:', response.data);

// Safe data extraction
const data = response.data?.data || response.data || [];
```

### Issue 5: Loading không dừng
**Nguyên nhân:** Missing finally block

**Solution:**
```javascript
try {
  setLoading(true);
  const response = await api.call();
  // handle response
} catch (error) {
  // handle error
} finally {
  setLoading(false); // Always set loading to false
}
```

## Best Practices

### 1. Data Loading
```javascript
useEffect(() => {
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await coOwnerApi.getData();
      const safeData = Array.isArray(response.data) 
        ? response.data 
        : [];
      setData(safeData);
    } catch (error) {
      console.error('Load data failed:', error);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);
```

### 2. Error Handling
```javascript
const handleAction = async () => {
  try {
    const response = await coOwnerApi.action(data);
    if (response.isSuccess) {
      showSuccess('Action completed successfully');
      refreshData();
    } else {
      showError(response.message);
    }
  } catch (error) {
    showError(error.message || 'Action failed');
  }
};
```

### 3. Multiple API Calls
```javascript
const loadAllData = async () => {
  setLoading(true);
  try {
    const [res1, res2, res3] = await Promise.allSettled([
      coOwnerApi.call1(),
      coOwnerApi.call2(),
      coOwnerApi.call3()
    ]);

    setData1(res1.status === 'fulfilled' ? res1.value.data : []);
    setData2(res2.status === 'fulfilled' ? res2.value.data : []);
    setData3(res3.status === 'fulfilled' ? res3.value.data : []);
  } catch (error) {
    console.error('Load failed:', error);
  } finally {
    setLoading(false);
  }
};
```

## Report và Documentation

### 1. Test Results
- Lưu test results vào file JSON
- Document các issues tìm thấy
- Track fix progress

### 2. API Documentation
- Document tất cả endpoints
- Response structures
- Error codes
- Example requests/responses

### 3. Integration Status
- Maintain checklist
- Update khi có thay đổi
- Share với team

## Next Steps

1. ✅ Hoàn thành static analysis
2. ✅ Setup test environment
3. 🔄 Run API tests với backend thật
4. 🔄 Fix các issues tìm thấy
5. 🔄 Re-test sau khi fix
6. 🔄 Document kết quả
7. ✅ Deploy và monitor

## Liên hệ

Nếu gặp vấn đề trong quá trình test:
1. Check console logs
2. Check network tab trong DevTools
3. Check backend logs
4. Contact backend team nếu endpoint issue
5. Create issue trong Git repository

---

**Last Updated:** 2 tháng 11, 2025
**Version:** 1.0
**Author:** Frontend Team
