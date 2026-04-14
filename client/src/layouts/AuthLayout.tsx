import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  backgroundImage: string;
  sideTitle: string;
  sideSubtitle?: React.ReactNode;
  sideBottom?: React.ReactNode;
  gradient?: string;
  badge?: {
    text: string;
    color?: string;
  };
}

export default function AuthLayout({
  children,
  backgroundImage,
  sideTitle,
  sideSubtitle,
  sideBottom,
  gradient,
  badge,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans">
      {/* Left side banner — Desktop only */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden bg-black flex-col justify-center p-[60px]">
        <img
          src={backgroundImage}
          className="absolute top-0 left-0 w-full h-full object-cover opacity-90 z-[1]"
          alt="Background"
        />
        <div
          className="absolute top-0 left-0 w-full h-full z-[2]"
          style={{
            background:
              gradient ||
              "linear-gradient(135deg, rgba(30, 20, 100, 0.4), rgba(10, 50, 160, 0.7))",
          }}
        />

        {badge && (
          <div
            className={`inline-block ${
              badge.color || "bg-white/15 backdrop-blur-xl"
            } py-2 px-4 rounded-lg mb-8 font-display italic font-extrabold tracking-wide z-[3]`}
          >
            {badge.text}
          </div>
        )}

        <div className="relative z-[3] text-white my-auto">
          <h1 className="font-display text-[4.5rem] font-extrabold leading-[1.05] m-0 mb-6 drop-shadow-lg">
            {sideTitle}
          </h1>
          {sideSubtitle && (
            <p className="text-lg leading-relaxed max-w-[450px] opacity-95 drop-shadow-md">
              {sideSubtitle}
            </p>
          )}
        </div>

        {sideBottom && (
          <div className="absolute bottom-10 left-[60px] text-[0.7rem] text-white/50 font-medium tracking-wide uppercase z-[3]">
            {sideBottom}
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-5 py-10 relative">
        {children}
      </div>
    </div>
  );
}
