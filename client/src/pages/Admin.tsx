import { useNavigate } from "react-router-dom";
import { clearAuth, getAuth } from "../utils/auth";

export default function Admin() {
  const navigate = useNavigate();
  const auth = getAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 font-sans p-6">
      <div className="bg-white rounded-3xl shadow-xl shadow-indigo-500/10 p-10 max-w-md w-full text-center">
        <h1 className="text-2xl font-display font-bold text-slate-800 mb-2">Panel administrativo</h1>
        <p className="text-slate-500 text-sm mb-6">El rol administrador accede a este panel.</p>
        <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left text-sm text-slate-700">
          <strong>Administrador:</strong> {auth?.name}
          <br />
          <strong>Correo:</strong> {auth?.email}
        </div>
        <button
          className="w-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none rounded-xl py-3.5 text-base font-semibold cursor-pointer transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-xl active:scale-[0.98]"
          onClick={() => {
            clearAuth();
            navigate("/login", { replace: true });
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
