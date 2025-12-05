export type Confederation = 'UEFA' | 'CONMEBOL' | 'AFC' | 'CAF' | 'CONCACAF' | 'OFC';

export interface Team {
    id: string;
    name: string;
    nameEn: string;
    confederation: Confederation;
    pot: 1 | 2 | 3 | 4;
    rank: number; // FIFA Ranking (Nov 2025 projection)
    isHost?: boolean;
}

export const TEAMS: Team[] = [
    // Pot 1
    { id: 'ESP', name: 'スペイン', nameEn: 'Spain', confederation: 'UEFA', pot: 1, rank: 1 },
    { id: 'ARG', name: 'アルゼンチン', nameEn: 'Argentina', confederation: 'CONMEBOL', pot: 1, rank: 2 },
    { id: 'FRA', name: 'フランス', nameEn: 'France', confederation: 'UEFA', pot: 1, rank: 3 },
    { id: 'ENG', name: 'イングランド', nameEn: 'England', confederation: 'UEFA', pot: 1, rank: 4 },
    { id: 'BRA', name: 'ブラジル', nameEn: 'Brazil', confederation: 'CONMEBOL', pot: 1, rank: 5 },
    { id: 'POR', name: 'ポルトガル', nameEn: 'Portugal', confederation: 'UEFA', pot: 1, rank: 6 },
    { id: 'NED', name: 'オランダ', nameEn: 'Netherlands', confederation: 'UEFA', pot: 1, rank: 7 },
    { id: 'BEL', name: 'ベルギー', nameEn: 'Belgium', confederation: 'UEFA', pot: 1, rank: 8 },
    { id: 'GER', name: 'ドイツ', nameEn: 'Germany', confederation: 'UEFA', pot: 1, rank: 9 },
    { id: 'USA', name: 'アメリカ', nameEn: 'USA', confederation: 'CONCACAF', pot: 1, rank: 11, isHost: true },
    { id: 'MEX', name: 'メキシコ', nameEn: 'Mexico', confederation: 'CONCACAF', pot: 1, rank: 12, isHost: true },
    { id: 'CAN', name: 'カナダ', nameEn: 'Canada', confederation: 'CONCACAF', pot: 1, rank: 35, isHost: true },

    // Pot 2
    { id: 'CRO', name: 'クロアチア', nameEn: 'Croatia', confederation: 'UEFA', pot: 2, rank: 10 },
    { id: 'MAR', name: 'モロッコ', nameEn: 'Morocco', confederation: 'CAF', pot: 2, rank: 13 },
    { id: 'COL', name: 'コロンビア', nameEn: 'Colombia', confederation: 'CONMEBOL', pot: 2, rank: 14 },
    { id: 'URU', name: 'ウルグアイ', nameEn: 'Uruguay', confederation: 'CONMEBOL', pot: 2, rank: 15 },
    { id: 'SUI', name: 'スイス', nameEn: 'Switzerland', confederation: 'UEFA', pot: 2, rank: 16 },
    { id: 'JPN', name: '日本', nameEn: 'Japan', confederation: 'AFC', pot: 2, rank: 17 },
    { id: 'SEN', name: 'セネガル', nameEn: 'Senegal', confederation: 'CAF', pot: 2, rank: 18 },
    { id: 'IRN', name: 'イラン', nameEn: 'Iran', confederation: 'AFC', pot: 2, rank: 19 },
    { id: 'KOR', name: '韓国', nameEn: 'Korea Republic', confederation: 'AFC', pot: 2, rank: 23 },
    { id: 'ECU', name: 'エクアドル', nameEn: 'Ecuador', confederation: 'CONMEBOL', pot: 2, rank: 27 },
    { id: 'AUT', name: 'オーストリア', nameEn: 'Austria', confederation: 'UEFA', pot: 2, rank: 25 },
    { id: 'AUS', name: 'オーストラリア', nameEn: 'Australia', confederation: 'AFC', pot: 2, rank: 24 },

    // Pot 3
    { id: 'NOR', name: 'ノルウェー', nameEn: 'Norway', confederation: 'UEFA', pot: 3, rank: 45 }, // Example rank
    { id: 'PAN', name: 'パナマ', nameEn: 'Panama', confederation: 'CONCACAF', pot: 3, rank: 44 },
    { id: 'EGY', name: 'エジプト', nameEn: 'Egypt', confederation: 'CAF', pot: 3, rank: 36 },
    { id: 'ALG', name: 'アルジェリア', nameEn: 'Algeria', confederation: 'CAF', pot: 3, rank: 37 },
    { id: 'SCO', name: 'スコットランド', nameEn: 'Scotland', confederation: 'UEFA', pot: 3, rank: 39 },
    { id: 'PAR', name: 'パラグアイ', nameEn: 'Paraguay', confederation: 'CONMEBOL', pot: 3, rank: 55 },
    { id: 'TUN', name: 'チュニジア', nameEn: 'Tunisia', confederation: 'CAF', pot: 3, rank: 41 },
    { id: 'CIV', name: 'コートジボワール', nameEn: 'Côte d\'Ivoire', confederation: 'CAF', pot: 3, rank: 38 },
    { id: 'UZB', name: 'ウズベキスタン', nameEn: 'Uzbekistan', confederation: 'AFC', pot: 3, rank: 60 },
    { id: 'QAT', name: 'カタール', nameEn: 'Qatar', confederation: 'AFC', pot: 3, rank: 34 },
    { id: 'KSA', name: 'サウジアラビア', nameEn: 'Saudi Arabia', confederation: 'AFC', pot: 3, rank: 56 },
    { id: 'RSA', name: '南アフリカ', nameEn: 'South Africa', confederation: 'CAF', pot: 3, rank: 59 },

    // Pot 4
    { id: 'JOR', name: 'ヨルダン', nameEn: 'Jordan', confederation: 'AFC', pot: 4, rank: 68 },
    { id: 'CPV', name: 'カーボベルデ', nameEn: 'Cabo Verde', confederation: 'CAF', pot: 4, rank: 65 },
    { id: 'GHA', name: 'ガーナ', nameEn: 'Ghana', confederation: 'CAF', pot: 4, rank: 61 },
    { id: 'CUW', name: 'キュラソー', nameEn: 'Curaçao', confederation: 'CONCACAF', pot: 4, rank: 90 },
    { id: 'HAI', name: 'ハイチ', nameEn: 'Haiti', confederation: 'CONCACAF', pot: 4, rank: 86 },
    { id: 'NZL', name: 'ニュージーランド', nameEn: 'New Zealand', confederation: 'OFC', pot: 4, rank: 95 },
    { id: 'PO_EU_A', name: '欧州PO A', nameEn: 'UEFA PO Path A', confederation: 'UEFA', pot: 4, rank: 100 },
    { id: 'PO_EU_B', name: '欧州PO B', nameEn: 'UEFA PO Path B', confederation: 'UEFA', pot: 4, rank: 100 },
    { id: 'PO_EU_C', name: '欧州PO C', nameEn: 'UEFA PO Path C', confederation: 'UEFA', pot: 4, rank: 100 },
    { id: 'PO_EU_D', name: '欧州PO D', nameEn: 'UEFA PO Path D', confederation: 'UEFA', pot: 4, rank: 100 },
    // Intercontinental Playoffs - Handling logic will be complex. 
    // For simplicity in data, we assign a primary confederation but logic must handle multiple possibilities.
    // PO1: CAF vs [OFC or CONCACAF] -> Treat as CAF for now but logic needs to be careful.
    { id: 'PO_IC_1', name: '大陸間PO 1', nameEn: 'IC Playoff 1', confederation: 'CAF', pot: 4, rank: 101 },
    // PO2: AFC vs [CONMEBOL or CONCACAF] -> Treat as AFC for now.
    { id: 'PO_IC_2', name: '大陸間PO 2', nameEn: 'IC Playoff 2', confederation: 'AFC', pot: 4, rank: 102 },
];
