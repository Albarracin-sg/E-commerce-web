import { Navigate, Route, Routes, useParams } from "react-router-dom";
import Home from "../pages/Home";
import Catalog from "../pages/Catalog";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import ConfirmationPage from "../pages/ConfirmationPage";
import Login from "../pages/Login";
import ProcessingPaymentPage from "../pages/ProcessingPaymentPage";
import PurchaseAlertPage from "../pages/PurchaseAlertPage";
import Register from "../pages/Register";
import AdminLayout from "../modules/admin/layouts/AdminLayout";
import AdminDashboardPage from "../modules/admin/pages/AdminDashboardPage";
import AdminOrdersPage from "../modules/admin/pages/AdminOrdersPage";
import AdminProductsPage from "../modules/admin/pages/AdminProductsPage";
import AdminSettingsPage from "../modules/admin/pages/AdminSettingsPage";
import AdminUsersPage from "../modules/admin/pages/AdminUsersPage";
import { getAuth } from "../utils/auth";

function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = getAuth();
  if (!auth) return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ children }: { children: JSX.Element }) {
  const auth = getAuth();
  if (!auth) return <Navigate to="/login" replace />;
  if (auth.role !== "ADMIN") return <Navigate to="/home" replace />;
  return children;
}

function GuestOnly({ children }: { children: JSX.Element }) {
  const auth = getAuth();
  if (auth) return <Navigate to={auth.role === "ADMIN" ? "/admin" : "/home"} replace />;
  return children;
}

function RootRedirect() {
  const auth = getAuth();
  if (!auth) return <Navigate to="/login" replace />;
  return <Navigate to={auth.role === "ADMIN" ? "/admin" : "/home"} replace />;
}

function LegacyProductRedirect() {
  const { id } = useParams();
  return <Navigate to={`/products/${id ?? ""}`} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
      <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/catalogo" element={<RequireAuth><Catalog /></RequireAuth>} />
      <Route path="/products/:id" element={<RequireAuth><ProductDetail /></RequireAuth>} />
      <Route path="/producto/:id" element={<LegacyProductRedirect />} />
      <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
      <Route path="/carrito" element={<Navigate to="/cart" replace />} />
      <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
      <Route path="/processing-payment" element={<RequireAuth><ProcessingPaymentPage /></RequireAuth>} />
      <Route path="/purchase-alert" element={<RequireAuth><PurchaseAlertPage /></RequireAuth>} />
      <Route path="/confirmation" element={<RequireAuth><ConfirmationPage /></RequireAuth>} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
