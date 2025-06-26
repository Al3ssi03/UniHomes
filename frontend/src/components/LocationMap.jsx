import React, { useEffect } from 'react';
import { CITY_COORDINATES, findNearestUniversities } from '../utils/universities';

const LocationMap = ({ cityName, address, region = null, province = null, fullAddress = null }) => {
  const mapId = `map-${Math.random().toString(36).substr(2, 9)}`;
  
  // Trova università vicine PRIMA di useEffect
  const nearestUniversities = findNearestUniversities(cityName, region);

  // DEBUG: Log dei parametri ricevuti
  console.log('🗺️ LocationMap - Parametri ricevuti:', {
    cityName,
    address,
    region,
    province,
    fullAddress
  });

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
      }      return window.L;
    };

    // Geocoding function using OpenStreetMap Nominatim
    const geocodeAddress = async (addressToGeocode) => {
      try {
        console.log('🔍 Geocoding indirizzo:', addressToGeocode);
        const encodedAddress = encodeURIComponent(addressToGeocode);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          const result = data[0];
          console.log('✅ Geocoding riuscito:', result);
          return {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            display_name: result.display_name
          };
        } else {
          console.warn('❌ Geocoding fallito per:', addressToGeocode);
          return null;
        }
      } catch (error) {
        console.error('❌ Errore geocoding:', error);
        return null;
      }
    };    // Funzione per creare varianti dell'indirizzo
    const createAddressVariants = (address, city, province) => {
      const variants = [];
      
      if (address && city && province) {
        // Mappa province abbreviate a nomi completi
        const provinceMap = {
          'BR': 'Brindisi',
          'BA': 'Bari',
          'LE': 'Lecce',
          'TA': 'Taranto',
          'FG': 'Foggia'
        };
        const fullProvinceName = provinceMap[province] || province;
        
        // Variante 1: Indirizzo completo originale
        variants.push(`${address}, ${city}, ${province}, Italia`);
        
        // Variante 2: Indirizzo con nome provincia completo
        variants.push(`${address}, ${city}, ${fullProvinceName}, Italia`);
        
        // Variante 3: Semplifica il nome della via (es. "Via Filippo Brunelleschi" -> "Via Brunelleschi")
        let simplifiedAddress = address;
        if (address.includes('Filippo Brunelleschi')) {
          simplifiedAddress = address.replace('Filippo Brunelleschi', 'Brunelleschi');
          variants.push(`${simplifiedAddress}, ${city}, ${fullProvinceName}, Italia`);
        }
        
        // Variante 4: Solo nome via senza "Via" (FUNZIONA!)
        if (address.startsWith('Via ')) {
          const streetName = address.substring(4);
          if (streetName.includes('Filippo Brunelleschi')) {
            const simplifiedStreetName = streetName.replace('Filippo Brunelleschi', 'Brunelleschi');
            variants.push(`${simplifiedStreetName}, ${city}, ${fullProvinceName}, Italia`);
          }
          variants.push(`${streetName}, ${city}, ${fullProvinceName}, Italia`);
        }
        
        // Variante 5: Con codice postale
        variants.push(`${simplifiedAddress}, 72024 ${city}, Italia`);
        
        // Variante 6: Solo città e provincia come fallback finale
        variants.push(`${city}, ${fullProvinceName}, Italia`);
      }
      
      return variants;
    };

    // Funzione per tentare geocoding con fallback
    const geocodeWithFallback = async (address, city, province) => {
      console.log('🔍 Tentativo geocoding con fallback...');
      
      // Crea varianti dell'indirizzo
      const variants = createAddressVariants(address, city, province);
      console.log('📍 Varianti da testare:', variants);
      
      // Prova ogni variante finché non trova un risultato
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        console.log(`🎯 Tentativo ${i + 1}: "${variant}"`);
        
        const result = await geocodeAddress(variant);
        if (result) {
          console.log(`✅ Successo con variante ${i + 1}:`, result);
          return result;
        } else {
          console.log(`❌ Variante ${i + 1} fallita`);
        }
        
        // Pausa breve tra le richieste
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log('❌ Tutte le varianti fallite');
      return null;
    };loadLeaflet().then(async (L) => {
      let lat, lng, locationName;
      
      console.log('🔍 DEBUG: Iniziando geocoding...');
      console.log('🔍 DEBUG: fullAddress =', fullAddress);
      console.log('🔍 DEBUG: cityName =', cityName);
      console.log('🔍 DEBUG: address =', address);
      console.log('🔍 DEBUG: province =', province);
        // Try geocoding the full address first with fallback variants
      if (fullAddress || (address && cityName && province)) {
        console.log('🎯 Tentativo geocoding intelligente...');
        
        let geocoded;
        if (fullAddress) {
          // Prova prima l'indirizzo completo originale
          geocoded = await geocodeAddress(fullAddress);
        }
        
        // Se fallisce, prova con le varianti intelligenti
        if (!geocoded && address && cityName && province) {
          geocoded = await geocodeWithFallback(address, cityName, province);
        }
        
        if (geocoded) {
          lat = geocoded.lat;
          lng = geocoded.lng;
          locationName = geocoded.display_name;
          console.log(`✅ Geocoding riuscito: [${lat}, ${lng}]`);
          console.log(`📍 Indirizzo trovato: ${locationName}`);
        } else {
          console.log('❌ Tutti i tentativi di geocoding falliti');
        }
      } else {
        console.log('⚠️ Dati insufficienti per geocoding');
      }
        // Fallback to city coordinates if geocoding fails
      if (!lat || !lng) {
        const cityCoords = CITY_COORDINATES[cityName];
        if (cityCoords) {
          [lat, lng] = cityCoords;
          locationName = `${cityName}${province ? `, ${province}` : ''}`;
          console.log(`⚠️ Fallback a coordinate città: ${cityName} -> [${lat}, ${lng}]`);
        } else {
          console.error(`❌ Nessuna coordinata trovata per: ${cityName}`);
          return;
        }
      }

      console.log('🗺️ DEBUG: Coordinate finali per mappa:', { lat, lng, zoom: 15 });

      // Verifica che le coordinate siano valide
      if (isNaN(lat) || isNaN(lng) || lat === null || lng === null || lat === undefined || lng === undefined) {
        console.error('❌ Coordinate non valide:', { lat, lng });
        return;
      }      // Create map with explicit coordinates
      console.log(`🗺️ Creazione mappa con coordinate: [${lat}, ${lng}] e zoom 15`);
      
      const map = L.map(mapId, {
        center: [parseFloat(lat), parseFloat(lng)],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: true,
        maxZoom: 18,
        minZoom: 3
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // ASPETTA che la mappa sia completamente caricata prima di aggiungere marker
      map.whenReady(() => {
        console.log('🗺️ Mappa pronta, aggiungendo marker...');
        
        // Add marker for the room location
        const roomIcon = L.divIcon({
          html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          className: 'custom-div-icon'
        });

        const roomMarker = L.marker([lat, lng], { icon: roomIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: Arial, sans-serif;">
              <strong>📍 Posizione Alloggio</strong><br>
              ${address ? `${address}<br>` : ''}
              ${cityName}${province ? `, ${province}` : ''}<br>
              ${locationName && locationName !== `${cityName}${province ? `, ${province}` : ''}` ? 
                `<small style="color: #666;">${locationName}</small>` : ''
              }
            </div>
          `);

        // Add university markers
        nearestUniversities.forEach((uni, index) => {
          const uniCoords = CITY_COORDINATES[uni.city];
          if (uniCoords) {
            const [uniLat, uniLng] = uniCoords;
            
            const uniIcon = L.divIcon({
              html: `<div style="background-color: #dc2626; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; color: white;">${index + 1}</div>`,
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
                  📏 ${uni.distance} km dall'alloggio<br>
                  <small style="color: #666;">${uni.description}</small>
                </div>
              `);
          }
        });

        // FORZA zoom sull'alloggio DOPO aver aggiunto tutti i marker
        console.log('🎯 FORZANDO zoom finale sull\'alloggio');
        setTimeout(() => {
          map.setView([parseFloat(lat), parseFloat(lng)], 16);
          console.log('✅ Zoom forzato completato');
        }, 200);
      });      // Cleanup function
      return () => {
        if (map) {
          map.remove();
        }
      };
    }).catch(error => {
      console.error('Error loading Leaflet:', error);
    });
  }, [cityName, address, region, mapId]);

  return (<div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
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
