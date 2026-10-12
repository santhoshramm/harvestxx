import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// Farmer Pages
import CreateFarm from "./pages/farmer/CreateFarm";
import MyFarms from "./pages/farmer/MyFarms";
import BrowseFarms from "./pages/investor/BrowseFarms";
import MyInvestments from "./pages/investor/MyInvestments";
import HarvestFarm from "./pages/farmer/HarvestFarm";
import FarmerAnalytics from "./pages/farmer/FarmerAnalytics";
import Earnings from "./pages/investor/Earnings";
import Marketplace from "./pages/buyer/Marketplace";



function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>

        {/* ===== Public Routes ===== */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ===== Protected Routes ===== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-farm"
          element={
            <ProtectedRoute>
              <CreateFarm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-farms"
          element={
            <ProtectedRoute>
              <MyFarms />
            </ProtectedRoute>
          }
        />

        <Route
        path="/browse-farms"
        element={
            <ProtectedRoute>
            <BrowseFarms />
            </ProtectedRoute>
        }
        />
        <Route
          path="/my-investments"
          element={
            <ProtectedRoute>
              <MyInvestments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/harvest"
          element={
            <ProtectedRoute>
              <HarvestFarm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/farmer-analytics"
          element={
            <ProtectedRoute>
              <FarmerAnalytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/earnings"
          element={
            <ProtectedRoute>
              <Earnings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          }
        />


      </Routes>
    </div>
  );
}

export default App;
