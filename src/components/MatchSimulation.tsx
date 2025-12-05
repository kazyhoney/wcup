import React, { useState, useEffect } from 'react';
import { X, Clock, PlayCircle, Trophy } from 'lucide-react';
import { getFlagCode, type Team } from '../data/teams';
import { getScorerName } from '../data/players';

interface MatchSimulationProps {
    team1: Team;
    team2: Team;
    venue: string;
    onClose: () => void;
    onNextMatch?: () => void;
    standings?: any[];
    nextActionLabel?: string;
    onMatchComplete?: (score1: number, score2: number) => void;
}

interface MatchEvent {
    minute: number;
    type: 'GOAL' | 'CARD' | 'SUB';
    teamId: string;
    playerName: string;
    detail?: string;
}

export const MatchSimulation: React.FC<MatchSimulationProps> = ({ team1, team2, venue, onClose, onNextMatch, standings, nextActionLabel = "次の試合へ", onMatchComplete }) => {
    const [events, setEvents] = useState<MatchEvent[]>([]);
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [currentMinute, setCurrentMinute] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [hasReportedResult, setHasReportedResult] = useState(false);

    useEffect(() => {
        // Reset state when teams change
        setScore1(0);
        setScore2(0);
        setCurrentMinute(0);
        setEvents([]);
        setIsFinished(false);
        setHasReportedResult(false);

        const timer = setInterval(() => {
            setCurrentMinute(prev => {
                if (prev >= 90) {
                    clearInterval(timer);
                    setIsFinished(true);
                    return 90;
                }
                return prev + 1;
            });
        }, 50); // Fast simulation

        return () => clearInterval(timer);
    }, [team1.id, team2.id]);

    useEffect(() => {
        if (isFinished && !hasReportedResult && onMatchComplete) {
            onMatchComplete(score1, score2);
            setHasReportedResult(true);
        }
    }, [isFinished, hasReportedResult, onMatchComplete, score1, score2]);

    useEffect(() => {
        if (currentMinute > 0 && currentMinute <= 90) {
            // Simulation logic
            const rankDiff = team2.rank - team1.rank;
            // Base probability per minute (approx 0.03 for 2.7 goals avg)
            // Adjust by rank difference. 
            // If team1 (rank 1) vs team2 (rank 100) -> diff 99. Team 1 should score more.

            // Team 1 scoring chance
            const prob1 = 0.015 + (Math.max(0, rankDiff) * 0.0005);
            // Team 2 scoring chance
            const prob2 = 0.015 + (Math.max(0, -rankDiff) * 0.0005);

            if (Math.random() < prob1) {
                setScore1(s => s + 1);
                addEvent(team1, currentMinute);
            } else if (Math.random() < prob2) {
                setScore2(s => s + 1);
                addEvent(team2, currentMinute);
            }
        }
    }, [currentMinute, team1, team2]);

    const addEvent = (team: Team, minute: number) => {
        const scorer = getScorerName(team.id);
        setEvents(prev => [...prev, {
            minute,
            type: 'GOAL',
            teamId: team.id,
            playerName: scorer,
            detail: 'Goal'
        }]);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row max-h-[90vh]">

                {/* Match Area */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 flex items-center justify-between text-white shrink-0">
                        <div className="flex items-center gap-2">
                            <Clock size={20} className={!isFinished ? "animate-pulse text-yellow-400" : ""} />
                            <span className="font-mono text-xl font-bold">{currentMinute}'</span>
                            {isFinished && <span className="bg-yellow-500 text-blue-900 text-xs font-bold px-2 py-0.5 rounded ml-2">FT</span>}
                        </div>
                        <div className="text-sm opacity-80 truncate max-w-[200px]">{venue}</div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scoreboard */}
                    <div className="p-8 bg-slate-50 flex items-center justify-between shrink-0">
                        <div className="flex flex-col items-center w-1/3">
                            <div className="w-16 h-12 shadow-md rounded overflow-hidden mb-2">
                                <img src={`https://flagcdn.com/w160/${getFlagCode(team1.id)}.png`} alt={team1.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-center leading-tight">{team1.name}</span>
                            <span className="text-xs text-slate-500">Rank {team1.rank}</span>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="text-5xl font-black text-slate-800 tracking-tighter flex items-center gap-4">
                                <span>{score1}</span>
                                <span className="text-slate-300">-</span>
                                <span>{score2}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center w-1/3">
                            <div className="w-16 h-12 shadow-md rounded overflow-hidden mb-2">
                                <img src={`https://flagcdn.com/w160/${getFlagCode(team2.id)}.png`} alt={team2.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-center leading-tight">{team2.name}</span>
                            <span className="text-xs text-slate-500">Rank {team2.rank}</span>
                        </div>
                    </div>

                    {/* Events */}
                    <div className="flex-1 overflow-y-auto p-4 bg-white border-t border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Match Events</h3>
                        <div className="space-y-3">
                            {events.length === 0 && currentMinute > 0 && (
                                <div className="text-center text-slate-400 text-sm py-4 italic">No major events yet...</div>
                            )}
                            {events.map((event, idx) => (
                                <div key={idx} className={`flex items-center gap-3 ${event.teamId === team1.id ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className="text-xs font-mono font-bold text-slate-400 w-8 text-center">{event.minute}'</div>
                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${event.teamId === team1.id ? 'bg-blue-50 text-blue-800' : 'bg-red-50 text-red-800'}`}>
                                        <span className="font-bold text-sm">{event.playerName}</span>
                                        <span className="text-xs opacity-75">({event.detail})</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    {isFinished && onNextMatch && (
                        <div className="p-4 bg-white border-t border-slate-100 flex justify-center shrink-0">
                            <button
                                onClick={onNextMatch}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2 transition-all animate-bounce"
                            >
                                <PlayCircle size={20} />
                                {nextActionLabel}
                            </button>
                        </div>
                    )}
                </div>

                {/* Standings (Optional Sidebar) */}
                {standings && standings.length > 0 && (
                    <div className="w-full md:w-80 bg-slate-50 border-l border-slate-200 flex flex-col shrink-0">
                        <div className="p-4 bg-slate-100 border-b border-slate-200 font-bold text-slate-700 flex items-center gap-2">
                            <Trophy size={16} className="text-yellow-600" />
                            現在の順位
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-slate-400 text-xs border-b border-slate-200">
                                        <th className="text-left p-2 font-normal">Team</th>
                                        <th className="text-center p-2 font-normal">Pts</th>
                                        <th className="text-center p-2 font-normal">GD</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {standings.map((team, idx) => (
                                        <tr key={team.id} className="border-b border-slate-100 last:border-0">
                                            <td className="p-2 flex items-center gap-2">
                                                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${idx < 2 ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>
                                                    {idx + 1}
                                                </span>
                                                <span className="font-medium truncate max-w-[100px]">{team.name}</span>
                                            </td>
                                            <td className="p-2 text-center font-bold">{team.points}</td>
                                            <td className="p-2 text-center text-slate-500">{team.goalDiff > 0 ? `+${team.goalDiff}` : team.goalDiff}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
