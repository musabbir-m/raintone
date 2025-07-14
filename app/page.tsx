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
import bnWeatherTranslations from '@/lib/bn-translation';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'bn', name: 'বাংলা' },
];

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [location, setLocation] = useState('');
  const [translatedData, setTranslatedData] = useState<WeatherData | null>(null);

  // Set Bengali as default if country is Bangladesh
  useEffect(() => {
    if (weatherData && weatherData.location.includes('Bangladesh')) {
      setSelectedLanguage('bn');
    }
  }, [weatherData]);

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
      const translateText = (text: string) => {
        if (targetLanguage === 'bn') {
          return bnWeatherTranslations[text] || text;
        }
        return text;
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
              {selectedLanguage === 'bn' ? bnWeatherTranslations['Weather Forecast'] : 'Weather Forecast'}
            </h1>
            <p className="text-white/80 text-lg">
              {selectedLanguage === 'bn' ? bnWeatherTranslations['Get real-time weather updates with hourly forecasts'] : 'Get real-time weather updates with hourly forecasts'}
            </p>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="backdrop-blur-sm bg-white/10 border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-medium">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  {selectedLanguage === 'bn' ? bnWeatherTranslations['Location'] : 'Location'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LocationInput onLocationSubmit={handleLocationSubmit} />
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/10 border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-medium">
                  {selectedLanguage === 'bn' ? bnWeatherTranslations['Language'] : 'Language'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                />
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/10 border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-medium">
                  {selectedLanguage === 'bn' ? bnWeatherTranslations['Speech'] : 'Speech'}
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
              <span className="ml-3 text-white text-lg">{selectedLanguage === 'bn' ? bnWeatherTranslations['Loading weather data...'] : 'Loading weather data...'}</span>
            </div>
          )}

          {error && (
            <Alert className="mb-6 bg-red-500/10 border-red-500/20 text-red-100">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{selectedLanguage === 'bn' ? bnWeatherTranslations[error] || error : error}</AlertDescription>
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