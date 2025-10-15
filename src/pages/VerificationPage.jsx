// import { useState, useMemo } from "react";
// import { useSearchParams, useNavigate, Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// export default function VerificationPage() {
//   const [searchParams] = useSearchParams();
//   const email = useMemo(() => searchParams.get("email") || "", [searchParams]);
//   const [code, setCode] = useState("");
//   const [error, setError] = useState("");
//   const [info, setInfo] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const navigate = useNavigate();

//   const handleVerify = async (e) => {
//     e.preventDefault();
//     setError("");
//     setInfo("");

//     try {
//       setSubmitting(true);
//       const res = await fetch("http://localhost:8000/auth/register-verify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, code }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail || "Verification failed");

//       // Success → redirect to login
//       navigate("/login", { replace: true });
//     } catch (err) {
//       setError(err.message || "Verification failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleResend = async () => {
//     setError("");
//     setInfo("");
//     try {
//       const res = await fetch("http://localhost:8000/auth/register-resend", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         // For resend, you must include password again to re-hash. If you don't want,
//         // you can store it in sessionStorage just for this flow (not ideal),
//         // or change backend to allow resend without password (safer: only email).
//         // For simplicity here, we just show a message to re-start.
//         body: JSON.stringify({ email, password: "RE-ENTER-PASSWORD" }),
//       });
//       if (res.ok) {
//         setInfo("A new code was sent to your email.");
//       } else {
//         setError("Unable to resend. Please restart the signup process.");
//       }
//     } catch {
//       setError("Unable to resend. Please restart the signup process.");
//     }
//   };

//   if (!email) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#cce0d6]">
//         <Card className="w-full max-w-md bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-6 text-center">
//           <CardHeader>
//             <CardTitle className="text-xl">No email attached</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="mb-4">Go back to sign up and try again.</p>
//             <Link to="/signup" className="text-teal-700 underline">Go to Sign Up</Link>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#cce0d6]">
//       <Card className="w-full max-w-md bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl">
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl font-bold text-gray-900">
//             Verify Your Email
//           </CardTitle>
//           <p className="text-gray-600 mt-1 text-sm">
//             We’ve sent a 6-digit code to <span className="font-semibold">{email}</span>
//           </p>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleVerify} className="space-y-4">
//             <Input
//               type="text"
//               placeholder="Enter 6-digit code"
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//               maxLength={6}
//               className="text-center tracking-widest text-lg"
//               required
//             />
//             {error && <p className="text-red-600 text-sm text-center">{error}</p>}
//             {info && <p className="text-emerald-700 text-sm text-center">{info}</p>}
//             <Button
//               type="submit"
//               disabled={submitting}
//               className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl py-3"
//             >
//               {submitting ? "Verifying..." : "Verify"}
//             </Button>
//           </form>

//           <div className="mt-4 text-center">
//             <button
//               onClick={handleResend}
//               className="text-teal-700 hover:underline text-sm"
//             >
//               Resend code
//             </button>
//           </div>

//           <div className="mt-6 text-center">
//             <Link to="/signup" className="text-gray-700 hover:underline text-sm">
//               Back to Sign Up
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { useState, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function VerificationPage() {
  const [searchParams] = useSearchParams();
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:8000/auth/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Verification failed");

      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setInfo("");
    try {
      const res = await fetch("http://localhost:8000/auth/register-resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "RE-ENTER-PASSWORD" }),
      });
      if (res.ok) {
        setInfo("A new code was sent to your email.");
      } else {
        setError("Unable to resend. Please restart the signup process.");
      }
    } catch {
      setError("Unable to resend. Please restart the signup process.");
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#cce0d6] px-4 py-8">
        <Card className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-6 text-center">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">No email attached</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Go back to sign up and try again.</p>
            <Link to="/signup" className="text-teal-700 underline">Go to Sign Up</Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#cce0d6] px-4 py-8 overflow-y-auto">
      <Card className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
            Verify Your Email
          </CardTitle>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            We’ve sent a 6-digit code to <span className="font-semibold">{email}</span>
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className="text-center tracking-widest text-lg"
              required
            />
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            {info && <p className="text-emerald-700 text-sm text-center">{info}</p>}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl py-3"
            >
              {submitting ? "Verifying..." : "Verify"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={handleResend}
              className="text-teal-700 hover:underline text-sm"
            >
              Resend code
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link to="/signup" className="text-gray-700 hover:underline text-sm">
              Back to Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
