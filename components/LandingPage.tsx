import React from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const features = [
    { icon: '📸', title: 'AI Product Shots', desc: 'Generate professional e-commerce images from any angle with Gemini Flash & Pro.' },
    { icon: '🎯', title: '12 SEO Positions', desc: 'Hero shots, flat lays, lifestyle, macro — all optimized for maximum click-through rate.' },
    { icon: '📝', title: 'Etsy SEO Listings', desc: 'Auto-generate titles, descriptions, 13 tags, and FAQ — ready to paste into Etsy.' },
    { icon: '🎨', title: '10 Design Styles', desc: 'From Premium Luxury to Japandi — pick an aesthetic and let AI handle the rest.' },
  ];

  return (
    <div className="h-screen w-screen bg-[#050505] flex flex-col items-center relative overflow-hidden overflow-y-auto select-none">
      
      {/* Animated gradient orbs */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full opacity-[0.04] animate-pulse-slow" style={{
        background: 'radial-gradient(circle, #2563eb 0%, transparent 60%)'
      }}></div>
      <div className="absolute top-[20%] left-[15%] w-[600px] h-[600px] rounded-full opacity-[0.025] animate-float-slow" style={{
        background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)'
      }}></div>
      <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.02] animate-float-reverse" style={{
        background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)'
      }}></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] bg-white/[0.06] rounded-full animate-float-particle"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.012]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }}></div>

      {/* ═══ Hero Section ═══ */}
      <div className="relative z-10 text-center max-w-3xl px-6 pt-[12vh] pb-16">
        {/* LGCorporation */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <span className="inline-block text-[10px] font-semibold text-white/10 tracking-[0.3em] uppercase border border-white/[0.06] rounded-full px-4 py-1.5 mb-10">
            LGCorporation
          </span>
        </div>

        {/* Brand */}
        <h1 className="text-7xl md:text-[88px] font-bold text-white tracking-[-0.04em] mb-2 animate-fade-in-up leading-none" style={{ animationDelay: '0.3s' }}>
          Dropetsy
        </h1>
        <p className="text-[13px] font-medium text-white/15 tracking-[0.15em] mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          STUDIO
        </p>
        
        <p className="text-xl md:text-2xl font-light text-white/40 mb-4 tracking-tight leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          Turn any product into a best-seller.
        </p>
        <p className="text-[15px] text-white/20 mb-12 max-w-lg mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          AI-powered product photography, intelligent prompts, and Etsy-optimized SEO listings — all in one studio. Upload your product, and watch the magic happen.
        </p>

        {/* CTA */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <button
            onClick={onEnter}
            className="group relative inline-flex items-center justify-center px-10 py-4 rounded-full text-[14px] font-semibold bg-white text-black hover:bg-white/90 transition-all active:scale-[0.97] shadow-[0_0_50px_rgba(255,255,255,0.1)]"
          >
            Open Studio
            <svg className="w-4 h-4 ml-2.5 opacity-40 group-hover:opacity-70 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path d="M5 12h14m-6-6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <p className="text-[11px] text-white/10 mt-4">Free to use — bring your own Gemini API key</p>
        </div>
      </div>

      {/* ═══ Features Grid ═══ */}
      <div className="relative z-10 w-full max-w-4xl px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 hover:border-white/[0.1] hover:bg-white/[0.035] transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${1 + i * 0.1}s` }}
            >
              <span className="text-2xl block mb-3">{f.icon}</span>
              <h3 className="text-[13px] font-semibold text-white/80 mb-1.5">{f.title}</h3>
              <p className="text-[11px] text-white/25 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ How it works ═══ */}
      <div className="relative z-10 w-full max-w-3xl px-6 pb-16">
        <div className="animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
          <h2 className="text-center text-[11px] font-medium text-white/15 tracking-[0.25em] uppercase mb-8">How it works</h2>
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {[
              { step: '01', label: 'Upload product photos' },
              { step: '02', label: 'AI generates prompts' },
              { step: '03', label: 'Render images + SEO' },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-3 md:gap-4">
                {i > 0 && <div className="w-8 h-px bg-white/[0.06]"></div>}
                <div className="text-center">
                  <span className="block text-[10px] font-bold text-white/10 mb-1">{s.step}</span>
                  <span className="text-[12px] text-white/30">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Tech bar ═══ */}
      <div className="relative z-10 w-full max-w-2xl px-6 pb-10 animate-fade-in-up" style={{ animationDelay: '1.7s' }}>
        <div className="flex items-center justify-center gap-6 flex-wrap text-[11px] text-white/10">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></div>
            <span>Gemini Flash</span>
          </div>
          <span className="w-px h-3 bg-white/[0.06]"></span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40"></div>
            <span>Gemini Pro</span>
          </div>
          <span className="w-px h-3 bg-white/[0.06]"></span>
          <span>12 SEO Positions</span>
          <span className="w-px h-3 bg-white/[0.06]"></span>
          <span>10 Design Styles</span>
          <span className="w-px h-3 bg-white/[0.06]"></span>
          <span>Smart Prompts</span>
        </div>
      </div>

      {/* ═══ Footer ═══ */}
      <div className="relative z-10 pb-8 animate-fade-in-up" style={{ animationDelay: '1.9s' }}>
        <p className="text-[10px] text-white/[0.08] tracking-[0.2em] uppercase">
          Built by LGCorporation
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
