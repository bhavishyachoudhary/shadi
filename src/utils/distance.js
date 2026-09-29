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

  selectedCityKeys.forEach(cityKey => {
    const center = CITY_CENTERS[cityKey];
    if (center && !center.isAll) {
      const d = calculateDistanceKm(center.lat, center.lng, profileLat, profileLng);
      if (d < minDistance) {
        minDistance = d;
        nearestCenterName = center.name.replace('📍 ', '').replace('✈️ ', '');
      }
    }
  });

  if (minDistance === Infinity) {
    minDistance = 0;
    nearestCenterName = 'Location Center';
  }

  return { minDistance, nearestCenterName };
}
