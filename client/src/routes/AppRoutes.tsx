import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { useProtectedRoute } from "../hooks";
import { getAuth } from "../utils/auth";

function ProtectedRoute({ children, role }: { children: JSX.Element; role: "CLIENT" | "ADMIN" }) {
  const { isAuthorized, redirectTo } = useProtectedRoute(role);

  if (!isAuthorized && redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

function RootRedirect() {
  const auth = getAuth();
  if (!auth) return <Navigate to="/login" replace />;
  return <Navigate to={auth.role === "ADMIN" ? "/admin" : "/home"} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<ProtectedRoute role="CLIENT"><Home /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="ADMIN"><Admin /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
