# 🚀 Quick Fix Guide - API Connection Issues

## 🎯 TÓM TẮT VẤN ĐỀ

Bạn đang gặp lỗi **404 Not Found** và **405 Method Not Allowed** khi frontend gọi API backend.

## ⚡ QUICK FIX (3 bước nhanh)

### Bước 1: Chạy Backend

```powershell
# Mở terminal mới
cd E:\path\to\your\backend
dotnet run
```

### Bước 2: Kiểm tra/Cập nhật .env.local

File `.env.local` đã được tạo với nội dung:
```bash
REACT_APP_API_BASE_URL=https://localhost:7279
```

Nếu backend chạy ở port khác, sửa thành port tương ứng.

### Bước 3: Restart Frontend

```powershell
# Stop dev server (Ctrl+C)
npm start
```

## 🔍 KIỂM TRA TỰ ĐỘNG

Chạy script PowerShell để kiểm tra tự động:

```powershell
.\check-api-status.ps1
```

Script sẽ:
- ✅ Kiểm tra .env.local configuration
- ✅ Test backend connection trên nhiều ports
- ✅ Gợi ý fix nếu có lỗi
- ✅ Tự động cập nhật .env.local nếu cần

## 📊 KIỂM TRA TRẠNG THÁI

### Cách 1: Qua Dashboard UI

1. Mở dashboard: `http://localhost:3000/coowner/dashboard`
2. Xem banner ở đầu trang:
   - 🟢 **Xanh lá**: Backend online - OK!
   - 🔴 **Đỏ**: Backend offline - Cần start backend
   - 🟡 **Vàng**: Có vấn đề - Xem chi tiết trong banner

### Cách 2: Qua Console

1. Mở dashboard
2. Press `F12` → Console tab
3. Chạy: `debugAPI()`

## 📚 TÀI LIỆU CHI TIẾT

- **[FIX_API_ERRORS.md](./FIX_API_ERRORS.md)** - Hướng dẫn fix chi tiết từng bước
- **[TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)** - Troubleshooting guide đầy đủ
- **[API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)** - Hướng dẫn test API

## 🛠️ TOOLS ĐÃ TẠO

### 1. BackendStatusChecker Component
- Hiển thị trạng thái backend real-time
- Tự động check connection
- Gợi ý fix nếu có lỗi
- **Vị trí**: Đầu trang CoOwnerDashboard

### 2. API Test UI
- Test từng endpoint riêng lẻ
- Xem request/response chi tiết
- **URL**: `http://localhost:3000/test/api`

### 3. PowerShell Diagnostic Script
- Check backend connection tự động
- Verify .env.local configuration
- **Run**: `.\check-api-status.ps1`

## ❓ FAQ

### Q: Backend đã chạy nhưng vẫn lỗi 404?

**A**: Có thể port sai. Kiểm tra:
1. Backend đang listen port nào? (Xem terminal backend)
2. Frontend đang config port nào? (Xem .env.local)
3. Hai cái có khớp nhau không?

### Q: Sửa .env.local rồi nhưng vẫn lỗi?

**A**: Bạn đã restart dev server chưa? Thay đổi .env cần restart:
```powershell
# Ctrl+C để stop
npm start  # Start lại
```

### Q: Vẫn lỗi 401 Unauthorized?

**A**: Đây là good sign! Backend OK, chỉ cần login:
1. Đi đến: `http://localhost:3000/login`
2. Login với account CoOwner
3. Token sẽ được lưu tự động

### Q: Lỗi SSL/Certificate với HTTPS?

**A**: Chuyển sang HTTP:
```bash
# .env.local
REACT_APP_API_BASE_URL=http://localhost:5215
```

## 🎉 EXPECTED RESULT

Sau khi fix thành công:

1. ✅ Dashboard hiển thị banner xanh "Backend is online and ready"
2. ✅ Danh sách vehicles load ra
3. ✅ Bookings hiển thị
4. ✅ Fund info hiển thị
5. ✅ Console không còn lỗi 404/405

## 🆘 VẪN KHÔNG FIX ĐƯỢC?

Cung cấp thông tin sau để được hỗ trợ:

1. **Backend status**: 
   - Backend có đang chạy không?
   - Port nào?
   - Copy terminal output khi start backend

2. **Frontend config**:
   - Nội dung file .env.local
   - Dev server có restart sau khi sửa .env không?

3. **Errors**:
   - Screenshot console errors
   - Screenshot network tab
   - Copy error message đầy đủ

4. **Test results**:
   - Kết quả của `.\check-api-status.ps1`
   - Kết quả của `debugAPI()` trong console

---

## 🔗 FILES REFERENCE

| File | Mục đích |
|------|----------|
| `.env.local` | Backend URL configuration |
| `check-api-status.ps1` | Automated diagnostic script |
| `FIX_API_ERRORS.md` | Detailed fix guide |
| `TROUBLESHOOTING_GUIDE.md` | Comprehensive troubleshooting |
| `BackendStatusChecker.jsx` | Real-time status component |
| `coOwnerService.ts` | Service layer với API calls |
| `api/coowner/index.js` | API endpoint definitions |

## 📞 SUPPORT

- GitHub Issues: [Create issue](https://github.com/GFNatNat/evco-ownership-fe/issues)
- Email: support@evco.com
- Documentation: [API Docs](./API_DOCUMENTATION/)

---

**Last Updated**: 2025-11-02  
**Version**: 1.0.0  
**Status**: ✅ Ready to use
