
import React from 'react';
import type { GroupResult } from '../utils/drawLogic';
import type { Team } from '../data/teams';
import { GROUP_VENUES } from '../data/venues';
import { calculateTotalDistance } from '../utils/distance';
import { Calendar, MapPin, RotateCcw, Map } from 'lucide-react';
import { KnockoutPath } from './KnockoutPath';

interface DrawResultProps {
    myTeam: Team;
    result: GroupResult[];
    onReset: () => void;
    onReDraw: () => void;
}

export const DrawResult: React.FC<DrawResultProps> = ({ myTeam, result, onReset, onReDraw }) => {
    const myGroup = result.find(g => g.teams.some(t => t.id === myTeam.id));

    if (!myGroup) return null;

    const schedule = GROUP_VENUES[myGroup.group];
    const opponents = myGroup.teams.filter(t => t.id !== myTeam.id);

    // Determine match opponents based on position
    // In a real schedule, positions (A1, A2, etc.) matter. 
    // Here we assume simple round robin order for display or just list them.
    // For simplicity, we just list the 3 matches against the 3 opponents.
    // Ideally, we should assign positions 1-4 within the group.
    // Let's assume the order in `myGroup.teams` is the draw order (Pot 1, 2, 3, 4).
    // But `myTeam` could be in any pot.
    // Sort teams by Pot for display
    const groupTeams = [...myGroup.teams].sort((a, b) => a.pot - b.pot);

    // Calculate total travel distance
    const matchCoordinates = schedule.matches.flatMap(m => m.coordinates);
    const totalDistance = calculateTotalDistance(matchCoordinates);

    // Generate Google Maps URL for the route
    // Format: https://www.google.com/maps/dir/Lat,Lng/Lat,Lng/.../@Lat,Lng,Zoom
    // We append /@40,-100,4z to force the view to show the entire North American continent
    const googleMapsUrl = `https://www.google.com/maps/dir/${matchCoordinates.map(c => `${c.lat},${c.lng}`).join('/')}/@40,-100,4z`;

    return (
        <div className="max-w-4xl mx-auto p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 mb-8">
                <div className="bg-slate-900 text-white p-6 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    <h2 className="text-3xl font-bold mb-2">グループ {myGroup.group}</h2>
                    <p className="text-slate-400">運命の組分けが決定しました。</p>
                </div>

                <div className="p-8">
                    {/* Group Members List */}
                    <div className="bg-slate-50 rounded-xl p-6 mb-8">
                        <h3 className="font-bold text-slate-700 mb-4 text-center">グループメンバー</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {groupTeams.map(team => (
                                <div
                                    key={team.id}
                                    className={`flex items-center gap-4 p-3 rounded-lg border ${team.id === myTeam.id
                                        ? 'bg-blue-50 border-blue-200 shadow-sm'
                                        : 'bg-white border-slate-200'
                                        }`}
                                >
                                    <div className="w-12 h-8 shadow-sm rounded overflow-hidden flex-shrink-0">
                                        <img src={`https://flagcdn.com/w80/${getFlagCode(team.id)}.png`} alt={team.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-500">POD {team.pot}</span>
                                        <span className={`font-bold ${team.id === myTeam.id ? 'text-blue-700' : 'text-slate-800'}`}>
                                            {team.name}
                                        </span>
                                    </div>
                                    {team.id === myTeam.id && (
                                        <span className="ml-auto text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded-full">YOU</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                <Calendar size={20} className="text-blue-600" />
                                試合日程
                            </h3>
                            <div className="flex items-center gap-4 text-sm">
                                <a
                                    href={googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                    title="全行程をGoogleマップで見る"
                                >
                                    <Map size={16} />
                                    ルート表示
                                    <span className="text-slate-500 font-normal text-xs ml-1">
                                        (総移動距離: {totalDistance.toLocaleString()} km)
                                    </span>
                                </a>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {schedule.matches.map((match, idx) => (
                                <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                                        <span className="bg-white text-slate-600 text-xs font-bold px-2 py-1 rounded border border-slate-200">第{match.matchNumber}戦</span>
                                        <span className="font-medium text-slate-800">
                                            vs {opponents[idx]?.name || 'TBD'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-500">
                                        {match.venues.map((venue, vIdx) => {
                                            const coord = match.coordinates?.[vIdx];
                                            // Use standard search query with zoom param
                                            const mapLink = coord
                                                ? `https://www.google.com/maps/search/?api=1&query=${coord.lat},${coord.lng}&z=5`
                                                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`;

                                            return (
                                                <a
                                                    key={vIdx}
                                                    href={mapLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 hover:text-blue-600 transition-colors group"
                                                    title={`${venue}をGoogleマップで見る`}
                                                >
                                                    <MapPin size={16} className="group-hover:text-blue-600" />
                                                    {venue}
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-right text-slate-400 mt-2">
                            *対戦相手の順序はシミュレーションです。実際の日程はグループ内のポジション（例：A1 vs A2）により異なります。
                        </p>
                    </div>
                </div>

                {/* Knockout Path */}
                <KnockoutPath group={myGroup.group} allGroups={result} />

                <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-center gap-4">
                    <button
                        onClick={onReDraw}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <RotateCcw size={18} />
                        もう一度抽選する
                    </button>
                    <button
                        onClick={onReset}
                        className="text-slate-500 font-medium hover:text-slate-700 transition-colors px-4 py-2"
                    >
                        国を選び直す
                    </button>
                </div>
            </div>
        </div>
    );
};

function getFlagCode(teamId: string): string {
    // Duplicate helper - ideally move to utils
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
