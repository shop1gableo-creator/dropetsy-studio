import React, { useState } from 'react';
import { GEMINI_IMAGE_MODEL_FLASH, GEMINI_IMAGE_MODEL_PRO, RESOLUTIONS, ResolutionId, getImagePrice, formatPrice } from '../constants';
import { UploadedImage, GeneratedImage } from '../types';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';
import { downloadImage } from '../utils/imageUtils';

interface StudioPageProps {
  userApiKey: string;
  isApiKeyValid: boolean | null;
  refImages: UploadedImage[];
  onImageUpload: (files: FileList | null) => void;
  onRemoveImage: (id: string) => void;
  onExecute: (prompts: string[], models: string[], refImages: UploadedImage[]) => void;
  generatedImages: GeneratedImage[];
  isGenerating: boolean;
  onDeleteGenImage: (id: string) => void;
  onResetAll: () => void;
}

const StudioPage: React.FC<StudioPageProps> = ({
  userApiKey, isApiKeyValid, refImages, onImageUpload, onRemoveImage, onExecute, generatedImages, isGenerating, onDeleteGenImage, onResetAll
}) => {
  const [prompt, setPrompt] = useState('');
  const [engine, setEngine] = useState(GEMINI_IMAGE_MODEL_FLASH);
  const [resolution, setResolution] = useState<ResolutionId>('1k');
  const [batchSize, setBatchSize] = useState(1);

  const unitPrice = getImagePrice(engine, resolution);
  const totalCost = unitPrice * batchSize;
  const [selectedImgIndex, setSelectedImgIndex] = useState<number | null>(null);

  const handleExecute = () => {
    if (!prompt.trim() || !isApiKeyValid) return;
    const prompts = Array(batchSize).fill(prompt);
    const models = Array(batchSize).fill(engine);
    onExecute(prompts, models, refImages);
  };

  const currentModalImage = selectedImgIndex !== null ? generatedImages[selectedImgIndex] : null;

  const nextImage = () => {
    if (selectedImgIndex !== null && generatedImages.length > 0) {
      setSelectedImgIndex((selectedImgIndex + 1) % generatedImages.length);
    }
  };
  const prevImage = () => {
    if (selectedImgIndex !== null && generatedImages.length > 0) {
      setSelectedImgIndex((selectedImgIndex - 1 + generatedImages.length) % generatedImages.length);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Panel */}
      <div className="w-[380px] shrink-0 bg-[#111] border-r border-white/[0.06] flex flex-col overflow-y-auto scrollbar-thin">
        <div className="p-7 flex-1">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-white">Studio</h2>
            {(generatedImages.length > 0 || refImages.length > 0) && (
              <button onClick={() => { onResetAll(); setPrompt(''); }} className="text-[11px] text-white/20 hover:text-red-400/70 transition-colors">New product</button>
            )}
          </div>
          <p className="text-[13px] text-white/30 mb-8">Quick create from a prompt.</p>

          {/* Reference images */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-medium text-white/50">Reference images</span>
              <span className="text-[11px] text-white/20">{refImages.length}</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {refImages.map(img => (
                <div key={img.id} className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/[0.06] group">
                  <img src={`data:${img.mimeType};base64,${img.data}`} className="w-full h-full object-cover" alt="" />
                  <button onClick={() => onRemoveImage(img.id)} className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <svg className="w-3.5 h-3.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                </div>
              ))}
              <label className="w-16 h-16 rounded-xl border border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-white/25 hover:bg-white/[0.02] transition-all">
                <svg className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <input type="file" className="hidden" multiple accept="image/*" onChange={e => onImageUpload(e.target.files)} />
              </label>
            </div>
          </div>

          {/* Prompt */}
          <div className="mb-7">
            <span className="text-[12px] font-medium text-white/50 block mb-2.5">Prompt</span>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe the image you want..."
              className="w-full h-32 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-[13px] text-white/90 placeholder-white/15 resize-none focus:border-[#2563eb]"
            />
          </div>

          {/* Engine */}
          <div className="mb-7">
            <span className="text-[12px] font-medium text-white/50 block mb-2.5">Engine</span>
            <div className="flex gap-2">
              <button onClick={() => { setEngine(GEMINI_IMAGE_MODEL_FLASH); if (resolution === '4k') setResolution('2k'); }}
                className={`flex-1 py-2.5 rounded-xl text-[12px] font-medium transition-all ${engine === GEMINI_IMAGE_MODEL_FLASH ? 'bg-white text-black' : 'bg-white/[0.03] text-white/30 border border-white/[0.06] hover:text-white/50'}`}>
                Flash
              </button>
              <button onClick={() => setEngine(GEMINI_IMAGE_MODEL_PRO)}
                className={`flex-1 py-2.5 rounded-xl text-[12px] font-medium transition-all ${engine === GEMINI_IMAGE_MODEL_PRO ? 'bg-white text-black' : 'bg-white/[0.03] text-white/30 border border-white/[0.06] hover:text-white/50'}`}>
                Pro
              </button>
            </div>
          </div>

          {/* Resolution */}
          <div className="mb-7">
            <span className="text-[12px] font-medium text-white/50 block mb-2.5">Resolution</span>
            <div className="flex gap-1.5">
              {RESOLUTIONS.map(r => {
                const price = getImagePrice(engine, r.id);
                const disabled = price === 0;
                return (
                  <button key={r.id} disabled={disabled}
                    onClick={() => setResolution(r.id)}
                    className={`flex-1 py-2.5 rounded-xl text-[12px] font-medium transition-all relative ${disabled ? 'opacity-20 cursor-not-allowed text-white/20' : resolution === r.id ? 'bg-white text-black' : 'bg-white/[0.03] text-white/30 border border-white/[0.06] hover:text-white/50'}`}>
                    <span>{r.label}</span>
                    <span className={`block text-[9px] mt-0.5 ${resolution === r.id ? 'text-black/50' : 'text-white/15'}`}>
                      {disabled ? 'N/A' : `${formatPrice(price)}/img`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Batch Size */}
          <div className="mb-5">
            <span className="text-[12px] font-medium text-white/50 block mb-2.5">Batch size</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map(n => (
                <button key={n} onClick={() => setBatchSize(n)}
                  className={`flex-1 py-2.5 rounded-xl text-[12px] font-medium transition-all ${batchSize === n ? 'bg-white text-black' : 'text-white/25 hover:text-white/50 hover:bg-white/[0.04]'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Cost estimate */}
          <div className="mb-7 bg-white/[0.02] border border-white/[0.04] rounded-xl p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/25">Estimated cost</span>
              <span className="text-[12px] text-emerald-400/60 font-medium">{totalCost > 0 ? `$${totalCost.toFixed(3)}` : 'N/A'}</span>
            </div>
            <div className="mt-2 text-[9px] text-white/10 leading-relaxed">
              Flash: 1K $0.039 · 2K $0.079 | Pro: 1K $0.070 · 2K $0.134 · 4K $0.240
            </div>
          </div>
        </div>

        <div className="p-7 pt-0">
          <button onClick={handleExecute} disabled={isGenerating || !isApiKeyValid || !prompt.trim()}
            className="w-full py-3 rounded-full text-[13px] font-medium bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center">
            {isGenerating ? <LoadingSpinner size="sm" color="text-black" message="Generating..." /> : `Generate ${batchSize > 1 ? batchSize + ' images' : ''} ${totalCost > 0 ? '· ~$' + totalCost.toFixed(3) : ''}`.trim()}
          </button>
        </div>
      </div>

      {/* Right: Output */}
      <div className="flex-1 bg-[#0a0a0a] overflow-y-auto scrollbar-thin">
        {generatedImages.length > 0 ? (
          <div className="p-6">
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
              {generatedImages.map((img, idx) => (
                <div key={img.id} className="rounded-xl overflow-hidden group relative bg-[#161616]">
                  {img.loading ? (
                    <div className="aspect-square skeleton flex items-center justify-center"><LoadingSpinner size="md" color="text-white/30" message="" /></div>
                  ) : img.error ? (
                    <div className="aspect-square flex items-center justify-center p-4"><p className="text-[11px] text-red-400/70">{img.error}</p></div>
                  ) : (
                    <>
                      <img src={img.url!} className="w-full aspect-square object-cover cursor-pointer hover:opacity-90 transition-opacity" alt="" onClick={() => setSelectedImgIndex(idx)} />
                      <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => downloadImage(img.url!, 'dropetsy')} className="p-2 bg-black/60 backdrop-blur-sm rounded-lg text-white/70 hover:text-white">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <button onClick={() => onDeleteGenImage(img.id)} className="p-2 bg-black/60 backdrop-blur-sm rounded-lg text-white/70 hover:text-red-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-[14px] text-white/10">No images yet</p>
          </div>
        )}
      </div>

      <Modal isOpen={selectedImgIndex !== null} onClose={() => setSelectedImgIndex(null)}>
        {currentModalImage && currentModalImage.url && (
          <div className="relative flex items-center justify-center h-full group">
            <img src={currentModalImage.url} className="max-w-full max-h-[85vh] object-contain rounded-xl" alt="" />
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); downloadImage(currentModalImage.url!, 'dropetsy_hd'); }} className="absolute bottom-6 right-6 px-5 py-2.5 rounded-full text-[12px] font-medium bg-white text-black hover:bg-white/90 transition-all opacity-0 group-hover:opacity-100 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Download
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudioPage;
