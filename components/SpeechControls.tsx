'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface WeatherData {
  location: string;
  current: {
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
    icon: string;
    feelsLike: number;
    pressure: number;
    visibility: number;
    uv: number;
  };
  todayHourly: Array<{
    time: string;
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
    icon: string;
    chanceOfRain: number;
    feelsLike: number;
  }>;
  forecast: Array<{
    date: string;
    dayName: string;
    maxTemp: number;
    minTemp: number;
    description: string;
    icon: string;
    chanceOfRain: number;
    humidity: number;
    hourly: Array<{
      time: string;
      temperature: number;
      description: string;
      humidity: number;
      windSpeed: number;
      icon: string;
      chanceOfRain: number;
      feelsLike: number;
    }>;
  }>;
}

interface SpeechControlsProps {
  weatherData: WeatherData | null;
  language: string;
}

export function SpeechControls({ weatherData, language }: SpeechControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const getVoiceForLanguage = (langCode: string) => {
    const langMap: Record<string, string> = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-PT',
      'ru': 'ru-RU',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'zh': 'zh-CN'
    };

    const targetLang = langMap[langCode] || langCode;
    return voices.find(voice => voice.lang.startsWith(targetLang)) || voices[0];
  };

  const generateWeatherText = (data: WeatherData) => {
    const current = data.current;
    let text = '';

    if (language === 'es') {
      text = `El clima actual en ${data.location} es ${current.description} con una temperatura de ${current.temperature} grados Celsius. La humedad es del ${current.humidity}% y la velocidad del viento es de ${current.windSpeed} kilómetros por hora.`;
    } else if (language === 'fr') {
      text = `Le temps actuel à ${data.location} est ${current.description} avec une température de ${current.temperature} degrés Celsius. L'humidité est de ${current.humidity}% et la vitesse du vent est de ${current.windSpeed} kilomètres par heure.`;
    } else if (language === 'de') {
      text = `Das aktuelle Wetter in ${data.location} ist ${current.description} mit einer Temperatur von ${current.temperature} Grad Celsius. Die Luftfeuchtigkeit beträgt ${current.humidity}% und die Windgeschwindigkeit ${current.windSpeed} Kilometer pro Stunde.`;
    } else {
      text = `The current weather in ${data.location} is ${current.description} with a temperature of ${current.temperature} degrees Celsius. The humidity is ${current.humidity}% and the wind speed is ${current.windSpeed} kilometers per hour.`;
    }

    return text;
  };

  const handleSpeak = () => {
    if (!speechSynthesis || !weatherData) return;

    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
      return;
    }

    const text = generateWeatherText(weatherData);
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voice = getVoiceForLanguage(language);
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.lang = language === 'en' ? 'en-US' : language;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentUtterance(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentUtterance(null);
    };

    setCurrentUtterance(utterance);
    speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if (speechSynthesis && currentUtterance) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
    }
  };

  if (!speechSynthesis) {
    return (
      <div className="flex items-center space-x-2">
        <VolumeX className="w-4 h-4 text-white/50" />
        <span className="text-white/50 text-sm">TTS not available</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={handleSpeak}
        disabled={!weatherData}
        variant="ghost"
        size="sm"
        className="text-white hover:bg-white/20"
      >
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4 mr-2" />
            Stop
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 mr-2" />
            Speak
          </>
        )}
      </Button>
    </div>
  );
}