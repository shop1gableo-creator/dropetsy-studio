import React, { useState, useEffect } from 'react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string, brandBrain: string) => void;
  currentKey: string;
  isApiKeyValid: boolean | null;
  onTestKey: (key: string) => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, onSave, currentKey, isApiKeyValid, onTestKey }) => {
  const [key, setKey] = useState(currentKey);
  const [brandBrain, setBrandBrain] = useState('');

  useEffect(() => {
    if (isOpen) {
      setKey(currentKey);
      const stored = localStorage.getItem('brandBrain');
      if (stored) setBrandBrain(stored);
    }
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('brandBrain', brandBrain);
    onSave(key, brandBrain);
  };

  const keyStatus = isApiKeyValid === null ? 'checking' : isApiKeyValid ? 'valid' : 'invalid';
  const keyStatusColor = keyStatus === 'valid' ? 'text-emerald-400' : keyStatus === 'invalid' ? 'text-red-400' : 'text-yellow-400';
  const keyStatusBorder = keyStatus === 'valid' ? 'border-emerald-500/30' : keyStatus === 'invalid' ? 'border-red-500/30' : 'border-yellow-500/30';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-start z-50 pt-[10vh] px-4" onClick={onClose}>
      <div className="bg-[#111] w-full max-w-lg rounded-2xl border border-white/[0.06] shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-[16px] font-semibold text-white">Settings</h2>
          <button onClick={onClose} className="text-white/20 hover:text-white/60 transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* API Key */}
          <div>
            <span className="text-[12px] font-medium text-white/50 block mb-2.5">API Key</span>
            <div className="flex gap-2">
              <input
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="AIza..."
                className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-[13px] text-white/90 placeholder-white/15 focus:border-[#2563eb]"
              />
              <button onClick={() => onTestKey(key)}
                className="px-4 rounded-xl text-[12px] font-medium bg-white/[0.06] text-white/50 border border-white/[0.06] hover:bg-white/[0.1] transition-all">
                Test
              </button>
            </div>

            {key && (
              <div className="mt-2 flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${keyStatus === 'valid' ? 'bg-emerald-400' : keyStatus === 'invalid' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
                <span className={`text-[11px] ${keyStatusColor}`}>
                  {keyStatus === 'valid' ? 'Connected' : keyStatus === 'invalid' ? 'Invalid key' : 'Checking...'}
                </span>
              </div>
            )}

            <p className="mt-2 text-[11px] text-white/15">Stored locally. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/50 underline transition-colors">Get a key →</a></p>
          </div>

          {/* Brand Brain */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[12px] font-medium text-white/50">Brand context</span>
              <span className="text-[10px] text-white/15">optional</span>
            </div>
            <textarea
              value={brandBrain}
              onChange={e => setBrandBrain(e.target.value)}
              placeholder="Brand guidelines, tone of voice..."
              className="w-full h-28 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-[13px] text-white/90 placeholder-white/15 resize-none focus:border-[#2563eb]"
            />
          </div>

          {/* Language */}
          <div>
            <span className="text-[12px] font-medium text-white/50 block mb-2.5">Language</span>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-[13px] text-white/70">English (US)</span>
              <svg className="w-4 h-4 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
          </div>
        </div>

        <div className="p-6 pt-2">
          <button onClick={handleSave}
            className="w-full py-3 rounded-full text-[13px] font-medium bg-white text-black hover:bg-white/90 transition-all">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;
