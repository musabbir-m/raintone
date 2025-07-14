interface WeatherApiCurrentResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
}

interface WeatherApiForecastResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      date_epoch: number;
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        avgtemp_c: number;
        avgtemp_f: number;
        maxwind_mph: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        totalprecip_in: number;
        totalsnow_cm: number;
        avgvis_km: number;
        avgvis_miles: number;
        avghumidity: number;
        daily_will_it_rain: number;
        daily_chance_of_rain: number;
        daily_will_it_snow: number;
        daily_chance_of_snow: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        uv: number;
      };
      astro: {
        sunrise: string;
        sunset: string;
        moonrise: string;
        moonset: string;
        moon_phase: string;
        moon_illumination: string;
        is_moon_up: number;
        is_sun_up: number;
      };
      hour: Array<{
        time_epoch: number;
        time: string;
        temp_c: number;
        temp_f: number;
        is_day: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        wind_mph: number;
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        pressure_mb: number;
        pressure_in: number;
        precip_mm: number;
        precip_in: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        feelslike_f: number;
        windchill_c: number;
        windchill_f: number;
        heatindex_c: number;
        heatindex_f: number;
        dewpoint_c: number;
        dewpoint_f: number;
        will_it_rain: number;
        chance_of_rain: number;
        will_it_snow: number;
        chance_of_snow: number;
        vis_km: number;
        vis_miles: number;
        gust_mph: number;
        gust_kph: number;
        uv: number;
      }>;
    }>;
  };
}

interface GeocodingResponse {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface WeatherData {
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

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

if (!API_KEY) {
  console.warn('WeatherAPI.com API key not found. Please add NEXT_PUBLIC_WEATHER_API_KEY to your .env.local file');
}

export async function fetchWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error('API key not configured. Please add your WeatherAPI.com API key to .env.local');
  }

  try {
    // Fetch 4-day forecast (today + 3 days) with hourly data
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=4&aqi=no&alerts=no`
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your WeatherAPI.com API key.');
      }
      if (response.status === 400) {
        throw new Error('Invalid location coordinates.');
      }
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: WeatherApiForecastResponse = await response.json();

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    const todayForecast = data.forecast.forecastday.find(day => day.date === today);
    
    // If today's data is not available, use the first day
    const todayData = todayForecast || data.forecast.forecastday[0];

    // Get current hour to filter today's remaining hours
    const currentHour = new Date().getHours();
    const todayHourly = todayData.hour
      .filter(hour => {
        const hourTime = new Date(hour.time).getHours();
        return hourTime >= currentHour;
      })
      .map(hour => ({
        time: hour.time,
        temperature: Math.round(hour.temp_c),
        description: hour.condition.text,
        humidity: hour.humidity,
        windSpeed: Math.round(hour.wind_kph),
        icon: hour.condition.icon,
        chanceOfRain: hour.chance_of_rain || 0,
        feelsLike: Math.round(hour.feelslike_c)
      }));

    // Transform the data to our format
    const weatherData: WeatherData = {
      location: `${data.location.name}, ${data.location.country}`,
      current: {
        temperature: Math.round(data.current.temp_c),
        description: data.current.condition.text,
        humidity: data.current.humidity,
        windSpeed: Math.round(data.current.wind_kph),
        icon: data.current.condition.icon,
        feelsLike: Math.round(data.current.feelslike_c),
        pressure: Math.round(data.current.pressure_mb),
        visibility: Math.round(data.current.vis_km),
        uv: data.current.uv
      },
      todayHourly,
      forecast: data.forecast.forecastday.slice(1, 4).map(day => ({
        date: day.date,
        dayName: new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' }),
        maxTemp: Math.round(day.day.maxtemp_c),
        minTemp: Math.round(day.day.mintemp_c),
        description: day.day.condition.text,
        icon: day.day.condition.icon,
        chanceOfRain: day.day.daily_chance_of_rain,
        humidity: day.day.avghumidity,
        hourly: day.hour.map(hour => ({
          time: hour.time,
          temperature: Math.round(hour.temp_c),
          description: hour.condition.text,
          humidity: hour.humidity,
          windSpeed: Math.round(hour.wind_kph),
          icon: hour.condition.icon,
          chanceOfRain: hour.chance_of_rain || 0,
          feelsLike: Math.round(hour.feelslike_c)
        }))
      }))
    };

    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

export async function fetchWeatherByCity(cityName: string): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error('API key not configured. Please add your WeatherAPI.com API key to .env.local');
  }

  try {
    // WeatherAPI.com can handle city names directly
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(cityName)}&days=4&aqi=no&alerts=no`
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your WeatherAPI.com API key.');
      }
      if (response.status === 400) {
        throw new Error(`City "${cityName}" not found. Please check the spelling and try again.`);
      }
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: WeatherApiForecastResponse = await response.json();

    // Use the same transformation logic as fetchWeatherByCoordinates
    const today = new Date().toISOString().split('T')[0];
    const todayForecast = data.forecast.forecastday.find(day => day.date === today);
    const todayData = todayForecast || data.forecast.forecastday[0];

    const currentHour = new Date().getHours();
    const todayHourly = todayData.hour
      .filter(hour => {
        const hourTime = new Date(hour.time).getHours();
        return hourTime >= currentHour;
      })
      .map(hour => ({
        time: hour.time,
        temperature: Math.round(hour.temp_c),
        description: hour.condition.text,
        humidity: hour.humidity,
        windSpeed: Math.round(hour.wind_kph),
        icon: hour.condition.icon,
        chanceOfRain: hour.chance_of_rain || 0,
        feelsLike: Math.round(hour.feelslike_c)
      }));

    const weatherData: WeatherData = {
      location: `${data.location.name}, ${data.location.country}`,
      current: {
        temperature: Math.round(data.current.temp_c),
        description: data.current.condition.text,
        humidity: data.current.humidity,
        windSpeed: Math.round(data.current.wind_kph),
        icon: data.current.condition.icon,
        feelsLike: Math.round(data.current.feelslike_c),
        pressure: Math.round(data.current.pressure_mb),
        visibility: Math.round(data.current.vis_km),
        uv: data.current.uv
      },
      todayHourly,
      forecast: data.forecast.forecastday.slice(1, 4).map(day => ({
        date: day.date,
        dayName: new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' }),
        maxTemp: Math.round(day.day.maxtemp_c),
        minTemp: Math.round(day.day.mintemp_c),
        description: day.day.condition.text,
        icon: day.day.condition.icon,
        chanceOfRain: day.day.daily_chance_of_rain,
        humidity: day.day.avghumidity,
        hourly: day.hour.map(hour => ({
          time: hour.time,
          temperature: Math.round(hour.temp_c),
          description: hour.condition.text,
          humidity: hour.humidity,
          windSpeed: Math.round(hour.wind_kph),
          icon: hour.condition.icon,
          chanceOfRain: hour.chance_of_rain || 0,
          feelsLike: Math.round(hour.feelslike_c)
        }))
      }))
    };

    return weatherData;
  } catch (error) {
    console.error('Error fetching weather by city:', error);
    throw error;
  }
}