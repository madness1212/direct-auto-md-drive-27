import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TranslationCache {
  [key: string]: {
    [targetLang: string]: string;
  };
}

export const useAutoTranslate = () => {
  const [translationCache, setTranslationCache] = useState<TranslationCache>({});
  const [isTranslating, setIsTranslating] = useState(false);

  const translateText = async (text: string, targetLang: 'ru' | 'en'): Promise<string> => {
    // Check cache first
    const cacheKey = text.trim();
    if (translationCache[cacheKey]?.[targetLang]) {
      return translationCache[cacheKey][targetLang];
    }

    // If text is empty or very short, return as is
    if (!text || text.length < 3) {
      return text;
    }

    try {
      setIsTranslating(true);
      
      const { data, error } = await supabase.functions.invoke('translate-text', {
        body: {
          text: text,
          targetLang: targetLang
        }
      });

      if (error) {
        console.error('Translation error:', error);
        return text; // Return original text on error
      }

      const translatedText = data?.translatedText || text;

      // Update cache
      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: {
          ...prev[cacheKey],
          [targetLang]: translatedText
        }
      }));

      return translatedText;
    } catch (error) {
      console.error('Translation failed:', error);
      return text; // Return original text on error
    } finally {
      setIsTranslating(false);
    }
  };

  const translateObject = async (obj: any, targetLang: 'ru' | 'en'): Promise<any> => {
    if (typeof obj === 'string') {
      return await translateText(obj, targetLang);
    }

    if (Array.isArray(obj)) {
      return Promise.all(obj.map(item => translateObject(item, targetLang)));
    }

    if (obj && typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = await translateObject(value, targetLang);
      }
      return result;
    }

    return obj;
  };

  return {
    translateText,
    translateObject,
    isTranslating,
    translationCache
  };
};