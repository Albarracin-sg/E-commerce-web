import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerRequest } from "../services/api";
import bgImage from "../assets/imagen-register.png";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

type Fields = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

function validate(fields: Fields) {
  const { name, email, password, confirmPassword, acceptedTerms } = fields;
  return {
    nameError:
      name.trim().length === 0 ? "El nombre completo es obligatorio." : "",
    emailError:
      email.trim().length === 0
        ? "El correo es obligatorio."
        : !emailPattern.test(email)
        ? "Ingresa un correo con formato válido (ej: usuario@correo.com)."
        : "",
    passwordError:
      password.trim().length === 0
        ? "La contraseña es obligatoria."
        : password.length < MIN_PASSWORD_LENGTH
        ? `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
        : "",
    confirmPasswordError:
      confirmPassword.trim().length === 0
        ? "Por favor confirma tu contraseña."
        : confirmPassword !== password
        ? "Las contraseñas no coinciden. Verifica e intenta de nuevo."
        : "",
    termsError: acceptedTerms ? "" : "Debes aceptar los términos y condiciones para continuar.",
  };
}

type TouchedFields = {
  name: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
};

export default function Register() {
  const [fields, setFields] = useState<Fields>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });
  const [touched, setTouched] = useState<TouchedFields>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const errors = useMemo(() => validate(fields), [fields]);

  const isValid =
    !errors.nameError &&
    !errors.emailError &&
    !errors.passwordError &&
    !errors.confirmPasswordError &&
    !errors.termsError;

  const buttonDisabled = !isValid || isSubmitting;

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFields((prev) => ({ ...prev, [key]: value }));
    setServerError(null);
  };

  const blur = (key: keyof TouchedFields) => () =>
    setTouched((prev) => ({ ...prev, [key]: true }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Mark all fields touched on submit attempt
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    if (!isValid || isSubmitting) return;

    setServerError(null);
    setServerMessage(null);
    setIsSubmitting(true);

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

  return (
    <div className="auth-layout">
      {/* Left side banner — Desktop only */}
      <div className="auth-left">
        <img src={bgImage} className="auth-bg-img" alt="Vibra Shop" />
        <div className="auth-left-overlay" />
        <div className="auth-brand">VIBRA SHOP</div>
        <div className="auth-left-content">
          <div className="elite-badge">ÚNETE A LA ELITE</div>
          <h1 className="hero-text">
            Únete al
            <br />
            estilo
          </h1>
          <p className="hero-desc">
            Crea tu cuenta y descubre tu flow. Acceso exclusivo a colecciones limitadas y envíos
            rápidos.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">Crea tu cuenta</h2>
          <p className="auth-subtitle">Introduce tus datos para empezar la experiencia.</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Nombre */}
            <div className="input-group">
              <label className="input-label" htmlFor="reg-name">
                Nombre Completo
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
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
                  className={`input-field ${state("name", "nameError")}`}
                  placeholder="Ej. Alex Rivera"
                  autoComplete="name"
                  aria-describedby="reg-name-error"
                  aria-invalid={!!errors.nameError && touched.name}
                />
              </div>
              {errors.nameError && touched.name && (
                <span id="reg-name-error" className="field-error-msg" role="alert">
                  {errors.nameError}
                </span>
              )}
            </div>

            {/* Correo */}
            <div className="input-group">
              <label className="input-label" htmlFor="reg-email">
                Correo Electrónico
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
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
                  className={`input-field ${state("email", "emailError")}`}
                  placeholder="hola@vibrashop.com"
                  autoComplete="email"
                  aria-describedby="reg-email-error"
                  aria-invalid={!!errors.emailError && touched.email}
                />
              </div>
              {errors.emailError && touched.email && (
                <span id="reg-email-error" className="field-error-msg" role="alert">
                  {errors.emailError}
                </span>
              )}
            </div>

            {/* Contraseña */}
            <div className="input-group">
              <label className="input-label" htmlFor="reg-password">
                Contraseña
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
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
                  className={`input-field ${state("password", "passwordError")}`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-describedby="reg-password-error"
                  aria-invalid={!!errors.passwordError && touched.password}
                />
                <button
                  type="button"
                  className="password-toggle"
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
                <span id="reg-password-error" className="field-error-msg" role="alert">
                  {errors.passwordError}
                </span>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="input-group">
              <label className="input-label" htmlFor="reg-confirm-password">
                Confirmar Contraseña
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
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
                  className={`input-field ${state("confirmPassword", "confirmPasswordError")}`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-describedby="reg-confirm-error"
                  aria-invalid={!!errors.confirmPasswordError && touched.confirmPassword}
                />
              </div>
              {errors.confirmPasswordError && touched.confirmPassword && (
                <span id="reg-confirm-error" className="field-error-msg" role="alert">
                  {errors.confirmPasswordError}
                </span>
              )}
            </div>

            {/* Términos y condiciones */}
            <label className="checkbox-wrapper" htmlFor="reg-terms">
              <input
                id="reg-terms"
                type="checkbox"
                checked={fields.acceptedTerms}
                onChange={set("acceptedTerms")}
                className="custom-checkbox"
              />
              <div className="checkbox-text">
                Acepto los <span>términos y condiciones</span> y la política de privacidad.
              </div>
            </label>
            {/* Show terms error only if user tried submitting without checking */}
            {errors.termsError && !fields.acceptedTerms && touched.name && (
              <span className="field-error-msg" style={{ marginTop: "-14px", display: "block", marginBottom: "16px" }} role="alert">
                {errors.termsError}
              </span>
            )}

            {/* Server feedback */}
            {serverError && (
              <div className="alert error-alert" role="alert">
                {serverError}
              </div>
            )}
            {serverMessage && (
              <div className="alert success-alert" role="status">
                {serverMessage}
              </div>
            )}

            <button
              type="submit"
              id="register-submit-btn"
              className="btn-primary"
              disabled={buttonDisabled}
            >
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <div className="auth-bottom">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </div>

          <div className="footer-links">
            <Link to="#">Soporte</Link>
            <Link to="#">Privacidad</Link>
            <Link to="#">Ayuda</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
