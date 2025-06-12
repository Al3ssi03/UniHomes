import React, { useState } from 'react';
import SearchAutocomplete from './SearchAutocomplete';
import PriceRangeSlider from './PriceRangeSlider';

export default function AdvancedFilters({ filters, onFiltersChange, onReset }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
    onFiltersChange({ 
      ...filters, 
      minPrice: range[0], 
      maxPrice: range[1] === 2000 ? '' : range[1] 
    });
  };

  const accommodationTypes = [
    { value: '', label: 'Tutti i tipi' },
    { value: 'stanza_singola', label: '🛏️ Stanza singola' },
    { value: 'stanza_doppia', label: '🛏️🛏️ Stanza doppia' },
    { value: 'intero_appartamento', label: '🏠 Appartamento' },
    { value: 'monolocale', label: '🏠 Monolocale' },
    { value: 'bilocale', label: '🏠 Bilocale' },
    { value: 'trilocale', label: '🏠 Trilocale' }
  ];

  const services = [
    { key: 'wifi', label: '📶 WiFi' },
    { key: 'lavatrice', label: '🧺 Lavatrice' },
    { key: 'parking', label: '🅿️ Parcheggio' },
    { key: 'aria_condizionata', label: '❄️ Aria condizionata' },
    { key: 'cucina', label: '🍳 Cucina attrezzata' },
    { key: 'terrazzo', label: '🌿 Terrazzo' },
    { key: 'animali_ammessi', label: '🐕 Animali ammessi' },
    { key: 'riscaldamento', label: '🔥 Riscaldamento' }
  ];

  const universities = [
    'Università Bocconi', 'Università Statale Milano', 'Politecnico di Milano',
    'Sapienza Università di Roma', 'Università di Bologna', 'Università di Firenze',
    'Università di Napoli Federico II', 'Università di Torino', 'Università di Padova',
    'Università Ca\' Foscari Venezia', 'Università di Pisa', 'Università di Genova'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          Filtri di ricerca
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          {isExpanded ? 'Nascondi filtri ▲' : 'Altri filtri ▼'}
        </button>
      </div>

      {/* Basic Filters - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Città</label>
          <SearchAutocomplete
            onSelect={(city) => handleFilterChange('city', city)}
            placeholder="Cerca città..."
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tipo di alloggio</label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {accommodationTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Fascia di prezzo</label>
          <PriceRangeSlider
            min={0}
            max={2000}
            step={50}
            value={[filters.minPrice || 0, filters.maxPrice || 2000]}
            onChange={handlePriceRangeChange}
          />
        </div>
      </div>

      {/* Advanced Filters - Collapsible */}
      {isExpanded && (
        <div className="border-t pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Università nelle vicinanze</label>
              <select
                value={filters.university || ''}
                onChange={(e) => handleFilterChange('university', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Tutte le università</option>
                {universities.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Distanza max (km)</label>
              <input
                type="number"
                placeholder="es. 5"
                value={filters.maxDistance || ''}
                onChange={(e) => handleFilterChange('maxDistance', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Servizi richiesti</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {services.map(service => (
                <label key={service.key} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.services?.includes(service.key) || false}
                    onChange={(e) => {
                      const currentServices = filters.services || [];
                      const newServices = e.target.checked
                        ? [...currentServices, service.key]
                        : currentServices.filter(s => s !== service.key);
                      handleFilterChange('services', newServices);
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{service.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Disponibile dal</label>
              <input
                type="date"
                value={filters.availableFrom || ''}
                onChange={(e) => handleFilterChange('availableFrom', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ordinamento</label>
              <select
                value={filters.sortBy || 'recent'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="recent">Più recenti</option>
                <option value="price_asc">Prezzo crescente</option>
                <option value="price_desc">Prezzo decrescente</option>
                <option value="distance">Distanza</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Solo con foto</label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onlyWithPhotos || false}
                  onChange={(e) => handleFilterChange('onlyWithPhotos', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Mostra solo annunci con foto</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-6 pt-6 border-t">
        <button
          onClick={onReset}
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          🔄 Reset filtri
        </button>
        <button
          onClick={() => setIsExpanded(false)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
        >
          ✨ Applica filtri
        </button>
      </div>
    </div>
  );
}
