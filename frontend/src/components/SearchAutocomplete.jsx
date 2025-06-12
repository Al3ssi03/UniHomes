import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function SearchAutocomplete({ onSelect, placeholder = "Cerca città..." }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Italian cities for autocomplete
  const italianCities = [
    'Milano', 'Roma', 'Napoli', 'Torino', 'Palermo', 'Genova', 'Bologna', 'Firenze',
    'Bari', 'Catania', 'Venezia', 'Verona', 'Messina', 'Padova', 'Trieste', 'Brescia',
    'Prato', 'Taranto', 'Reggio Calabria', 'Modena', 'Reggio Emilia', 'Perugia', 'Livorno',
    'Cagliari', 'Foggia', 'Rimini', 'Salerno', 'Ferrara', 'Sassari', 'Monza', 'Bergamo',
    'Pescara', 'Trento', 'Forlì', 'Vicenza', 'Terni', 'Bolzano', 'Novara', 'Piacenza',
    'Ancona', 'Andria', 'Arezzo', 'Udine', 'Cesena', 'Lecce', 'Pesaro', 'Barletta'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      const filtered = italianCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8)); // Show max 8 suggestions
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city) => {
    setQuery(city);
    setShowSuggestions(false);
    onSelect(city);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSuggestionClick(suggestions[0]);
      } else {
        onSelect(query);
      }
    }
  };

  return (
    <div className="relative" ref={suggestionsRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((city, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(city)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center"
            >
              <svg className="h-4 w-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-800">{city}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
