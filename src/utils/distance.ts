export interface Coordinates {
    lat: number;
    lng: number;
}

// Haversine formula to calculate distance between two points in km
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLng = toRad(coord2.lng - coord1.lng);
    const lat1 = toRad(coord1.lat);
    const lat2 = toRad(coord2.lat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(value: number): number {
    return value * Math.PI / 180;
}

export function calculateTotalDistance(venues: Coordinates[]): number {
    let total = 0;
    for (let i = 0; i < venues.length - 1; i++) {
        total += calculateDistance(venues[i], venues[i + 1]);
    }
    return Math.round(total);
}
