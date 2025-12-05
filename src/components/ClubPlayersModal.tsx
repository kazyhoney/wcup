import React from 'react';
import { X, Shield } from 'lucide-react';
import { type Player, TEAM_PLAYERS } from '../data/players';
import { getFlagCode, TEAMS } from '../data/teams';

interface ClubPlayersModalProps {
    clubName: string;
    onClose: () => void;
}

interface PlayerWithTeam extends Player {
    teamId: string;
    teamName: string;
}

export const ClubPlayersModal: React.FC<ClubPlayersModalProps> = ({ clubName, onClose }) => {
    // Find all players from this club across all teams
    const clubPlayers = React.useMemo(() => {
        const players: PlayerWithTeam[] = [];
        Object.entries(TEAM_PLAYERS).forEach(([teamId, teamPlayers]) => {
            const team = TEAMS.find(t => t.id === teamId);
            if (!team) return;

            teamPlayers.forEach(player => {
                if (player.club === clubName) {
                    players.push({
                        ...player,
                        teamId,
                        teamName: team.name
                    });
                }
            });
        });
        return players;
    }, [clubName]);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-lg">
                            <Shield size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">{clubName}</h2>
                            <p className="text-slate-400 text-xs">所属選手一覧 ({clubPlayers.length}名)</p>
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
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {clubPlayers.length > 0 ? (
                        <div className="space-y-2">
                            {clubPlayers.map((player, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-6 shadow-sm rounded overflow-hidden flex-shrink-0">
                                            <img
                                                src={`https://flagcdn.com/w40/${getFlagCode(player.teamId)}.png`}
                                                alt={player.teamName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{player.name}</div>
                                            <div className="text-xs text-slate-500">{player.teamName} • {player.position}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            選手が見つかりませんでした
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
