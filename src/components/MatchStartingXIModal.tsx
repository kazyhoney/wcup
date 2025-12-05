import React from 'react';
import { X, User, Shield, Shirt } from 'lucide-react';
import { type Team, getFlagCode } from '../data/teams';
import { TEAM_PLAYERS, type Player } from '../data/players';

interface MatchStartingXIModalProps {
    team1: Team;
    team2: Team;
    onClose: () => void;
}

export const MatchStartingXIModal: React.FC<MatchStartingXIModalProps> = ({ team1, team2, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 flex items-center justify-between text-white shrink-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span>予想スタメン</span>
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Team 1 */}
                        <TeamLineup team={team1} />

                        {/* Team 2 */}
                        <TeamLineup team={team2} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeamLineup = ({ team }: { team: Team }) => {
    const players = TEAM_PLAYERS[team.id] || [];
    const starters = players.filter(p => p.isStarter);

    // Group starters by position
    const gk = starters.filter(p => p.position === 'GK');
    const df = starters.filter(p => p.position === 'DF' || p.position === 'WB');
    const mf = starters.filter(p => p.position === 'MF');
    const fw = starters.filter(p => p.position === 'FW');

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center gap-3">
                <div className="w-10 h-7 shadow-sm rounded overflow-hidden">
                    <img src={`https://flagcdn.com/w80/${getFlagCode(team.id)}.png`} alt={team.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">{team.name}</h3>
            </div>

            <div className="p-4 space-y-4">
                {starters.length > 0 ? (
                    <>
                        <PositionGroup title="FW" players={fw} icon={<User size={16} />} color="text-red-600" bg="bg-red-50" />
                        <PositionGroup title="MF" players={mf} icon={<Shirt size={16} />} color="text-green-600" bg="bg-green-50" />
                        <PositionGroup title="DF" players={df} icon={<Shield size={16} />} color="text-blue-600" bg="bg-blue-50" />
                        <PositionGroup title="GK" players={gk} icon={<Shield size={16} />} color="text-yellow-600" bg="bg-yellow-50" />
                    </>
                ) : (
                    <div className="text-center py-8 text-slate-400">
                        データがありません
                    </div>
                )}
            </div>
        </div>
    );
};

const PositionGroup = ({ title, players, icon, color, bg }: { title: string, players: Player[], icon: React.ReactNode, color: string, bg: string }) => {
    if (players.length === 0) return null;
    return (
        <div>
            <div className={`flex items-center gap-2 mb-2 ${color} font-bold text-sm`}>
                {icon}
                <span>{title}</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {players.map((player, idx) => (
                    <div key={idx} className={`${bg} p-2 rounded-lg border border-slate-100 flex items-center justify-between`}>
                        <span className="font-bold text-slate-800 text-sm">{player.name}</span>
                        {player.club && (
                            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm truncate max-w-[120px]">
                                <Shield size={10} className="text-slate-400" />
                                <span>{player.club}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
