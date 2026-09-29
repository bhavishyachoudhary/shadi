// Haversine formula distance calculation in kilometers between two lat/lng coordinates

export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const CITY_CENTERS = {
  All: { id: 'All', name: '🌍 All Locations', lat: 20.5937, lng: 78.9629, isAll: true },
  Sirsa: { id: 'Sirsa', name: '📍 Sirsa, Haryana', lat: 29.5320, lng: 75.0318 },
  Hisar: { id: 'Hisar', name: '📍 Hisar, Haryana', lat: 29.1492, lng: 75.7217 },
  Gurugram: { id: 'Gurugram', name: '📍 Gurugram', lat: 28.4595, lng: 77.0266 },
  Ambala: { id: 'Ambala', name: '📍 Ambala', lat: 30.3782, lng: 76.7767 },
  Rohtak: { id: 'Rohtak', name: '📍 Rohtak', lat: 28.8955, lng: 76.6066 },
  Panipat: { id: 'Panipat', name: '📍 Panipat', lat: 29.3909, lng: 76.9635 },
  Karnal: { id: 'Karnal', name: '📍 Karnal', lat: 29.6857, lng: 76.9905 },
  Faridabad: { id: 'Faridabad', name: '📍 Faridabad', lat: 28.4089, lng: 77.3178 },
  Chandigarh: { id: 'Chandigarh', name: '📍 Chandigarh', lat: 30.7333, lng: 76.7794 },
  Ludhiana: { id: 'Ludhiana', name: '📍 Ludhiana', lat: 30.9010, lng: 75.8573 },
  Amritsar: { id: 'Amritsar', name: '📍 Amritsar', lat: 31.6340, lng: 74.8723 },
  Jaipur: { id: 'Jaipur', name: '📍 Jaipur', lat: 26.9124, lng: 75.7873 },
  Lucknow: { id: 'Lucknow', name: '📍 Lucknow', lat: 26.8467, lng: 80.9462 },
  Bengaluru: { id: 'Bengaluru', name: '📍 Bengaluru Center', lat: 12.9716, lng: 77.5946 },
  Mumbai: { id: 'Mumbai', name: '📍 Mumbai Center', lat: 19.0760, lng: 72.8777 },
  Delhi: { id: 'Delhi', name: '📍 Delhi NCR Center', lat: 28.6139, lng: 77.2090 },
  Hyderabad: { id: 'Hyderabad', name: '📍 Hyderabad Center', lat: 17.3850, lng: 78.4867 },
  Chennai: { id: 'Chennai', name: '📍 Chennai Center', lat: 13.0827, lng: 80.2707 },
  Pune: { id: 'Pune', name: '📍 Pune Center', lat: 18.5204, lng: 73.8567 },
  NRI_USA: { id: 'NRI_USA', name: '✈️ Silicon Valley USA (NRI)', lat: 37.3382, lng: -121.8863 },
  NRI_UK: { id: 'NRI_UK', name: '✈️ London UK (NRI)', lat: 51.5074, lng: -0.1278 }
};

export function getMinDistanceToCenters(profileLat, profileLng, selectedCityKeys = ['Bengaluru']) {
  if (!profileLat || !profileLng || !selectedCityKeys || selectedCityKeys.length === 0) {
    return { minDistance: 0, nearestCenterName: 'Center' };
  }

  if (selectedCityKeys.includes('All')) {
    return { minDistance: 0, nearestCenterName: 'All Regions' };
  }

  let minDistance = Infinity;
  let nearestCenterName = '';

  selectedCityKeys.forEach(cityItem => {
    let lat, lng, name;
    if (typeof cityItem === 'object' && cityItem !== null) {
      lat = cityItem.lat;
      lng = cityItem.lng;
      name = cityItem.label || cityItem.name;
    } else {
      const center = CITY_CENTERS[cityItem];
      if (center) {
        if (center.isAll) return;
        lat = center.lat;
        lng = center.lng;
        name = center.name;
      }
    }

    if (lat && lng) {
      const d = calculateDistanceKm(lat, lng, profileLat, profileLng);
      if (d < minDistance) {
        minDistance = d;
        nearestCenterName = (name || '').replace('📍 ', '').replace('✈️ ', '');
      }
    }
  });

  if (minDistance === Infinity) {
    minDistance = 0;
    nearestCenterName = 'Location Center';
  }

  return { minDistance, nearestCenterName };
}
