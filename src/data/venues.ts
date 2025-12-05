export interface Venue {
    city: string;
    stadium?: string; // Optional for now
    lat: number;
    lng: number;
}

export interface GroupSchedule {
    group: string;
    region: string;
    matches: {
        matchNumber: number; // 1, 2, 3 (Group stage match number for the team)
        venues: string[]; // List of venues for the match day (e.g. "Mexico City, Zapopan")
        coordinates: { lat: number; lng: number }[]; // Coordinates for the venues
    }[];
}

// Approximate coordinates for 2026 World Cup Host Cities
const CITIES: Record<string, { lat: number; lng: number }> = {
    'メキシコシティ': { lat: 19.4326, lng: -99.1332 },
    'サポパン': { lat: 20.7220, lng: -103.3910 }, // Guadalajara area
    'グアダルーペ': { lat: 25.6769, lng: -100.2589 }, // Monterrey area
    'トロント': { lat: 43.6532, lng: -79.3832 },
    'バンクーバー': { lat: 49.2827, lng: -123.1207 },
    'アトランタ': { lat: 33.7490, lng: -84.3880 },
    'ボストン': { lat: 42.3601, lng: -71.0589 }, // Foxborough
    'フォックスボロ': { lat: 42.0654, lng: -71.2478 },
    'ダラス': { lat: 32.7767, lng: -96.7970 }, // Arlington
    'アーリントン': { lat: 32.7357, lng: -97.1081 },
    'ヒューストン': { lat: 29.7604, lng: -95.3698 },
    'カンザスシティ': { lat: 39.0997, lng: -94.5786 },
    'ロサンゼルス': { lat: 34.0522, lng: -118.2437 }, // Inglewood
    'イングルウッド': { lat: 33.9617, lng: -118.3531 },
    'マイアミ': { lat: 25.7617, lng: -80.1918 },
    'NY/NJ': { lat: 40.8136, lng: -74.0743 }, // East Rutherford
    'フィラデルフィア': { lat: 39.9526, lng: -75.1652 },
    'サンフランシスコ': { lat: 37.7749, lng: -122.4194 }, // Santa Clara
    'サンタクララ': { lat: 37.3541, lng: -121.9552 },
    'シアトル': { lat: 47.6062, lng: -122.3321 },
};

export const GROUP_VENUES: Record<string, GroupSchedule> = {
    A: {
        group: 'A',
        region: '中部 (MEX中心)',
        matches: [
            { matchNumber: 1, venues: ['メキシコシティ', 'サポパン'], coordinates: [CITIES['メキシコシティ'], CITIES['サポパン']] },
            { matchNumber: 2, venues: ['アトランタ', 'サポパン'], coordinates: [CITIES['アトランタ'], CITIES['サポパン']] },
            { matchNumber: 3, venues: ['メキシコシティ', 'グアダルーペ'], coordinates: [CITIES['メキシコシティ'], CITIES['グアダルーペ']] },
        ]
    },
    B: {
        group: 'B',
        region: '西部 (CAN/USA)',
        matches: [
            { matchNumber: 1, venues: ['トロント', 'サンタクララ'], coordinates: [CITIES['トロント'], CITIES['サンタクララ']] },
            { matchNumber: 2, venues: ['イングルウッド', 'バンクーバー'], coordinates: [CITIES['イングルウッド'], CITIES['バンクーバー']] },
            { matchNumber: 3, venues: ['バンクーバー', 'シアトル'], coordinates: [CITIES['バンクーバー'], CITIES['シアトル']] },
        ]
    },
    C: {
        group: 'C',
        region: '東部 (USA)',
        matches: [
            { matchNumber: 1, venues: ['フォックスボロ', 'NY/NJ'], coordinates: [CITIES['フォックスボロ'], CITIES['NY/NJ']] },
            { matchNumber: 2, venues: ['フィラデルフィア', 'フォックスボロ'], coordinates: [CITIES['フィラデルフィア'], CITIES['フォックスボロ']] },
            { matchNumber: 3, venues: ['マイアミ', 'アトランタ'], coordinates: [CITIES['マイアミ'], CITIES['アトランタ']] },
        ]
    },
    D: {
        group: 'D',
        region: '西部 (USA)',
        matches: [
            { matchNumber: 1, venues: ['イングルウッド', 'バンクーバー'], coordinates: [CITIES['イングルウッド'], CITIES['バンクーバー']] },
            { matchNumber: 2, venues: ['サンタクララ', 'シアトル'], coordinates: [CITIES['サンタクララ'], CITIES['シアトル']] },
            { matchNumber: 3, venues: ['イングルウッド', 'サンタクララ'], coordinates: [CITIES['イングルウッド'], CITIES['サンタクララ']] },
        ]
    },
    E: {
        group: 'E',
        region: '中部 (USA)',
        matches: [
            { matchNumber: 1, venues: ['フィラデルフィア', 'ヒューストン'], coordinates: [CITIES['フィラデルフィア'], CITIES['ヒューストン']] },
            { matchNumber: 2, venues: ['トロント', 'カンザスシティ'], coordinates: [CITIES['トロント'], CITIES['カンザスシティ']] },
            { matchNumber: 3, venues: ['フィラデルフィア', 'NY/NJ'], coordinates: [CITIES['フィラデルフィア'], CITIES['NY/NJ']] },
        ]
    },
    F: {
        group: 'F',
        region: '中部 (USA/MEX)',
        matches: [
            { matchNumber: 1, venues: ['アーリントン', 'グアダルーペ'], coordinates: [CITIES['アーリントン'], CITIES['グアダルーペ']] },
            { matchNumber: 2, venues: ['ヒューストン', 'グアダルーペ'], coordinates: [CITIES['ヒューストン'], CITIES['グアダルーペ']] },
            { matchNumber: 3, venues: ['アーリントン', 'カンザスシティ'], coordinates: [CITIES['アーリントン'], CITIES['カンザスシティ']] },
        ]
    },
    G: {
        group: 'G',
        region: '西部 (USA/CAN)',
        matches: [
            { matchNumber: 1, venues: ['イングルウッド', 'シアトル'], coordinates: [CITIES['イングルウッド'], CITIES['シアトル']] },
            { matchNumber: 2, venues: ['イングルウッド', 'バンクーバー'], coordinates: [CITIES['イングルウッド'], CITIES['バンクーバー']] },
            { matchNumber: 3, venues: ['シアトル', 'バンクーバー'], coordinates: [CITIES['シアトル'], CITIES['バンクーバー']] },
        ]
    },
    H: {
        group: 'H',
        region: '中部 (USA/MEX)',
        matches: [
            { matchNumber: 1, venues: ['マイアミ', 'アトランタ'], coordinates: [CITIES['マイアミ'], CITIES['アトランタ']] },
            { matchNumber: 2, venues: ['マイアミ', 'アトランタ'], coordinates: [CITIES['マイアミ'], CITIES['アトランタ']] },
            { matchNumber: 3, venues: ['ヒューストン', 'サポパン'], coordinates: [CITIES['ヒューストン'], CITIES['サポパン']] },
        ]
    },
    I: {
        group: 'I',
        region: '東部 (USA/CAN)',
        matches: [
            { matchNumber: 1, venues: ['NY/NJ', 'フォックスボロ'], coordinates: [CITIES['NY/NJ'], CITIES['フォックスボロ']] },
            { matchNumber: 2, venues: ['NY/NJ', 'フィラデルフィア'], coordinates: [CITIES['NY/NJ'], CITIES['フィラデルフィア']] },
            { matchNumber: 3, venues: ['フォックスボロ', 'トロント'], coordinates: [CITIES['フォックスボロ'], CITIES['トロント']] },
        ]
    },
    J: {
        group: 'J',
        region: '西部 (USA)',
        matches: [
            { matchNumber: 1, venues: ['カンザスシティ', 'サンタクララ'], coordinates: [CITIES['カンザスシティ'], CITIES['サンタクララ']] },
            { matchNumber: 2, venues: ['アーリントン', 'サンタクララ'], coordinates: [CITIES['アーリントン'], CITIES['サンタクララ']] },
            { matchNumber: 3, venues: ['カンザスシティ', 'アーリントン'], coordinates: [CITIES['カンザスシティ'], CITIES['アーリントン']] },
        ]
    },
    K: {
        group: 'K',
        region: '中部 (USA/MEX)',
        matches: [
            { matchNumber: 1, venues: ['ヒューストン', 'メキシコシティ'], coordinates: [CITIES['ヒューストン'], CITIES['メキシコシティ']] },
            { matchNumber: 2, venues: ['ヒューストン', 'サポパン'], coordinates: [CITIES['ヒューストン'], CITIES['サポパン']] },
            { matchNumber: 3, venues: ['マイアミ', 'アトランタ'], coordinates: [CITIES['マイアミ'], CITIES['アトランタ']] },
        ]
    },
    L: {
        group: 'L',
        region: '東部 (USA/CAN)',
        matches: [
            { matchNumber: 1, venues: ['トロント', 'アーリントン'], coordinates: [CITIES['トロント'], CITIES['アーリントン']] },
            { matchNumber: 2, venues: ['フォックスボロ', 'トロント'], coordinates: [CITIES['フォックスボロ'], CITIES['トロント']] },
            { matchNumber: 3, venues: ['NY/NJ', 'フィラデルフィア'], coordinates: [CITIES['NY/NJ'], CITIES['フィラデルフィア']] },
        ]
    },
};
