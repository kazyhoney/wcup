import React, { useState } from 'react';
import { TEAMS, type Team, type Confederation } from '../data/teams';
import { Search, Globe } from 'lucide-react';

interface TeamSelectorProps {
    onSelect: (team: Team) => void;
}

const CONFEDERATIONS: Confederation[] = ['UEFA', 'CONMEBOL', 'AFC', 'CAF', 'CONCACAF', 'OFC'];

const CONFED_NAMES: Record<Confederation, string> = {
    'UEFA': '欧州 (UEFA)',
    'CONMEBOL': '南米 (CONMEBOL)',
    'AFC': 'アジア (AFC)',
    'CAF': 'アフリカ (CAF)',
    'CONCACAF': '北中米カリブ (CONCACAF)',
    'OFC': 'オセアニア (OFC)'
};

export const TeamSelector: React.FC<TeamSelectorProps> = ({ onSelect }) => {
    const [search, setSearch] = useState('');
    const [filterConfed, setFilterConfed] = useState<Confederation | 'ALL'>('ALL');

    const filteredTeams = TEAMS.filter(team => {
        const matchesSearch = team.name.includes(search) || team.nameEn.toLowerCase().includes(search.toLowerCase());
        const matchesConfed = filterConfed === 'ALL' || team.confederation === filterConfed;
        return matchesSearch && matchesConfed;
    });

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    2026 FIFA ワールドカップ 組分け抽選シミュレーター
                </h1>
                <p className="text-lg text-slate-600">
                    応援する国を選んで、運命の抽選をシミュレーションしよう。
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="国名で検索..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                    <button
                        onClick={() => setFilterConfed('ALL')}
                        className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${filterConfed === 'ALL'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        すべて
                    </button>
                    {CONFEDERATIONS.map(confed => (
                        <button
                            key={confed}
                            onClick={() => setFilterConfed(confed)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${filterConfed === confed
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {CONFED_NAMES[confed]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredTeams.map(team => (
                    <button
                        key={team.id}
                        onClick={() => onSelect(team)}
                        className="group relative bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-left flex flex-col h-full"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <span className={`text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600`}>
                                ポッド {team.pot}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">ランキング{team.rank}位</span>
                        </div>

                        <div className="flex-grow flex flex-col items-center justify-center py-4">
                            {/* Flag placeholder - in real app use flagcdn or similar */}
                            <div className="w-16 h-12 bg-slate-100 rounded shadow-sm mb-3 flex items-center justify-center text-2xl overflow-hidden relative">
                                <img
                                    src={`https://flagcdn.com/w80/${getFlagCode(team.id)}.png`}
                                    alt={team.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                <span className="absolute inset-0 flex items-center justify-center bg-slate-100 -z-10">
                                    <Globe size={24} className="text-slate-300" />
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-800 text-center leading-tight">{team.name}</h3>
                            <p className="text-xs text-slate-500 mt-1">{team.nameEn}</p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-xs font-medium text-slate-500">{CONFED_NAMES[team.confederation]}</span>
                            {team.isHost && (
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">開催国</span>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

// Helper to map team ID to flagcdn code (ISO 3166-1 alpha-2)
// This is a simplified mapping. In production, add a 'flagCode' to Team interface.
function getFlagCode(teamId: string): string {
    const map: Record<string, string> = {
        'ESP': 'es', 'ARG': 'ar', 'FRA': 'fr', 'ENG': 'gb-eng', 'BRA': 'br', 'POR': 'pt', 'NED': 'nl', 'BEL': 'be', 'GER': 'de', 'USA': 'us', 'MEX': 'mx', 'CAN': 'ca',
        'CRO': 'hr', 'MAR': 'ma', 'COL': 'co', 'URU': 'uy', 'SUI': 'ch', 'JPN': 'jp', 'SEN': 'sn', 'IRN': 'ir', 'KOR': 'kr', 'ECU': 'ec', 'AUT': 'at', 'AUS': 'au',
        'NOR': 'no', 'PAN': 'pa', 'EGY': 'eg', 'ALG': 'dz', 'SCO': 'gb-sct', 'PAR': 'py', 'TUN': 'tn', 'CIV': 'ci', 'UZB': 'uz', 'QAT': 'qa', 'KSA': 'sa', 'RSA': 'za',
        'JOR': 'jo', 'CPV': 'cv', 'GHA': 'gh', 'CUW': 'cw', 'HAI': 'ht', 'NZL': 'nz',
        // Playoffs - use generic or specific if known
        'PO_EU_A': 'eu', 'PO_EU_B': 'eu', 'PO_EU_C': 'eu', 'PO_EU_D': 'eu',
        'PO_IC_1': 'un', 'PO_IC_2': 'un'
    };
    return map[teamId] || 'un';
}
