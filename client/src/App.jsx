import React from "react";
import { Box } from "@mui/material";

// pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/account/Profile";
import Security from "./pages/account/Security";

import MyVehicles from "./pages/Ownership/MyVehicles";
import OwnershipDetail from "./pages/Ownership/OwnershipDetail";
import Ownership from "./pages/Ownership/Ownership";

import BookingCalendar from "./pages/booking/BookingCalendar";
import MyBookings from "./pages/booking/MyBookings";

import AddCost from "./pages/Costs/AddCost";
import CostsOverview from "./pages/Costs/CostsOverview";
import PaymentsHistory from "./pages/Costs/PaymentsHistory";

import GroupsList from "./pages/groups/GroupsList";
import GroupDetail from "./pages/groups/GroupDetail";
import GroupCreate from "./pages/groups/GroupCreate";
import GroupManagement from "./pages/groups/GroupManagement";

import Vehicles from "./pages/Vehicles/Vehicles";
import VehicleDetail from "./pages/Vehicles/VehicleDetail";

export default function App() {
  return (
    <Box>
      <Routes>
        <Route index element={<Dashboard />} />

        {/* Account */}
        <Route path="profile" element={<Profile />} />
        <Route path="security" element={<Security />} />

        {/* Ownership */}
        <Route path="ownership" element={<MyVehicles />} />
        <Route path="ownership/:id" element={<OwnershipDetail />} />

        {/* Booking */}
        <Route path="booking" element={<BookingList />} />
        <Route path="booking/new" element={<BookingCreate />} />
        <Route path="calendar" element={<CalendarPage />} />

        {/* Payments */}
        <Route path="expenses" element={<Expenses />} />
        <Route path="expenses/new" element={<AddExpense />} />
        <Route path="payments" element={<Payments />} />

        {/* Groups */}
        <Route path="groups" element={<Groups />} />
        <Route path="groups/:groupId" element={<GroupDetail />} />
        <Route path="invites" element={<GroupInvites />} />
      </Routes>
    </Box>
  );
}
