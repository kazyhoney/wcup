import React, { useState } from 'react';
import type { GroupResult } from '../utils/drawLogic';
import { type Team, getFlagCode } from '../data/teams';
import { GROUP_VENUES } from '../data/venues';
import { calculateTotalDistance } from '../utils/distance';
import { Calendar, MapPin, RotateCcw, Map, PlayCircle, Users } from 'lucide-react';
import { KnockoutPath } from './KnockoutPath';
import { MatchSimulation } from './MatchSimulation';
import { GroupSimulation } from './GroupSimulation';
import { StartingXIModal } from './StartingXIModal';
import { MatchStartingXIModal } from './MatchStartingXIModal';

interface DrawResultProps {
    myTeam: Team;
    result: GroupResult[];
    onReset: () => void;
    onReDraw: () => void;
}

export const DrawResult: React.FC<DrawResultProps> = ({ myTeam, result, onReset, onReDraw }) => {
    const [simulatingMatch, setSimulatingMatch] = useState<{ team1: Team, team2: Team, venue: string } | null>(null);
    const [viewingMatchXI, setViewingMatchXI] = useState<{ team1: Team, team2: Team } | null>(null);
    const [showGroupSim, setShowGroupSim] = useState(false);
    const [selectedTeamForXI, setSelectedTeamForXI] = useState<Team | null>(null);

    const [matchResults, setMatchResults] = useState<{ team1Id: string, team2Id: string, score1: number, score2: number }[]>([]);

    const myGroup = result.find(g => g.teams.some(t => t.id === myTeam.id));

    if (!myGroup) return null;

    const schedule = GROUP_VENUES[myGroup.group];
    const opponents = myGroup.teams.filter(t => t.id !== myTeam.id);

    // Sort teams by Pot for display
    const groupTeams = [...myGroup.teams].sort((a, b) => a.pot - b.pot);

    // Calculate total travel distance
    const matchCoordinates = schedule.matches.flatMap(m => m.coordinates);
    const totalDistance = calculateTotalDistance(matchCoordinates);

    // Generate Google Maps URL
    const googleMapsUrl = `https://www.google.com/maps/dir/${matchCoordinates.map(c => `${c.lat},${c.lng}`).join('/')}/@40,-100,4z`;

    // Calculate standings based on match results
    const calculateStandings = () => {
        const standings = myGroup.teams.map(team => ({
            id: team.id,
            name: team.name,
            points: 0,
            goalDiff: 0,
            goalsFor: 0
        }));

        matchResults.forEach(match => {
            const team1 = standings.find(t => t.id === match.team1Id);
            const team2 = standings.find(t => t.id === match.team2Id);

            if (team1 && team2) {
                team1.goalsFor += match.score1;
                team2.goalsFor += match.score2;
                team1.goalDiff += match.score1 - match.score2;
                team2.goalDiff += match.score2 - match.score1;

                if (match.score1 > match.score2) {
                    team1.points += 3;
                } else if (match.score2 > match.score1) {
                    team2.points += 3;
                } else {
                    team1.points += 1;
                    team2.points += 1;
                }
            }
        });

        return standings.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
            return b.goalsFor - a.goalsFor;
        });
    };

    const handleMatchComplete = (score1: number, score2: number) => {
        if (!simulatingMatch) return;

        setMatchResults(prev => {
            // Remove existing result for this match if any (to avoid duplicates if re-simulated)
            const filtered = prev.filter(r =>
                !((r.team1Id === simulatingMatch.team1.id && r.team2Id === simulatingMatch.team2.id) ||
                    (r.team1Id === simulatingMatch.team2.id && r.team2Id === simulatingMatch.team1.id))
            );
            return [...filtered, {
                team1Id: simulatingMatch.team1.id,
                team2Id: simulatingMatch.team2.id,
                score1,
                score2
            }];
        });
    };

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
                                        } cursor-pointer hover:bg-slate-50 transition-colors`}
                                    onClick={() => setSelectedTeamForXI(team)}
                                    title="クリックして予想スタメンを表示"
                                >
                                    <div className="w-12 h-8 shadow-sm rounded overflow-hidden flex-shrink-0">
                                        <img src={`https://flagcdn.com/w80/${getFlagCode(team.id)}.png`} alt={team.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-500">POD {team.pot}</span>
                                        <span className={`font-bold ${team.id === myTeam.id ? 'text-blue-700' : 'text-slate-800'}`}>
                                            {team.name}
                                        </span>
                                        <div className="text-xs text-slate-500">
                                            ポッド{team.pot}・ランク{team.rank}位
                                        </div>
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
                            {schedule.matches.map((match, idx) => {
                                // Find opponent team object
                                const otherTeams = myGroup.teams.filter(t => t.id !== myTeam.id);
                                const sortedOtherTeams = [...otherTeams].sort((a, b) => a.pot - b.pot);
                                const opponent = sortedOtherTeams[match.matchNumber - 1] || sortedOtherTeams[0];

                                return (
                                    <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <div className="flex items-center gap-3 mb-2 md:mb-0">
                                            <span className="bg-white text-slate-600 text-xs font-bold px-2 py-1 rounded border border-slate-200">第{match.matchNumber}戦</span>
                                            <span className="font-medium text-slate-800">
                                                vs {opponent?.name || 'TBD'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-3 text-sm text-slate-500 mb-3">
                                            {match.venues.map((venue, vIdx) => {
                                                const coord = match.coordinates?.[vIdx];
                                                const mapLink = coord
                                                    ? `https://www.google.com/maps/search/?api=1&query=${coord.lat},${coord.lng}&z=2`
                                                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`;

                                                return (
                                                    <div key={vIdx} className="mb-2 last:mb-0 md:mb-0">
                                                        <div className="flex items-start justify-between mb-1">
                                                            <div className="text-sm font-bold text-slate-700">
                                                                <span className="text-xs font-normal text-slate-500 mr-2">会場:</span>
                                                                {venue}
                                                                {coord?.country && (
                                                                    <span className="block text-xs text-slate-400 font-normal ml-8">
                                                                        ({coord.country})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <a
                                                            href={mapLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 hover:text-blue-600 transition-colors group text-xs text-slate-500 ml-8"
                                                            title={`${venue}をGoogleマップで見る`}
                                                        >
                                                            <MapPin size={14} className="group-hover:text-blue-600" />
                                                            <span>マップ表示</span>
                                                        </a>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {opponent && (
                                            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col items-end gap-2">
                                                <button
                                                    onClick={() => setViewingMatchXI({
                                                        team1: myTeam,
                                                        team2: opponent
                                                    })}
                                                    className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 mb-1"
                                                >
                                                    <Users size={14} />
                                                    予想スタメンを見る
                                                </button>
                                                <button
                                                    onClick={() => setSimulatingMatch({
                                                        team1: myTeam,
                                                        team2: opponent,
                                                        venue: match.venues[0]
                                                    })}
                                                    className="text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-1.5"
                                                >
                                                    <PlayCircle size={14} className="animate-pulse" />
                                                    試合シミュレーション
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-xs text-right text-slate-400 mt-2">
                            *対戦相手の順序はシミュレーションです。実際の日程はグループ内のポジション（例：A1 vs A2）により異なります。
                        </p>

                        {/* 3-Match Simulation Button */}
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => setShowGroupSim(true)}
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <PlayCircle size={20} />
                                グループリーグをシミュレーション
                            </button>
                        </div>
                    </div>
                </div>

                {/* Knockout Path */}
                <div id="knockout-path-section">
                    <KnockoutPath group={myGroup.group} allGroups={result} myTeamId={myTeam.id} />
                </div>

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

                {/* Modals */}
                {viewingMatchXI && (
                    <MatchStartingXIModal
                        team1={viewingMatchXI.team1}
                        team2={viewingMatchXI.team2}
                        onClose={() => setViewingMatchXI(null)}
                    />
                )}

                {simulatingMatch && (
                    <MatchSimulation
                        team1={simulatingMatch.team1}
                        team2={simulatingMatch.team2}
                        venue={simulatingMatch.venue}
                        onClose={() => setSimulatingMatch(null)}
                        onMatchComplete={handleMatchComplete}
                        standings={matchResults.length > 0 ? calculateStandings() : undefined}
                        onNextMatch={() => {
                            const otherTeams = myGroup.teams.filter(t => t.id !== myTeam.id);
                            const sortedOtherTeams = [...otherTeams].sort((a, b) => a.pot - b.pot);

                            // Find current opponent index
                            const currentOpponentIdx = sortedOtherTeams.findIndex(t => t.id === simulatingMatch.team2.id || t.id === simulatingMatch.team1.id);
                            const nextOpponent = sortedOtherTeams[currentOpponentIdx + 1];

                            if (nextOpponent) {
                                setSimulatingMatch({
                                    team1: myTeam,
                                    team2: nextOpponent,
                                    venue: "Next Venue" // Simplified
                                });
                            } else {
                                setShowGroupSim(true);
                                setSimulatingMatch(null);
                            }
                        }}
                        nextActionLabel={
                            (() => {
                                const otherTeams = myGroup.teams.filter(t => t.id !== myTeam.id);
                                const sortedOtherTeams = [...otherTeams].sort((a, b) => a.pot - b.pot);
                                const currentOpponentIdx = sortedOtherTeams.findIndex(t => t.id === simulatingMatch.team2.id || t.id === simulatingMatch.team1.id);
                                return currentOpponentIdx === sortedOtherTeams.length - 1 ? "順位表を見る" : "次の試合へ";
                            })()
                        }
                    />
                )}

                {selectedTeamForXI && (
                    <StartingXIModal
                        team={selectedTeamForXI}
                        onClose={() => setSelectedTeamForXI(null)}
                    />
                )}

                {showGroupSim && (
                    <GroupSimulation
                        myTeam={myTeam}
                        opponents={opponents}
                        existingResults={matchResults}
                        onClose={() => setShowGroupSim(false)}
                        onProceedToKnockout={() => {
                            setShowGroupSim(false);
                            // Scroll to Knockout Path
                            const element = document.getElementById('knockout-path-section');
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
};
