import { useState } from 'react';
import { TeamSelector } from './components/TeamSelector';
import { DrawResult } from './components/DrawResult';
import { FullDrawView } from './components/FullDrawView';
import { DistanceGuide } from './components/DistanceGuide';
import { simulateDraw, type GroupResult } from './utils/drawLogic';
import type { Team } from './data/teams';
import { Map } from 'lucide-react';

function App() {
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [drawResult, setDrawResult] = useState<GroupResult[] | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDistanceGuide, setShowDistanceGuide] = useState(false);

  const handleSelectTeam = async (team: Team) => {
    setMyTeam(team);
    setIsDrawing(true);
    setDrawResult(null);
    setError(null);

    // Simulate delay for effect
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const result = simulateDraw(team.id);
      setDrawResult(result);
    } catch (e) {
      console.error(e);
      setError('抽選の生成に失敗しました。もう一度お試しください。');
      setMyTeam(null);
    } finally {
      setIsDrawing(false);
    }
  };

  const handleReset = () => {
    setMyTeam(null);
    setDrawResult(null);
    setError(null);
  };

  const handleReDraw = () => {
    if (myTeam) {
      handleSelectTeam(myTeam);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <main className="container mx-auto px-4 py-8">
        {/* Header / Title Area could go here */}

        {!myTeam && !isDrawing && (
          <div className="relative">
            <TeamSelector onSelect={handleSelectTeam} />

            {/* Distance Guide Button */}
            <div className="fixed bottom-8 right-8 z-40">
              <button
                onClick={() => setShowDistanceGuide(true)}
                className="bg-white text-slate-700 font-bold py-3 px-6 rounded-full shadow-lg border border-slate-200 flex items-center gap-2 hover:bg-slate-50 hover:scale-105 transition-all"
              >
                <Map size={20} className="text-blue-600" />
                移動距離の目安を見る
              </button>
            </div>
          </div>
        )}

        {isDrawing && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-xl font-bold text-slate-600 animate-pulse">抽選中...</p>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto mt-8 p-4 bg-red-50 text-red-700 rounded-lg text-center border border-red-200">
            {error}
            <button
              onClick={() => setError(null)}
              className="block mx-auto mt-2 text-sm underline hover:no-underline"
            >
              戻る
            </button>
          </div>
        )}

        {myTeam && drawResult && !isDrawing && (
          <>
            <DrawResult
              myTeam={myTeam}
              result={drawResult}
              onReset={handleReset}
              onReDraw={handleReDraw}
            />
            <FullDrawView result={drawResult} />
          </>
        )}

        {/* Distance Guide Modal */}
        {showDistanceGuide && (
          <DistanceGuide onClose={() => setShowDistanceGuide(false)} />
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">2026 FIFA World Cup Draw Simulator</p>
          <p className="text-sm">Unofficial fan project. Not affiliated with FIFA.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
