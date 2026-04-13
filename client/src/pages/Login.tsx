import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginRequest } from "../services/api";
import { setAuth } from "../utils/auth";
import bgImage from "../assets/imagen-login.png";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(email: string, password: string) {
  let emailError = "";
  let passwordError = "";

  if (email.trim().length === 0) {
    emailError = "El correo es obligatorio.";
  } else if (!emailPattern.test(email)) {
    emailError = "Ingresa un correo con formato válido (ej: usuario@correo.com).";
  }

  if (password.trim().length === 0) {
    passwordError = "La contraseña no puede estar vacía.";
  }

  return { emailError, passwordError };
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { emailError, passwordError } = useMemo(
    () => validate(email, password),
    [email, password]
  );

  const isValid = !emailError && !passwordError;
  const buttonDisabled = !isValid || isSubmitting;

  const handleBlur = (field: "email" | "password") =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ email: true, password: true });
    if (!isValid || isSubmitting) return;

    setServerError(null);
    setIsSubmitting(true);

    try {
      const result = await loginRequest({ email: email.trim().toLowerCase(), password });
      setAuth(result.user);
      if (result.user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Error inesperado. Intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailState = touched.email ? (emailError ? "error" : "success") : "";
  const passwordState = touched.password ? (passwordError ? "error" : "success") : "";

  const inputBase =
    "w-full bg-violet-100 border border-transparent rounded-xl py-4 pr-4 pl-11 text-[0.95rem] text-slate-800 outline-none font-medium transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";
  const inputError = "border-red-500 bg-red-50";
  const inputSuccess = "border-green-500 bg-green-50";

  const getInputClass = (state: string) =>
    `${inputBase} ${state === "error" ? inputError : state === "success" ? inputSuccess : ""}`;

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans">
      {/* Left side banner — Desktop only */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden bg-black flex-col justify-center p-[60px]">
        <img src={bgImage} className="absolute top-0 left-0 w-full h-full object-cover opacity-90 z-[1]" alt="Revolución Urbana" />
        <div
          className="absolute top-0 left-0 w-full h-full z-[2]"
          style={{
            background:
              "linear-gradient(135deg, rgba(30, 20, 100, 0.4), rgba(10, 50, 160, 0.7))",
          }}
        />
        <div className="inline-block bg-white/15 backdrop-blur-xl py-2 px-4 rounded-lg mb-8 font-display italic font-extrabold tracking-wide z-[3]">
          VIBRA SHOP
        </div>
        <div className="relative z-[3] text-white my-auto">
          <h1 className="font-display text-[4.5rem] font-extrabold leading-[1.05] m-0 mb-6 drop-shadow-lg">
            Únete a la
            <br />
            Revolución
            <br />
            Urbana.
          </h1>
          <p className="text-lg leading-relaxed max-w-[450px] opacity-95 drop-shadow-md">
            Descubre las últimas tendencias con una experiencia de compra diseñada para el
            futuro.
          </p>
        </div>
        <div className="absolute bottom-10 left-[60px] text-[0.7rem] text-white/50 font-medium tracking-wide uppercase z-[3]">
          ELECTRIC EDITORIAL © 2024
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-5 py-10 relative">
        <div className="w-full max-w-[420px]">
          <h2 className="text-[2rem] font-display font-bold text-slate-800 mb-2.5 tracking-tight">Bienvenido.</h2>
          <p className="text-slate-500 text-[0.95rem] mb-8">Ingresa tus credenciales para continuar tu experiencia.</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-5 relative">
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide" htmlFor="login-email">
                Email
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-500 flex pointer-events-none">
                  <svg
                    width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
                  </svg>
                </span>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setServerError(null); }}
                  onBlur={() => handleBlur("email")}
                  className={getInputClass(emailState)}
                  placeholder="nombre@ejemplo.com"
                  autoComplete="username"
                  aria-describedby="login-email-error"
                  aria-invalid={!!emailError && touched.email}
                />
              </div>
              {emailError && touched.email && (
                <span id="login-email-error" className="block text-red-500 text-sm mt-1.5 font-medium" role="alert">
                  {emailError}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="mb-5 relative">
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide" htmlFor="login-password">
                Contraseña
              </label>
              <Link to="#" className="absolute top-0 right-0 text-xs font-bold text-blue-500 no-underline uppercase tracking-wide" tabIndex={-1}>
                ¿Olvidaste tu contraseña?
              </Link>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-500 flex pointer-events-none">
                  <svg
                    width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setServerError(null); }}
                  onBlur={() => handleBlur("password")}
                  className={getInputClass(passwordState)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-describedby="login-password-error"
                  aria-invalid={!!passwordError && touched.password}
                />
                <button
                  type="button"
                  className="absolute right-4 bg-transparent border-none text-slate-500 cursor-pointer flex p-1 rounded-full hover:bg-black/5"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && touched.password && (
                <span id="login-password-error" className="block text-red-500 text-sm mt-1.5 font-medium" role="alert">
                  {passwordError}
                </span>
              )}
            </div>

            {serverError && (
              <div className="p-3.5 px-4 rounded-xl mb-6 font-semibold text-[0.9rem] bg-red-50 text-red-800 border border-red-200" role="alert">
                {serverError}
              </div>
            )}

            <button type="submit" id="login-submit-btn" className="w-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none rounded-xl py-4 text-base font-semibold cursor-pointer transition-all duration-200 shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 active:enabled:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none" disabled={buttonDisabled}>
              {isSubmitting ? (
                "Iniciando..."
              ) : (
                <>
                  Iniciar sesión{" "}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="flex items-center text-slate-400 text-xs font-semibold uppercase tracking-wider my-8 before:content-[''] before:flex-1 before:h-px before:bg-slate-200 before:mr-4 after:content-[''] after:flex-1 after:h-px after:bg-slate-200 after:ml-4">
            O Continúa con
          </div>

          <div className="flex gap-4">
            <button type="button" className="flex-1 flex items-center justify-center gap-2.5 bg-violet-100 border border-transparent rounded-xl py-3.5 text-[0.95rem] font-semibold text-slate-800 cursor-pointer transition-all duration-200 hover:bg-indigo-100" disabled>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" className="flex-1 flex items-center justify-center gap-2.5 bg-violet-100 border border-transparent rounded-xl py-3.5 text-[0.95rem] font-semibold text-slate-800 cursor-pointer transition-all duration-200 hover:bg-indigo-100" disabled>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.82 3.59-.75 2.15.11 3.53 1.14 4.3 2.16-3.75 2.04-3.14 6.83.65 8.16-.83 1.99-1.92 3.8-3.62 2.6zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.4-1.99 4.34-3.74 4.25z"/>
              </svg>
              Apple
            </button>
          </div>

          <div className="mt-6 text-center text-[0.95rem] text-slate-500">
            ¿Aún no tienes cuenta? <Link to="/register" className="text-blue-900 font-bold no-underline ml-1.5">Crear cuenta</Link>
          </div>

          <div className="text-[0.7rem] text-slate-400 font-medium tracking-wide uppercase text-center mt-10">
            © 2024 VIBRA SHOP. ELECTRIC EDITORIAL. TODOS LOS DERECHOS RESERVADOS.
          </div>
        </div>
      </div>
    </div>
  );
}
