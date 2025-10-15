// // src/pages/LoginPage.jsx
// import { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowLeft } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { user, login } = useAuth();

//   useEffect(() => {
//     if (user) navigate("/dashboard", { replace: true });
//   }, [user, navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await fetch("http://localhost:8000/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.detail || "Login failed");
//       }

//       // ✅ Expecting backend to return:
//       // { id, email, access_token, token_type }
//       const token = data.access_token ?? null;

//       if (!data.id || !data.email || !token) {
//         throw new Error("Invalid response from server");
//       }

//       const userObj = {
//         id: data.id,
//         email: data.email,
//         token: token,
//       };

//       // store token in localStorage if you need it outside context
//       localStorage.setItem("token", token);

//       login(userObj); // context update
//     } catch (err) {
//       setError(err.message || "Login failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-[#cce0d6]">
//       {/* Back Button */}
//       <div className="absolute top-6 left-6">
//         <Link
//           to="/"
//           className="flex items-center space-x-2 text-teal-700 font-medium 
//                      transform transition-all duration-300
//                      hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(45,212,191,0.8)] 
//                      active:scale-95"
//         >
//           <ArrowLeft className="w-6 h-6" />
//           <span>Back</span>
//         </Link>
//       </div>

//       {/* Centered Login Card */}
//       <div className="flex flex-1 items-center justify-center">
//         <Card className="w-full max-w-md bg-white/30 backdrop-blur-xl shadow-2xl border border-white/40 rounded-2xl">
//           <CardHeader className="text-center">
//             <CardTitle className="text-3xl font-extrabold text-gray-900 drop-shadow-sm">
//               Welcome Back 👋
//             </CardTitle>
//             <p className="text-gray-600 mt-2 text-sm">
//               Log in to continue tracking your finances
//             </p>
//           </CardHeader>

//           <CardContent>
//             <form onSubmit={handleLogin} className="space-y-6">
//               {/* Email */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Email
//                 </label>
//                 <Input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter your email"
//                   required
//                   className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-300/50"
//                 />
//               </div>

//               {/* Password */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <Input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter your password"
//                   required
//                   className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-300/50"
//                 />
//               </div>

//               {/* Error */}
//               {error && (
//                 <p className="text-red-600 text-sm font-medium">{error}</p>
//               )}

//               {/* Submit */}
//               <Button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 
//                            hover:from-teal-600 hover:to-emerald-600 
//                            text-white font-semibold text-lg py-3 rounded-xl
//                            shadow-md shadow-emerald-400/30
//                            transform transition-all duration-300 
//                            hover:scale-105 active:scale-95"
//               >
//                 Log In
//               </Button>
//             </form>

//             {/* Link to Signup */}
//             <p className="text-center text-sm text-gray-700 mt-4">
//               Don’t have an account?{" "}
//               <Link
//                 to="/signup"
//                 className="text-teal-600 font-medium hover:underline"
//               >
//                 Sign up
//               </Link>
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// src/pages/LoginPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Login failed");
      }

      const token = data.access_token ?? null;
      if (!data.user?.id || !data.user?.email || !token) {
        throw new Error("Invalid response from server");
      }

      // ✅ normalize to match AuthContext expectations
      login({
        id: data.user.id,
        email: data.user.email,
        access_token: token,
      });

      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true }); // redirect after login
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#cce0d6] px-4 sm:px-6">
      {/* Back Button */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Link
          to="/"
          className="flex items-center space-x-1 sm:space-x-2 text-teal-700 font-medium 
                     transform transition-all duration-300
                     hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(45,212,191,0.8)] 
                     active:scale-95 text-sm sm:text-base"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>Back</span>
        </Link>
      </div>

      {/* Centered Login Card */}
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full sm:max-w-md md:max-w-lg bg-white/30 backdrop-blur-xl shadow-2xl border border-white/40 rounded-2xl">
          <CardHeader className="text-center px-4 sm:px-6">
            <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 drop-shadow-sm">
              Welcome Back 👋
            </CardTitle>
            <p className="text-gray-600 mt-2 text-xs sm:text-sm md:text-base">
              Log in to continue tracking your finances
            </p>
          </CardHeader>

          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-300/50 text-sm sm:text-base"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-300/50 text-sm sm:text-base"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-600 text-sm font-medium">{error}</p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 
                           hover:from-teal-600 hover:to-emerald-600 
                           text-white font-semibold text-base sm:text-lg py-2 sm:py-3 rounded-xl
                           shadow-md shadow-emerald-400/30
                           transform transition-all duration-300 
                           hover:scale-105 active:scale-95"
              >
                Log In
              </Button>
            </form>

            {/* Link to Signup */}
            <p className="text-center text-xs sm:text-sm text-gray-700 mt-4">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-teal-600 font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}