// // src/context/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     try {
//       const raw = localStorage.getItem("auth_user");
//       return raw ? JSON.parse(raw) : null;
//     } catch (e) {
//       console.error("Failed to parse localStorage auth_user", e);
//       return null;
//     }
//   });

//   useEffect(() => {
//     try {
//       if (user) {
//         localStorage.setItem("auth_user", JSON.stringify(user));
//       } else {
//         localStorage.removeItem("auth_user");
//       }
//     } catch (e) {
//       console.error("Failed to persist auth_user", e);
//     }
//   }, [user]);

//   const login = useCallback((userData) => {
//     setUser(userData);
//   }, []);

//   const logout = useCallback(() => {
//     setUser(null);
//   }, []);

//   // ✅ Allow profile update (email/password refresh)
//   const updateProfile = useCallback((updates) => {
//     setUser((prev) => {
//       if (!prev) return prev;
//       const newUser = { ...prev, ...updates };
//       localStorage.setItem("auth_user", JSON.stringify(newUser));
//       return newUser;
//     });
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // 🔹 Persist user in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
    }
  }, [user]);

  // 🔹 Login → just set user (backend fetch happens in LoginPage.jsx)
  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("auth_user", JSON.stringify(userData));
  }, []);

  // 🔹 Logout → clear user
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("auth_user");
  }, []);

  // 🔹 Update profile in state/localStorage (optional helper)
  const updateProfile = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newUser = { ...prev, ...updates };
      localStorage.setItem("auth_user", JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
