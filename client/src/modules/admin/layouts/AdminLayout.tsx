import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Bell,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";
import { useAuth } from "../../../hooks";
import { cn } from "../../../lib/cn";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Productos", icon: Package },
  { to: "/admin/orders", label: "Pedidos", icon: ShoppingCart },
  { to: "/admin/users", label: "Usuarios", icon: Users },
  { to: "/admin/settings", label: "Configuración", icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const pageCopy = useMemo(() => {
    if (location.pathname.startsWith("/admin/products")) {
      return {
        eyebrow: "Catálogo central",
        title: "Productos e inventario",
      };
    }

    if (location.pathname.startsWith("/admin/orders")) {
      return {
        eyebrow: "Centro de operaciones",
        title: "Pedidos y cumplimiento",
      };
    }

    if (location.pathname.startsWith("/admin/users")) {
      return {
        eyebrow: "Gestión de acceso",
        title: "Usuarios y actividad",
      };
    }

    if (location.pathname.startsWith("/admin/settings")) {
      return {
        eyebrow: "Control del panel",
        title: "Configuración administrativa",
      };
    }

    return {
      eyebrow: "Panel administrativo",
        title: "Visión general del negocio",
    };
  }, [location.pathname]);

  return (
    <div className="admin-theme min-h-screen">
      <aside className="admin-panel fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-admin-outline-variant/40 px-6 py-6 lg:flex">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-admin-outline">Vibe Pulse</p>
          <h1 className="mt-3 font-headline text-2xl font-extrabold tracking-tight text-admin-primary">
            El Directorio
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.28em] text-admin-outline">Admin Console</p>
        </div>

        <nav className="mt-10 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-admin-surface-highest/70 text-admin-primary shadow-admin-glow"
                    : "text-admin-on-surface-variant hover:border-admin-outline-variant/40 hover:bg-admin-surface-high/60 hover:text-admin-on-surface"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("h-5 w-5", isActive ? "text-admin-primary" : "text-admin-outline")} />
                  <span className="font-headline tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 rounded-2xl border border-admin-outline-variant/40 bg-admin-surface-high/70 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-admin-outline">Sesión activa</p>
          <p className="mt-3 text-sm font-semibold text-admin-on-surface">{user?.name ?? "Administrador"}</p>
          <p className="mt-1 text-xs text-admin-on-surface-variant">{user?.email ?? "Sin sesión"}</p>
        </div>

        <div className="mt-auto space-y-3">
          <NavLink
            to="/home"
            className="flex items-center justify-center gap-2 rounded-xl border border-admin-outline-variant/40 bg-admin-surface-high/50 px-4 py-3 text-sm font-semibold text-admin-on-surface transition hover:bg-admin-surface-highest/70"
          >
            <Store className="h-4 w-4" />
            Volver a tienda
          </NavLink>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-admin-primary-container to-admin-primary px-4 py-3 text-sm font-bold text-admin-on-primary transition hover:opacity-95"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="admin-glass fixed left-0 right-0 top-0 z-30 border-b border-admin-outline-variant/30 px-4 py-4 lg:left-64 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-admin-outline">{pageCopy.eyebrow}</p>
              <h2 className="mt-1 font-headline text-2xl font-extrabold tracking-tight text-admin-on-surface">
                {pageCopy.title}
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex min-w-[280px] items-center gap-3 rounded-full border border-admin-outline-variant/40 bg-admin-surface-highest/60 px-4 py-3 text-sm text-admin-on-surface-variant">
                <Search className="h-4 w-4 text-admin-outline" />
                <span className="sr-only">Buscar métricas o pedidos</span>
                <input
                  aria-label="Buscar métricas o pedidos"
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Buscar métricas o pedidos..."
                  className="w-full bg-transparent text-sm text-admin-on-surface outline-none placeholder:text-admin-outline"
                />
              </label>

              <div className="flex items-center justify-end gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifications((current) => !current);
                      setShowProfileMenu(false);
                    }}
                    aria-label={showNotifications ? "Ocultar notificaciones" : "Mostrar notificaciones"}
                    className={cn(
                      "relative rounded-full border border-admin-outline-variant/40 p-3 text-admin-outline transition hover:bg-admin-surface-highest/60 hover:text-admin-primary",
                      showNotifications && "bg-admin-surface-highest/60 text-admin-primary"
                    )}
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-admin-primary-container" />
                  </button>

                  {showNotifications && (
                    <div className="admin-panel absolute right-0 mt-3 w-80 rounded-2xl p-3">
                      <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.28em] text-admin-outline">
                        Notificaciones
                      </p>
                      <div className="space-y-2">
                        {[
                          "Nuevo pedido pendiente de revisión",
                          "Órdenes entregadas listas para cierre",
                          "Actividad administrativa reciente",
                        ].map((item) => (
                          <div key={item} className="rounded-xl bg-admin-surface-high/60 px-3 py-3 text-sm text-admin-on-surface-variant">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  aria-label="Abrir centro de ayuda"
                  className="rounded-full border border-admin-outline-variant/40 p-3 text-admin-outline transition hover:bg-admin-surface-highest/60 hover:text-admin-primary"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu((current) => !current);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-3 rounded-full border border-admin-outline-variant/40 bg-admin-surface-high/50 py-2 pl-2 pr-4 transition hover:bg-admin-surface-highest/70"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-admin-primary-container/20 text-sm font-black text-admin-primary">
                      {(user?.name ?? "AD").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="hidden text-left sm:block">
                      <p className="text-sm font-bold text-admin-on-surface">{user?.name ?? "Administrador"}</p>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-admin-outline">Senior Strategist</p>
                    </div>
                  </button>

                  {showProfileMenu && (
                    <div className="admin-panel absolute right-0 mt-3 w-56 rounded-2xl p-2">
                      <NavLink
                        to="/home"
                        className="block rounded-xl px-4 py-3 text-sm text-admin-on-surface-variant transition hover:bg-admin-surface-high/70 hover:text-admin-on-surface"
                      >
                        Ir a la tienda
                      </NavLink>
                      <button
                        type="button"
                        onClick={logout}
                        className="block w-full rounded-xl px-4 py-3 text-left text-sm text-admin-error transition hover:bg-admin-error-container/20"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 pb-8 pt-28 lg:px-8 lg:pt-32">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
}
