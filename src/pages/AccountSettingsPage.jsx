// // src/pages/AccountSettingsPage.jsx
// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useNavigate } from "react-router-dom";

// export default function AccountSettingsPage() {
//   const { user, updateProfile, logout } = useAuth();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: user?.email || "",
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const validatePassword = (pwd) => {
//     if (pwd.length < 8) return "Password must be at least 8 characters long";
//     if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
//     if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter";
//     if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
//     if (!/[@$!%*?&]/.test(pwd)) return "Password must contain at least one special character (@$!%*?&)";
//     return "";
//   };

//   const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.newPassword) return alert("Please enter a new password");
//     if (formData.newPassword !== formData.confirmPassword) return alert("New passwords do not match!");
//     const pwdErr = validatePassword(formData.newPassword);
//     if (pwdErr) return alert(pwdErr);

//     try {
//       setLoading(true);
//       const res = await fetch("http://localhost:8000/users/me", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user?.token || ""}`,
//         },
//         body: JSON.stringify({
//           email: user.email,
//           old_password: formData.oldPassword,
//           new_password: formData.newPassword,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         if (data?.detail) {
//           const msg = typeof data.detail === "string" ? data.detail : (data.detail[0]?.msg || "Failed to update account");
//           throw new Error(msg);
//         }
//         throw new Error("Failed to update account");
//       }

//       updateProfile({ email: data.email });
//       alert("Password updated successfully!");
//       setFormData({ email: data.email, oldPassword: "", newPassword: "", confirmPassword: "" });
//       navigate("/dashboard", { replace: true });
//     } catch (err) {
//       alert(err.message || "Error updating account");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#cce0d6] px-4 sm:px-6 lg:px-8">
//       <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white shadow-lg rounded-2xl p-6 sm:p-8 space-y-8">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
//               Account Settings
//             </h1>
//             <p className="text-gray-600 text-sm sm:text-base">
//               Manage your account information
//             </p>
//           </div>
//           <Button
//             onClick={() => navigate("/dashboard")}
//             className="bg-gray-800 hover:bg-gray-700 text-white text-sm sm:text-base px-4 py-2"
//           >
//             ← Back to Dashboard
//           </Button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Read-only Email */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">
//               Email (read-only)
//             </label>
//             <Input
//               type="email"
//               name="email"
//               value={formData.email}
//               readOnly
//               className="w-full border-gray-300 bg-gray-100 text-gray-600"
//             />
//           </div>

//           {/* Old Password */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">Old Password</label>
//             <Input
//               type="password"
//               name="oldPassword"
//               value={formData.oldPassword}
//               onChange={handleChange}
//               className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500"
//               required
//             />
//           </div>

//           {/* New Password */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">New Password</label>
//             <Input
//               type="password"
//               name="newPassword"
//               value={formData.newPassword}
//               onChange={handleChange}
//               className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500"
//               required
//             />
//           </div>

//           {/* Confirm New Password */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
//             <Input
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500"
//               required
//             />
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg shadow"
//             >
//               {loading ? "Saving..." : "Save Changes"}
//             </Button>
//             <Button
//               type="button"
//               onClick={logout}
//               className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow"
//             >
//               Logout
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// src/pages/AccountSettingsPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function AccountSettingsPage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: user?.email || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
    if (!/[@$!%*?&]/.test(pwd))
      return "Password must contain at least one special character (@$!%*?&)";
    return "";
  };

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.newPassword) return alert("Please enter a new password");
    if (formData.newPassword !== formData.confirmPassword)
      return alert("New passwords do not match!");
    const pwdErr = validatePassword(formData.newPassword);
    if (pwdErr) return alert(pwdErr);

    try {
      setLoading(true);

      // ✅ Backend expects /users/{id}, not /users/me
      const res = await fetch(`http://localhost:8000/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.access_token || ""}`, // ✅ correct token
        },
        body: JSON.stringify({
          email: user.email,
          old_password: formData.oldPassword,
          new_password: formData.newPassword,
        }),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok) {
        if (data?.detail) {
          const msg =
            typeof data.detail === "string"
              ? data.detail
              : data.detail[0]?.msg || "Failed to update account";
          throw new Error(msg);
        }
        throw new Error("Failed to update account");
      }

      updateProfile({ email: data.email });
      alert("Password updated successfully!");
      setFormData({
        email: data.email,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Update error:", err);
      alert(err.message || "Error updating account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#cce0d6] px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white shadow-lg rounded-2xl p-6 sm:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              Account Settings
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage your account information
            </p>
          </div>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm sm:text-base px-4 py-2"
          >
            ← Back to Dashboard
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Read-only Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Email (read-only)
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full border-gray-300 bg-gray-100 text-gray-600"
            />
          </div>

          {/* Old Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Old Password
            </label>
            <Input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <Input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg shadow"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              onClick={logout}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow"
            >
              Logout
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}



