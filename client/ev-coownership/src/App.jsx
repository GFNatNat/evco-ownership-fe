import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import GroupsPage from "./pages/GroupsPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import CalendarPage from "./pages/CalendarPage";
import LoginPage from "./pages/LoginPage";
import CostListPage from "./pages/CostListPage";
import CostCreatePage from "./pages/CostCreatePage";
import KycUpload from './pages/KycUpload';
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<Layout />}> 
          <Route index element={<DashboardPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="groups/:id" element={<GroupDetailPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="costs" element={<CostListPage />} />
          <Route path="costs/create" element={<CostCreatePage />} />
          <Route path="/kyc" element={<KycUpload />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
export default App;