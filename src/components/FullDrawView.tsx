import React from 'react';
import type { GroupResult } from '../utils/drawLogic';

interface FullDrawViewProps {
    result: GroupResult[];
}

export const FullDrawView: React.FC<FullDrawViewProps> = ({ result }) => {
    return (
        <div className="max-w-7xl mx-auto p-4 pb-16">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">全グループ抽選結果</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {result.map((group) => (
                    <div key={group.group} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                            <span className="font-bold text-slate-700">グループ {group.group}</span>
                        </div>
                        <div className="p-4 space-y-3">
                            {group.teams.map((team) => (
                                <div key={team.id} className="flex items-center gap-3">
                                    <div className="w-8 h-6 shadow-sm rounded overflow-hidden flex-shrink-0">
                                        <img src={`https://flagcdn.com/w40/${getFlagCode(team.id)}.png`} alt={team.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-medium text-sm text-slate-800 truncate">{team.name}</span>
                                        <span className="text-xs text-slate-400">ポッド {team.pot} • #{team.rank}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

function getFlagCode(teamId: string): string {
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
