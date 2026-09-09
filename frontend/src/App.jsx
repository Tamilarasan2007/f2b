import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth, ROLE_ROUTES } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Layouts
import FarmerLayout from './layouts/FarmerLayout';
import DriverLayout from './layouts/DriverLayout';
import OperatorLayout from './layouts/OperatorLayout';
import AdminLayout from './layouts/AdminLayout';
import BuyerLayout from './layouts/BuyerLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import AddCrop from './pages/farmer/AddCrop';
import FarmerPickups from './pages/farmer/FarmerPickups';
import DemandForecast from './pages/farmer/DemandForecast';
import FarmerNegotiations from './pages/farmer/FarmerNegotiations';
import UserManual from './pages/farmer/UserManual';
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverRoute from './pages/driver/DriverRoute';
import OperatorDashboard from './pages/operator/OperatorDashboard';
import OperatorPickups from './pages/operator/OperatorPickups';
import CreateRoute from './pages/operator/CreateRoute';
import OperatorRoutes from './pages/operator/OperatorRoutes';
import OperatorVehicles from './pages/operator/OperatorVehicles';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import BuyerOrders from './pages/buyer/BuyerOrders';
import CreateOrder from './pages/buyer/CreateOrder';
import BuyerDealerBidding from './pages/buyer/BuyerDealerBidding';
import BuyerNegotiations from './pages/buyer/BuyerNegotiations';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFarmers from './pages/admin/AdminFarmers';
import AdminDrivers from './pages/admin/AdminDrivers';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminRoutes from './pages/admin/AdminRoutes';

import './index.css';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const userHome = ROLE_ROUTES[user.role] || '/login';
    return <Navigate to={userHome} replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Farmer */}
      <Route path="/farmer" element={<ProtectedRoute allowedRoles={['FARMER']}><FarmerLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/farmer/dashboard" replace />} />
        <Route path="dashboard" element={<FarmerDashboard />} />
        <Route path="add-crop" element={<AddCrop />} />
        <Route path="pickups" element={<FarmerPickups />} />
        <Route path="forecast" element={<DemandForecast />} />
        <Route path="negotiations" element={<FarmerNegotiations />} />
        <Route path="manual" element={<UserManual />} />
      </Route>
      <Route path="/manual" element={<UserManual />} />

      {/* Driver */}
      <Route path="/driver" element={<ProtectedRoute allowedRoles={['DRIVER']}><DriverLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/driver/dashboard" replace />} />
        <Route path="dashboard" element={<DriverDashboard />} />
        <Route path="route/:id" element={<DriverRoute />} />
      </Route>

      {/* Operator */}
      <Route path="/operator" element={<ProtectedRoute allowedRoles={['COLLECTION_POINT_OPERATOR', 'ADMIN']}><OperatorLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/operator/dashboard" replace />} />
        <Route path="dashboard" element={<OperatorDashboard />} />
        <Route path="pickups" element={<OperatorPickups />} />
        <Route path="routes" element={<OperatorRoutes />} />
        <Route path="routes/create" element={<CreateRoute />} />
        <Route path="vehicles" element={<OperatorVehicles />} />
      </Route>

      {/* Buyer */}
      <Route path="/buyer" element={<ProtectedRoute allowedRoles={['BUYER']}><BuyerLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/buyer/dashboard" replace />} />
        <Route path="dashboard" element={<BuyerDashboard />} />
        <Route path="orders" element={<BuyerOrders />} />
        <Route path="orders/create" element={<CreateOrder />} />
        <Route path="bidding" element={<BuyerDealerBidding />} />
        <Route path="negotiations" element={<BuyerNegotiations />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="farmers" element={<AdminFarmers />} />
        <Route path="drivers" element={<AdminDrivers />} />
        <Route path="vehicles" element={<AdminVehicles />} />
        <Route path="routes" element={<AdminRoutes />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
