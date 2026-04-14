import { Link } from "react-router-dom";
import { loginRequest } from "../services/api";
import { useLoginForm, useAuth } from "../hooks";
import { AuthLayout } from "../layouts";
import { AuthInput, FormMessage, SocialButtons, SubmitButton } from "../components";
import bgImage from "../assets/imagen-login.png";

export default function Login() {
  const {
    email,
    password,
    showPassword,
    setShowPassword,
    isSubmitting,
    serverError,
    emailError,
    passwordError,
    buttonDisabled,
    handleBlur,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    emailState,
    passwordState,
  } = useLoginForm();

  const { login } = useAuth();

  const emailIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
    </svg>
  );

  const passwordIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  return (
    <AuthLayout
      backgroundImage={bgImage}
      sideTitle={
        <>
          Únete a la
          <br />
          Revolución
          <br />
          Urbana.
        </>
      }
      sideSubtitle="Descubre las últimas tendencias con una experiencia de compra diseñada para el futuro."
      sideBottom="ELECTRIC EDITORIAL © 2024"
      badge={{ text: "VIBRA SHOP" }}
    >
      <div className="w-full max-w-[420px]">
        <h2 className="text-[2rem] font-display font-bold text-slate-800 mb-2 tracking-tight">
          Bienvenido.
        </h2>
        <p className="text-slate-500 text-[0.92rem] mb-7">
          Ingresa tus credenciales para continuar tu experiencia.
        </p>

        <form
          onSubmit={(e) =>
            handleSubmit(e, async () => {
              const result = await loginRequest({
                email: email.trim().toLowerCase(),
                password,
              });
              login(result.user);
            })
          }
          noValidate
        >
          <AuthInput
            id="login-email"
            label="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={() => handleBlur("email")}
            placeholder="nombre@ejemplo.com"
            error={emailError}
            touched={emailState === "error" || emailState === "success"}
            icon={emailIcon}
            autoComplete="username"
            ariaDescribedBy="login-email-error"
          />

          <div className="mb-5 relative">
            <div className="flex justify-between items-center mb-2">
              <label
                className="block text-xs font-bold text-slate-600 uppercase tracking-wide"
                htmlFor="login-password"
              >
                Contraseña
              </label>
              <Link
                to="#"
                className="text-xs font-bold text-blue-500 no-underline uppercase tracking-wide hover:text-blue-700 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <AuthInput
              id="login-password"
              label=""
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur("password")}
              placeholder="••••••••"
              error={passwordError}
              touched={passwordState === "error" || passwordState === "success"}
              icon={passwordIcon}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((v) => !v)}
              autoComplete="current-password"
              ariaDescribedBy="login-password-error"
            />
          </div>

          <FormMessage type="error" message={serverError || ""} />

          <SubmitButton
            id="login-submit-btn"
            disabled={buttonDisabled}
            isSubmitting={isSubmitting}
            label="Iniciar sesión"
          />
        </form>

        <SocialButtons />

        <div className="mt-5 text-center text-[0.92rem] text-slate-500">
          ¿Aún no tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-blue-700 font-bold no-underline ml-1 hover:text-blue-900 transition-colors"
          >
            Crear cuenta
          </Link>
        </div>

        <div className="text-[0.65rem] text-slate-300 font-medium tracking-widest uppercase text-center mt-8">
          © 2024 VIBRA SHOP · ELECTRIC EDITORIAL · TODOS LOS DERECHOS RESERVADOS
        </div>
      </div>
    </AuthLayout>
  );
}
