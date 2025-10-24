# 🚗 **EV Co-ownership Platform - Role-Based Architecture**

## 📖 **Tổng quan**

Hệ thống đã được tái cấu trúc hoàn toàn để xoay quanh **Dashboard riêng cho từng vai trò**, thay vì sử dụng AppLayout làm layout chung. Mỗi role có navigation, layout, và API riêng biệt.

## 🏗️ **Cấu trúc mới**

### **1. Role-Based Dashboards**

| Vai trò | Dashboard Layout | Routes | Màu sắc chính |
|---------|------------------|--------|---------------|
| **Admin** | `AdminDashboardLayout` | `/admin/*` | 🔴 Red (#ef4444) |
| **Staff** | `StaffDashboardLayout` | `/staff/*` | 🔵 Blue (#0ea5e9) |
| **CoOwner** | `CoOwnerDashboardLayout` | `/coowner/*` | 🟢 Green (#10b981) |
| **Profile** | `ProfileDashboardLayout` | `/profile/*` | 🟣 Purple (#8b5cf6) |
| **Public** | `PublicLayout` | `/`, `/login`, `/register` | 🟢 Green (#10b981) |

### **2. Navigation Structure**

#### **Admin Dashboard** (`/admin/*`)
```
📊 Dashboard
├── 📈 Tổng quan
├── 👥 Quản lý hệ thống
│   ├── 👤 Quản lý người dùng
│   ├── 📜 Quản lý giấy phép
│   └── 👥 Nhóm đồng sở hữu
├── 📊 Báo cáo & Phân tích
│   ├── 💰 Báo cáo tài chính
│   └── 📈 Phân tích hệ thống
└── ⚙️ Cấu hình
    └── 🔧 Cấu hình hệ thống
```

#### **Staff Dashboard** (`/staff/*`)
```
📊 Dashboard
├── 📈 Tổng quan
├── 🚗 Quản lý xe
│   ├── 🚙 Quản lý nhóm xe
│   ├── ✅ Xác minh xe
│   └── 🔧 Dịch vụ xe
├── 📋 Hoạt động
│   ├── 📄 Hợp đồng điện tử
│   ├── ✅ Check-in/Check-out
│   └── ⚖️ Tranh chấp
└── ⚙️ Cấu hình
    └── 🔧 Cài đặt
```

#### **CoOwner Dashboard** (`/coowner/*`)
```
📊 Dashboard
├── 📈 Tổng quan
├── 🚗 Quản lý xe
│   ├── 🚙 Quản lý xe
│   ├── ➕ Thêm xe mới
│   ├── 📅 Lịch trình sử dụng
│   └── 📊 Phân tích hiệu suất
├── 📅 Booking & Lịch trình
│   ├── 📅 Lịch & đặt xe
│   └── 📋 Quản lý Booking
├── 💰 Tài chính
│   ├── 💳 Chi phí & thanh toán
│   ├── 💰 Quản lý Thanh toán
│   ├── 🏦 Quản lý Quỹ
│   └── 💎 Quản lý Cọc tiền
├── 🔧 Bảo dưỡng & Dịch vụ
│   ├── 🔧 Quản lý Bảo dưỡng
│   └── 🗳️ Bỏ phiếu Bảo trì
├── 👥 Nhóm & Cộng đồng
│   ├── 👥 Nhóm đồng sở hữu
│   ├── 📧 Lời mời đồng sở hữu
│   ├── 🗳️ Quản lý Bình chọn
│   └── ⚖️ Quản lý Tranh chấp
├── 📊 Báo cáo & Lịch sử
│   ├── 📋 Quản lý Báo cáo
│   ├── 📜 Lịch sử & phân tích
│   └── 📈 Phân tích Sử dụng
└── 🔔 Khác
    ├── 🔔 Quản lý Thông báo
    └── ⚖️ Tối ưu hóa Công bằng
```

### **3. API Structure**

#### **Role-Based API Organization**
```
src/api/
├── admin/
│   └── index.js          # adminApi - Admin-specific endpoints
├── staff/
│   └── index.js          # staffApi - Staff-specific endpoints  
├── coowner/
│   └── index.js          # coOwnerApi - CoOwner-specific endpoints
├── profile/
│   └── index.js          # profileApi - Profile management
├── shared/
│   └── index.js          # sharedApi - Common functionality
├── index.js              # Main API export with role-based access
└── [legacy files...]     # Existing API files (for compatibility)
```

#### **API Usage Examples**

**Admin APIs:**
```javascript
import { adminApi } from '@/api';

// Users management
await adminApi.users.getAll();
await adminApi.users.create(userData);

// Reports & Analytics
await adminApi.reports.getDashboardStats();
await adminApi.analytics.getOverview();
```

**Staff APIs:**
```javascript
import { staffApi } from '@/api';

// Vehicle verification
await staffApi.verification.getPendingVerifications();
await staffApi.verification.approveVehicle(id, notes);

// Fleet management
await staffApi.fleet.getAll();
await staffApi.fleet.updateStatus(id, 'active');
```

**CoOwner APIs:**
```javascript
import { coOwnerApi } from '@/api';

// Vehicle management
await coOwnerApi.vehicles.getMy();
await coOwnerApi.vehicles.create(vehicleData);

// Booking management
await coOwnerApi.bookings.create(bookingData);
await coOwnerApi.schedule.getMySchedule();
```

#### **Role-Based API Helper**
```javascript
import { getApiForRole } from '@/api';

// Get APIs based on user role
const userApi = getApiForRole(user.role);
// Returns relevant APIs for the user's role + shared + profile APIs
```

## 🔄 **Migration Guide**

### **From Old Structure to New Structure**

#### **Route Changes**
```javascript
// ❌ Old Routes
/dashboard/admin → /admin
/dashboard/staff → /staff  
/dashboard/coowner → /coowner
/co-owner/* → /coowner/*

// ✅ New Routes
/admin/* - Admin Dashboard Layout
/staff/* - Staff Dashboard Layout
/coowner/* - CoOwner Dashboard Layout
/profile/* - Profile Dashboard Layout
```

#### **Component Usage**
```javascript
// ❌ Old Way
import AppLayout from '@/components/layout/AppLayout';

// ✅ New Way - Use role-specific layouts
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';
import StaffDashboardLayout from '@/components/layout/StaffDashboardLayout';
import CoOwnerDashboardLayout from '@/components/layout/CoOwnerDashboardLayout';
```

#### **API Usage Migration**
```javascript
// ❌ Old Way
import vehicleApi from '@/api/vehicleApi';
import userApi from '@/api/userApi';

// ✅ New Way - Role-based
import { adminApi, coOwnerApi } from '@/api';

// Or use role helper
import { getApiForRole } from '@/api';
const api = getApiForRole(user.role);
```

## 🎨 **Design System**

### **Color Coding by Role**
- **Admin**: Red (#ef4444) - Authority, Control
- **Staff**: Blue (#0ea5e9) - Professional, Trustworthy  
- **CoOwner**: Green (#10b981) - Growth, Harmony
- **Profile**: Purple (#8b5cf6) - Personal, Individual

### **Navigation UX Rules**
1. **Sidebar per role**: Logical grouping by function
2. **Breadcrumbs**: Based on nested route structure
3. **Quick actions**: Role-specific shortcuts in header
4. **Mobile responsive**: Drawer pattern for all dashboards

## 📱 **Responsive Design**

All Dashboard Layouts implement:
- **Desktop**: Permanent sidebar navigation
- **Mobile**: Collapsible drawer navigation
- **Tablet**: Responsive breakpoints

## 🚀 **Performance Features**

- **Lazy Loading**: Each Dashboard can be lazy-loaded by role
- **Code Splitting**: Role-based chunks for optimization
- **Role-based Routing**: Only load routes for user's role
- **API Optimization**: Only include relevant APIs per role

## 🔧 **Development Benefits**

### **✅ Advantages**
- **Clear Separation**: Each role has its own space
- **Easy Maintenance**: Role-specific code in one place
- **Scalable**: Easy to add new roles
- **Performance**: Optimized loading per role
- **Security**: Role-based access control

### **📝 Next Steps**
1. Update existing pages to use new API structure
2. Implement lazy loading for Dashboard components
3. Add role-based permission guards
4. Create role-specific themes and styles
5. Remove legacy AppLayout completely

---

**📧 Contact**: Development Team
**📅 Updated**: October 2025
**🔄 Version**: 2.0 - Role-Based Architecture