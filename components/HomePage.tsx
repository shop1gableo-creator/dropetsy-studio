import React from 'react';
import { GRADIENT_PURPLE_PINK } from '../constants';

interface HomePageProps {
  onNavigate: (nav: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <section className="relative text-center py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none"></div>
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40"></div>
        
        <div className="relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
            Powered by Google Gemini AI
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            NanoCreative
            <span className="text-gradient-blue block md:inline"> Studio</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed font-medium">
            Generate stunning, hyper-realistic product images for your Etsy shop with the power of AI. 
            Professional quality, zero effort.
          </p>
          <p className="text-sm text-gray-500 max-w-xl mx-auto mb-12">
            Upload your product photo, choose a style, and let our AI create breathtaking scenes in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('Products')}
              className={`px-10 py-5 rounded-2xl font-black text-lg uppercase tracking-widest ${GRADIENT_PURPLE_PINK} text-white shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center`}
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Start Generating
            </button>
            <button
              onClick={() => onNavigate('Images')}
              className="px-10 py-5 rounded-2xl font-bold text-lg text-gray-300 border-2 border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 uppercase tracking-widest"
            >
              Open Studio
            </button>
          </div>
        </div>

        {/* Decorative floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/5 rounded-full blur-xl animate-float" style={{animationDelay: '0s'}}></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-400/5 rounded-full blur-lg animate-float" style={{animationDelay: '1s'}}></div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
            Powerful <span className="text-gradient-blue">Features</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">Everything you need to create professional product visuals for your e-commerce store.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {[
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ),
              title: 'AI Image Generation',
              desc: 'Generate hyper-realistic product photos with multiple background styles and professional lighting.'
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ),
              title: 'Smart Prompts',
              desc: 'AI analyzes your product and generates optimized prompts for the best possible results.'
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ),
              title: 'SEO Optimization',
              desc: 'Auto-generate Etsy-optimized titles, descriptions, tags and FAQ from your product images.'
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ),
              title: '15+ Background Styles',
              desc: 'From luxury marble to cyberpunk neon, choose the perfect atmosphere for your product.'
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ),
              title: 'Batch Generation',
              desc: 'Generate up to 12 unique scenes per product in a single click. Maximum efficiency.'
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ),
              title: 'Privacy First',
              desc: 'Your API key stays in your browser. No server, no tracking, full control.'
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-[#0f1419]/80 p-8 rounded-2xl border border-gray-800 card-glow animate-fade-in-up group"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 group-hover:bg-blue-500/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wide">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Models Section */}
      <section className="py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
            Supported <span className="text-gradient-blue">Models</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">Choose the engine that fits your needs. Speed or quality, you decide.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Flash Model */}
          <div className="relative bg-[#0f1419]/80 p-8 rounded-2xl border border-gray-800 card-glow group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase">Gemini Flash</h3>
                  <span className="text-xs text-blue-400 font-bold uppercase tracking-widest">Fast & Efficient</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Lightning-fast generation with excellent quality. Perfect for batch production and rapid prototyping.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-300 text-[10px] font-bold uppercase rounded-full border border-blue-500/20">Speed</span>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-300 text-[10px] font-bold uppercase rounded-full border border-blue-500/20">Cost-Effective</span>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-300 text-[10px] font-bold uppercase rounded-full border border-blue-500/20">Default</span>
              </div>
            </div>
          </div>

          {/* Nanobanana Pro Model */}
          <div className="relative bg-[#0f1419]/80 p-8 rounded-2xl border border-cyan-500/20 card-glow group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute top-3 right-3 px-2 py-1 bg-cyan-500/20 text-cyan-300 text-[9px] font-black uppercase rounded-full border border-cyan-500/30">New</div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase">Nanobanana Pro</h3>
                  <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Premium Quality</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Maximum fidelity and detail. Advanced reasoning for the most realistic product scenes possible.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-300 text-[10px] font-bold uppercase rounded-full border border-cyan-500/20">Quality</span>
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-300 text-[10px] font-bold uppercase rounded-full border border-cyan-500/20">Detail</span>
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-300 text-[10px] font-bold uppercase rounded-full border border-cyan-500/20">Pro</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Tool Section */}
      <section className="py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
            Why <span className="text-gradient-blue">NanoCreative</span>?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            { num: '01', title: 'No Photoshoot Needed', desc: 'Skip expensive photography sessions. Upload one photo and get dozens of professional scenes.' },
            { num: '02', title: 'Etsy-Optimized', desc: 'Built specifically for Etsy sellers. Every feature is designed to boost your shop visibility.' },
            { num: '03', title: 'Full Control', desc: 'Choose backgrounds, styles, number of images, and AI models. Your creative vision, amplified.' },
            { num: '04', title: 'Instant Results', desc: 'From upload to finished images in under a minute. Batch generate and download instantly.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-5 p-6 rounded-2xl bg-[#0f1419]/40 border border-gray-800/50 card-glow">
              <span className="text-3xl font-black text-blue-500/30 shrink-0">{item.num}</span>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wide mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center mt-20">
          <button
            onClick={() => onNavigate('Products')}
            className={`px-12 py-5 rounded-2xl font-black text-lg uppercase tracking-widest ${GRADIENT_PURPLE_PINK} text-white shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300`}
          >
            Get Started Now
          </button>
          <p className="text-xs text-gray-500 mt-4 uppercase tracking-widest">Free to use with your own Gemini API key</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
