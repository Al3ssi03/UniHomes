// Servizio di geocoding migliorato per UNI Home
// Supporta ricerca precisa con INDIRIZZO + CITTÀ + PROVINCIA

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'UNIHome/1.0';

// Database delle università italiane con coordinate precise
export const UNIVERSITIES_DATABASE = [
  // Puglia
  { name: 'Università del Salento (UniSalento)', city: 'Lecce', coordinates: [40.3515, 18.1750], region: 'Puglia' },
  { name: 'Università degli Studi di Bari "Aldo Moro"', city: 'Bari', coordinates: [41.1171, 16.8719], region: 'Puglia' },
  { name: 'Politecnico di Bari', city: 'Bari', coordinates: [41.1089, 16.8700], region: 'Puglia' },
  { name: 'Università di Foggia', city: 'Foggia', coordinates: [41.4621, 15.5451], region: 'Puglia' },
  
  // Lazio
  { name: 'Sapienza Università di Roma', city: 'Roma', coordinates: [41.9028, 12.4964], region: 'Lazio' },
  { name: 'Università Roma Tor Vergata', city: 'Roma', coordinates: [41.8536, 12.6047], region: 'Lazio' },
  { name: 'Università Roma Tre', city: 'Roma', coordinates: [41.8583, 12.4823], region: 'Lazio' },
  { name: 'LUISS Guido Carli', city: 'Roma', coordinates: [41.9183, 12.4918], region: 'Lazio' },
  
  // Lombardia
  { name: 'Università Statale di Milano', city: 'Milano', coordinates: [45.4627, 9.1897], region: 'Lombardia' },
  { name: 'Politecnico di Milano', city: 'Milano', coordinates: [45.4786, 9.2272], region: 'Lombardia' },
  { name: 'Università Bocconi', city: 'Milano', coordinates: [45.4435, 9.1900], region: 'Lombardia' },
  { name: 'Università Cattolica del Sacro Cuore', city: 'Milano', coordinates: [45.4654, 9.1859], region: 'Lombardia' },
  
  // Veneto
  { name: 'Università di Padova', city: 'Padova', coordinates: [45.4077, 11.8734], region: 'Veneto' },
  { name: 'Università Ca\' Foscari Venezia', city: 'Venezia', coordinates: [45.4344, 12.3364], region: 'Veneto' },
  { name: 'Università di Verona', city: 'Verona', coordinates: [45.4035, 10.9793], region: 'Veneto' },
  
  // Emilia-Romagna
  { name: 'Università di Bologna', city: 'Bologna', coordinates: [44.4949, 11.3426], region: 'Emilia-Romagna' },
  
  // Toscana
  { name: 'Università di Firenze', city: 'Firenze', coordinates: [43.7696, 11.2558], region: 'Toscana' },
  { name: 'Università di Pisa', city: 'Pisa', coordinates: [43.7228, 10.4017], region: 'Toscana' },
  { name: 'Università di Siena', city: 'Siena', coordinates: [43.3188, 11.3307], region: 'Toscana' },
  
  // Piemonte
  { name: 'Università di Torino', city: 'Torino', coordinates: [45.0703, 7.6869], region: 'Piemonte' },
  { name: 'Politecnico di Torino', city: 'Torino', coordinates: [45.0628, 7.6621], region: 'Piemonte' },
  
  // Campania
  { name: 'Università Federico II', city: 'Napoli', coordinates: [40.8518, 14.2681], region: 'Campania' },
  { name: 'Università Parthenope', city: 'Napoli', coordinates: [40.8359, 14.2488], region: 'Campania' },
  
  // Sicilia
  { name: 'Università di Palermo', city: 'Palermo', coordinates: [38.1157, 13.3613], region: 'Sicilia' },
  { name: 'Università di Catania', city: 'Catania', coordinates: [37.5079, 15.0830], region: 'Sicilia' },
  
  // Liguria
  { name: 'Università di Genova', city: 'Genova', coordinates: [44.4056, 8.9463], region: 'Liguria' }
];

// Delay per rispettare i limiti delle API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calcola la distanza tra due punti geografici in km
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raggio della Terra in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Arrotonda a 1 decimale
}

/**
 * Geocoding avanzato con multiple varianti dell'indirizzo
 */
export async function geocodeAddress(indirizzo, citta, provincia) {
  console.log('🔍 Geocoding avanzato per:', { indirizzo, citta, provincia });
  
  // Crea varianti dell'indirizzo per migliorare la precisione
  const addressVariants = createAddressVariants(indirizzo, citta, provincia);
  
  for (let i = 0; i < addressVariants.length; i++) {
    const variant = addressVariants[i];
    console.log(`🎯 Tentativo ${i + 1}: "${variant}"`);
    
    try {
      await delay(1000); // Rispetta i limiti dell'API
      
      const url = `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(variant)}&limit=1&countrycodes=it&addressdetails=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT
        }
      });
      
      if (!response.ok) continue;
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        console.log(`✅ Geocoding riuscito con variante ${i + 1}:`, result);
        
        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          display_name: result.display_name,
          address: result.address,
          precision: i === 0 ? 'high' : 'medium' // Primo tentativo = alta precisione
        };
      }
    } catch (error) {
      console.warn(`❌ Variante ${i + 1} fallita:`, error);
    }
  }
  
  console.log('❌ Tutti i tentativi di geocoding falliti');
  return null;
}

/**
 * Crea varianti dell'indirizzo per migliorare il successo del geocoding
 */
function createAddressVariants(indirizzo, citta, provincia) {
  const variants = [];
  
  if (!indirizzo || !citta) return variants;
  
  // Mappa delle province abbreviate
  const provinceMap = {
    'BR': 'Brindisi', 'BA': 'Bari', 'LE': 'Lecce', 'TA': 'Taranto', 'FG': 'Foggia',
    'BT': 'Barletta-Andria-Trani', 'RM': 'Roma', 'MI': 'Milano', 'NA': 'Napoli',
    'TO': 'Torino', 'FI': 'Firenze', 'BO': 'Bologna', 'VE': 'Venezia', 'GE': 'Genova',
    'PA': 'Palermo', 'CT': 'Catania', 'PD': 'Padova', 'VR': 'Verona', 'PI': 'Pisa'
  };
  
  const fullProvinceName = provincia ? (provinceMap[provincia.toUpperCase()] || provincia) : '';
  
  // Variante 1: Indirizzo completo con provincia estesa
  if (fullProvinceName) {
    variants.push(`${indirizzo}, ${citta}, ${fullProvinceName}, Italia`);
  }
  
  // Variante 2: Indirizzo completo con sigla provincia
  if (provincia) {
    variants.push(`${indirizzo}, ${citta}, ${provincia}, Italia`);
  }
  
  // Variante 3: Solo indirizzo e città
  variants.push(`${indirizzo}, ${citta}, Italia`);
  
  // Variante 4: Indirizzo semplificato (rimuove prefissi comuni)
  let simplifiedAddress = indirizzo;
  const prefixes = ['Via ', 'Viale ', 'Corso ', 'Piazza ', 'Largo ', 'Strada '];
  
  for (const prefix of prefixes) {
    if (indirizzo.startsWith(prefix)) {
      simplifiedAddress = indirizzo.substring(prefix.length);
      variants.push(`${simplifiedAddress}, ${citta}, Italia`);
      break;
    }
  }
  
  // Variante 5: Solo nome della via senza numero civico
  const addressWithoutNumber = indirizzo.replace(/\d+.*$/, '').trim();
  if (addressWithoutNumber !== indirizzo) {
    variants.push(`${addressWithoutNumber}, ${citta}, Italia`);
  }
  
  return variants;
}

/**
 * Trova le università più vicine a un punto geografico
 */
export function findNearestUniversities(lat, lng, maxDistance = 100, maxResults = 10) {
  console.log('🎓 Calcolo università vicine per coordinate:', { lat, lng });
  
  const universitiesWithDistance = UNIVERSITIES_DATABASE
    .map(uni => ({
      ...uni,
      distance: calculateDistance(lat, lng, uni.coordinates[0], uni.coordinates[1])
    }))
    .filter(uni => uni.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxResults);

  console.log(`🎓 Trovate ${universitiesWithDistance.length} università entro ${maxDistance}km`);
  return universitiesWithDistance;
}

/**
 * Geocoding intelligente che prova multiple strategie
 */
export async function smartGeocode(announcement) {
  const { indirizzo, citta, provincia } = announcement;
  
  console.log('🧠 Geocoding intelligente per:', { indirizzo, citta, provincia });
  
  // Strategia 1: Geocoding preciso con indirizzo completo
  if (indirizzo && citta) {
    const result = await geocodeAddress(indirizzo, citta, provincia);
    if (result) {
      return {
        ...result,
        strategy: 'precise_address',
        universities: findNearestUniversities(result.lat, result.lng)
      };
    }
  }
  
  // Strategia 2: Geocoding solo città e provincia
  if (citta && provincia) {
    const result = await geocodeAddress(null, citta, provincia);
    if (result) {
      return {
        ...result,
        strategy: 'city_province',
        precision: 'low',
        universities: findNearestUniversities(result.lat, result.lng)
      };
    }
  }
  
  // Strategia 3: Solo città
  if (citta) {
    const result = await geocodeAddress(null, citta, null);
    if (result) {
      return {
        ...result,
        strategy: 'city_only',
        precision: 'low',
        universities: findNearestUniversities(result.lat, result.lng)
      };
    }
  }
  
  console.log('❌ Geocoding intelligente fallito');
  return null;
}

/**
 * Reverse geocoding per ottenere informazioni da coordinate
 */
export async function reverseGeocode(lat, lng) {
  try {
    await delay(1000);
    
    const url = `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT
      }
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Errore reverse geocoding:', error);
    return null;
  }
}

export default {
  geocodeAddress,
  smartGeocode,
  findNearestUniversities,
  calculateDistance,
  reverseGeocode,
  UNIVERSITIES_DATABASE
};
