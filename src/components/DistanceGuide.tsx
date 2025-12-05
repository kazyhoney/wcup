import React from 'react';
import { GROUP_VENUES } from '../data/venues';
import { calculateTotalDistance } from '../utils/distance';
import { Map, X, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface DistanceGuideProps {
    onClose: () => void;
}

export const DistanceGuide: React.FC<DistanceGuideProps> = ({ onClose }) => {
    // Calculate distance for each group
    const groupDistances = Object.entries(GROUP_VENUES).map(([group, schedule]) => {
        const matchCoordinates = schedule.matches.flatMap(m => m.coordinates);
        const totalDistance = calculateTotalDistance(matchCoordinates);

        // Determine region/commentary based on group
        let region = '';
        let commentary = '';

        // Simple heuristics for commentary based on known group locations
        if (['A', 'C', 'E', 'H', 'I'].includes(group)) { // Mexico/Central based (approx)
            region = 'メキシコ・米国南部中心';
            commentary = '移動距離が比較的短く、コンディション維持に有利な傾向があります。';
        } else if (['B', 'D', 'J', 'L'].includes(group)) { // West Coast / Canada
            region = 'カナダ・米国西海岸';
            commentary = '都市間の距離が長く、移動による疲労が懸念されます。';
        } else {
            region = '米国東海岸・中央';
            commentary = '標準的な移動距離ですが、時差への対策が必要になる場合があります。';
        }

        return {
            group,
            distance: totalDistance,
            region,
            commentary
        };
    }).sort((a, b) => a.distance - b.distance); // Sort by distance ascending

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-slate-900 text-white p-6 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <Map className="text-blue-400" size={28} />
                        <div>
                            <h2 className="text-2xl font-bold">グループ別 移動距離の目安</h2>
                            <p className="text-slate-400 text-sm">2026年大会は広大な北米大陸での開催となるため、移動距離が鍵となります。</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 bg-slate-50">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
                                <TrendingDown size={20} />
                                <span>最短移動グループ</span>
                            </div>
                            <div className="text-3xl font-bold text-slate-800 mb-1">
                                Group {groupDistances[0].group}
                            </div>
                            <p className="text-sm text-slate-600">{groupDistances[0].distance.toLocaleString()} km</p>
                        </div>

                        <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                                <TrendingUp size={20} />
                                <span>最長移動グループ</span>
                            </div>
                            <div className="text-3xl font-bold text-slate-800 mb-1">
                                Group {groupDistances[groupDistances.length - 1].group}
                            </div>
                            <p className="text-sm text-slate-600">{groupDistances[groupDistances.length - 1].distance.toLocaleString()} km</p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-blue-700 font-bold mb-2">
                                <Info size={20} />
                                <span>平均移動距離</span>
                            </div>
                            <div className="text-3xl font-bold text-slate-800 mb-1">
                                {Math.round(groupDistances.reduce((acc, curr) => acc + curr.distance, 0) / 12).toLocaleString()} km
                            </div>
                            <p className="text-sm text-slate-600">全12グループ平均</p>
                        </div>
                    </div>

                    {/* Ranking Table */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100 text-slate-600 text-sm border-b border-slate-200">
                                    <th className="p-4 font-bold">順位</th>
                                    <th className="p-4 font-bold">グループ</th>
                                    <th className="p-4 font-bold">総移動距離</th>
                                    <th className="p-4 font-bold hidden md:table-cell">主な開催地域</th>
                                    <th className="p-4 font-bold hidden md:table-cell">特徴・解説</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupDistances.map((item, index) => (
                                    <tr key={item.group} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-mono text-slate-500">#{index + 1}</td>
                                        <td className="p-4 font-bold text-lg text-slate-800">Group {item.group}</td>
                                        <td className="p-4 font-mono font-bold text-blue-600">
                                            {item.distance.toLocaleString()} km
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 hidden md:table-cell">{item.region}</td>
                                        <td className="p-4 text-sm text-slate-500 hidden md:table-cell">{item.commentary}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
