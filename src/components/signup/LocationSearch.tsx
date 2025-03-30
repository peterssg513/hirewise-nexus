
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Search } from 'lucide-react';

interface LocationSearchProps {
  locations: string[];
  onAddLocation: (location: string) => void;
  onRemoveLocation: (location: string) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ 
  locations, 
  onAddLocation, 
  onRemoveLocation 
}) => {
  const [location, setLocation] = useState('');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Initialize Google Places Autocomplete
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    } else {
      // Load Google Places API if not already loaded
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
      };
      document.head.appendChild(script);
    }
  }, []);

  const getPredictions = (input: string) => {
    if (!autocompleteService.current || !input.trim()) {
      setPredictions([]);
      return;
    }

    const request = {
      input,
      types: ['(cities)'],
      componentRestrictions: { country: 'us' }
    };

    autocompleteService.current.getPlacePredictions(
      request,
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setPredictions(predictions);
          setShowPredictions(true);
        } else {
          setPredictions([]);
          setShowPredictions(false);
        }
      }
    );
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    if (value.length > 2) {
      getPredictions(value);
    } else {
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  const handleAddLocation = () => {
    if (location.trim() && !locations.includes(location.trim())) {
      onAddLocation(location.trim());
      setLocation('');
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  const handleSelectPrediction = (prediction: google.maps.places.AutocompletePrediction) => {
    const locationText = prediction.description;
    if (!locations.includes(locationText)) {
      onAddLocation(locationText);
    }
    setLocation('');
    setPredictions([]);
    setShowPredictions(false);
  };

  return (
    <div>
      <div className="relative">
        <div className="flex mb-2">
          <div className="relative flex-1 mr-2">
            <Input
              type="text"
              value={location}
              onChange={handleLocationChange}
              placeholder="e.g., New York, NY"
              ref={placesInputRef}
              onFocus={() => {
                if (predictions.length > 0) {
                  setShowPredictions(true);
                }
              }}
              onBlur={() => {
                // Delay hiding to allow clicks on predictions
                setTimeout(() => setShowPredictions(false), 200);
              }}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          <Button 
            type="button" 
            onClick={handleAddLocation}
            disabled={!location.trim()}
          >
            Add
          </Button>
        </div>
        
        {showPredictions && predictions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border max-h-60 overflow-auto">
            <ul>
              {predictions.map((prediction) => (
                <li 
                  key={prediction.place_id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSelectPrediction(prediction)}
                >
                  {prediction.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {locations.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {locations.map((loc, index) => (
            <div 
              key={index}
              className="bg-gray-100 rounded-full px-3 py-1 flex items-center"
            >
              <span className="text-sm mr-1">{loc}</span>
              <button 
                type="button"
                onClick={() => onRemoveLocation(loc)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {locations.length === 0 && (
        <p className="text-sm text-orange-500 mt-2">
          Please add at least one location
        </p>
      )}
    </div>
  );
};

export default LocationSearch;
