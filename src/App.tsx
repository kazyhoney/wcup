import { useState } from 'react';
import { TeamSelector } from './components/TeamSelector';
import { DrawResult } from './components/DrawResult';
import { FullDrawView } from './components/FullDrawView';
import type { Team } from './data/teams';
import { simulateDraw, type GroupResult } from './utils/drawLogic';
import { Loader2 } from 'lucide-react';

function App() {
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [drawResult, setDrawResult] = useState<GroupResult[] | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectTeam = async (team: Team) => {
    setMyTeam(team);
    setIsDrawing(true);
    setError(null);

    // Simulate delay for effect
    setTimeout(() => {
      try {
        const result = simulateDraw(team.id);
        setDrawResult(result);
      } catch (e) {
        console.error(e);
        setError('Failed to generate a valid draw. Please try again.');
      } finally {
        setIsDrawing(false);
      }
    }, 800);
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
      {/* Header / Nav could go here */}

      <main className="container mx-auto px-4 py-8">
        {!myTeam && !isDrawing && (
          <TeamSelector onSelect={handleSelectTeam} />
        )}

        {isDrawing && (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={64} />
            <h2 className="2xl font-bold text-slate-700">抽選中...</h2>
            <p className="text-slate-500">運命の瞬間です。</p>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto bg-red-50 text-red-600 p-4 rounded-lg text-center mb-8">
            {error}
            <button onClick={handleReset} className="block mx-auto mt-2 text-sm font-bold underline">
              やり直す
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
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p className="mb-2">2026 FIFA World Cup Draw Simulator</p>
          <p>Unofficial fan project. Not affiliated with FIFA.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
