import { useAuth } from "../hooks";
import { DashboardCard } from "../layouts";

export default function Home() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <DashboardCard
      title="Bienvenido al sitio de compras"
      subtitle="El rol cliente ve esta página principal."
      userInfo={[
        { label: "Usuario", value: user.name },
        { label: "Correo", value: user.email },
      ]}
      onLogout={logout}
    />
  );
}
