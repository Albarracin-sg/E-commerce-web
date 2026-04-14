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
    <div className="flex min-h-screen w-full items-center justify-center font-sans text-slate-800 bg-[#f4f5f9] p-4 lg:p-8 relative">
      {/* Main Container Card */}
      <div className="flex flex-col lg:flex-row w-full max-w-[1000px] min-h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
        
        {/* Left side banner — Desktop only */}
        <div className="hidden lg:flex flex-col relative w-1/2 bg-black overflow-hidden justify-center items-center p-12">
          <img
            src={backgroundImage}
            className="absolute inset-0 w-full h-full object-cover z-[1]"
            alt="Background"
          />
          {/* Dark gradient overlay for readability */}
          <div
            className="absolute inset-0 z-[2]"
            style={{
              background:
                gradient ||
                "linear-gradient(to top right, rgba(0, 4, 40, 0.9) 0%, rgba(0, 78, 146, 0.7) 100%)",
            }}
          />
          
          <div className="relative z-[3] flex flex-col items-center justify-center text-center text-white h-full w-full">
            {badge && (
              <div
                className={`inline-flex items-center justify-center px-6 py-2 rounded-lg mb-8 font-display font-black italic tracking-widest text-2xl shadow-lg border border-white/20 ${
                  badge.color || "bg-white/20 backdrop-blur-md"
                }`}
              >
                {badge.text}
              </div>
            )}

            <h1 className="font-display text-[3.5rem] font-bold leading-[1.05] m-0 mb-6 drop-shadow-xl text-white">
              {sideTitle}
            </h1>

            {sideSubtitle && (
              <p className="text-[1.05rem] leading-relaxed text-white/90 max-w-[340px] drop-shadow-md m-0">
                {sideSubtitle}
              </p>
            )}
          </div>
          
          {sideBottom && (
            <div className="absolute bottom-8 left-12 right-12 z-[3] flex items-center justify-between">
                <div className="text-[0.65rem] text-white/60 font-semibold tracking-widest uppercase">
                  {sideBottom}
                </div>
                {/* Simulated dots/carousel indicator */}
                <div className="flex gap-2">
                  <div className="w-8 h-1 bg-white rounded-full"></div>
                  <div className="w-4 h-1 bg-white/40 rounded-full"></div>
                  <div className="w-4 h-1 bg-white/40 rounded-full"></div>
                </div>
            </div>
          )}
        </div>

        {/* Right side — form area */}
        <div className="flex-1 flex flex-col relative items-center justify-center p-8 lg:p-14 overflow-y-auto w-full lg:w-1/2">
          {children}
        </div>
      </div>

      {/* Global Footer (absolute positioned at bottom of screen) */}
      <div className="hidden lg:block absolute bottom-6 left-0 right-0 text-[0.65rem] text-slate-400 font-bold tracking-widest uppercase text-center w-full z-0">
          © 2024 VIBRA SHOP. ELECTRIC EDITORIAL. TODOS LOS DERECHOS RESERVADOS.
      </div>
    </div>
  );
}
