import React from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="h-screen w-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.04]" style={{
        background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)'
      }}></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-xl px-6 animate-fade-in">
        {/* Overline */}
        <p className="text-[11px] font-medium text-white/20 tracking-[0.25em] uppercase mb-8">
          AI Product Photography
        </p>

        {/* Brand */}
        <h1 className="text-6xl md:text-7xl font-semibold text-white tracking-[-0.03em] mb-4">
          Dropetsy
        </h1>
        <p className="text-lg font-light text-white/30 mb-16 tracking-tight">
          Generate stunning Etsy listings with AI.
          <br />
          <span className="text-white/15">From product shots to SEO — in seconds.</span>
        </p>

        {/* Enter */}
        <button
          onClick={onEnter}
          className="group inline-flex items-center justify-center px-8 py-3.5 rounded-full text-[14px] font-medium bg-white text-black hover:bg-white/90 transition-all active:scale-[0.97]"
        >
          Get Started
          <svg className="w-4 h-4 ml-2 opacity-40 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M5 12h14m-6-6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Sub */}
        <div className="mt-16 flex items-center justify-center gap-6 text-[11px] text-white/10">
          <span>Gemini Flash</span>
          <span className="w-px h-3 bg-white/[0.06]"></span>
          <span>Gemini Pro</span>
          <span className="w-px h-3 bg-white/[0.06]"></span>
          <span>10 Design Styles</span>
          <span className="w-px h-3 bg-white/[0.06]"></span>
          <span>SEO Engine</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
