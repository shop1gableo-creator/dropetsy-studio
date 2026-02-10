import React, { useState, useEffect } from 'react';
import { generateSeoContent } from '../services/geminiService';
import { UploadedImage, SeoResult } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface BlueprintsPageProps {
  userApiKey: string;
  isApiKeyValid: boolean | null;
  ficheProduitImageBase64: string | null;
  ficheProduitImageMimeType: string | null;
  onImageUpload: (files: FileList | null) => void;
  onResetAll: () => void;
}

const BlueprintsPage: React.FC<BlueprintsPageProps> = ({
  userApiKey, isApiKeyValid, ficheProduitImageBase64, ficheProduitImageMimeType, onImageUpload, onResetAll
}) => {
  const [productName, setProductName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [seoResult, setSeoResult] = useState<SeoResult | null>(null);
  const [editableTitle, setEditableTitle] = useState('');
  const [editableDescription, setEditableDescription] = useState('');
  const [editableTags, setEditableTags] = useState('');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  useEffect(() => {
    if (seoResult) {
      setEditableTitle(seoResult.title || '');
      setEditableDescription(seoResult.description || '');
      const rawTags = seoResult.tags;
      const tagsStr = Array.isArray(rawTags) ? rawTags.join(', ') : (typeof rawTags === 'string' ? rawTags : '');
      setEditableTags(tagsStr);
    }
  }, [seoResult]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const handleCopyAll = () => {
    const fullText = `Title:\n${editableTitle}\n\nDescription:\n${editableDescription}\n\nTags:\n${editableTags}`;
    handleCopy(fullText, 'all');
  };

  const handleGenSeo = async () => {
    if (!ficheProduitImageBase64 || !isApiKeyValid) return;
    setIsLoading(true);
    try {
      const res = await generateSeoContent(userApiKey, ficheProduitImageBase64, ficheProduitImageMimeType!, productName);
      setSeoResult(res);
    } catch (e) { alert(e instanceof Error ? e.message : String(e)); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Panel */}
      <div className="w-[380px] shrink-0 bg-[#111] border-r border-white/[0.06] flex flex-col overflow-y-auto scrollbar-thin">
        <div className="p-7 flex-1">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-white">Blueprints</h2>
            {(ficheProduitImageBase64 || seoResult) && (
              <button onClick={() => { onResetAll(); setProductName(''); setSeoResult(null); setEditableTitle(''); setEditableDescription(''); setEditableTags(''); }} className="text-[11px] text-white/35 hover:text-red-400/70 transition-colors">New product</button>
            )}
          </div>
          <p className="text-[13px] text-white/45 mb-8">Generate an optimized Etsy listing.</p>

          {/* Image upload */}
          <div className="mb-7">
            <span className="text-[12px] font-medium text-white/60 block mb-2.5">Product image</span>
            <div className="border border-dashed border-white/10 rounded-xl p-5 text-center hover:border-white/20 transition-all">
              {ficheProduitImageBase64 ? (
                <img src={`data:${ficheProduitImageMimeType};base64,${ficheProduitImageBase64}`} className="max-h-40 mx-auto rounded-lg mb-3" alt="" />
              ) : (
                <div className="py-4">
                  <svg className="w-8 h-8 mx-auto text-white/10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              )}
              <label className="cursor-pointer text-[12px] text-white/40 hover:text-white/70 transition-colors">
                {ficheProduitImageBase64 ? 'Change image' : 'Select image'}
                <input type="file" className="hidden" accept="image/*" onChange={e => onImageUpload(e.target.files)} />
              </label>
            </div>
          </div>

          {/* Product name */}
          <div className="mb-7">
            <span className="text-[12px] font-medium text-white/60 block mb-2.5">Product context <span className="text-white/30">optional</span></span>
            <input
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="Name, colors, variants..."
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-[13px] text-white/90 placeholder-white/15 focus:border-[#2563eb]"
            />
          </div>

          {/* Info */}
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 mb-6">
            <p className="text-[11px] text-white/40 leading-relaxed">
              AI researches real specs from marketplaces. Generates SEO title, storytelling description, 13 tags, and FAQ.
            </p>
          </div>
        </div>

        <div className="p-7 pt-0">
          <button onClick={handleGenSeo} disabled={isLoading || !ficheProduitImageBase64 || !isApiKeyValid}
            className="w-full py-3 rounded-full text-[13px] font-medium bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center">
            {isLoading ? <LoadingSpinner size="sm" color="text-black" message="Analyzing..." /> : 'Generate listing'}
          </button>
        </div>
      </div>

      {/* Right: Output */}
      <div className="flex-1 bg-[#0a0a0a] overflow-y-auto scrollbar-thin">
        {seoResult ? (
          <div className="p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-[15px] font-semibold text-white">Listing output</h3>
                <p className="text-[12px] text-white/40 mt-0.5">Etsy-optimized</p>
              </div>
              <button onClick={handleCopyAll} className="px-4 py-2 rounded-full text-[11px] font-medium bg-white/[0.06] text-white/50 hover:bg-white/[0.1] hover:text-white/70 transition-all">
                {copyStatus === 'all' ? 'Copied ✓' : 'Copy all'}
              </button>
            </div>

            {/* Title */}
            <div className="bg-[#111] border border-white/[0.04] rounded-xl p-5 mb-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-white/45">Title</span>
                <button onClick={() => handleCopy(editableTitle, 'title')} className="text-[11px] text-white/35 hover:text-white/55 transition-colors">
                  {copyStatus === 'title' ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
              <input value={editableTitle} onChange={e => setEditableTitle(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 text-[13px] text-white/90 focus:border-[#2563eb]" />
            </div>

            {/* Description */}
            <div className="bg-[#111] border border-white/[0.04] rounded-xl p-5 mb-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-white/45">Description & FAQ</span>
                <button onClick={() => handleCopy(editableDescription, 'desc')} className="text-[11px] text-white/35 hover:text-white/55 transition-colors">
                  {copyStatus === 'desc' ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
              <textarea value={editableDescription} onChange={e => setEditableDescription(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 text-[13px] text-white/70 min-h-[500px] resize-none focus:border-[#2563eb] leading-relaxed" />
            </div>

            {/* Tags */}
            <div className="bg-[#111] border border-white/[0.04] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-white/45">13 Etsy tags</span>
                <button onClick={() => handleCopy(editableTags, 'tags')} className="text-[11px] text-white/35 hover:text-white/55 transition-colors">
                  {copyStatus === 'tags' ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
              <textarea value={editableTags} onChange={e => setEditableTags(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 text-[13px] text-white/70 resize-none focus:border-[#2563eb]" rows={3} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-[14px] text-white/25">Upload an image to start</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlueprintsPage;
