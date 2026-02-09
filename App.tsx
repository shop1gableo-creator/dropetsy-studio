
import React, { useState, useEffect, useCallback } from 'react';
import TopNavBar from './components/TopNavBar';
import ArchitectPage from './components/ArchitectPage';
import StudioPage from './components/StudioPage';
import BlueprintsPage from './components/BlueprintsPage';
import ConfigModal from './components/ConfigModal';
import LandingPage from './components/LandingPage';
import { generateImage, testSpecificApiKey } from './services/geminiService';
import { 
    IMAGE_GENERATION_CONCURRENCY_LIMIT, 
    MAX_IMAGE_UPLOAD_SIZE_MB, 
    GEMINI_IMAGE_MODEL_FLASH 
} from './constants';
import { GeneratedImage, UploadedImage } from './types';
import { resizeImage } from './utils/imageUtils';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeNav, setActiveNav] = useState('Architect');

  const [userApiKey, setUserApiKey] = useState<string>('');
  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Architect state
  const [architectRefImages, setArchitectRefImages] = useState<UploadedImage[]>([]);
  const [architectGenImages, setArchitectGenImages] = useState<GeneratedImage[]>([]);
  const [isArchitectGenerating, setIsArchitectGenerating] = useState(false);

  // Studio state
  const [studioRefImages, setStudioRefImages] = useState<UploadedImage[]>([]);
  const [studioGenImages, setStudioGenImages] = useState<GeneratedImage[]>([]);
  const [isStudioGenerating, setIsStudioGenerating] = useState(false);

  // Blueprints state
  const [ficheProduitImageBase64, setFicheProduitImageBase64] = useState<string | null>(null);
  const [ficheProduitImageMimeType, setFicheProduitImageMimeType] = useState<string | null>(null);

  const validateKey = async (key: string) => {
    if (!key) { setIsApiKeyValid(false); return; }
    setIsApiKeyValid(null); 
    try {
        const isValid = await testSpecificApiKey(key);
        setIsApiKeyValid(isValid);
    } catch (error) {
        setIsApiKeyValid(false);
    }
  };

  useEffect(() => {
    const storedKey = localStorage.getItem('geminiApiKey');
    if (storedKey) { setUserApiKey(storedKey); validateKey(storedKey); }
    else { setIsApiKeyValid(false); }
  }, []);

  const handleSaveConfig = (key: string, _brandBrain: string) => {
    const trimmedKey = key.trim();
    setUserApiKey(trimmedKey);
    localStorage.setItem('geminiApiKey', trimmedKey);
    validateKey(trimmedKey);
    setIsConfigOpen(false);
  };

  const handleTestKey = (key: string) => {
    const trimmedKey = key.trim();
    setUserApiKey(trimmedKey);
    localStorage.setItem('geminiApiKey', trimmedKey);
    validateKey(trimmedKey);
  };

  const runGeneration = useCallback(async (
    prompts: string[],
    models: string[],
    refImages: UploadedImage[],
    setImages: React.Dispatch<React.SetStateAction<GeneratedImage[]>>,
    setGenerating: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (prompts.length === 0 || !userApiKey || !isApiKeyValid) return;

    setGenerating(true);
    const initial: GeneratedImage[] = prompts.map((p, i) => ({
      id: `img-${i}-${Date.now()}`, url: null, prompt: p, loading: true
    }));
    setImages(initial);

    let currentIndex = 0;
    const execute = async () => {
      const batch = [];
      for (let i = 0; i < IMAGE_GENERATION_CONCURRENCY_LIMIT && currentIndex < initial.length; i++) {
        const taskIdx = currentIndex++;
        const model = models[taskIdx] || GEMINI_IMAGE_MODEL_FLASH;
        batch.push((async () => {
          try {
            const url = await generateImage(userApiKey, initial[taskIdx].prompt, { inAndOutMode: true }, refImages, model);
            setImages(prev => {
              const next = [...prev];
              next[taskIdx] = { ...next[taskIdx], url, loading: false };
              return next;
            });
          } catch (e: any) {
            setImages(prev => {
              const next = [...prev];
              next[taskIdx] = { ...next[taskIdx], loading: false, error: e.message };
              return next;
            });
          }
        })());
      }
      await Promise.allSettled(batch);
      if (currentIndex < initial.length) await execute();
    };
    await execute();
    setGenerating(false);
  }, [userApiKey, isApiKeyValid]);

  const handleArchitectGenerate = (config: any) => {
    runGeneration(config.prompts, config.models, config.refImages, setArchitectGenImages, setIsArchitectGenerating);
  };

  const handleStudioExecute = (prompts: string[], models: string[], refImages: UploadedImage[]) => {
    runGeneration(prompts, models, refImages, setStudioGenImages, setIsStudioGenerating);
  };

  const processFiles = async (files: FileList | null): Promise<UploadedImage[]> => {
    if (!files || files.length === 0) return [];
    const newImages: UploadedImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > MAX_IMAGE_UPLOAD_SIZE_MB * 1024 * 1024) continue;
      try {
        const base64Data = await resizeImage(file);
        newImages.push({ id: `${Date.now()}-${i}`, data: base64Data, mimeType: 'image/jpeg' });
      } catch (e) { console.error(e); }
    }
    return newImages;
  };

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-[#f5f5f5] overflow-hidden animate-fade-in">
      <TopNavBar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isApiKeyValid={isApiKeyValid}
        onConfigClick={() => setIsConfigOpen(true)}
      />
      
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSave={handleSaveConfig}
        currentKey={userApiKey}
        isApiKeyValid={isApiKeyValid}
        onTestKey={handleTestKey}
      />

      {activeNav === 'Architect' && (
        <ArchitectPage
          userApiKey={userApiKey}
          isApiKeyValid={isApiKeyValid}
          refImages={architectRefImages}
          onImageUpload={async (files) => {
            const imgs = await processFiles(files);
            setArchitectRefImages(prev => [...prev, ...imgs]);
          }}
          onRemoveImage={(id) => setArchitectRefImages(prev => prev.filter(img => img.id !== id))}
          onGenerateImages={handleArchitectGenerate}
          generatedImages={architectGenImages}
          isGenerating={isArchitectGenerating}
        />
      )}

      {activeNav === 'Studio' && (
        <StudioPage
          userApiKey={userApiKey}
          isApiKeyValid={isApiKeyValid}
          refImages={studioRefImages}
          onImageUpload={async (files) => {
            const imgs = await processFiles(files);
            setStudioRefImages(prev => [...prev, ...imgs]);
          }}
          onRemoveImage={(id) => setStudioRefImages(prev => prev.filter(img => img.id !== id))}
          onExecute={handleStudioExecute}
          generatedImages={studioGenImages}
          isGenerating={isStudioGenerating}
        />
      )}

      {activeNav === 'Blueprints' && (
        <BlueprintsPage
          userApiKey={userApiKey}
          isApiKeyValid={isApiKeyValid}
          ficheProduitImageBase64={ficheProduitImageBase64}
          ficheProduitImageMimeType={ficheProduitImageMimeType}
          onImageUpload={async (files) => {
            const imgs = await processFiles(files);
            if (imgs.length > 0) {
              setFicheProduitImageBase64(imgs[0].data);
              setFicheProduitImageMimeType('image/jpeg');
            }
          }}
        />
      )}
    </div>
  );
}

export default App;
