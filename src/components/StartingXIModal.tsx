import React, { useState } from 'react';
import { X, User, Shield, Shirt } from 'lucide-react';
import { type Team, getFlagCode } from '../data/teams';
import { TEAM_PLAYERS, type Player } from '../data/players';
import { ClubPlayersModal } from './ClubPlayersModal';

interface StartingXIModalProps {
    team: Team;
    onClose: () => void;
}

export const StartingXIModal: React.FC<StartingXIModalProps> = ({ team, onClose }) => {
    const [selectedClub, setSelectedClub] = useState<string | null>(null);
    const players = TEAM_PLAYERS[team.id] || [];
    const starters = players.filter(p => p.isStarter);
    const subs = players.filter(p => !p.isStarter);

    // Group starters by position for better layout
    const gk = starters.filter(p => p.position === 'GK');
    const df = starters.filter(p => p.position === 'DF' || p.position === 'WB');
    const mf = starters.filter(p => p.position === 'MF');
    const fw = starters.filter(p => p.position === 'FW');

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-8 shadow-sm rounded overflow-hidden">
                                <img src={`https://flagcdn.com/w40/${getFlagCode(team.id)}.png`} alt={team.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{team.name}</h2>
                                <p className="text-blue-200 text-xs">監督: {team.manager || '未定'}</p>
                                <p className="text-blue-200 text-[10px] opacity-80">2025年12月時点 予想スタメン</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        {starters.length > 0 ? (
                            <div className="space-y-6">
                                {/* Formation Visual (Simplified List) */}
                                <div className="space-y-4">
                                    <PositionGroup title="FW" players={fw} icon={<User size={16} />} color="text-red-600" bg="bg-red-50" onClubClick={setSelectedClub} />
                                    <PositionGroup title="MF" players={mf} icon={<Shirt size={16} />} color="text-green-600" bg="bg-green-50" onClubClick={setSelectedClub} />
                                    <PositionGroup title="DF" players={df} icon={<Shield size={16} />} color="text-blue-600" bg="bg-blue-50" onClubClick={setSelectedClub} />
                                    <PositionGroup title="GK" players={gk} icon={<Shield size={16} />} color="text-yellow-600" bg="bg-yellow-50" onClubClick={setSelectedClub} />
                                </div>

                                {/* Substitutes */}
                                {subs.length > 0 && (
                                    <div className="mt-8 pt-4 border-t border-slate-100">
                                        <h3 className="text-sm font-bold text-slate-500 mb-3">控えメンバー</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {subs.map((player, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-sm p-2 rounded bg-slate-50">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-mono text-slate-400 w-6">{player.position}</span>
                                                        <span className="font-medium text-slate-700">{player.name}</span>
                                                    </div>
                                                    {player.club && (
                                                        <span
                                                            className="text-xs text-slate-500 truncate max-w-[100px] hover:text-blue-600 hover:underline cursor-pointer"
                                                            onClick={() => player.club && setSelectedClub(player.club)}
                                                        >
                                                            {player.club}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-slate-500">
                                <p>予想スタメンデータがありません</p>
                            </div>
                        )}
                    </div>
                    {/* Manager at bottom */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
                        <p className="text-sm font-bold text-slate-700">監督: {team.manager || '未定'}</p>
                    </div>
                </div>
            </div>

            {selectedClub && (
                <ClubPlayersModal
                    clubName={selectedClub}
                    onClose={() => setSelectedClub(null)}
                />
            )}
        </>
    );
};

const PositionGroup = ({ title, players, icon, color, bg, onClubClick }: { title: string, players: Player[], icon: React.ReactNode, color: string, bg: string, onClubClick: (club: string) => void }) => {
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
                        <span className="font-bold text-slate-800">{player.name}</span>
                        {player.club && (
                            <div
                                className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors"
                                onClick={() => player.club && onClubClick(player.club)}
                            >
                                <Shield size={10} className="text-slate-400" />
                                <span className="truncate max-w-[100px]">{player.club}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
