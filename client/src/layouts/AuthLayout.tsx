import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  backgroundImage: string;
  sideTitle: React.ReactNode;
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
    <div className="flex h-screen overflow-hidden bg-[#eef0f8] font-sans items-center justify-center p-4 sm:p-6">
      {/* Outer card wrapper */}
      <div className="w-full max-w-[960px] flex rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.12)] h-full max-h-[680px]">

        {/* Left side banner — Desktop only */}
        <div className="hidden lg:flex relative w-[45%] flex-shrink-0 overflow-hidden bg-black">
          <img
            src={backgroundImage}
            className="absolute inset-0 w-full h-full object-cover opacity-90 z-[1]"
            alt="Background"
          />
          {/* Dark gradient overlay for readability */}
          <div
            className="absolute inset-0 z-[2]"
            style={{
              background:
                gradient ||
                "linear-gradient(160deg, rgba(20,10,80,0.55) 0%, rgba(10,40,160,0.72) 100%)",
            }}
          />

          {/* Centered content group */}
          <div className="relative z-[3] flex flex-col justify-center px-10 py-12 w-full h-full">
            {/* Badge */}
            {badge && (
              <div
                className={`self-start inline-flex items-center ${
                  badge.color || "bg-white/20 backdrop-blur-xl text-white"
                } py-1.5 px-4 rounded-lg mb-6 font-display italic font-extrabold tracking-widest text-sm uppercase`}
              >
                {badge.text}
              </div>
            )}

            {/* Title */}
            <h1 className="font-display text-[3.6rem] font-extrabold leading-[1.08] text-white m-0 mb-5 drop-shadow-lg">
              {sideTitle}
            </h1>

            {/* Subtitle */}
            {sideSubtitle && (
              <p className="text-[1rem] leading-relaxed text-white/80 max-w-[280px] drop-shadow-md m-0">
                {sideSubtitle}
              </p>
            )}

            {/* Bottom text */}
            {sideBottom && (
              <div className="absolute bottom-8 left-10 text-[0.65rem] text-white/40 font-medium tracking-widest uppercase">
                {sideBottom}
              </div>
            )}
          </div>
        </div>

        {/* Right side — form area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 py-6 sm:px-10 overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  );
}
