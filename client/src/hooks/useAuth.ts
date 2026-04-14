import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, setAuth, clearAuth } from "../utils/auth";
import type { AuthUser } from "../utils/auth";

export function useAuth() {
  const navigate = useNavigate();

  const login = useCallback(
    (user: AuthUser) => {
      setAuth(user);
      if (user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    clearAuth();
    navigate("/login", { replace: true });
  }, [navigate]);

  return {
    user: getAuth(),
    login,
    logout,
  };
}
