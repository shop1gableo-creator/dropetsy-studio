import React from 'react';

interface TopNavBarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  isApiKeyValid: boolean | null;
  onConfigClick: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ activeNav, setActiveNav, isApiKeyValid, onConfigClick }) => {
  const navItems = [
    { name: 'Architect', label: 'Architect' },
    { name: 'Studio', label: 'Studio' },
    { name: 'Blueprints', label: 'Blueprints' },
  ];

  const dotClass = isApiKeyValid === null ? 'status-dot-idle' : isApiKeyValid ? 'status-dot' : 'status-dot-error';

  return (
    <nav className="flex items-center justify-between h-14 px-8 border-b border-white/[0.06]">
      <button onClick={() => setActiveNav('Architect')} className="flex items-center gap-2">
        <span className="text-[15px] font-semibold text-white tracking-tight">Dropetsy</span>
        <span className="text-[15px] font-light text-white/25 tracking-tight">.gab</span>
      </button>

      <div className="flex items-center gap-1">
        {navItems.map(item => (
          <button
            key={item.name}
            onClick={() => setActiveNav(item.name)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
              activeNav === item.name
                ? 'bg-white text-black'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={dotClass}></div>
          <span className="text-[11px] text-white/25">{isApiKeyValid ? 'Connected' : 'No key'}</span>
        </div>
        <button
          onClick={onConfigClick}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
        >
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default TopNavBar;
