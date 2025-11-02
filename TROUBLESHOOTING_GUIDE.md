# Hướng dẫn xử lý lỗi API 404/405

## 🚨 Lỗi hiện tại

Bạn đang gặp các lỗi sau:
- ❌ `404 Not Found` cho `/api/Health`, `/api/Vehicle`
- ❌ `405 Method Not Allowed` cho OPTIONS `/api/Auth/login`

## 📋 Checklist khắc phục

### 1. Kiểm tra Backend có đang chạy không?

**Mở terminal và chạy:**
```bash
# Nếu backend là .NET
cd path/to/your/backend
dotnet run

# Hoặc nếu đã build
dotnet your-backend.dll
```

**Backend phải đang chạy ở một trong các port:**
- `https://localhost:7279` (HTTPS)
- `http://localhost:5215` (HTTP)

### 2. Kiểm tra URL Backend trong Frontend

**File:** `e:\Ki5\Project\SWP\evco-ownership-fe\.env.local`

Đảm bảo URL đúng với backend của bạn:
```bash
REACT_APP_API_BASE_URL=https://localhost:7279
# hoặc
REACT_APP_API_BASE_URL=http://localhost:5215
```

**Sau khi sửa `.env.local`, BẮT BUỘC phải restart dev server:**
```bash
# Dừng server (Ctrl+C), sau đó chạy lại:
npm start
```

### 3. Test Backend trực tiếp

**Mở browser hoặc Postman, test các endpoint:**

```
# Health check
GET https://localhost:7279/api/coowner/profile

# Hoặc với HTTP
GET http://localhost:5215/api/coowner/profile
```

**Nếu backend trả về 401 Unauthorized** → OK! Backend đang chạy, chỉ cần login.

**Nếu backend trả về 404** → Endpoint không tồn tại, cần check backend code.

### 4. CORS Configuration (Backend)

Backend cần enable CORS cho frontend. Trong .NET backend:

**File: `Program.cs` hoặc `Startup.cs`**
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// ...

app.UseCors("AllowFrontend");
```

### 5. Kiểm tra Authentication Token

**Mở Browser DevTools → Application/Storage → Local Storage**

Cần có:
- ✅ `accessToken`: "Bearer ey..."
- ✅ `refreshToken`: "..."
- ✅ `user`: "{...}"

**Nếu không có token** → Cần login lại:
1. Đi đến trang login: `http://localhost:3000/login`
2. Login với tài khoản có role "CoOwner"
3. Sau khi login thành công, token sẽ được lưu tự động

### 6. Debug API Calls

**Trong Dashboard, mở Console và chạy:**
```javascript
// Kiểm tra config hiện tại
console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);

// Test API connection
await debugAPI();
```

## 🔧 Fix nhanh

### Solution 1: Backend chưa chạy
```bash
# Start backend
cd path/to/backend
dotnet run
```

### Solution 2: URL sai
```bash
# Update .env.local
echo REACT_APP_API_BASE_URL=http://localhost:5215 > .env.local

# Restart frontend
npm start
```

### Solution 3: Chưa login
1. Vào http://localhost:3000/login
2. Login với account CoOwner
3. Refresh dashboard

### Solution 4: CORS issue
- Fix CORS trong backend (xem mục 4)
- Restart backend
- Refresh frontend

## 📊 Kiểm tra kết quả

Sau khi fix, dashboard phải:
- ✅ Load được danh sách vehicles
- ✅ Load được bookings
- ✅ Load được fund info
- ✅ Load được groups
- ✅ Không có lỗi 404/405 trong Console

## 🎯 Next Steps

1. **Backend đang chạy** + **Frontend đã config đúng URL** → Dashboard sẽ load data thành công
2. Nếu vẫn lỗi → Check backend logs để xem API có implement chưa
3. Use API Test UI: http://localhost:3000/test/api để test từng endpoint

---

## 📞 Liên hệ

Nếu vẫn gặp vấn đề, cung cấp:
1. Backend URL bạn đang dùng
2. Backend có đang chạy không?
3. Screenshot lỗi trong Console
4. Response từ backend (nếu có)
