import React, { useState } from 'react';
import { Trophy, PlayCircle } from 'lucide-react';
import { KNOCKOUT_MAPPINGS } from '../data/knockout';
import { type GroupResult, simulateTournament, type KnockoutMatch } from '../utils/drawLogic';
import { TournamentBracket } from './TournamentBracket';
import { getFlagCode } from '../data/teams';

interface KnockoutPathProps {
    group: string;
    allGroups: GroupResult[];
    myTeamId: string;
}

interface PathRound {
    roundName: string;
    opponents: { id: string, name: string, flag: string, rank: number }[];
}

export const KnockoutPath: React.FC<KnockoutPathProps> = ({ group, allGroups, myTeamId }) => {
    const mapping = KNOCKOUT_MAPPINGS[group];
    const [showBracket, setShowBracket] = useState(false);
    const [simulationMatches, setSimulationMatches] = useState<KnockoutMatch[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);

    if (!mapping) return null;

    const handleSimulate = () => {
        setIsSimulating(true);
        setTimeout(() => {
            // Simulate assuming 1st or 2nd place (randomly or user choice? Let's pick 1st for now or random)
            // Actually, the simulation should cover the whole tournament.
            // We'll pass rank 1 as default for "my team" to see where they go.
            const matches = simulateTournament(allGroups, myTeamId, 1);
            setSimulationMatches(matches);
            setShowBracket(true);
            setIsSimulating(false);
        }, 1500);
    };

    const getPathData = (targetGroups: string[], roundNames: string[]): PathRound[] => {
        return targetGroups.map((gId, idx) => {
            const g = allGroups.find(gr => gr.group === gId);
            const opponents = g ? g.teams.filter(t => t.pot <= 2).map(t => ({
                id: t.id,
                name: t.name,
                flag: getFlagCode(t.id),
                rank: t.rank
            })) : [];

            return {
                roundName: roundNames[idx] || `Round ${idx + 1}`,
                opponents
            };
        });
    };

    // Define rounds for display (Simplified logic: just showing potential opponents from target groups)
    // The mapping has targetGroups for R32, R16, QF, SF.
    // We need to map these to the rounds.

    // Mapping structure: first: { targetGroups: ['B', 'C', 'E', 'G'] } (example)
    // We need to label them.
    const roundLabels = ['Round of 32', 'Round of 16', 'Quarter Final', 'Semi Final'];

    const path1st = getPathData(mapping.first.targetGroups, roundLabels);
    const path2nd = getPathData(mapping.second.targetGroups, roundLabels);

    return (
        <>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100 p-6 animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                        <Trophy className="text-yellow-500" />
                        決勝トーナメント進出時の対戦相手（予想）
                    </h2>
                    {!showBracket && (
                        <button
                            onClick={handleSimulate}
                            disabled={isSimulating}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSimulating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    シミュレーション中...
                                </>
                            ) : (
                                <>
                                    <PlayCircle size={18} />
                                    トーナメントをシミュレーション
                                </>
                            )}
                        </button>
                    )}
                </div>

                <div className="space-y-8">
                    {/* 1st Place Path */}
                    <div className="transition-all duration-500">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                                グループ1位通過の場合
                            </div>
                            <div className="h-px bg-slate-200 flex-1"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {path1st.map((round, idx) => (
                                <div key={idx} className="relative">
                                    {/* Connector Line */}
                                    {idx < path1st.length - 1 && (
                                        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-slate-200 z-0"></div>
                                    )}

                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 relative z-10 h-full hover:shadow-md transition-shadow">
                                        <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                            {round.roundName}
                                        </div>

                                        {/* Opponent List */}
                                        <div className="space-y-2">
                                            <div className="text-xs text-slate-500 mb-1">有力候補:</div>
                                            <div className="flex flex-wrap gap-1">
                                                {round.opponents.map(opp => (
                                                    <div key={opp.id} className="flex items-center gap-1 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs shadow-sm" title={`Rank ${opp.rank}`}>
                                                        <img src={`https://flagcdn.com/w20/${opp.flag}.png`} alt="" className="w-4 h-3 object-cover rounded shadow-sm" />
                                                        <span className="truncate max-w-[80px]">{opp.name}</span>
                                                    </div>
                                                ))}
                                                {round.opponents.length === 0 && (
                                                    <span className="text-xs text-slate-400">TBD</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2nd Place Path */}
                    <div className="transition-all duration-500">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">
                                グループ2位通過の場合
                            </div>
                            <div className="h-px bg-slate-200 flex-1"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {path2nd.map((round, idx) => (
                                <div key={idx} className="relative">
                                    {/* Connector Line */}
                                    {idx < path2nd.length - 1 && (
                                        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-slate-200 z-0"></div>
                                    )}

                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 relative z-10 h-full hover:shadow-md transition-shadow">
                                        <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                            {round.roundName}
                                        </div>

                                        {/* Opponent List */}
                                        <div className="space-y-2">
                                            <div className="text-xs text-slate-500 mb-1">有力候補:</div>
                                            <div className="flex flex-wrap gap-1">
                                                {round.opponents.map(opp => (
                                                    <div key={opp.id} className="flex items-center gap-1 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs shadow-sm" title={`Rank ${opp.rank}`}>
                                                        <img src={`https://flagcdn.com/w20/${opp.flag}.png`} alt="" className="w-4 h-3 object-cover rounded shadow-sm" />
                                                        <span className="truncate max-w-[80px]">{opp.name}</span>
                                                    </div>
                                                ))}
                                                {round.opponents.length === 0 && (
                                                    <span className="text-xs text-slate-400">TBD</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showBracket && (
                <TournamentBracket
                    matches={simulationMatches}
                    onClose={() => setShowBracket(false)}
                    myTeamId={myTeamId}
                />
            )}
        </>
    );
};
