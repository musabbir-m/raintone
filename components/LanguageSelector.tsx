'use client';

import React from 'react';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onLanguageChange }) => {
  const isBengali = selectedLanguage === 'bn';
  return (
    <button
      className="px-4 py-2 rounded bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-all duration-200"
      onClick={() => onLanguageChange(isBengali ? 'en' : 'bn')}
      aria-label={isBengali ? 'Switch to English' : 'Switch to Bengali'}
    >
      {isBengali ? 'বাংলা' : 'English'}
    </button>
  );
};