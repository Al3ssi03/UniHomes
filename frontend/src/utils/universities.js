// University data for Italy with coordinates
export const UNIVERSITIES = {
  'Puglia': [
    {
      name: 'Università del Salento (UniSalento)',
      city: 'Lecce',
      coordinates: [40.3515, 18.1750],
      description: 'Università pubblica con sede principale a Lecce'
    },
    {
      name: 'Università degli Studi di Bari "Aldo Moro"',
      city: 'Bari',
      coordinates: [41.1171, 16.8719],
      description: 'Università pubblica di Bari'
    },
    {
      name: 'Politecnico di Bari',
      city: 'Bari',
      coordinates: [41.1089, 16.8700],
      description: 'Politecnico di Bari - Ingegneria e Architettura'
    },
    {
      name: 'Università di Foggia',
      city: 'Foggia',
      coordinates: [41.4621, 15.5451],
      description: 'Università pubblica di Foggia'
    }
  ],
  'Lazio': [
    {
      name: 'Sapienza Università di Roma',
      city: 'Roma',
      coordinates: [41.9028, 12.4964],
      description: 'La più grande università d\'Europa'
    },
    {
      name: 'Università Roma Tor Vergata',
      city: 'Roma',
      coordinates: [41.8536, 12.6047],
      description: 'Università pubblica di Roma'
    },
    {
      name: 'Università Roma Tre',
      city: 'Roma',
      coordinates: [41.8583, 12.4823],
      description: 'Università pubblica di Roma'
    }
  ],
  'Lombardia': [
    {
      name: 'Università Statale di Milano',
      city: 'Milano',
      coordinates: [45.4627, 9.1897],
      description: 'Università pubblica di Milano'
    },
    {
      name: 'Politecnico di Milano',
      city: 'Milano',
      coordinates: [45.4786, 9.2272],
      description: 'Politecnico di Milano - Ingegneria e Architettura'
    },
    {
      name: 'Università Bocconi',
      city: 'Milano',
      coordinates: [45.4435, 9.1900],
      description: 'Università privata di economia'
    }
  ],
  'Emilia-Romagna': [
    {
      name: 'Università di Bologna',
      city: 'Bologna',
      coordinates: [44.4949, 11.3426],
      description: 'La più antica università del mondo occidentale'
    }
  ],
  'Toscana': [
    {
      name: 'Università di Firenze',
      city: 'Firenze',
      coordinates: [43.7696, 11.2558],
      description: 'Università pubblica di Firenze'
    },
    {
      name: 'Università di Pisa',
      city: 'Pisa',
      coordinates: [43.7228, 10.4017],
      description: 'Università pubblica di Pisa'
    }
  ],
  'Veneto': [
    {
      name: 'Università di Padova',
      city: 'Padova',
      coordinates: [45.4077, 11.8734],
      description: 'Università pubblica di Padova'
    },
    {
      name: 'Università Ca\' Foscari Venezia',
      city: 'Venezia',
      coordinates: [45.4344, 12.3364],
      description: 'Università pubblica di Venezia'
    }
  ],
  'Campania': [
    {
      name: 'Università Federico II',
      city: 'Napoli',
      coordinates: [40.8518, 14.2681],
      description: 'Università pubblica di Napoli'
    }
  ],
  'Sicilia': [
    {
      name: 'Università di Palermo',
      city: 'Palermo',
      coordinates: [38.1157, 13.3613],
      description: 'Università pubblica di Palermo'
    },
    {
      name: 'Università di Catania',
      city: 'Catania',
      coordinates: [37.5079, 15.0830],
      description: 'Università pubblica di Catania'
    }
  ]
};

// City coordinates for major Italian cities
export const CITY_COORDINATES = {
  'Lecce': [40.3515, 18.1750],
  'Bari': [41.1171, 16.8719],
  'Brindisi': [40.6386, 17.9463],
  'Taranto': [40.4668, 17.2520],
  'Oria': [40.5020, 17.6354],
  'Gallipoli': [40.0560, 17.9922],
  'Otranto': [40.1439, 18.4910],
  'Roma': [41.9028, 12.4964],
  'Milano': [45.4642, 9.1900],
  'Napoli': [40.8518, 14.2681],
  'Firenze': [43.7696, 11.2558],
  'Bologna': [44.4949, 11.3426],
  'Torino': [45.0703, 7.6869],
  'Palermo': [38.1157, 13.3613],
  'Venezia': [45.4408, 12.3155],
  'Pisa': [43.7228, 10.4017],
  'Padova': [45.4077, 11.8734],
  'Catania': [37.5079, 15.0830],
  'Verona': [45.4384, 10.9916],
  'Genova': [44.4056, 8.9463]
};

// Function to calculate distance between two coordinates (in km)
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

// Function to find nearest universities to a city
export function findNearestUniversities(cityName, region = null) {
  const cityCoords = CITY_COORDINATES[cityName];
  if (!cityCoords) {
    return [];
  }

  const [cityLat, cityLon] = cityCoords;
  let allUniversities = [];

  // If region is specified, prioritize universities in that region
  if (region && UNIVERSITIES[region]) {
    allUniversities = [...UNIVERSITIES[region]];
  }

  // Add universities from other regions
  Object.keys(UNIVERSITIES).forEach(regionKey => {
    if (regionKey !== region) {
      allUniversities = [...allUniversities, ...UNIVERSITIES[regionKey]];
    }
  });

  // Calculate distances and sort
  const universitiesWithDistance = allUniversities.map(uni => ({
    ...uni,
    distance: calculateDistance(cityLat, cityLon, uni.coordinates[0], uni.coordinates[1])
  })).sort((a, b) => a.distance - b.distance);

  // Return top 3 nearest universities
  return universitiesWithDistance.slice(0, 3);
}
