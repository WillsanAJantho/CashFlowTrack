// import { Routes, Route } from "react-router-dom";
// import LandingPage from "./pages/LandingPage";
// import LoginPage from "./pages/LoginPage";
// import SignUpPage from "./pages/SignUpPage";
// import DashboardPage from "./pages/DashboardPage";
// import ManualInput from "./pages/ManualInput";
// import ScanReceipt from "./pages/ScanReceipt";
// import ExpenseReport from "./pages/ExpenseReport";
// import ProtectedRoute from "./components/ProtectedRoute"; 
// import AccountSettingsPage from "./pages/AccountSettingsPage"; // ✅

// function App() {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/signup" element={<SignUpPage />} />

//       {/* Protected Dashboard Layout */}
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <DashboardPage />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<ManualInput />} /> {/* default */}
//         <Route path="manual-input" element={<ManualInput />} />
//         <Route path="scan-receipt" element={<ScanReceipt />} />
//         <Route path="expense-report" element={<ExpenseReport />} />
//       </Route>

//       {/* ✅ Standalone Protected Account Settings Page */}
//       <Route
//         path="/account"
//         element={
//           <ProtectedRoute>
//             <AccountSettingsPage />
//           </ProtectedRoute>
//         }
//       />
//     </Routes>
//   );
// }

// export default App;

// src/App.jsx
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import VerificationPage from "./pages/VerificationPage"; // ✅ New page
import DashboardPage from "./pages/DashboardPage";
import ManualInput from "./pages/ManualInput";
import ScanReceipt from "./pages/ScanReceipt";
import ExpenseReport from "./pages/ExpenseReport";
import ProtectedRoute from "./components/ProtectedRoute"; 
import AccountSettingsPage from "./pages/AccountSettingsPage";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/verify" element={<VerificationPage />} /> {/* ✅ New */}

      {/* Protected Dashboard Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManualInput />} /> {/* default */}
        <Route path="manual-input" element={<ManualInput />} />
        <Route path="scan-receipt" element={<ScanReceipt />} />
        <Route path="expense-report" element={<ExpenseReport />} />
      </Route>

      {/* Standalone Protected Account Settings Page */}
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountSettingsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
