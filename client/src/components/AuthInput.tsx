import React from "react";

interface AuthInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  placeholder: string;
  error?: string;
  touched: boolean;
  icon: React.ReactNode;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  autoComplete?: string;
  ariaDescribedBy?: string;
  containerClassName?: string;
}

const inputBase =
  "w-full bg-[#E4E4FF]/40 border-2 border-transparent rounded-xl py-2.5 pr-11 pl-11 text-[0.93rem] text-slate-800 outline-none font-medium transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal " +
  /* Focus ring */
  "focus:bg-white focus:border-[#5272F5] focus:ring-4 focus:ring-[#5272F5]/10";

const inputError =
  "border-red-400 bg-red-50/60 focus:border-red-400 focus:ring-red-400/15";
const inputSuccess =
  "border-green-500 bg-green-50/60 focus:border-green-500 focus:ring-green-400/15";

/* ── Status icon helpers ─────────────────────────────────────────────────── */
const ErrorIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className="text-red-500"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const SuccessIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className="text-green-500"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default function AuthInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  icon,
  showPassword,
  onTogglePassword,
  autoComplete,
  ariaDescribedBy,
  containerClassName = "mb-5 relative",
}: AuthInputProps) {
  const state = touched ? (error ? "error" : "success") : "";

  const inputClass = [
    inputBase,
    state === "error" ? inputError : state === "success" ? inputSuccess : "",
  ]
    .filter(Boolean)
    .join(" ");

  const isPasswordType = type === "password";
  const inputType = isPasswordType && showPassword ? "text" : type;

  /* Show status icon on the right only when not a password field (password has toggle) */
  const showStatusIcon = touched && !isPasswordType;

  return (
    <div className={containerClassName}>
      {label && (
        <label
          className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider"
          htmlFor={id}
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Left icon */}
        <span className="absolute left-4 text-slate-400 flex pointer-events-none z-10">
          {icon}
        </span>

        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClass}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-describedby={ariaDescribedBy}
          aria-invalid={!!error && touched}
        />

        {/* Right side: password toggle OR status icon */}
        {isPasswordType && onTogglePassword ? (
          <button
            type="button"
            className="absolute right-3 bg-transparent border-none text-slate-400 cursor-pointer flex p-1.5 rounded-full hover:bg-black/5 hover:text-slate-600 transition-colors"
            onClick={onTogglePassword}
            tabIndex={-1}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        ) : showStatusIcon ? (
          <span className="absolute right-4 flex pointer-events-none">
            {state === "error" ? <ErrorIcon /> : <SuccessIcon />}
          </span>
        ) : null}
      </div>

      {/* Error message */}
      {error && touched && (
        <span
          id={ariaDescribedBy}
          className="flex items-center gap-1.5 text-red-500 text-[0.8rem] mt-1.5 font-medium"
          role="alert"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}
