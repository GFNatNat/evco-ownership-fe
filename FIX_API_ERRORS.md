# 🔧 HƯỚNG DẪN FIX LỖI API 404/405

## ❌ CÁC LỖI HIỆN TẠI

Từ screenshot của bạn, tôi thấy các lỗi sau:

1. **404 Not Found**:
   - `GET https://localhost:7279/api/Health` 
   - `GET https://localhost:7279/api/Vehicle`
   
2. **405 Method Not Allowed**:
   - `OPTIONS https://localhost:7279/api/Auth/login`

## ✅ NGUYÊN NHÂN & GIẢI PHÁP

### 🔍 Phân tích nguyên nhân

#### 1. Backend chưa chạy hoặc chạy sai port
**Triệu chứng**: Tất cả API đều trả về lỗi kết nối hoặc 404
**Nguyên nhân**: Backend không chạy hoặc chạy ở port khác với frontend config

#### 2. API endpoints chưa được implement
**Triệu chứng**: 404 Not Found cho specific endpoints
**Nguyên nhân**: Backend chưa có controller/route cho endpoint đó

#### 3. CORS chưa được config
**Triệu chứng**: 405 Method Not Allowed cho OPTIONS request
**Nguyên nhân**: Backend không cho phép CORS từ frontend

### 🛠️ CÁCH FIX

## BƯỚC 1: Kiểm tra Backend

### 1.1. Xác nhận Backend đang chạy

Mở terminal mới và navigate đến folder backend:

```powershell
# Navigate to backend folder
cd E:\path\to\your\backend

# Run backend
dotnet run
```

**Kết quả mong đợi**:
```
Now listening on: https://localhost:7279
Now listening on: http://localhost:5215
```

### 1.2. Test backend trực tiếp

Mở browser hoặc Postman, test URL:
```
https://localhost:7279/api/coowner/profile
```

**Các kết quả có thể**:
- ✅ `401 Unauthorized` → Backend OK, chỉ cần login
- ❌ `404 Not Found` → Endpoint chưa implement hoặc routing sai
- ❌ `Connection refused` → Backend chưa chạy

## BƯỚC 2: Cấu hình Frontend

### 2.1. Kiểm tra file .env.local

File đã được tạo tại: `E:\Ki5\Project\SWP\evco-ownership-fe\.env.local`

Nội dung hiện tại:
```bash
REACT_APP_API_BASE_URL=https://localhost:7279
```

**Nếu backend chạy ở port khác**, sửa thành:
```bash
# Cho HTTP
REACT_APP_API_BASE_URL=http://localhost:5215

# Hoặc HTTPS
REACT_APP_API_BASE_URL=https://localhost:7279
```

### 2.2. Restart Frontend Dev Server

**⚠️ QUAN TRỌNG**: Sau khi sửa `.env.local`, BẮT BUỘC phải restart dev server!

```powershell
# Trong terminal đang chạy frontend, nhấn Ctrl+C để stop
# Sau đó chạy lại:
npm start
```

## BƯỚC 3: Fix CORS trong Backend

### 3.1. Cấu hình CORS cho ASP.NET Core

**File: `Program.cs` hoặc `Startup.cs`**

Thêm code sau:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",  // React dev server
            "https://localhost:3000"  // If using HTTPS
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// ... other services ...

var app = builder.Build();

// Use CORS - PHẢI ĐẶT TRƯỚC app.UseAuthorization()
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```

### 3.2. Restart Backend

Sau khi thêm CORS config:
```powershell
# Stop backend (Ctrl+C)
# Run again
dotnet run
```

## BƯỚC 4: Xác minh Authentication

### 4.1. Kiểm tra Token trong Browser

1. Mở trang dashboard
2. Nhấn `F12` → Tab `Application` (Chrome) hoặc `Storage` (Firefox)
3. Chọn `Local Storage` → `http://localhost:3000`
4. Kiểm tra các key:
   - `accessToken` - Phải có giá trị
   - `refreshToken` - Phải có giá trị
   - `user` - Phải có thông tin user

### 4.2. Nếu không có Token - Login lại

```
1. Đi đến: http://localhost:3000/login
2. Login với account có role "CoOwner"
3. Sau khi login thành công, quay lại dashboard
```

## BƯỚC 5: Test API Integration

### 5.1. Sử dụng Backend Status Checker

Dashboard giờ đã có component **BackendStatusChecker** hiển thị ở đầu trang.

Component này sẽ tự động:
- ✅ Kiểm tra kết nối backend
- ✅ Hiển thị trạng thái (Online/Offline/Error)
- ✅ Cung cấp chi tiết lỗi
- ✅ Gợi ý cách fix

### 5.2. Sử dụng API Test UI

Navigate đến: `http://localhost:3000/test/api`

Test từng API endpoint để xem endpoint nào hoạt động, endpoint nào lỗi.

### 5.3. Test bằng Console

Mở Console trong browser (F12), chạy:

```javascript
// Test API connection
debugAPI();

// Test specific endpoint
testSpecificEndpoint('/api/coowner/profile', 'GET');
```

## BƯỚC 6: Xác minh Kết quả

### Dashboard phải:
- ✅ Hiển thị banner xanh "Backend is online and ready"
- ✅ Load được danh sách vehicles
- ✅ Load được bookings
- ✅ Load được fund info
- ✅ Load được groups
- ✅ Không có lỗi 404/405 trong Console

## 🎯 CHECKLIST HOÀN CHỈNH

### Backend:
- [ ] Backend đang chạy: `dotnet run`
- [ ] Backend listening trên đúng port (7279 hoặc 5215)
- [ ] CORS đã được config
- [ ] API endpoints đã được implement
- [ ] Database connection OK

### Frontend:
- [ ] `.env.local` có đúng backend URL
- [ ] Frontend dev server đã restart sau khi sửa .env
- [ ] User đã login và có token trong localStorage
- [ ] BackendStatusChecker hiển thị "online"
- [ ] Dashboard load data thành công

## 🆘 VẪN KHÔNG HOẠT ĐỘNG?

### Debug checklist:

1. **Backend logs**: Check terminal đang chạy backend
   - Có thấy request từ frontend không?
   - Có error nào trong logs không?

2. **Network tab**: Trong browser DevTools → Network
   - Request có được gửi không?
   - Response code là gì?
   - Response body có gì?

3. **Console errors**: Trong browser DevTools → Console
   - Có error nào khác ngoài API calls không?
   - Error message chi tiết là gì?

### Các trường hợp đặc biệt:

#### Lỗi SSL Certificate (HTTPS)

Nếu gặp lỗi SSL với `https://localhost:7279`:

**Option 1**: Chuyển sang HTTP
```bash
# .env.local
REACT_APP_API_BASE_URL=http://localhost:5215
```

**Option 2**: Trust certificate
```powershell
# Trust dev certificate
dotnet dev-certs https --trust
```

#### Backend chạy trong Docker

Nếu backend chạy trong Docker container:
```bash
# .env.local - Dùng host.docker.internal
REACT_APP_API_BASE_URL=http://host.docker.internal:5215
```

#### Backend deploy trên server khác

Nếu backend không chạy local:
```bash
# .env.local
REACT_APP_API_BASE_URL=https://your-backend-domain.com
```

## 📞 BÁO CÁO LỖI

Nếu sau tất cả các bước trên vẫn không fix được, cung cấp thông tin sau:

1. **Backend status**: Backend có đang chạy không? Port nào?
2. **Backend URL**: URL backend thực tế là gì?
3. **Frontend .env.local**: Nội dung file .env.local
4. **Console errors**: Screenshot/copy đầy đủ errors trong Console
5. **Network tab**: Screenshot/copy request/response chi tiết
6. **Backend logs**: Copy logs từ terminal backend

---

## 🎉 EXPECTED RESULT

Sau khi fix xong, dashboard sẽ:

1. **Hiển thị banner màu xanh**: "Backend is online and ready"
2. **Load vehicles**: Danh sách xe hiển thị với thông tin đầy đủ
3. **Load bookings**: Danh sách booking gần đây
4. **Load funds**: Thông tin quỹ và số dư
5. **Load groups**: Danh sách groups bạn tham gia
6. **No errors**: Console sạch sẽ, không có lỗi 404/405

## 📚 FILES ĐÃ TẠO/SỬA

1. ✅ `.env.local` - Backend URL configuration
2. ✅ `TROUBLESHOOTING_GUIDE.md` - Hướng dẫn troubleshooting
3. ✅ `FIX_API_ERRORS.md` - File này (detailed fix guide)
4. ✅ `BackendStatusChecker.jsx` - Component kiểm tra backend status
5. ✅ `CoOwnerDashboard.jsx` - Thêm BackendStatusChecker vào dashboard

## 🚀 NEXT STEPS

Sau khi API hoạt động:

1. Test tất cả các pages khác (BookingManagement, PaymentManagement, etc.)
2. Verify tất cả CRUD operations
3. Test error handling
4. Test với nhiều users khác nhau
5. Performance testing với nhiều concurrent requests
