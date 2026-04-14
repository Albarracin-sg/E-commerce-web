import { useAuth } from "../hooks";
import { DashboardCard } from "../layouts";

export default function Admin() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <DashboardCard
      title="Panel administrativo"
      subtitle="El rol administrador accede a este panel."
      userInfo={[
        { label: "Administrador", value: user.name },
        { label: "Correo", value: user.email },
      ]}
      onLogout={logout}
      isAdmin
    />
  );
}
