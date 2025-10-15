// import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { User, Menu } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";

// export default function DashboardPage() {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     if (!user) {
//       navigate("/login", { replace: true });
//     }
//   }, [user, navigate]);

//   return (
//     <div className="min-h-screen w-full flex flex-col bg-[#cce0d6] overflow-x-hidden">
//       {/* Navbar */}
//       <header className="flex justify-between items-center px-4 sm:px-8 py-4 bg-gray-900 text-white">
//         {/* Logo */}
//         <div className="flex items-center space-x-2">
//           <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
//             <span className="font-bold text-sm">C</span>
//           </div>
//           <span className="font-semibold text-lg">CashFlowTrack</span>
//         </div>

//         {/* Navbar Right */}
//         <div className="flex items-center space-x-4">
//           {!user ? (
//             <Link
//               to="/login"
//               className="relative font-medium text-white transition-all duration-300 
//                          hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
//             >
//               Login
//             </Link>
//           ) : (
//             <>
//               <span className="hidden sm:inline text-sm font-medium">{user.email}</span>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => navigate("/account")}
//                 className="rounded-full hover:bg-gray-800 transition-all hover:scale-125"
//               >
//                 <User className="w-8 h-8 sm:w-10 sm:h-10" />
//               </Button>
//               <Button
//                 onClick={logout}
//                 className="hidden sm:inline bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm"
//               >
//                 Logout
//               </Button>
//             </>
//           )}

//           {/* Mobile Menu Button */}
//           <Button
//             variant="ghost"
//             size="icon"
//             className="sm:hidden"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//           >
//             <Menu className="w-6 h-6" />
//           </Button>
//         </div>
//       </header>

//       {/* Body */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <aside
//           className={`fixed sm:static top-0 left-0 h-full sm:h-auto w-64 sm:w-60 bg-gray-900 text-white 
//                      flex flex-col p-6 space-y-6 shadow-xl transform 
//                      ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"} 
//                      transition-transform duration-300 ease-in-out z-40`}
//         >
//           <h2 className="text-xl font-extrabold tracking-wide">Menu</h2>
//           <nav className="flex flex-col space-y-3">
//             <NavLink
//               to="/dashboard/manual-input"
//               className={({ isActive }) =>
//                 `font-medium px-4 py-2 rounded-lg transition-all 
//                  ${isActive
//                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-105"
//                    : "hover:bg-gray-700/60 hover:scale-105"}`
//               }
//               onClick={() => setSidebarOpen(false)}
//             >
//               Manual Input
//             </NavLink>
//             <NavLink
//               to="/dashboard/scan-receipt"
//               className={({ isActive }) =>
//                 `font-medium px-4 py-2 rounded-lg transition-all 
//                  ${isActive
//                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-105"
//                    : "hover:bg-gray-700/60 hover:scale-105"}`
//               }
//               onClick={() => setSidebarOpen(false)}
//             >
//               Scan Receipt
//             </NavLink>
//             <NavLink
//               to="/dashboard/expense-report"
//               className={({ isActive }) =>
//                 `font-medium px-4 py-2 rounded-lg transition-all 
//                  ${isActive
//                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-105"
//                    : "hover:bg-gray-700/60 hover:scale-105"}`
//               }
//               onClick={() => setSidebarOpen(false)}
//             >
//               Expense Report
//             </NavLink>
//           </nav>
//         </aside>

//         {/* Main content */}
//         <main className="flex-1 p-4 sm:p-8 mt-16 sm:mt-0 overflow-x-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Menu, Home } from "lucide-react"; // ✅ Added Home icon
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#cce0d6] overflow-x-hidden">
      {/* Navbar */}
      <header className="flex justify-between items-center px-4 sm:px-8 py-4 bg-gray-900 text-white">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
            <span className="font-bold text-sm">C</span>
          </div>
          <span className="font-semibold text-lg">CashFlowTrack</span>
        </div>

        {/* Navbar Right */}
        <div className="flex items-center space-x-4">
          {/* ✅ Home button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full hover:bg-gray-800 transition-all hover:scale-125"
          >
            <Home className="w-8 h-8 sm:w-10 sm:h-10" />
          </Button>

          {!user ? (
            <Link
              to="/login"
              className="relative font-medium text-white transition-all duration-300 
                         hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            >
              Login
            </Link>
          ) : (
            <>
              <span className="hidden sm:inline text-sm font-medium">{user.email}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/account")}
                className="rounded-full hover:bg-gray-800 transition-all hover:scale-125"
              >
                <User className="w-8 h-8 sm:w-10 sm:h-10" />
              </Button>
              <Button
                onClick={logout}
                className="hidden sm:inline bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm"
              >
                Logout
              </Button>
            </>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed sm:static top-0 left-0 h-full sm:h-auto w-64 sm:w-60 bg-gray-900 text-white 
                     flex flex-col p-6 space-y-6 shadow-xl transform 
                     ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"} 
                     transition-transform duration-300 ease-in-out z-40`}
        >
          <h2 className="text-xl font-extrabold tracking-wide">Menu</h2>
          <nav className="flex flex-col space-y-3">
            <NavLink
              to="/dashboard/manual-input"
              className={({ isActive }) =>
                `font-medium px-4 py-2 rounded-lg transition-all 
                 ${isActive
                   ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-105"
                   : "hover:bg-gray-700/60 hover:scale-105"}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              Manual Input
            </NavLink>
            <NavLink
              to="/dashboard/scan-receipt"
              className={({ isActive }) =>
                `font-medium px-4 py-2 rounded-lg transition-all 
                 ${isActive
                   ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-105"
                   : "hover:bg-gray-700/60 hover:scale-105"}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              Scan Receipt
            </NavLink>
            <NavLink
              to="/dashboard/expense-report"
              className={({ isActive }) =>
                `font-medium px-4 py-2 rounded-lg transition-all 
                 ${isActive
                   ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-105"
                   : "hover:bg-gray-700/60 hover:scale-105"}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              Expense Report
            </NavLink>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-8 mt-16 sm:mt-0 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
