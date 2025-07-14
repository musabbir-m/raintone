'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export function LanguageSelector({ languages, selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <Select value={selectedLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger className="bg-white/20 border-white/30 text-white">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-gray-900 border-gray-700">
        {languages.map((language) => (
          <SelectItem 
            key={language.code} 
            value={language.code}
            className="text-white hover:bg-gray-800"
          >
            {language.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}