import React, { useEffect } from 'react';
import { CITY_COORDINATES, findNearestUniversities } from '../utils/universities';

const LocationMap = ({ cityName, address, region = null }) => {
  const mapId = `map-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    // Dynamically load Leaflet
    const loadLeaflet = async () => {
      // Load Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      if (!window.L) {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = () => resolve(window.L);
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      return window.L;
    };

    loadLeaflet().then((L) => {
      // Get city coordinates
      const cityCoords = CITY_COORDINATES[cityName];
      if (!cityCoords) {
        console.warn(`No coordinates found for city: ${cityName}`);
        return;
      }

      const [lat, lng] = cityCoords;

      // Create map
      const map = L.map(mapId).setView([lat, lng], 12);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors'
      }).addTo(map);

      // Add marker for the room location
      const roomIcon = L.divIcon({
        html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        className: 'custom-div-icon'
      });

      L.marker([lat, lng], { icon: roomIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: Arial, sans-serif;">
            <strong>📍 Posizione Alloggio</strong><br>
            ${cityName}${address ? `<br>${address}` : ''}
          </div>
        `);

      // Find and add markers for nearest universities
      const nearestUniversities = findNearestUniversities(cityName, region);
      
      nearestUniversities.forEach((uni, index) => {
        const [uniLat, uniLng] = uni.coordinates;
        
        // Create university icon
        const uniIcon = L.divIcon({
          html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          className: 'custom-div-icon'
        });

        L.marker([uniLat, uniLng], { icon: uniIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: Arial, sans-serif;">
              <strong>🎓 ${uni.name}</strong><br>
              📍 ${uni.city}<br>
              📏 Distanza: <strong>${uni.distance} km</strong><br>
              <small>${uni.description}</small>
            </div>
          `);
      });

      // Adjust map bounds to include all markers
      if (nearestUniversities.length > 0) {
        const group = new L.featureGroup([
          L.marker([lat, lng]),
          ...nearestUniversities.map(uni => L.marker(uni.coordinates))
        ]);
        map.fitBounds(group.getBounds().pad(0.1));
      }

      // Cleanup function
      return () => {
        map.remove();
      };
    }).catch(error => {
      console.error('Error loading Leaflet:', error);
    });

  }, [cityName, address, region, mapId]);

  const nearestUniversities = findNearestUniversities(cityName, region);

  return (    <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
      <div className="p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold flex items-center gap-3 mb-2">
            🗺️ Mappa e Università Vicine
          </h3>
          <p className="text-blue-100 text-sm font-medium">
            Posizione dell'alloggio e distanze dalle università più importanti
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
      </div>
        {/* Map */}
      <div 
        id={mapId} 
        style={{ height: '400px', width: '100%' }}
        className="relative border-t border-gray-200"
      >
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-3"></div>
            <p className="text-gray-700 text-sm font-medium">Caricamento mappa interattiva...</p>
            <p className="text-gray-500 text-xs mt-1">Preparazione visualizzazione università</p>
          </div>
        </div>
      </div>      {/* University list */}
      {nearestUniversities.length > 0 && (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-3 text-lg">
            🎓 Università più vicine
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              {nearestUniversities.length} trovate
            </span>
          </h4>
          <div className="grid gap-4">
            {nearestUniversities.map((uni, index) => (
              <div key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                      {uni.name}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        📍 {uni.city}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-blue-600">
                        📏 {uni.distance} km
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 leading-relaxed">{uni.description}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-green-400 rounded-full group-hover:scale-150 transition-transform"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMap;
