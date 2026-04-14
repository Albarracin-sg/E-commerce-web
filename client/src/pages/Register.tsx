import { Link } from "react-router-dom";
import { registerRequest } from "../services/api";
import { useRegisterForm } from "../hooks";
import { AuthLayout } from "../layouts";
import bgImage from "../assets/imagen-register.png";

export default function Register() {
  const {
    fields,
    touched,
    showPassword,
    setShowPassword,
    isSubmitting,
    serverMessage,
    setServerMessage,
    serverError,
    setServerError,
    errors,
    buttonDisabled,
    set,
    blur,
    handleSubmit,
  } = useRegisterForm();

  const state = (field: keyof typeof touched, errorKey: keyof typeof errors) =>
    touched[field] ? (errors[errorKey] ? "error" : "success") : "";

  const inputBase =
    "w-full bg-violet-100 border border-transparent rounded-xl py-4 pr-4 pl-11 text-[0.95rem] text-slate-800 outline-none font-medium transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";
  const inputError = "border-red-500 bg-red-50";
  const inputSuccess = "border-green-500 bg-green-50";

  const getInputClass = (s: string) =>
    `${inputBase} ${s === "error" ? inputError : s === "success" ? inputSuccess : ""}`;

  return (
    <AuthLayout
      backgroundImage={bgImage}
      sideTitle={
        <>
          Únete al
          <br />
          estilo
        </>
      }
      sideSubtitle="Crea tu cuenta y descubre tu flow. Acceso exclusivo a colecciones limitadas y envíos rápidos."
      badge={{
        text: "ÚNETE A LA ELITE",
        color: "bg-[#ff8fa3] text-white",
      }}
    >
      <div className="w-full max-w-[480px] bg-white rounded-3xl p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)] max-sm:p-8 max-sm:px-6 max-sm:shadow-none max-sm:rounded-none max-sm:max-w-full">
        <h2 className="text-[2rem] font-display font-bold text-slate-800 mb-2.5 tracking-tight">
          Crea tu cuenta
        </h2>
        <p className="text-slate-500 text-[0.95rem] mb-8">
          Introduce tus datos para empezar la experiencia.
        </p>

        <form
          onSubmit={(e) =>
            handleSubmit(e, async () => {
              const result = await registerRequest({
                name: fields.name.trim(),
                email: fields.email.trim().toLowerCase(),
                password: fields.password,
              });
              setServerMessage(
                result.message || "¡Cuenta creada exitosamente! Redirigiendo..."
              );
              setTimeout(
                () => (window.location.href = "/login"),
                1600
              );
            })
          }
          noValidate
        >
          {/* Nombre */}
          <div className="mb-5 relative">
            <label
              className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide"
              htmlFor="reg-name"
            >
              Nombre Completo
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-500 flex pointer-events-none">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                id="reg-name"
                type="text"
                value={fields.name}
                onChange={set("name")}
                onBlur={blur("name")}
                className={getInputClass(state("name", "nameError"))}
                placeholder="Ej. Alex Rivera"
                autoComplete="name"
                aria-describedby="reg-name-error"
                aria-invalid={!!errors.nameError && touched.name}
              />
            </div>
            {errors.nameError && touched.name && (
              <span
                id="reg-name-error"
                className="block text-red-500 text-sm mt-1.5 font-medium"
                role="alert"
              >
                {errors.nameError}
              </span>
            )}
          </div>

          {/* Correo */}
          <div className="mb-5 relative">
            <label
              className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide"
              htmlFor="reg-email"
            >
              Correo Electrónico
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-500 flex pointer-events-none">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                id="reg-email"
                type="email"
                value={fields.email}
                onChange={set("email")}
                onBlur={blur("email")}
                className={getInputClass(state("email", "emailError"))}
                placeholder="hola@vibrashop.com"
                autoComplete="email"
                aria-describedby="reg-email-error"
                aria-invalid={!!errors.emailError && touched.email}
              />
            </div>
            {errors.emailError && touched.email && (
              <span
                id="reg-email-error"
                className="block text-red-500 text-sm mt-1.5 font-medium"
                role="alert"
              >
                {errors.emailError}
              </span>
            )}
          </div>

          {/* Contraseña */}
          <div className="mb-5 relative">
            <label
              className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide"
              htmlFor="reg-password"
            >
              Contraseña
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-500 flex pointer-events-none">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                value={fields.password}
                onChange={set("password")}
                onBlur={blur("password")}
                className={getInputClass(state("password", "passwordError"))}
                placeholder="••••••••"
                autoComplete="new-password"
                aria-describedby="reg-password-error"
                aria-invalid={!!errors.passwordError && touched.password}
              />
              <button
                type="button"
                className="absolute right-4 bg-transparent border-none text-slate-500 cursor-pointer flex p-1 rounded-full hover:bg-black/5"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.passwordError && touched.password && (
              <span
                id="reg-password-error"
                className="block text-red-500 text-sm mt-1.5 font-medium"
                role="alert"
              >
                {errors.passwordError}
              </span>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div className="mb-5 relative">
            <label
              className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide"
              htmlFor="reg-confirm-password"
            >
              Confirmar Contraseña
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-500 flex pointer-events-none">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </span>
              <input
                id="reg-confirm-password"
                type="password"
                value={fields.confirmPassword}
                onChange={set("confirmPassword")}
                onBlur={blur("confirmPassword")}
                className={getInputClass(
                  state("confirmPassword", "confirmPasswordError")
                )}
                placeholder="••••••••"
                autoComplete="new-password"
                aria-describedby="reg-confirm-error"
                aria-invalid={
                  !!errors.confirmPasswordError && touched.confirmPassword
                }
              />
            </div>
            {errors.confirmPasswordError && touched.confirmPassword && (
              <span
                id="reg-confirm-error"
                className="block text-red-500 text-sm mt-1.5 font-medium"
                role="alert"
              >
                {errors.confirmPasswordError}
              </span>
            )}
          </div>

          {/* Términos y condiciones */}
          <label
            className="flex items-start gap-3 my-6 cursor-pointer"
            htmlFor="reg-terms"
          >
            <input
              id="reg-terms"
              type="checkbox"
              checked={fields.acceptedTerms}
              onChange={set("acceptedTerms")}
              className="custom-checkbox"
            />
            <div className="text-[0.85rem] text-slate-500 leading-relaxed">
              Acepto los{" "}
              <span className="text-blue-700 font-semibold">
                términos y condiciones
              </span>{" "}
              y la política de privacidad.
            </div>
          </label>
          {/* Show terms error only if user tried submitting without checking */}
          {errors.termsError && !fields.acceptedTerms && touched.name && (
            <span
              className="block text-red-500 text-sm font-medium -mt-3.5 mb-4"
              role="alert"
            >
              {errors.termsError}
            </span>
          )}

          {/* Server feedback */}
          {serverError && (
            <div
              className="p-3.5 px-4 rounded-xl mb-6 font-semibold text-[0.9rem] bg-red-50 text-red-800 border border-red-200"
              role="alert"
            >
              {serverError}
            </div>
          )}
          {serverMessage && (
            <div
              className="p-3.5 px-4 rounded-xl mb-6 font-semibold text-[0.9rem] bg-emerald-50 text-green-800 border border-emerald-200"
              role="status"
            >
              {serverMessage}
            </div>
          )}

          <button
            type="submit"
            id="register-submit-btn"
            className="w-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none rounded-xl py-4 text-base font-semibold cursor-pointer transition-all duration-200 shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 active:enabled:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
            disabled={buttonDisabled}
          >
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className="mt-6 text-center text-[0.95rem] text-slate-500">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-blue-900 font-bold no-underline ml-1.5"
          >
            Inicia sesión
          </Link>
        </div>

        <div className="flex gap-5 justify-center mt-auto pt-10 text-xs font-bold text-slate-400 uppercase tracking-wide">
          <Link to="#" className="text-slate-400 no-underline">
            Soporte
          </Link>
          <Link to="#" className="text-slate-400 no-underline">
            Privacidad
          </Link>
          <Link to="#" className="text-slate-400 no-underline">
            Ayuda
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

    try {
      const result = await registerRequest({
        name: fields.name.trim(),
        email: fields.email.trim().toLowerCase(),
        password: fields.password,
      });
      setServerMessage(result.message || "¡Cuenta creada exitosamente! Redirigiendo...");
      setTimeout(() => navigate("/login", { replace: true }), 1600);
    } catch (error) {
      // Backend returns "Ya existe una cuenta con ese correo." for 409
      setServerError(
        error instanceof Error ? error.message : "Error inesperado. Intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const state = (field: keyof TouchedFields, errorKey: keyof ReturnType<typeof validate>) =>
    touched[field] ? (errors[errorKey] ? "error" : "success") : "";

  const inputBase =
    "w-full bg-violet-100 border border-transparent rounded-xl py-4 pr-4 pl-11 text-[0.95rem] text-slate-800 outline-none font-medium transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";
  const inputError = "border-red-500 bg-red-50";
  const inputSuccess = "border-green-500 bg-green-50";

  const getInputClass = (s: string) =>
    `${inputBase} ${s === "error" ? inputError : s === "success" ? inputSuccess : ""}`;

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans">
      {/* Left side banner — Desktop only */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden bg-black flex-col justify-center p-[60px]">
        <img src={bgImage} className="absolute top-0 left-0 w-full h-full object-cover opacity-90 z-[1]" alt="Vibra Shop" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[rgba(8,16,40,0.4)] to-[rgba(10,50,160,0.2)] z-[2]" />
        <div className="absolute top-10 left-[60px] font-display text-2xl font-extrabold italic tracking-wide z-[3] text-white drop-shadow-md">
          VIBRA SHOP
        </div>
        <div className="relative z-[3] text-white my-auto">
          <div className="inline-block bg-[#ff8fa3] text-white py-1.5 px-4 rounded-full text-[0.8rem] font-bold tracking-wider mb-5 uppercase">
            ÚNETE A LA ELITE
          </div>
          <h1 className="font-display text-[4.5rem] font-extrabold leading-[1.05] m-0 mb-6 drop-shadow-lg">
            Únete al
            <br />
            estilo
          </h1>
          <p className="text-lg leading-relaxed max-w-[450px] opacity-95 drop-shadow-md">
            Crea tu cuenta y descubre tu flow. Acceso exclusivo a colecciones limitadas y envíos
            rápidos.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-5 py-10 relative">
        <div className="w-full max-w-[480px] bg-white rounded-3xl p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)] max-sm:p-8 max-sm:px-6 max-sm:shadow-none max-sm:rounded-none max-sm:max-w-full">
          <h2 className="text-[2rem] font-display font-bold text-slate-800 mb-2.5 tracking-tight">Crea tu cuenta</h2>
          <p className="text-slate-500 text-[0.95rem] mb-8">Introduce tus datos para empezar la experiencia.</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Nombre */}
            <div className="mb-5 relative">
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide" htmlFor="reg-name">
                Nombre Completo
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-500 flex pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="reg-name"
                  type="text"
                  value={fields.name}
                  onChange={set("name")}
                  onBlur={blur("name")}
                  className={getInputClass(state("name", "nameError"))}
                  placeholder="Ej. Alex Rivera"
                  autoComplete="name"
                  aria-describedby="reg-name-error"
                  aria-invalid={!!errors.nameError && touched.name}
                />
              </div>
              {errors.nameError && touched.name && (
                <span id="reg-name-error" className="block text-red-500 text-sm mt-1.5 font-medium" role="alert">
                  {errors.nameError}
                </span>
              )}
            </div>

            {/* Correo */}
            <div className="mb-5 relative">
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide" htmlFor="reg-email">
                Correo Electrónico
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-500 flex pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="reg-email"
                  type="email"
                  value={fields.email}
                  onChange={set("email")}
                  onBlur={blur("email")}
                  className={getInputClass(state("email", "emailError"))}
                  placeholder="hola@vibrashop.com"
                  autoComplete="email"
                  aria-describedby="reg-email-error"
                  aria-invalid={!!errors.emailError && touched.email}
                />
              </div>
              {errors.emailError && touched.email && (
                <span id="reg-email-error" className="block text-red-500 text-sm mt-1.5 font-medium" role="alert">
                  {errors.emailError}
                </span>
              )}
            </div>

            {/* Contraseña */}
            <div className="mb-5 relative">
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide" htmlFor="reg-password">
                Contraseña
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-500 flex pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={fields.password}
                  onChange={set("password")}
                  onBlur={blur("password")}
                  className={getInputClass(state("password", "passwordError"))}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-describedby="reg-password-error"
                  aria-invalid={!!errors.passwordError && touched.password}
                />
                <button
                  type="button"
                  className="absolute right-4 bg-transparent border-none text-slate-500 cursor-pointer flex p-1 rounded-full hover:bg-black/5"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.passwordError && touched.password && (
                <span id="reg-password-error" className="block text-red-500 text-sm mt-1.5 font-medium" role="alert">
                  {errors.passwordError}
                </span>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="mb-5 relative">
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide" htmlFor="reg-confirm-password">
                Confirmar Contraseña
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-500 flex pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </span>
                <input
                  id="reg-confirm-password"
                  type="password"
                  value={fields.confirmPassword}
                  onChange={set("confirmPassword")}
                  onBlur={blur("confirmPassword")}
                  className={getInputClass(state("confirmPassword", "confirmPasswordError"))}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-describedby="reg-confirm-error"
                  aria-invalid={!!errors.confirmPasswordError && touched.confirmPassword}
                />
              </div>
              {errors.confirmPasswordError && touched.confirmPassword && (
                <span id="reg-confirm-error" className="block text-red-500 text-sm mt-1.5 font-medium" role="alert">
                  {errors.confirmPasswordError}
                </span>
              )}
            </div>

            {/* Términos y condiciones */}
            <label className="flex items-start gap-3 my-6 cursor-pointer" htmlFor="reg-terms">
              <input
                id="reg-terms"
                type="checkbox"
                checked={fields.acceptedTerms}
                onChange={set("acceptedTerms")}
                className="custom-checkbox"
              />
              <div className="text-[0.85rem] text-slate-500 leading-relaxed">
                Acepto los <span className="text-blue-700 font-semibold">términos y condiciones</span> y la política de privacidad.
              </div>
            </label>
            {/* Show terms error only if user tried submitting without checking */}
            {errors.termsError && !fields.acceptedTerms && touched.name && (
              <span className="block text-red-500 text-sm font-medium -mt-3.5 mb-4" role="alert">
                {errors.termsError}
              </span>
            )}

            {/* Server feedback */}
            {serverError && (
              <div className="p-3.5 px-4 rounded-xl mb-6 font-semibold text-[0.9rem] bg-red-50 text-red-800 border border-red-200" role="alert">
                {serverError}
              </div>
            )}
            {serverMessage && (
              <div className="p-3.5 px-4 rounded-xl mb-6 font-semibold text-[0.9rem] bg-emerald-50 text-green-800 border border-emerald-200" role="status">
                {serverMessage}
              </div>
            )}

            <button
              type="submit"
              id="register-submit-btn"
              className="w-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none rounded-xl py-4 text-base font-semibold cursor-pointer transition-all duration-200 shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 active:enabled:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
              disabled={buttonDisabled}
            >
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center text-[0.95rem] text-slate-500">
            ¿Ya tienes cuenta? <Link to="/login" className="text-blue-900 font-bold no-underline ml-1.5">Inicia sesión</Link>
          </div>

          <div className="flex gap-5 justify-center mt-auto pt-10 text-xs font-bold text-slate-400 uppercase tracking-wide">
            <Link to="#" className="text-slate-400 no-underline">Soporte</Link>
            <Link to="#" className="text-slate-400 no-underline">Privacidad</Link>
            <Link to="#" className="text-slate-400 no-underline">Ayuda</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
