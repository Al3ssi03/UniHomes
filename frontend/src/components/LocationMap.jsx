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

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          🗺️ Mappa e Università Vicine
        </h3>
        <p className="text-blue-100 text-sm">
          Posizione dell'alloggio e distanze dalle università
        </p>
      </div>
      
      {/* Map */}
      <div 
        id={mapId} 
        style={{ height: '300px', width: '100%' }}
        className="relative"
      >
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Caricamento mappa...</p>
          </div>
        </div>
      </div>

      {/* University list */}
      {nearestUniversities.length > 0 && (
        <div className="p-4 border-t">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            🎓 Università più vicine
          </h4>
          <div className="space-y-3">
            {nearestUniversities.map((uni, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{uni.name}</div>
                  <div className="text-sm text-gray-600 mb-1">📍 {uni.city}</div>
                  <div className="text-sm text-blue-600 font-medium">
                    📏 Distanza: {uni.distance} km
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{uni.description}</div>
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
