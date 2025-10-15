// import { Button } from "@/components/ui/button";
// import { User } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";

// export default function LandingPage() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex flex-col bg-[#cce0d6]">
//       {/* Navbar */}
//       <header className="flex flex-wrap justify-between items-center px-4 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white">
//         {/* Logo */}
//         <div className="flex items-center space-x-2">
//           <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
//             <span className="font-bold text-sm">C</span>
//           </div>
//           <span className="font-semibold text-base sm:text-lg">CashFlowTrack</span>
//         </div>

//         {/* Navbar Links */}
//         <nav className="flex items-center space-x-4 sm:space-x-6 mt-2 sm:mt-0">
//           {/* Home */}
//           <Link
//             to="/"
//             className="relative font-medium text-white text-sm sm:text-base transition-all duration-300 
//                        hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
//           >
//             Home
//           </Link>

//           {!user ? (
//             <Link
//               to="/login"
//               className="relative font-medium text-white text-sm sm:text-base transition-all duration-300 
//                          hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
//             >
//               Login
//             </Link>
//           ) : (
//             <>
//               {/* Email */}
//               <span className="hidden sm:inline text-xs sm:text-sm font-medium">
//                 {user.email}
//               </span>

//               {/* Account Icon */}
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => navigate("/account")}
//                 className="rounded-full hover:bg-gray-800 transform transition-all duration-300 hover:scale-110"
//               >
//                 <User className="w-7 h-7 sm:w-8 sm:h-8" />
//               </Button>

//               {/* Logout */}
//               <Button
//                 onClick={logout}
//                 className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1 rounded-lg text-xs sm:text-sm"
//               >
//                 Logout
//               </Button>
//             </>
//           )}
//         </nav>
//       </header>

//       {/* Hero Section */}
//       <main className="flex flex-1 flex-col md:flex-row items-center justify-between px-6 sm:px-10 py-12 sm:py-16 md:py-24">
//         {/* Left Content */}
//         <div className="max-w-lg space-y-4 sm:space-y-6 text-center md:text-left">
//           <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black drop-shadow-lg">
//             Manage Your Expenses
//           </h1>
//           <p className="text-gray-800 text-sm sm:text-base md:text-lg leading-relaxed">
//             Effortlessly track your expenses and receipts in one secure place.
//             Start organizing today and gain real control of your finances — it's
//             quick, simple, and safe.
//           </p>

//           {/* CTA Button */}
//           <Button
//             onClick={() => {
//               if (user) {
//                 navigate("/dashboard");
//               } else {
//                 navigate("/login");
//               }
//             }}
//             className="bg-gradient-to-r from-teal-400 to-cyan-500 
//                        hover:from-teal-500 hover:to-cyan-600
//                        text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl
//                        shadow-lg shadow-cyan-500/40
//                        transform transition-all duration-300
//                        hover:scale-105 hover:shadow-xl hover:shadow-cyan-600/50
//                        active:scale-95"
//           >
//             🚀 Get Started
//           </Button>
//         </div>

//         {/* Right Image */}
//         <div className="w-full flex justify-center md:justify-end mt-8 md:mt-0 md:ml-10">
//           <img
//             src="/hero.png"
//             alt="Expense tracking illustration"
//             className="w-2/3 sm:w-3/4 max-w-[220px] sm:max-w-sm md:max-w-md lg:max-w-lg drop-shadow-2xl"
//           />
//         </div>
//       </main>
//     </div>
//   );
// }

import { Button } from "@/components/ui/button";
import { User, Home } from "lucide-react"; // ✅ Added Home icon
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#cce0d6]">
      {/* Navbar */}
      <header className="flex flex-wrap justify-between items-center px-4 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
            <span className="font-bold text-sm">C</span>
          </div>
          <span className="font-semibold text-base sm:text-lg">CashFlowTrack</span>
        </div>

        {/* Navbar Links */}
        <nav className="flex items-center space-x-4 sm:space-x-6 mt-2 sm:mt-0">
          {/* ✅ Home button same as Dashboard */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full hover:bg-gray-800 transition-all hover:scale-125"
          >
            <Home className="w-7 h-7 sm:w-8 sm:h-8" />
          </Button>

          {!user ? (
            <Link
              to="/login"
              className="relative font-medium text-white text-sm sm:text-base transition-all duration-300 
                         hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            >
              Login
            </Link>
          ) : (
            <>
              {/* Email */}
              <span className="hidden sm:inline text-xs sm:text-sm font-medium">
                {user.email}
              </span>

              {/* Account Icon */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/account")}
                className="rounded-full hover:bg-gray-800 transform transition-all duration-300 hover:scale-110"
              >
                <User className="w-7 h-7 sm:w-8 sm:h-8" />
              </Button>

              {/* Logout */}
              <Button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1 rounded-lg text-xs sm:text-sm"
              >
                Logout
              </Button>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col md:flex-row items-center justify-between px-6 sm:px-10 py-12 sm:py-16 md:py-24">
        {/* Left Content */}
        <div className="max-w-lg space-y-4 sm:space-y-6 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black drop-shadow-lg">
            Manage Your Expenses
          </h1>
          <p className="text-gray-800 text-sm sm:text-base md:text-lg leading-relaxed">
            Effortlessly track your expenses and receipts in one secure place.
            Start organizing today and gain real control of your finances — it's
            quick, simple, and safe.
          </p>

          {/* CTA Button */}
          <Button
            onClick={() => {
              if (user) {
                navigate("/dashboard");
              } else {
                navigate("/login");
              }
            }}
            className="bg-gradient-to-r from-teal-400 to-cyan-500 
                       hover:from-teal-500 hover:to-cyan-600
                       text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl
                       shadow-lg shadow-cyan-500/40
                       transform transition-all duration-300
                       hover:scale-105 hover:shadow-xl hover:shadow-cyan-600/50
                       active:scale-95"
          >
            🚀 Get Started
          </Button>
        </div>

        {/* Right Image */}
        <div className="w-full flex justify-center md:justify-end mt-8 md:mt-0 md:ml-10">
          <img
            src="/hero.png"
            alt="Expense tracking illustration"
            className="w-2/3 sm:w-3/4 max-w-[220px] sm:max-w-sm md:max-w-md lg:max-w-lg drop-shadow-2xl"
          />
        </div>
      </main>
    </div>
  );
}
