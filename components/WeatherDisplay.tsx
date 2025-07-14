'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Thermometer, Droplets, Wind, Clock, Eye, Sun, Gauge, Calendar } from 'lucide-react';

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

interface WeatherDisplayProps {
  weatherData: WeatherData;
}

export function WeatherDisplay({ weatherData }: WeatherDisplayProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 30) return 'text-red-500';
    if (temp >= 20) return 'text-orange-500';
    if (temp >= 10) return 'text-yellow-500';
    if (temp >= 0) return 'text-blue-500';
    return 'text-purple-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const currentHourlyData = selectedDay !== null 
    ? weatherData.forecast[selectedDay].hourly 
    : weatherData.todayHourly;

  const currentTitle = selectedDay !== null 
    ? `${weatherData.forecast[selectedDay].dayName} - ${formatDate(weatherData.forecast[selectedDay].date)}`
    : 'Today\'s Hourly Forecast';

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <Card className="backdrop-blur-sm bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-xl">
            Current Weather - {weatherData.location}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="mb-2">
                <img 
                  src={`https:${weatherData.current.icon}`}
                  alt={weatherData.current.description}
                  className="w-20 h-20 mx-auto"
                />
              </div>
              <div className={`text-5xl font-bold mb-2 ${getTemperatureColor(weatherData.current.temperature)}`}>
                {weatherData.current.temperature}°C
              </div>
              <div className="text-white/80 text-lg capitalize">
                {weatherData.current.description}
              </div>
              <div className="text-white/60 text-sm mt-1">
                Feels like {weatherData.current.feelsLike}°C
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-white/80">
                <Droplets className="w-5 h-5" />
                <div>
                  <div className="text-sm">Humidity</div>
                  <div className="text-lg font-semibold">{weatherData.current.humidity}%</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Wind className="w-5 h-5" />
                <div>
                  <div className="text-sm">Wind Speed</div>
                  <div className="text-lg font-semibold">{weatherData.current.windSpeed} km/h</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Gauge className="w-5 h-5" />
                <div>
                  <div className="text-sm">Pressure</div>
                  <div className="text-lg font-semibold">{weatherData.current.pressure} mb</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Eye className="w-5 h-5" />
                <div>
                  <div className="text-sm">Visibility</div>
                  <div className="text-lg font-semibold">{weatherData.current.visibility} km</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Sun className="w-5 h-5" />
                <div>
                  <div className="text-sm">UV Index</div>
                  <div className="text-lg font-semibold">{weatherData.current.uv}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Selection Buttons */}
      <Card className="backdrop-blur-sm bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-xl">
            <Calendar className="w-5 h-5 inline mr-2" />
            Select Day for Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setSelectedDay(null)}
              variant={selectedDay === null ? "default" : "outline"}
              className={`${
                selectedDay === null 
                  ? 'bg-white text-gray-900 hover:bg-white/90' 
                  : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
              }`}
            >
              Today
            </Button>
            {weatherData.forecast.map((day, index) => (
              <Button
                key={index}
                onClick={() => setSelectedDay(index)}
                variant={selectedDay === index ? "default" : "outline"}
                className={`${
                  selectedDay === index 
                    ? 'bg-white text-gray-900 hover:bg-white/90' 
                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                }`}
              >
                <div className="text-center">
                  <div className="font-medium">{day.dayName}</div>
                  <div className="text-xs opacity-80">{formatDate(day.date)}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Summary (for forecast days) */}
      {selectedDay !== null && (
        <Card className="backdrop-blur-sm bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              {weatherData.forecast[selectedDay].dayName} Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="mb-2">
                  <img 
                    src={`https:${weatherData.forecast[selectedDay].icon}`}
                    alt={weatherData.forecast[selectedDay].description}
                    className="w-16 h-16 mx-auto"
                  />
                </div>
                <div className="text-white/80 text-lg capitalize mb-2">
                  {weatherData.forecast[selectedDay].description}
                </div>
                <div className="flex justify-center items-center space-x-4">
                  <div className={`text-2xl font-bold ${getTemperatureColor(weatherData.forecast[selectedDay].maxTemp)}`}>
                    {weatherData.forecast[selectedDay].maxTemp}°C
                  </div>
                  <div className="text-white/60">/</div>
                  <div className={`text-xl ${getTemperatureColor(weatherData.forecast[selectedDay].minTemp)}`}>
                    {weatherData.forecast[selectedDay].minTemp}°C
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-white/80">
                  <Droplets className="w-5 h-5" />
                  <div>
                    <div className="text-sm">Rain Chance</div>
                    <div className="text-lg font-semibold">{weatherData.forecast[selectedDay].chanceOfRain}%</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-white/80">
                  <Droplets className="w-5 h-5" />
                  <div>
                    <div className="text-sm">Humidity</div>
                    <div className="text-lg font-semibold">{weatherData.forecast[selectedDay].humidity}%</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hourly Forecast */}
      <Card className="backdrop-blur-sm bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-xl">
            <Clock className="w-5 h-5 inline mr-2" />
            {currentTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentHourlyData.map((hour, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-white/80">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{formatTime(hour.time)}</span>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {hour.temperature}°C
                  </Badge>
                </div>
                
                <div className="text-center mb-3">
                  <div className="mb-1">
                    <img 
                      src={`https:${hour.icon}`}
                      alt={hour.description}
                      className="w-8 h-8 mx-auto"
                    />
                  </div>
                  <div className="text-white/80 text-sm capitalize">
                    {hour.description}
                  </div>
                  <div className="text-white/60 text-xs mt-1">
                    Feels {hour.feelsLike}°C
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
                  <div className="flex items-center space-x-1">
                    <Droplets className="w-3 h-3" />
                    <span>{hour.humidity}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Wind className="w-3 h-3" />
                    <span>{hour.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}