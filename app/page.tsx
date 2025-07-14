'use client';

import { useState, useEffect } from 'react';
import { fetchWeatherByCoordinates, fetchWeatherByCity, type WeatherData } from '@/lib/weather-api';
import { WeatherDisplay } from '@/components/WeatherDisplay';
import { LanguageSelector } from '@/components/LanguageSelector';
import { SpeechControls } from '@/components/SpeechControls';
import { LocationInput } from '@/components/LocationInput';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
];

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [location, setLocation] = useState('');
  const [translatedData, setTranslatedData] = useState<WeatherData | null>(null);

  useEffect(() => {
    // Get user's current location on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleFetchWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            console.info('Geolocation access denied by user');
          } else {
            console.error('Geolocation error:', error);
          }
          setError('Unable to get your location. Please search for a city.');
        }
      );
    }
  }, []);

  useEffect(() => {
    if (weatherData && selectedLanguage !== 'en') {
      translateWeatherData(weatherData, selectedLanguage);
    } else {
      setTranslatedData(weatherData);
    }
  }, [weatherData, selectedLanguage]);

  const handleFetchWeatherByCoordinates = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const weatherData = await fetchWeatherByCoordinates(lat, lon);
      setWeatherData(weatherData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data. Please try again.';
      setError(errorMessage);
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchWeatherByCity = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const weatherData = await fetchWeatherByCity(city);
      setWeatherData(weatherData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data. Please try again.';
      setError(errorMessage);
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const translateWeatherData = async (data: WeatherData, targetLanguage: string) => {
    try {
      // For demo purposes, create mock translations
      const translations: Record<string, Record<string, string>> = {
        es: {
          'Clear': 'Despejado',
          'Sunny': 'Soleado',
          'Partly cloudy': 'Parcialmente nublado',
          'Cloudy': 'Nublado',
          'Overcast': 'Nublado',
          'Mist': 'Neblina',
          'Patchy rain possible': 'Posible lluvia dispersa',
          'Light rain': 'Lluvia ligera',
          'Moderate rain': 'Lluvia moderada',
          'Heavy rain': 'Lluvia intensa'
        },
        fr: {
          'Clear': 'Dégagé',
          'Sunny': 'Ensoleillé',
          'Partly cloudy': 'Partiellement nuageux',
          'Cloudy': 'Nuageux',
          'Overcast': 'Couvert',
          'Mist': 'Brume',
          'Patchy rain possible': 'Pluie éparse possible',
          'Light rain': 'Pluie légère',
          'Moderate rain': 'Pluie modérée',
          'Heavy rain': 'Pluie forte'
        },
        de: {
          'Clear': 'Klar',
          'Sunny': 'Sonnig',
          'Partly cloudy': 'Teilweise bewölkt',
          'Cloudy': 'Bewölkt',
          'Overcast': 'Bedeckt',
          'Mist': 'Nebel',
          'Patchy rain possible': 'Vereinzelt Regen möglich',
          'Light rain': 'Leichter Regen',
          'Moderate rain': 'Mäßiger Regen',
          'Heavy rain': 'Starker Regen'
        }
      };

      const translateText = (text: string) => {
        return translations[targetLanguage]?.[text] || text;
      };

      const translated: WeatherData = {
        ...data,
        current: {
          ...data.current,
          description: translateText(data.current.description)
        },
        todayHourly: data.todayHourly.map(hour => ({
          ...hour,
          description: translateText(hour.description)
        })),
        forecast: data.forecast.map(day => ({
          ...day,
          description: translateText(day.description),
          hourly: day.hourly.map(hour => ({
            ...hour,
            description: translateText(hour.description)
          }))
        }))
      };

      setTranslatedData(translated);
    } catch (err) {
      console.error('Translation error:', err);
      setTranslatedData(data);
    }
  };

  const handleLocationSubmit = (city: string) => {
    setLocation(city);
    
    // Check if this is a coordinate-based search
    if (city.startsWith('coords:')) {
      const coords = city.replace('coords:', '').split(',');
      const lat = parseFloat(coords[0]);
      const lon = parseFloat(coords[1]);
      handleFetchWeatherByCoordinates(lat, lon);
    } else {
      handleFetchWeatherByCity(city);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Weather Forecast
            </h1>
            <p className="text-white/80 text-lg">
              Get real-time weather updates with hourly forecasts
            </p>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="backdrop-blur-sm bg-white/10 border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-medium">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LocationInput onLocationSubmit={handleLocationSubmit} />
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/10 border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-medium">
                  Language
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LanguageSelector
                  languages={SUPPORTED_LANGUAGES}
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                />
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/10 border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-medium">
                  Speech
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SpeechControls
                  weatherData={translatedData}
                  language={selectedLanguage}
                />
              </CardContent>
            </Card>
          </div>

          {/* Weather Display */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
              <span className="ml-3 text-white text-lg">Loading weather data...</span>
            </div>
          )}

          {error && (
            <Alert className="mb-6 bg-red-500/10 border-red-500/20 text-red-100">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {translatedData && !loading && (
            <WeatherDisplay weatherData={translatedData} />
          )}

          {/* Theme Toggle */}
          <div className="fixed bottom-6 right-6">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}