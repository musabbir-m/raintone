'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';

interface LocationInputProps {
  onLocationSubmit: (location: string) => void;
}

export function LocationInput({ onLocationSubmit }: LocationInputProps) {
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onLocationSubmit(location.trim());
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Trigger a coordinate-based search by passing a special format
          onLocationSubmit(`coords:${latitude},${longitude}`);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        type="text"
        placeholder="Enter city name..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
      />
      <Button type="submit" size="sm" variant="ghost" className="text-white hover:bg-white/20">
        <Search className="w-4 h-4" />
      </Button>
      <Button 
        type="button" 
        size="sm" 
        variant="ghost" 
        onClick={handleCurrentLocation}
        className="text-white hover:bg-white/20"
      >
        <MapPin className="w-4 h-4" />
      </Button>
    </form>
  );
}