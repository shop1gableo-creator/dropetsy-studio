import React, { useState } from 'react';
import { STYLE_MATRIX, GEMINI_IMAGE_MODEL_FLASH, GEMINI_IMAGE_MODEL_PRO, RESOLUTIONS, ResolutionId, getImagePrice, formatPrice } from '../constants';
import { generatePrompts } from '../services/geminiService';
import { UploadedImage, GeneratedImage } from '../types';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';
import { downloadImage } from '../utils/imageUtils';

export interface ArchitectConfig {
  prompts: string[];
  models: string[];
  refImages: UploadedImage[];
}

interface ArchitectPageProps {
  userApiKey: string;
  isApiKeyValid: boolean | null;
  refImages: UploadedImage[];
  onImageUpload: (files: FileList | null) => void;
  onRemoveImage: (id: string) => void;
  onGenerateImages: (config: ArchitectConfig) => void;
  generatedImages: GeneratedImage[];
  isGenerating: boolean;
  onDeleteGenImage: (id: string) => void;
  onResetAll: () => void;
  savedPrompts: string[];
  savedPromptModels: string[];
  savedPromptCounts: number[];
  savedPromptResolutions: ResolutionId[];
  onPromptsChange: (p: string[]) => void;
  onPromptModelsChange: (m: string[]) => void;
  onPromptCountsChange: (c: number[]) => void;
  onPromptResolutionsChange: (r: ResolutionId[]) => void;
}

const ArchitectPage: React.FC<ArchitectPageProps> = ({
  userApiKey, isApiKeyValid, refImages, onImageUpload, onRemoveImage, onGenerateImages, generatedImages, isGenerating,
  onDeleteGenImage, onResetAll, savedPrompts, savedPromptModels, savedPromptCounts, savedPromptResolutions, onPromptsChange, onPromptModelsChange, onPromptCountsChange, onPromptResolutionsChange
}) => {
  const [dataInput, setDataInput] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [customDA, setCustomDA] = useState('');
  const [numPrompts, setNumPrompts] = useState(6);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);

  // Use persisted prompts from parent
  const generatedPrompts = savedPrompts;
  const promptModels = savedPromptModels;
  const promptCounts = savedPromptCounts;
  const setGeneratedPrompts = onPromptsChange;
  const setPromptModels = onPromptModelsChange;
  const setPromptCounts = onPromptCountsChange;
  const promptResolutions = savedPromptResolutions;
  const setPromptResolutions = onPromptResolutionsChange;
  const [selectedImgIndex, setSelectedImgIndex] = useState<number | null>(null);

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
  const currentModalImage = selectedImgIndex !== null ? generatedImages[selectedImgIndex] : null;

  const toggleStyle = (id: string) => {
    setSelectedStyles(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleInitialize = async () => {
    if (!userApiKey || !isApiKeyValid) return;
    setIsLoadingPrompts(true);
    try {
      const selectedDA = STYLE_MATRIX.filter(s => selectedStyles.includes(s.id));
      const bgContext = selectedDA.length > 0
        ? selectedDA.map(s => s.prompt).join(' | NEXT STYLE: ')
        : customDA || 'automatically analyzed based on the product type. Create a logically perfect, hyper-realistic, high-end environment.';

      const brandBrain = localStorage.getItem('brandBrain') || '';
      const res = await generatePrompts(
        userApiKey,
        dataInput || null,
        bgContext,
        refImages,
        customDA,
        true,
        numPrompts,
        brandBrain
      );
      setGeneratedPrompts(res);
      setPromptModels(res.map(() => GEMINI_IMAGE_MODEL_FLASH));
      setPromptCounts(res.map(() => 1));
      setPromptResolutions(res.map(() => '1k' as ResolutionId));
    } catch (e: any) {
      alert(e.message || 'Error generating prompts');
    } finally {
      setIsLoadingPrompts(false);
    }
  };

  const handleExecute = () => {
    const expandedPrompts: string[] = [];
    const expandedModels: string[] = [];
    generatedPrompts.forEach((p, i) => {
      const count = promptCounts[i] || 1;
      for (let j = 0; j < count; j++) {
        expandedPrompts.push(p);
        expandedModels.push(promptModels[i] || GEMINI_IMAGE_MODEL_FLASH);
      }
    });
    onGenerateImages({
      prompts: expandedPrompts,
      models: expandedModels,
      refImages,
    });
  };

  const totalImages = promptCounts.reduce((s, c) => s + c, 0);

  const totalCost = generatedPrompts.reduce((sum, _, i) => {
    const model = promptModels[i] || GEMINI_IMAGE_MODEL_FLASH;
    const res = promptResolutions[i] || '1k';
    const count = promptCounts[i] || 1;
    const price = getImagePrice(model, res);
    return sum + (price * count);
  }, 0);

  const setAllModels = (model: string) => {
    setPromptModels(prev => prev.map(() => model));
  };

  const setAllCounts = (count: number) => {
    setPromptCounts(prev => prev.map(() => count));
  };

  const setAllResolutions = (res: ResolutionId) => {
    setPromptResolutions(prev => prev.map(() => res));
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Panel — Always input */}
      <div className="w-[380px] shrink-0 bg-[#111] border-r border-white/[0.06] flex flex-col overflow-y-auto scrollbar-thin">
        <div className="p-7 flex-1">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-white">Architect</h2>
            {(generatedPrompts.length > 0 || generatedImages.length > 0 || refImages.length > 0) && (
              <button onClick={() => { onResetAll(); setDataInput(''); setSelectedStyles([]); setCustomDA(''); }} className="text-[11px] text-white/35 hover:text-red-400/70 transition-colors">New product</button>
            )}
          </div>
          <p className="text-[13px] text-white/45 mb-8">Configure your product shoot.</p>

          {/* Visual Assets */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-medium text-white/60">Reference images</span>
              <span className="text-[11px] text-white/35">{refImages.length}</span>
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

          {/* Data Input */}
          <div className="mb-7">
            <span className="text-[12px] font-medium text-white/60 block mb-2.5">Product details</span>
            <textarea
              value={dataInput}
              onChange={e => setDataInput(e.target.value)}
              placeholder="Describe your product..."
              className="w-full h-24 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-[13px] text-white/90 placeholder-white/20 resize-none focus:border-[#2563eb]"
            />
          </div>

          {/* Style Matrix */}
          <div className="mb-7">
            <span className="text-[12px] font-medium text-white/60 block mb-2.5">Design aesthetic</span>
            <div className="space-y-1">
              {STYLE_MATRIX.map(style => (
                <button
                  key={style.id}
                  onClick={() => toggleStyle(style.id)}
                  className={`w-full text-left px-3.5 py-2 rounded-lg text-[12px] transition-all ${
                    selectedStyles.includes(style.id)
                      ? 'bg-white/[0.08] text-white font-medium'
                      : 'text-white/40 hover:text-white/60 hover:bg-white/[0.02]'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom DA */}
          <div className="mb-7">
            <span className="text-[12px] font-medium text-white/60 block mb-2.5">Custom directive <span className="text-white/30">optional</span></span>
            <textarea
              value={customDA}
              onChange={e => setCustomDA(e.target.value)}
              placeholder="Add custom visual direction..."
              className="w-full h-20 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-[13px] text-white/90 placeholder-white/15 resize-none focus:border-[#2563eb]"
            />
          </div>

          {/* Prompt count */}
          <div className="mb-8">
            <span className="text-[12px] font-medium text-white/60 block mb-2.5">Number of prompts</span>
            <div className="flex gap-1.5 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                <button
                  key={n}
                  onClick={() => setNumPrompts(n)}
                  className={`w-9 h-9 rounded-lg text-[12px] font-medium transition-all ${
                    numPrompts === n
                      ? 'bg-white text-black'
                      : 'text-white/35 hover:text-white/55 hover:bg-white/[0.04]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-7 pt-0">
          <button onClick={handleInitialize} disabled={isLoadingPrompts || !isApiKeyValid}
            className="w-full py-3 rounded-full text-[13px] font-medium bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center">
            {isLoadingPrompts ? <LoadingSpinner size="sm" color="text-black" message="Generating..." /> : 'Generate prompts'}
          </button>
        </div>
      </div>

      {/* Right Panel — Prompts + Images */}
      <div className="flex-1 bg-[#0a0a0a] overflow-y-auto scrollbar-thin">
        {/* Prompts Section (appears after generation) */}
        {generatedPrompts.length > 0 && (
          <div className="border-b border-white/[0.06] p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h3 className="text-[13px] font-medium text-white/70">Prompts</h3>
                <span className="text-[11px] text-white/35 bg-white/[0.04] px-2.5 py-0.5 rounded-full">{generatedPrompts.length} prompts · {totalImages} images</span>
              </div>
              <div className="flex gap-2 items-center">
                <button onClick={() => setAllModels(GEMINI_IMAGE_MODEL_FLASH)} className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.08] transition-all">All Flash</button>
                <button onClick={() => setAllModels(GEMINI_IMAGE_MODEL_PRO)} className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.08] transition-all">All Pro</button>
                <div className="w-px h-4 bg-white/[0.06]"></div>
                {RESOLUTIONS.map(r => (
                  <button key={r.id} onClick={() => setAllResolutions(r.id)} className="px-2 py-1.5 rounded-lg text-[10px] text-white/35 hover:text-white/55 hover:bg-white/[0.03] transition-all">{r.label}</button>
                ))}
                <div className="w-px h-4 bg-white/[0.06]"></div>
                {[1, 2, 3, 4].map(n => (
                  <button key={n} onClick={() => setAllCounts(n)} className="px-2 py-1.5 rounded-lg text-[10px] text-white/35 hover:text-white/55 hover:bg-white/[0.03] transition-all">{n}x</button>
                ))}
              </div>
            </div>

            {/* Pricing estimate */}
            <div className="flex items-center gap-4 mb-4 px-1">
              <span className="text-[10px] text-white/30">Estimated cost: <span className="text-emerald-400/70 font-medium">${totalCost.toFixed(2)}</span></span>
              <span className="text-[10px] text-white/25">Flash 1K $0.039 · 2K $0.079 | Pro 1K $0.070 · 2K $0.134 · 4K $0.240</span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 mb-4">
              {generatedPrompts.map((prompt, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3.5 hover:border-white/[0.08] transition-all">
                  <p className="text-[11px] text-white/50 leading-relaxed mb-3 line-clamp-2">{prompt}</p>
                  <div className="flex items-center gap-2">
                    <select
                      value={promptModels[i]}
                      onChange={e => { const next = [...promptModels]; next[i] = e.target.value; setPromptModels(next); }}
                      className="bg-black/30 border border-white/[0.06] rounded-lg px-2 py-1.5 text-[10px] text-white/70 cursor-pointer"
                    >
                      <option value={GEMINI_IMAGE_MODEL_FLASH}>Flash</option>
                      <option value={GEMINI_IMAGE_MODEL_PRO}>Pro</option>
                    </select>
                    <div className="flex gap-0.5">
                      {RESOLUTIONS.map(r => {
                        const currentModel = promptModels[i] || GEMINI_IMAGE_MODEL_FLASH;
                        const price = getImagePrice(currentModel, r.id);
                        const disabled = price === 0;
                        return (
                          <button key={r.id} disabled={disabled} onClick={() => { const next = [...promptResolutions]; next[i] = r.id; setPromptResolutions(next); }}
                            className={`px-1.5 py-1 rounded text-[9px] font-medium transition-all ${disabled ? 'text-white/10 cursor-not-allowed' : (promptResolutions[i] || '1k') === r.id ? 'bg-white/[0.12] text-white/80' : 'text-white/25 hover:text-white/50'}`}
                            title={disabled ? 'Not available' : `${r.pixels} — ${formatPrice(price)}/img`}>
                            {r.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4].map(n => (
                        <button key={n} onClick={() => { const next = [...promptCounts]; next[i] = n; setPromptCounts(next); }}
                          className={`w-6 h-6 rounded text-[9px] font-medium transition-all ${promptCounts[i] === n ? 'bg-white text-black' : 'text-white/20 hover:text-white/40'}`}>{n}</button>
                      ))}
                    </div>
                    <span className="text-[9px] text-emerald-400/70 ml-auto">{formatPrice(getImagePrice(promptModels[i] || GEMINI_IMAGE_MODEL_FLASH, promptResolutions[i] || '1k') * (promptCounts[i] || 1))}</span>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleExecute} disabled={isGenerating || !isApiKeyValid}
              className="w-full py-3 rounded-full text-[13px] font-medium bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center">
              {isGenerating ? <LoadingSpinner size="sm" color="text-black" message="Rendering..." /> : `Generate ${totalImages} images · ~$${totalCost.toFixed(2)}`}
            </button>
          </div>
        )}

        {/* Images Grid */}
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
        ) : generatedPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-[14px] text-white/25">No images yet</p>
          </div>
        ) : null}
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

export default ArchitectPage;
