// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Link, useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";

// export default function SignUpPage() {
//   const navigate = useNavigate();

//   // Local state
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ Password strength validator
//   const validatePassword = (pwd) => {
//     if (pwd.length < 8) return "Password must be at least 8 characters long";
//     if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
//     if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter";
//     if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
//     if (!/[@$!%*?&]/.test(pwd)) return "Password must contain at least one special character (@$!%*?&)";
//     return "";
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   // ✅ Confirm password check
//   //   if (password !== confirmPassword) {
//   //     setError("Passwords do not match");
//   //     return;
//   //   }

//   //   // ✅ Strength check
//   //   const strengthError = validatePassword(password);
//   //   if (strengthError) {
//   //     setError(strengthError);
//   //     return;
//   //   }

//   //   setLoading(true);
//   //   setError("");

//   //   try {
//   //     const response = await fetch("http://localhost:8000/users/", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({ email, password }),
//   //     });

//   //     if (!response.ok) {
//   //       const errData = await response.json();
//   //       throw new Error(errData.detail || "Failed to register");
//   //     }

//   //     // ✅ Instead of redirecting to login, go to verification page
//   //     // and pass email so we know where to send verification
//   //     navigate("/verify", { state: { email } });

//   //   } catch (err) {
//   //     setError(err.message);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // src/pages/SignUpPage.jsx (only change handleSubmit)
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (password !== confirmPassword) {
//     setError("Passwords do not match");
//     return;
//   }
//   const strengthError = validatePassword(password);
//   if (strengthError) {
//     setError(strengthError);
//     return;
//   }

//   setLoading(true);
//   setError("");

//   try {
//     const res = await fetch("http://localhost:8000/auth/register-start", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.detail || "Failed to start verification");

//     // ✅ Go to verification page
//     navigate(`/verify?email=${encodeURIComponent(email)}`);
//   } catch (err) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };


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

//       {/* Centered Sign Up Card */}
//       <div className="flex flex-1 items-center justify-center">
//         <Card className="w-full max-w-md bg-white/30 backdrop-blur-xl shadow-2xl border border-white/40 rounded-2xl">
//           <CardHeader className="text-center">
//             <CardTitle className="text-3xl font-extrabold text-gray-900 drop-shadow-sm">
//               Create Account ✨
//             </CardTitle>
//             <p className="text-gray-600 mt-2 text-sm">
//               Sign up to start tracking your finances
//             </p>
//           </CardHeader>

//           <CardContent>
//             <form className="space-y-6" onSubmit={handleSubmit}>
//               {/* Email */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Email</label>
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
//                 <label className="block text-sm font-medium text-gray-700">Password</label>
//                 <Input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter a strong password"
//                   required
//                   className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-300/50"
//                 />
//               </div>

//               {/* Confirm Password */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
//                 <Input
//                   type="password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   placeholder="Confirm your password"
//                   required
//                   className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-300/50"
//                 />
//               </div>

//               {/* Error message */}
//               {error && (
//                 <p className="text-red-600 text-sm text-center">{error}</p>
//               )}

//               {/* Sign Up */}
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 
//                            hover:from-teal-600 hover:to-emerald-600 
//                            text-white font-semibold text-lg py-3 rounded-xl
//                            shadow-md shadow-emerald-400/30
//                            transform transition-all duration-300 
//                            hover:scale-105 active:scale-95"
//               >
//                 {loading ? "Signing Up..." : "✨ Sign Up"}
//               </Button>
//             </form>

//             {/* Login Link */}
//             <p className="text-center text-sm text-gray-700 mt-6">
//               Already have an account?{" "}
//               <Link
//                 to="/login"
//                 className="text-teal-600 font-medium hover:underline"
//               >
//                 Login
//               </Link>
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
    if (!/[@$!%*?&]/.test(pwd)) return "Password must contain at least one special character (@$!%*?&)";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const strengthError = validatePassword(password);
    if (strengthError) {
      setError(strengthError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/auth/register-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to start verification");

      navigate(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#cce0d6] px-4 py-8 overflow-y-auto">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="flex items-center space-x-2 text-teal-700 font-medium 
                     transform transition-all duration-300
                     hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(45,212,191,0.8)] 
                     active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back</span>
        </Link>
      </div>

      {/* Centered Sign Up Card */}
      <Card className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg bg-white/30 backdrop-blur-xl shadow-2xl border border-white/40 rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-extrabold text-gray-900 drop-shadow-sm">
            Create Account ✨
          </CardTitle>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Sign up to start tracking your finances
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-300/50"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong password"
                required
                className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-300/50"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-300/50"
              />
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            {/* Sign Up */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 
                         hover:from-teal-600 hover:to-emerald-600 
                         text-white font-semibold text-lg py-3 rounded-xl
                         shadow-md shadow-emerald-400/30
                         transform transition-all duration-300 
                         hover:scale-105 active:scale-95"
            >
              {loading ? "Signing Up..." : "✨ Sign Up"}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-700 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-teal-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
