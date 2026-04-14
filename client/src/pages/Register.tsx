import { Link } from "react-router-dom";
import { registerRequest } from "../services/api";
import { useRegisterForm } from "../hooks";
import { AuthLayout } from "../layouts";
import { AuthInput, FormMessage, SubmitButton } from "../components";
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

  const nameIcon = (
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
  );

  const emailIcon = (
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
  );

  const passwordIcon = (
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
  );

  const confirmIcon = (
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
  );

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
      <div className="w-full max-w-[480px] bg-white rounded-3xl px-10 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] max-sm:px-6 max-sm:py-6 max-sm:shadow-none max-sm:rounded-none max-sm:max-w-full">
        <h2 className="text-[1.7rem] font-display font-bold text-slate-800 mb-1 tracking-tight">
          Crea tu cuenta
        </h2>
        <p className="text-slate-500 text-[0.88rem] mb-5">
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
              setTimeout(() => (window.location.href = "/login"), 1600);
            })
          }
          noValidate
        >
          {/* Nombre */}
          <AuthInput
            id="reg-name"
            label="Nombre Completo"
            type="text"
            value={fields.name}
            onChange={set("name")}
            onBlur={blur("name")}
            placeholder="Ej. Alex Rivera"
            error={errors.nameError}
            touched={touched.name}
            icon={nameIcon}
            autoComplete="name"
            ariaDescribedBy="reg-name-error"
          />

          {/* Correo */}
          <AuthInput
            id="reg-email"
            label="Correo Electrónico"
            type="email"
            value={fields.email}
            onChange={set("email")}
            onBlur={blur("email")}
            placeholder="hola@vibrashop.com"
            error={errors.emailError}
            touched={touched.email}
            icon={emailIcon}
            autoComplete="email"
            ariaDescribedBy="reg-email-error"
          />

          {/* Contraseña */}
          <AuthInput
            id="reg-password"
            label="Contraseña"
            type="password"
            value={fields.password}
            onChange={set("password")}
            onBlur={blur("password")}
            placeholder="••••••••"
            error={errors.passwordError}
            touched={touched.password}
            icon={passwordIcon}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((v) => !v)}
            autoComplete="new-password"
            ariaDescribedBy="reg-password-error"
          />

          {/* Confirmar Contraseña */}
          <AuthInput
            id="reg-confirm-password"
            label="Confirmar Contraseña"
            type="password"
            value={fields.confirmPassword}
            onChange={set("confirmPassword")}
            onBlur={blur("confirmPassword")}
            placeholder="••••••••"
            error={errors.confirmPasswordError}
            touched={touched.confirmPassword}
            icon={confirmIcon}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((v) => !v)}
            autoComplete="new-password"
            ariaDescribedBy="reg-confirm-error"
          />

          {/* Términos y condiciones */}
          <label
            className="flex items-start gap-3 mt-3 mb-4 cursor-pointer"
            htmlFor="reg-terms"
          >
            <input
              id="reg-terms"
              type="checkbox"
              checked={fields.acceptedTerms}
              onChange={set("acceptedTerms")}
              className="custom-checkbox mt-0.5"
            />
            <div className="text-[0.85rem] text-slate-500 leading-relaxed">
              Acepto los{" "}
              <span className="text-blue-700 font-semibold">
                términos y condiciones
              </span>{" "}
              y la política de privacidad.
            </div>
          </label>

          {errors.termsError && !fields.acceptedTerms && touched.name && (
            <span
              className="block text-red-500 text-sm font-medium -mt-3.5 mb-4"
              role="alert"
            >
              {errors.termsError}
            </span>
          )}

          {/* Server Messages */}
          <FormMessage type="error" message={serverError || ""} />
          <FormMessage type="success" message={serverMessage || ""} />

          <SubmitButton
            id="register-submit-btn"
            disabled={buttonDisabled}
            isSubmitting={isSubmitting}
            label="Crear cuenta"
          />
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

        <div className="flex gap-5 justify-center mt-auto pt-5 text-xs font-bold text-slate-400 uppercase tracking-wide">
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
