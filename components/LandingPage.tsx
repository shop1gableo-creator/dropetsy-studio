import React from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="h-screen w-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden select-none">
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-[0.035] animate-pulse-slow" style={{
        background: 'radial-gradient(circle, #2563eb 0%, transparent 65%)'
      }}></div>
      <div className="absolute top-[30%] left-[25%] w-[500px] h-[500px] rounded-full opacity-[0.025] animate-float-slow" style={{
        background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)'
      }}></div>
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] rounded-full opacity-[0.02] animate-float-reverse" style={{
        background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)'
      }}></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] bg-white/[0.08] rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }}></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl px-6">
        {/* Overline */}
        <p className="text-[11px] font-medium text-white/15 tracking-[0.3em] uppercase mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          AI-Powered Product Photography
        </p>

        {/* Brand */}
        <h1 className="text-7xl md:text-8xl font-bold text-white tracking-[-0.04em] mb-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          Dropetsy
        </h1>
        <p className="text-[15px] font-light text-white/20 mb-5 tracking-wide animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          .gab
        </p>
        
        <p className="text-lg md:text-xl font-light text-white/30 mb-6 tracking-tight leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          Generate stunning Etsy listings with AI.
        </p>
        <p className="text-[15px] font-light text-white/15 mb-14 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          From product shots to SEO-optimized descriptions — in seconds.
        </p>

        {/* CTA */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <button
            onClick={onEnter}
            className="group relative inline-flex items-center justify-center px-10 py-4 rounded-full text-[14px] font-semibold bg-white text-black hover:bg-white/90 transition-all active:scale-[0.97] shadow-[0_0_40px_rgba(255,255,255,0.08)]"
          >
            Open Studio
            <svg className="w-4 h-4 ml-2.5 opacity-40 group-hover:opacity-70 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path d="M5 12h14m-6-6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Features */}
        <div className="mt-16 flex items-center justify-center gap-8 text-[11px] text-white/10 animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-emerald-500/40"></div>
            <span>Gemini Flash</span>
          </div>
          <span className="w-px h-3 bg-white/[0.06]"></span>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-blue-500/40"></div>
            <span>Gemini Pro</span>
          </div>
          <span className="w-px h-3 bg-white/[0.06]"></span>
          <span>12 SEO Positions</span>
          <span className="w-px h-3 bg-white/[0.06]"></span>
          <span>10 Design Styles</span>
          <span className="w-px h-3 bg-white/[0.06]"></span>
          <span>SEO Engine</span>
        </div>

        {/* Company */}
        <div className="mt-20 animate-fade-in-up" style={{ animationDelay: '1.3s' }}>
          <p className="text-[10px] text-white/[0.07] tracking-[0.2em] uppercase">
            Built by LGCorporation
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
