export type Confederation = 'UEFA' | 'CONMEBOL' | 'AFC' | 'CAF' | 'CONCACAF' | 'OFC';

export interface Team {
    id: string;
    name: string;
    nameEn: string;
    confederation: Confederation;
    pot: 1 | 2 | 3 | 4;
    rank: number; // FIFA Ranking (Nov 2025 projection)
    isHost?: boolean;
    manager?: string;
}

export const TEAMS: Team[] = [
    // Pot 1
    { id: 'ESP', name: 'スペイン', nameEn: 'Spain', confederation: 'UEFA', pot: 1, rank: 1, manager: 'ルイス・デ・ラ・フエンテ' },
    { id: 'ARG', name: 'アルゼンチン', nameEn: 'Argentina', confederation: 'CONMEBOL', pot: 1, rank: 2, manager: 'リオネル・スカローニ' },
    { id: 'FRA', name: 'フランス', nameEn: 'France', confederation: 'UEFA', pot: 1, rank: 3, manager: 'ディディエ・デシャン' },
    { id: 'ENG', name: 'イングランド', nameEn: 'England', confederation: 'UEFA', pot: 1, rank: 4, manager: 'トーマス・トゥヘル' },
    { id: 'BRA', name: 'ブラジル', nameEn: 'Brazil', confederation: 'CONMEBOL', pot: 1, rank: 5, manager: 'カルロ・アンチェロッティ' },
    { id: 'POR', name: 'ポルトガル', nameEn: 'Portugal', confederation: 'UEFA', pot: 1, rank: 6, manager: 'ロベルト・マルティネス' },
    { id: 'NED', name: 'オランダ', nameEn: 'Netherlands', confederation: 'UEFA', pot: 1, rank: 7, manager: 'ロナルド・クーマン' },
    { id: 'BEL', name: 'ベルギー', nameEn: 'Belgium', confederation: 'UEFA', pot: 1, rank: 8, manager: 'ルディ・ガルシア' },
    { id: 'GER', name: 'ドイツ', nameEn: 'Germany', confederation: 'UEFA', pot: 1, rank: 9, manager: 'ユリアン・ナーゲルスマン' },
    { id: 'USA', name: 'アメリカ', nameEn: 'USA', confederation: 'CONCACAF', pot: 1, rank: 11, isHost: true, manager: 'マウリシオ・ポチェッティーノ' },
    { id: 'MEX', name: 'メキシコ', nameEn: 'Mexico', confederation: 'CONCACAF', pot: 1, rank: 12, isHost: true, manager: 'ハビエル・アギーレ' },
    { id: 'CAN', name: 'カナダ', nameEn: 'Canada', confederation: 'CONCACAF', pot: 1, rank: 35, isHost: true, manager: 'ジェシー・マーシュ' },

    // Pot 2
    { id: 'CRO', name: 'クロアチア', nameEn: 'Croatia', confederation: 'UEFA', pot: 2, rank: 10, manager: 'ズラトコ・ダリッチ' },
    { id: 'MAR', name: 'モロッコ', nameEn: 'Morocco', confederation: 'CAF', pot: 2, rank: 13, manager: 'ワリド・レグラギ' },
    { id: 'COL', name: 'コロンビア', nameEn: 'Colombia', confederation: 'CONMEBOL', pot: 2, rank: 14, manager: 'ネストル・ロレンソ' },
    { id: 'URU', name: 'ウルグアイ', nameEn: 'Uruguay', confederation: 'CONMEBOL', pot: 2, rank: 15, manager: 'マルセロ・ビエルサ' },
    { id: 'SUI', name: 'スイス', nameEn: 'Switzerland', confederation: 'UEFA', pot: 2, rank: 16, manager: 'ムラト・ヤキン' },
    { id: 'JPN', name: '日本', nameEn: 'Japan', confederation: 'AFC', pot: 2, rank: 17, manager: '森保 一' },
    { id: 'SEN', name: 'セネガル', nameEn: 'Senegal', confederation: 'CAF', pot: 2, rank: 18, manager: 'パペ・ティアウ' },
    { id: 'IRN', name: 'イラン', nameEn: 'Iran', confederation: 'AFC', pot: 2, rank: 19, manager: 'アミール・ガレノイー' },
    { id: 'KOR', name: '韓国', nameEn: 'Korea Republic', confederation: 'AFC', pot: 2, rank: 23, manager: 'ホン・ミョンボ' },
    { id: 'ECU', name: 'エクアドル', nameEn: 'Ecuador', confederation: 'CONMEBOL', pot: 2, rank: 27, manager: 'セバスティアン・ベカセセ' },
    { id: 'AUT', name: 'オーストリア', nameEn: 'Austria', confederation: 'UEFA', pot: 2, rank: 25, manager: 'ラルフ・ラングニック' },
    { id: 'AUS', name: 'オーストラリア', nameEn: 'Australia', confederation: 'AFC', pot: 2, rank: 24, manager: 'トニー・ポポヴィッチ' },

    // Pot 3
    { id: 'NOR', name: 'ノルウェー', nameEn: 'Norway', confederation: 'UEFA', pot: 3, rank: 45, manager: 'ストーレ・ソルバッケン' },
    { id: 'PAN', name: 'パナマ', nameEn: 'Panama', confederation: 'CONCACAF', pot: 3, rank: 44, manager: 'トーマス・クリスチャンセン' },
    { id: 'EGY', name: 'エジプト', nameEn: 'Egypt', confederation: 'CAF', pot: 3, rank: 36, manager: 'ホサム・ハッサン' },
    { id: 'ALG', name: 'アルジェリア', nameEn: 'Algeria', confederation: 'CAF', pot: 3, rank: 37, manager: 'ヴラディミル・ペトコヴィッチ' },
    { id: 'SCO', name: 'スコットランド', nameEn: 'Scotland', confederation: 'UEFA', pot: 3, rank: 39, manager: 'スティーブ・クラーク' },
    { id: 'PAR', name: 'パラグアイ', nameEn: 'Paraguay', confederation: 'CONMEBOL', pot: 3, rank: 55, manager: 'グスタボ・アルファロ' },
    { id: 'TUN', name: 'チュニジア', nameEn: 'Tunisia', confederation: 'CAF', pot: 3, rank: 41, manager: 'サミ・トラベルシ' },
    { id: 'CIV', name: 'コートジボワール', nameEn: 'Côte d\'Ivoire', confederation: 'CAF', pot: 3, rank: 38, manager: 'エメルス・ファエ' },
    { id: 'UZB', name: 'ウズベキスタン', nameEn: 'Uzbekistan', confederation: 'AFC', pot: 3, rank: 60, manager: 'ティムル・カパーゼ' },
    { id: 'QAT', name: 'カタール', nameEn: 'Qatar', confederation: 'AFC', pot: 3, rank: 34, manager: 'フレン・ロペテギ' },
    { id: 'KSA', name: 'サウジアラビア', nameEn: 'Saudi Arabia', confederation: 'AFC', pot: 3, rank: 56, manager: 'エルヴェ・ルナール' },
    { id: 'RSA', name: '南アフリカ', nameEn: 'South Africa', confederation: 'CAF', pot: 3, rank: 59, manager: 'ウーゴ・ブロース' },

    // Pot 4
    { id: 'JOR', name: 'ヨルダン', nameEn: 'Jordan', confederation: 'AFC', pot: 4, rank: 68, manager: 'ジャマル・セラミ' },
    { id: 'CPV', name: 'カーボベルデ', nameEn: 'Cabo Verde', confederation: 'CAF', pot: 4, rank: 65, manager: 'ブビスタ' },
    { id: 'GHA', name: 'ガーナ', nameEn: 'Ghana', confederation: 'CAF', pot: 4, rank: 61, manager: 'オットー・アッド' },
    { id: 'CUW', name: 'キュラソー', nameEn: 'Curaçao', confederation: 'CONCACAF', pot: 4, rank: 90, manager: 'ディック・アドフォカート' },
    { id: 'HAI', name: 'ハイチ', nameEn: 'Haiti', confederation: 'CONCACAF', pot: 4, rank: 86, manager: 'セバスチャン・ミニェ' },
    { id: 'NZL', name: 'ニュージーランド', nameEn: 'New Zealand', confederation: 'OFC', pot: 4, rank: 95, manager: 'ダレン・ベイズリー' },
    { id: 'PO_EU_A', name: 'ウェールズ (欧州PO A)', nameEn: 'Wales (UEFA PO Path A)', confederation: 'UEFA', pot: 4, rank: 29, manager: 'クレイグ・ベラミー' },
    { id: 'PO_EU_B', name: 'ポーランド (欧州PO B)', nameEn: 'Poland (UEFA PO Path B)', confederation: 'UEFA', pot: 4, rank: 30, manager: 'ヤン・ウルバン' },
    { id: 'PO_EU_C', name: 'イタリア (欧州PO C)', nameEn: 'Italy (UEFA PO Path C)', confederation: 'UEFA', pot: 4, rank: 9, manager: 'ジェンナーロ・ガットゥーゾ' },
    { id: 'PO_EU_D', name: 'ノルウェー (欧州PO D)', nameEn: 'Norway (UEFA PO Path D)', confederation: 'UEFA', pot: 4, rank: 45, manager: 'ストーレ・ソルバッケン' },

    // Intercontinental Playoffs
    { id: 'PO_IC_1', name: 'チリ (大陸間PO 1)', nameEn: 'Chile (IC Playoff 1)', confederation: 'CONMEBOL', pot: 4, rank: 40, manager: 'ニコラス・コルドバ' },
    { id: 'PO_IC_2', name: 'コスタリカ (大陸間PO 2)', nameEn: 'Costa Rica (IC Playoff 2)', confederation: 'CONCACAF', pot: 4, rank: 50, manager: 'ミゲル・エレーラ' },
];

export function getFlagCode(teamId: string): string {
    const map: Record<string, string> = {
        'ESP': 'es', 'ARG': 'ar', 'FRA': 'fr', 'ENG': 'gb-eng', 'BRA': 'br', 'POR': 'pt', 'NED': 'nl', 'BEL': 'be', 'GER': 'de', 'USA': 'us', 'MEX': 'mx', 'CAN': 'ca',
        'CRO': 'hr', 'MAR': 'ma', 'COL': 'co', 'URU': 'uy', 'SUI': 'ch', 'JPN': 'jp', 'SEN': 'sn', 'IRN': 'ir', 'KOR': 'kr', 'ECU': 'ec', 'AUT': 'at', 'AUS': 'au',
        'NOR': 'no', 'PAN': 'pa', 'EGY': 'eg', 'ALG': 'dz', 'SCO': 'gb-sct', 'PAR': 'py', 'TUN': 'tn', 'CIV': 'ci', 'UZB': 'uz', 'QAT': 'qa', 'KSA': 'sa', 'RSA': 'za',
        'JOR': 'jo', 'CPV': 'cv', 'GHA': 'gh', 'CUW': 'cw', 'HAI': 'ht', 'NZL': 'nz',
        'PO_EU_A': 'eu', 'PO_EU_B': 'eu', 'PO_EU_C': 'eu', 'PO_EU_D': 'eu',
        'PO_IC_1': 'un', 'PO_IC_2': 'un'
    };
    return map[teamId] || 'un';
}
