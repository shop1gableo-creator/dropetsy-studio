import React from 'react';

// Scrolling showcase rows — real product images
const ROW1 = [
  '/showcase/1.png',  '/showcase/7.png',  '/showcase/3.png',
  '/showcase/14.png', '/showcase/5.png',  '/showcase/8.png',  '/showcase/16.png',
];
const ROW2 = [
  '/showcase/2.png',  '/showcase/6.png',  '/showcase/11.png',
  '/showcase/9.png',  '/showcase/4.png',  '/showcase/12.png', '/showcase/13.png',
];

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
    <div className="min-h-screen w-screen bg-[#050505] flex flex-col items-center relative overflow-x-hidden overflow-y-auto select-none">

      {/* ═══ Ambient background ═══ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full opacity-[0.04] animate-pulse-slow" style={{
          background: 'radial-gradient(circle, #2563eb 0%, transparent 55%)'
        }}></div>
        <div className="absolute top-[60%] left-[20%] w-[700px] h-[700px] rounded-full opacity-[0.025] animate-float-slow" style={{
          background: 'radial-gradient(circle, #7c3aed 0%, transparent 65%)'
        }}></div>
        <div className="absolute top-[80%] right-[15%] w-[500px] h-[500px] rounded-full opacity-[0.02] animate-float-reverse" style={{
          background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)'
        }}></div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* ═══ HERO — Full Viewport ═══ */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 w-full">

        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <span className="inline-block text-[10px] font-semibold text-white/30 tracking-[0.3em] uppercase border border-white/[0.1] rounded-full px-4 py-1.5 mb-10">
            LGCorporation
          </span>
        </div>

        <h1 className="text-7xl md:text-[96px] font-bold text-white tracking-[-0.04em] mb-3 animate-fade-in-up leading-none py-1" style={{ animationDelay: '0.25s' }}>
          Dropetsy
        </h1>
        <p className="text-[13px] font-medium text-white/35 tracking-[0.2em] mb-10 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
          STUDIO
        </p>

        <p className="text-xl md:text-[28px] font-light text-white/60 mb-4 tracking-tight leading-snug animate-fade-in-up max-w-xl" style={{ animationDelay: '0.45s' }}>
          Turn any product into a best-seller.
        </p>
        <p className="text-[15px] text-white/35 mb-14 max-w-md mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.55s' }}>
          AI-powered product photography, intelligent prompts, and Etsy-optimized SEO listings — all in one studio.
        </p>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <button
            onClick={onEnter}
            className="group relative inline-flex items-center justify-center px-12 py-4 rounded-full text-[14px] font-semibold bg-white text-black hover:bg-white/90 transition-all active:scale-[0.97] shadow-[0_0_80px_rgba(255,255,255,0.08)]"
          >
            Open Studio
            <svg className="w-4 h-4 ml-2.5 opacity-40 group-hover:opacity-70 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path d="M5 12h14m-6-6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <p className="text-[11px] text-white/25 mt-5">Free to use — bring your own Gemini API key</p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          <div className="flex flex-col items-center gap-2 opacity-30">
            <span className="text-[10px] text-white/40 tracking-widest uppercase">Scroll</span>
            <svg className="w-4 h-4 text-white/30 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M19 14l-7 7m0 0l-7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* ═══ SHOWCASE — Scrolling Marquee ═══ */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative z-10 w-full py-20 overflow-hidden">
        {/* Section title */}
        <div className="text-center mb-14 px-6">
          <p className="text-[10px] font-semibold text-white/25 tracking-[0.3em] uppercase mb-3">Powered by Gemini AI</p>
          <h2 className="text-3xl md:text-[42px] font-bold text-white tracking-tight leading-tight">
            See what's possible
          </h2>
        </div>

        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-40 z-20" style={{ background: 'linear-gradient(to right, #050505, transparent)' }}></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-40 z-20" style={{ background: 'linear-gradient(to left, #050505, transparent)' }}></div>

        {/* Row 1 — scrolls LEFT */}
        <div className="mb-5">
          <div className="flex gap-5 w-max" style={{ animation: 'marquee-left 40s linear infinite' }}>
            {[...Array(3)].map((_, dup) =>
              ROW1.map((src, i) => (
                <div key={`r1-${dup}-${i}`} className="w-[300px] h-[220px] rounded-[20px] overflow-hidden shrink-0 relative group">
                  <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Row 2 — scrolls RIGHT, offset down */}
        <div className="translate-y-[-8px]">
          <div className="flex gap-5 w-max" style={{ animation: 'marquee-right 45s linear infinite' }}>
            {[...Array(3)].map((_, dup) =>
              ROW2.map((src, i) => (
                <div key={`r2-${dup}-${i}`} className="w-[300px] h-[220px] rounded-[20px] overflow-hidden shrink-0 relative group">
                  <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Caption */}
        <p className="text-center text-[12px] text-white/20 mt-14 max-w-md mx-auto leading-relaxed px-6">
          Every image above was generated with AI. Upload your product, choose a style, and get studio-quality shots in seconds.
        </p>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* ═══ FEATURES ═══ */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative z-10 w-full max-w-5xl px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-[10px] font-semibold text-white/25 tracking-[0.3em] uppercase mb-3">Everything you need</p>
          <h2 className="text-3xl md:text-[42px] font-bold text-white tracking-tight">One studio, zero friction</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white/[0.02] border border-white/[0.05] rounded-[20px] p-6 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-500 group"
            >
              <span className="text-3xl block mb-4 group-hover:scale-110 transition-transform duration-300">{f.icon}</span>
              <h3 className="text-[14px] font-semibold text-white/80 mb-2">{f.title}</h3>
              <p className="text-[12px] text-white/35 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* ═══ HOW IT WORKS ═══ */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative z-10 w-full max-w-4xl px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-[10px] font-semibold text-white/25 tracking-[0.3em] uppercase mb-3">Simple workflow</p>
          <h2 className="text-3xl md:text-[42px] font-bold text-white tracking-tight">Three steps to launch</h2>
        </div>
        <div className="grid grid-cols-3 gap-6 md:gap-10">
          {[
            { step: '01', title: 'Upload', desc: 'Drop your product photos — any angle, any quality. AI handles the rest.' },
            { step: '02', title: 'Generate', desc: 'AI creates optimized prompts and renders studio-quality product shots.' },
            { step: '03', title: 'Launch', desc: 'Get SEO titles, descriptions, 13 tags, and FAQ — paste straight into Etsy.' },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                <span className="text-[13px] font-bold text-white/40">{s.step}</span>
              </div>
              <h3 className="text-[15px] font-semibold text-white/70 mb-2">{s.title}</h3>
              <p className="text-[12px] text-white/30 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* ═══ TECH BAR + CTA ═══ */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative z-10 w-full max-w-3xl px-6 py-24 text-center">
        <div className="flex items-center justify-center gap-6 flex-wrap text-[12px] text-white/30 mb-16">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
            <span>Gemini Flash</span>
          </div>
          <span className="w-px h-4 bg-white/[0.08]"></span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500/50"></div>
            <span>Gemini Pro</span>
          </div>
          <span className="w-px h-4 bg-white/[0.08]"></span>
          <span>12 SEO Positions</span>
          <span className="w-px h-4 bg-white/[0.08]"></span>
          <span>10 Design Styles</span>
          <span className="w-px h-4 bg-white/[0.08]"></span>
          <span>Smart Prompts</span>
        </div>

        <button
          onClick={onEnter}
          className="group inline-flex items-center justify-center px-14 py-4 rounded-full text-[15px] font-semibold bg-white text-black hover:bg-white/90 transition-all active:scale-[0.97] shadow-[0_0_100px_rgba(255,255,255,0.06)]"
        >
          Get started
          <svg className="w-4 h-4 ml-3 opacity-40 group-hover:opacity-70 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path d="M5 12h14m-6-6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="relative z-10 w-full border-t border-white/[0.04] py-8">
        <p className="text-center text-[10px] text-white/20 tracking-[0.2em] uppercase">
          Built by LGCorporation
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
