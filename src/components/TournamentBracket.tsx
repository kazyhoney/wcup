import React, { useMemo } from 'react';
import type { KnockoutMatch } from '../utils/drawLogic';
import { Trophy, X } from 'lucide-react';
import { getFlagCode } from '../data/teams';

interface TournamentBracketProps {
    matches: KnockoutMatch[];
    onClose: () => void;
    myTeamId: string;
}

export const TournamentBracket: React.FC<TournamentBracketProps> = ({ matches, onClose, myTeamId }) => {
    const rounds = ['R32', 'R16', 'QF', 'SF', 'Final'];

    const matchesByRound = useMemo(() => {
        const grouped: Record<string, KnockoutMatch[]> = {};
        rounds.forEach(r => grouped[r] = []);
        matches.forEach(m => {
            if (grouped[m.round]) grouped[m.round].push(m);
        });
        return grouped;
    }, [matches]);

    const renderMatch = (match: KnockoutMatch) => {
        const isMyTeamInMatch = match.team1?.id === myTeamId || match.team2?.id === myTeamId;
        const isMyTeamWinner = match.winner?.id === myTeamId;

        return (
            <div key={match.id} className={`flex flex-col bg-white border rounded-lg shadow-sm mb-4 text-xs overflow-hidden ${isMyTeamInMatch ? 'border-blue-400 ring-1 ring-blue-200' : 'border-slate-200'}`}>
                {/* Team 1 */}
                <div className={`flex justify-between items-center p-2 ${match.winner?.id === match.team1?.id ? 'bg-slate-50 font-bold' : ''}`}>
                    <div className="flex items-center gap-2">
                        {match.team1 && (
                            <>
                                <img src={`https://flagcdn.com/w20/${getFlagCode(match.team1.id)}.png`} alt="" className="w-4 h-3 object-cover" />
                                <span className={match.team1.id === myTeamId ? 'text-blue-700' : ''}>{match.team1.name}</span>
                            </>
                        )}
                    </div>
                    <span>{match.score?.split('-')[0]}</span>
                </div>
                {/* Team 2 */}
                <div className={`flex justify-between items-center p-2 border-t border-slate-100 ${match.winner?.id === match.team2?.id ? 'bg-slate-50 font-bold' : ''}`}>
                    <div className="flex items-center gap-2">
                        {match.team2 && (
                            <>
                                <img src={`https://flagcdn.com/w20/${getFlagCode(match.team2.id)}.png`} alt="" className="w-4 h-3 object-cover" />
                                <span className={match.team2.id === myTeamId ? 'text-blue-700' : ''}>{match.team2.name}</span>
                            </>
                        )}
                    </div>
                    <span>{match.score?.split('-')[1]}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-100 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <Trophy className="text-yellow-400" size={24} />
                        <h2 className="text-xl font-bold">トーナメント・シミュレーション</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Bracket Content */}
                <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
                    <div className="flex gap-8 min-w-max">
                        {rounds.map((round, rIdx) => (
                            <div key={round} className="flex flex-col w-48">
                                <h3 className="text-center font-bold text-slate-500 mb-4 sticky top-0 bg-slate-100 py-2">
                                    {round === 'R32' ? 'ラウンド32' :
                                        round === 'R16' ? 'ベスト16' :
                                            round === 'QF' ? '準々決勝' :
                                                round === 'SF' ? '準決勝' : '決勝'}
                                </h3>
                                <div className={`flex flex-col justify-around h-full gap-4`}>
                                    {matchesByRound[round]?.map(match => renderMatch(match))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
                    ※この結果は現在のFIFAランキング等に基づくシミュレーションであり、実際の結果を保証するものではありません。
                </div>
            </div>
        </div>
    );
};
