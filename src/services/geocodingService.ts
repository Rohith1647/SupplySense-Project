export interface GeoLocation {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  countryCode?: string;
}

function cleanLocationName(raw: string): string {
  const trimmed = raw.trim();
  const halfLength = Math.floor(trimmed.length / 2);
  if (trimmed.length > 3 && trimmed.substring(0, halfLength).toLowerCase() === trimmed.substring(halfLength).toLowerCase()) {
    return trimmed.substring(0, halfLength);
  }
  return trimmed;
}

export async function searchLocationGeo(query: string): Promise<GeoLocation> {
  const cleanedQuery = cleanLocationName(query);
  if (!cleanedQuery) {
    return { name: 'Shenzhen', latitude: 22.5431, longitude: 114.0579, country: 'China', admin1: 'Guangdong' };
  }

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanedQuery)}&count=1&language=en&format=json`
    );
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const item = data.results[0];
        return {
          name: cleanLocationName(item.name),
          latitude: item.latitude,
          longitude: item.longitude,
          country: item.country || 'International',
          admin1: item.admin1,
          countryCode: item.country_code
        };
      }
    }
  } catch (err) {
    console.warn("Dynamic Geocoding API call fallback:", err);
  }

  // Fallback for custom queries or offline
  return {
    name: cleanedQuery.charAt(0).toUpperCase() + cleanedQuery.slice(1),
    latitude: 13.0827,
    longitude: 80.2707,
    country: 'India',
    admin1: 'Tamil Nadu'
  };
}
