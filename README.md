# Weather Forecast App

A beautiful, fully-featured weather application built with Next.js that provides real-time weather data with multi-language support and text-to-speech functionality.

## Features

- **Real-time Weather Data**: Powered by WeatherAPI.com
- **Today's Hourly Forecast**: Detailed hourly weather for the current day
- **3-Day Forecast**: Interactive buttons to view next 3 days with hourly data
- **Location Services**: 
  - Automatic geolocation detection
  - City search capability
- **Multi-language Support**: Weather descriptions in 10+ languages
- **Text-to-Speech**: Hear weather forecasts in your preferred language
- **Responsive Design**: Beautiful UI that works on all devices
- **Dark/Light Theme**: Toggle between themes

## Setup Instructions

### 1. API Configuration

The app is pre-configured with a WeatherAPI.com API key. The API key is already set in the `.env.local` file:

```env
NEXT_PUBLIC_WEATHER_API_KEY=4a19bc28a5d948e2a65204832251307
```

### 2. Install and Run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

## Key Features

### 📅 **Today's Hourly Data**
- Displays current day's hourly forecast starting from the current hour
- Shows temperature, weather conditions, humidity, wind speed, and rain chance
- Real-time weather icons from WeatherAPI.com

### 🗓️ **3-Day Forecast Buttons**
- Interactive buttons to switch between Today and the next 3 days
- Each day shows:
  - Daily summary with high/low temperatures
  - Hourly breakdown for the selected day
  - Weather conditions and precipitation chances

### 🌍 **Location Features**
- **Auto-detection**: Uses browser geolocation to get current weather
- **City Search**: Search for any city worldwide
- **Coordinate Support**: Direct latitude/longitude input

### 🗣️ **Multi-language & Speech**
- **10 Languages**: English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese
- **Text-to-Speech**: Hear weather announcements in your preferred language
- **Real-time Translation**: Weather descriptions translated on-the-fly

## API Usage

The app uses WeatherAPI.com endpoints:

- **Current Weather + 4-day Forecast**: `/forecast.json` - Get current conditions and 4-day forecast with hourly data
- **City Search**: Direct city name support in the forecast endpoint
- **Coordinates**: Latitude/longitude support for precise location weather

## Weather Data Displayed

### Current Weather
- Temperature (°C) with "feels like" temperature
- Weather description and icon
- Humidity percentage
- Wind speed (km/h)
- Atmospheric pressure (mb)
- Visibility (km)
- UV index

### Hourly Forecast
- Temperature for each hour
- Weather conditions with icons
- Humidity and wind speed
- Chance of rain percentage
- "Feels like" temperature

### Daily Forecast
- High and low temperatures
- Weather summary
- Average humidity
- Daily rain chance
- Complete hourly breakdown

## Supported Languages

- English (en) - Default
- Spanish (es) - Español
- French (fr) - Français
- German (de) - Deutsch
- Italian (it) - Italiano
- Portuguese (pt) - Português
- Russian (ru) - Русский
- Japanese (ja) - 日本語
- Korean (ko) - 한국어
- Chinese (zh) - 中文

## Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **API**: WeatherAPI.com
- **Speech**: Web Speech API
- **TypeScript**: Full type safety
- **Theme**: next-themes for dark/light mode

## Project Structure

```
├── app/
│   ├── page.tsx          # Main weather app with day selection
│   ├── layout.tsx        # Root layout with theme provider
│   └── globals.css       # Global styles and theme variables
├── components/
│   ├── WeatherDisplay.tsx    # Weather data with day buttons
│   ├── LanguageSelector.tsx  # Language selection dropdown
│   ├── LocationInput.tsx     # City search and geolocation
│   ├── SpeechControls.tsx    # Text-to-speech functionality
│   └── ThemeToggle.tsx       # Dark/light theme toggle
├── lib/
│   └── weather-api.ts    # WeatherAPI.com integration
└── .env.local           # API key configuration
```

## User Interface

### Main Features
1. **Current Weather Card**: Large display of current conditions
2. **Day Selection**: Buttons for Today + next 3 days
3. **Hourly Grid**: Responsive grid of hourly forecasts
4. **Control Panel**: Location search, language, and speech controls
5. **Theme Toggle**: Floating button for dark/light mode

### Design Elements
- **Glassmorphism**: Translucent cards with backdrop blur
- **Gradient Backgrounds**: Dynamic color schemes
- **Hover Effects**: Interactive elements with smooth transitions
- **Responsive Layout**: Optimized for all screen sizes
- **Color-coded Temperatures**: Visual temperature indicators

## Error Handling

The app includes comprehensive error handling for:

- Invalid API responses
- Network failures
- Geolocation permission denied
- City not found errors
- API rate limits
- Translation failures

## Browser Compatibility

- **Geolocation**: Requires HTTPS in production
- **Text-to-Speech**: Supported in modern browsers
- **Responsive Design**: Works on all screen sizes
- **Theme Persistence**: Remembers user preferences

## Development

To extend the app:

1. **Add new languages**: Update the `SUPPORTED_LANGUAGES` array and translation mappings
2. **Customize UI**: Modify Tailwind classes and shadcn/ui components
3. **Add features**: Extend the weather data interface and API calls
4. **New forecast periods**: Modify the forecast days in the API call

## Production Deployment

1. Ensure the API key is properly configured
2. Set up HTTPS for geolocation features
3. Consider implementing caching for API responses
4. Monitor API usage and rate limits

## License

MIT License - feel free to use this project for learning and development.