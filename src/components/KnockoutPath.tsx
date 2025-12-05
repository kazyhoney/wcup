import React from 'react';
import { Trophy, ArrowRight } from 'lucide-react';
import { KNOCKOUT_MAPPINGS } from '../data/knockout';
import type { GroupResult } from '../utils/drawLogic';

interface KnockoutPathProps {
    group: string;
    allGroups: GroupResult[];
}

export const KnockoutPath: React.FC<KnockoutPathProps> = ({ group, allGroups }) => {
    const mapping = KNOCKOUT_MAPPINGS[group];

    if (!mapping) return null;

    const getStrongTeams = (targetGroups: string[]) => {
        // Collect Pot 1 and Pot 2 teams from the target groups
        const teams: string[] = [];
        targetGroups.forEach(gId => {
            const g = allGroups.find(gr => gr.group === gId);
            if (g) {
                // Find Pot 1 and Pot 2 teams
                const pot1 = g.teams.find(t => t.pot === 1);
                const pot2 = g.teams.find(t => t.pot === 2);
                if (pot1) teams.push(`${pot1.name}(${gId})`);
                if (pot2) teams.push(`${pot2.name}(${gId})`);
            }
        });
        return teams;
    };

    const firstPathTeams = getStrongTeams(mapping.first.targetGroups);
    const secondPathTeams = getStrongTeams(mapping.second.targetGroups);

    // Helper to format team list
    const renderTeamList = (teams: string[]) => {
        if (teams.length === 0) return null;
        // If too many teams (e.g. 3rd place from 5 groups), just show top few or generic message?
        // User asked for "strong teams", so listing Pot 1/2 is good.
        // But for 5 groups, that's 10 teams. Too many.
        // Let's limit or just show for single group targets (2nd place match) primarily.

        if (teams.length > 4) {
            return (
                <div className="mt-2 text-xs text-slate-500">
                    <span className="font-bold">有力候補:</span> {teams.slice(0, 6).join(', ')}...
                </div>
            );
        }

        return (
            <div className="mt-2 text-sm text-slate-600">
                <span className="font-bold text-slate-700">有力候補:</span> {teams.join(', ')}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mt-8">
            <h3 className="font-bold text-slate-700 flex items-center gap-2 mb-4">
                <Trophy size={20} className="text-yellow-500" />
                決勝トーナメント進出時の対戦相手（予想）
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1st Place Path */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Trophy size={64} className="text-yellow-600" />
                    </div>
                    <div className="relative z-10">
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded mb-2">
                            1位通過の場合
                        </span>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                                <span className="text-sm">ラウンド32</span>
                                <ArrowRight size={16} className="text-slate-400" />
                                <span className="font-bold text-lg">{mapping.first.opponentDescription}</span>
                            </div>
                            {renderTeamList(firstPathTeams)}
                        </div>
                    </div>
                </div>

                {/* 2nd Place Path */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-lg p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Trophy size={64} className="text-slate-600" />
                    </div>
                    <div className="relative z-10">
                        <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded mb-2">
                            2位通過の場合
                        </span>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                                <span className="text-sm">ラウンド32</span>
                                <ArrowRight size={16} className="text-slate-400" />
                                <span className="font-bold text-lg">{mapping.second.opponentDescription}</span>
                            </div>
                            {renderTeamList(secondPathTeams)}
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-xs text-right text-slate-400 mt-2">
                *有力候補は対象グループのポッド1・2のチームを表示しています。
            </p>
        </div>
    );
};
