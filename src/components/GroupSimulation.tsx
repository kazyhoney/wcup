import React, { useState, useEffect } from 'react';
import { X, Trophy, Timer } from 'lucide-react';
import { type Team, getFlagCode } from '../data/teams';
import { getScorerName } from '../data/players';
import { simulateMatchWinner } from '../utils/drawLogic';

interface GroupSimulationProps {
    myTeam: Team;
    opponents: Team[];
    existingResults?: { team1Id: string, team2Id: string, score1: number, score2: number }[];
    onClose: () => void;
    onProceedToKnockout?: () => void;
}

interface MatchResult {
    matchId: number;
    team1: Team;
    team2: Team;
    score1: number;
    score2: number;
    events: GameEvent[];
}

interface GameEvent {
    minute: number;
    type: 'GOAL';
    teamId: string;
    playerName: string;
}

interface TeamStats {
    team: Team;
    points: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    gf: number;
    ga: number;
    gd: number;
}

export const GroupSimulation: React.FC<GroupSimulationProps> = ({ myTeam, opponents, existingResults = [], onClose, onProceedToKnockout }) => {
    const [results, setResults] = useState<MatchResult[]>([]);
    const [standings, setStandings] = useState<TeamStats[]>([]);
    const [isSimulating, setIsSimulating] = useState(true);

    useEffect(() => {
        simulateGroup();
    }, []);

    const simulateGroup = async () => {
        setIsSimulating(true);
        const allTeams = [myTeam, ...opponents];
        const newResults: MatchResult[] = [];

        // Define matches (User vs Opponents)
        const matchesToSimulate = opponents.map((opp, idx) => ({
            id: idx + 1,
            team1: myTeam,
            team2: opp
        }));

        // Simulate each match
        for (const match of matchesToSimulate) {
            // Check if this match was already played
            const existing = existingResults.find(r =>
                (r.team1Id === match.team1.id && r.team2Id === match.team2.id) ||
                (r.team1Id === match.team2.id && r.team2Id === match.team1.id)
            );

            if (existing) {
                // Use existing result
                // We need to reconstruct events roughly or just show result
                // For now, let's just create a result without detailed events or generate dummy events matching the score
                const reconstructedResult: MatchResult = {
                    matchId: match.id,
                    team1: match.team1,
                    team2: match.team2,
                    score1: existing.team1Id === match.team1.id ? existing.score1 : existing.score2,
                    score2: existing.team1Id === match.team1.id ? existing.score2 : existing.score1,
                    events: [] // We could generate dummy events if needed
                };
                newResults.push(reconstructedResult);
                setResults([...newResults]);
                // No delay for existing matches
            } else {
                // Simulate new match
                await new Promise(resolve => setTimeout(resolve, 1500)); // Delay for effect
                const simResult = simulateSingleMatch(match.id, match.team1, match.team2);
                newResults.push(simResult);
                setResults([...newResults]);
            }
        }

        // Simulate other matches (Opponent vs Opponent)
        // These are always simulated here as they aren't played manually
        const otherMatches = [
            { team1: opponents[0], team2: opponents[1] },
            { team1: opponents[1], team2: opponents[2] },
            { team1: opponents[2], team2: opponents[0] }
        ];

        otherMatches.forEach((m, idx) => {
            const res = simulateSingleMatch(10 + idx, m.team1, m.team2);
            newResults.push(res);
        });

        // Calculate final standings
        const stats: Record<string, TeamStats> = {};
        allTeams.forEach(t => {
            stats[t.id] = { team: t, points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0 };
        });

        newResults.forEach(r => {
            updateStats(stats[r.team1.id], r.score1, r.score2);
            updateStats(stats[r.team2.id], r.score2, r.score1);
        });

        const sortedStandings = Object.values(stats).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.gd !== a.gd) return b.gd - a.gd;
            return b.gf - a.gf;
        });

        setStandings(sortedStandings);
        setIsSimulating(false);
    };

    const updateStats = (stat: TeamStats, forScore: number, againstScore: number) => {
        stat.played++;
        stat.gf += forScore;
        stat.ga += againstScore;
        stat.gd += (forScore - againstScore);
        if (forScore > againstScore) {
            stat.won++;
            stat.points += 3;
        } else if (forScore === againstScore) {
            stat.drawn++;
            stat.points += 1;
        } else {
            stat.lost++;
        }
    };

    const simulateSingleMatch = (id: number, t1: Team, t2: Team): MatchResult => {
        // Use shared simulation logic
        const { winner: _winner, score } = simulateMatchWinner(t1, t2);
        const [score1Str, score2Str] = score.split('-');
        const s1 = parseInt(score1Str);
        // Handle "1-1 (PK)" case by splitting space if needed, though split('-') handles numbers fine usually
        // But if PK, the string is "1-1 (PK)". parseInt("1 (PK)") works? No.
        const s2 = parseInt(score2Str.split(' ')[0]);

        const events: GameEvent[] = [];
        // Generate pseudo-events for the goals
        for (let i = 0; i < s1; i++) {
            events.push({ minute: Math.floor(Math.random() * 90) + 1, type: 'GOAL', teamId: t1.id, playerName: getScorerName(t1.id) });
        }
        for (let i = 0; i < s2; i++) {
            events.push({ minute: Math.floor(Math.random() * 90) + 1, type: 'GOAL', teamId: t2.id, playerName: getScorerName(t2.id) });
        }
        events.sort((a, b) => a.minute - b.minute);

        return { matchId: id, team1: t1, team2: t2, score1: s1, score2: s2, events };
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-300 my-8">
                <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-6 flex items-center justify-between text-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <Trophy size={24} className="text-yellow-400" />
                        <h2 className="text-2xl font-bold">グループステージ シミュレーション</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Match Results Timeline */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                            <Timer size={20} />
                            試合結果 & ゴール
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {results.filter(r => r.matchId <= 3).map((match, idx) => (
                                <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200 shadow-sm animate-in slide-in-from-left duration-500" style={{ animationDelay: `${idx * 200}ms` }}>
                                    <div className="text-xs font-bold text-slate-400 mb-2">第{idx + 1}戦</div>
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="text-center w-1/3 flex flex-col items-center">
                                            <div className="w-8 h-6 shadow-sm rounded overflow-hidden mb-1">
                                                <img src={`https://flagcdn.com/w40/${getFlagCode(match.team1.id)}.png`} alt={match.team1.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="text-sm font-bold truncate w-full">{match.team1.name}</div>
                                        </div>
                                        <div className="text-2xl font-black text-slate-800">
                                            {match.score1} - {match.score2}
                                        </div>
                                        <div className="text-center w-1/3 flex flex-col items-center">
                                            <div className="w-8 h-6 shadow-sm rounded overflow-hidden mb-1">
                                                <img src={`https://flagcdn.com/w40/${getFlagCode(match.team2.id)}.png`} alt={match.team2.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="text-sm font-bold truncate w-full">{match.team2.name}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        {match.events.map((e, eIdx) => (
                                            <div key={eIdx} className={`text-xs flex items-center gap-1 ${e.teamId === match.team1.id ? 'justify-start text-blue-600' : 'justify-end text-red-600'}`}>
                                                <span className="font-mono">{e.minute}'</span>
                                                <span>{e.playerName}</span>
                                            </div>
                                        ))}
                                        {match.events.length === 0 && <div className="text-xs text-center text-slate-400">- No Goals -</div>}
                                    </div>
                                </div>
                            ))}
                            {isSimulating && results.length < 3 && (
                                <div className="flex items-center justify-center h-40 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Standings Table */}
                    {!isSimulating && (
                        <div className="animate-in fade-in slide-in-from-bottom duration-700">
                            <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <Trophy size={20} />
                                最終順位表
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-100">
                                        <tr>
                                            <th className="px-4 py-3 rounded-l-lg">順位</th>
                                            <th className="px-4 py-3">チーム</th>
                                            <th className="px-4 py-3 text-center">勝点</th>
                                            <th className="px-4 py-3 text-center">勝</th>
                                            <th className="px-4 py-3 text-center">分</th>
                                            <th className="px-4 py-3 text-center">負</th>
                                            <th className="px-4 py-3 text-center">得失</th>
                                            <th className="px-4 py-3 rounded-r-lg text-center">得点</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {standings.map((stat, idx) => (
                                            <tr key={stat.team.id} className={`border-b border-slate-50 last:border-0 hover:bg-slate-50 ${stat.team.id === myTeam.id ? 'bg-blue-50/50' : ''}`}>
                                                <td className="px-4 py-3 font-bold text-slate-700">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${idx < 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                        {idx + 1}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 font-medium flex items-center gap-2">
                                                    <div className="w-6 h-4 shadow-sm rounded overflow-hidden flex-shrink-0">
                                                        <img src={`https://flagcdn.com/w40/${getFlagCode(stat.team.id)}.png`} alt={stat.team.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    {stat.team.name}
                                                    {stat.team.id === myTeam.id && <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded">YOU</span>}
                                                </td>
                                                <td className="px-4 py-3 text-center font-bold text-slate-800">{stat.points}</td>
                                                <td className="px-4 py-3 text-center text-slate-500">{stat.won}</td>
                                                <td className="px-4 py-3 text-center text-slate-500">{stat.drawn}</td>
                                                <td className="px-4 py-3 text-center text-slate-500">{stat.lost}</td>
                                                <td className="px-4 py-3 text-center font-mono text-slate-600">{stat.gd > 0 ? `+${stat.gd}` : stat.gd}</td>
                                                <td className="px-4 py-3 text-center text-slate-500">{stat.gf}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 text-center space-y-4">
                                {standings.findIndex(s => s.team.id === myTeam.id) < 2 ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="inline-block bg-emerald-100 text-emerald-800 px-6 py-2 rounded-full font-bold animate-bounce">
                                            おめでとうございます！グループステージ突破です！
                                        </div>
                                        {onProceedToKnockout && (
                                            <button
                                                onClick={onProceedToKnockout}
                                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all animate-pulse"
                                            >
                                                決勝トーナメントをシュミレーション
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="inline-block bg-red-100 text-red-800 px-6 py-2 rounded-full font-bold">
                                        残念ながらグループステージ敗退です...
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
