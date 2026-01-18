
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ApiStatus, 
  LotteryResult, 
  FinancialState, 
  Stats 
} from './types';
import { fetchLatestResult } from './services/lotteryService';
import { generateGamesFromBase } from './utils/gameLogic';
import { 
  formatCurrency, 
  parseCurrencyString, 
  formatCurrencyInput 
} from './utils/currency';
import { exportToPdf } from './utils/pdfGenerator';
import NumberInputGrid from './components/NumberInputGrid';
import JogoCard from './components/JogoCard';
import WelcomeScreen from './components/WelcomeScreen';

const App: React.FC = () => {
  // States
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [baseNumbers, setBaseNumbers] = useState<string[]>(Array(19).fill(''));
  const [resultNumbers, setResultNumbers] = useState<string[]>(Array(15).fill(''));
  const [games, setGames] = useState<number[][]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>('loading');
  const [latestConcurso, setLatestConcurso] = useState<LotteryResult | null>(null);
  const [financial, setFinancial] = useState<FinancialState>({
    valorAposta: 'R$ 3,50',
    v11: 'R$ 7,00',
    v12: 'R$ 14,00',
    v13: 'R$ 35,00',
    v14: 'R$ 2.360,79',
    v15: 'R$ 3.733.907,79',
  });
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  // Load Initial API Data
  useEffect(() => {
    handleFetchApi();
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  }, []);

  const handleFetchApi = async () => {
    setApiStatus('loading');
    const result = await fetchLatestResult();
    if (result) {
      setLatestConcurso(result);
      setApiStatus('online');
      setResultNumbers(result.dezenas.map(d => d.toString().padStart(2, '0')));
      setFinancial(prev => ({
        ...prev,
        v11: result.premios[11] ? formatCurrency(result.premios[11]) : prev.v11,
        v12: result.premios[12] ? formatCurrency(result.premios[12]) : prev.v12,
        v13: result.premios[13] ? formatCurrency(result.premios[13]) : prev.v13,
        v14: result.premios[14] ? formatCurrency(result.premios[14]) : prev.v14,
        v15: result.premios[15] ? formatCurrency(result.premios[15]) : prev.v15,
      }));
      showToast(`Último Concurso ${result.numero} carregado!`);
    } else {
      setApiStatus('offline');
      showToast("Erro ao obter dados da API.");
    }
  };

  const handleBaseChange = (idx: number, val: string) => {
    const newBase = [...baseNumbers];
    newBase[idx] = val;
    setBaseNumbers(newBase);
    setShowResults(false);
  };

  const handleBasePaste = (values: string[]) => {
    const newBase = Array(19).fill('');
    values.forEach((v, i) => { if (i < 19) newBase[i] = v; });
    setBaseNumbers(newBase);
    setShowResults(false);
    showToast(`Números base preenchidos!`);
  };

  const handleResultChange = (idx: number, val: string) => {
    const newRes = [...resultNumbers];
    newRes[idx] = val;
    setResultNumbers(newRes);
    setShowResults(false);
  };

  const handleResultPaste = (values: string[]) => {
    const newRes = Array(15).fill('');
    values.forEach((v, i) => { if (i < 15) newRes[i] = v; });
    setResultNumbers(newRes);
    setShowResults(false);
    showToast(`Resultado preenchido!`);
  };

  const generateAleatorios = () => {
    const nums = new Set<number>();
    while (nums.size < 19) nums.add(Math.floor(Math.random() * 25) + 1);
    const sorted = Array.from(nums).sort((a, b) => a - b);
    setBaseNumbers(sorted.map(n => n.toString().padStart(2, '0')));
    setShowResults(false);
    showToast("Números aleatórios gerados!");
  };

  const handleGenerateGames = () => {
    const baseClean = baseNumbers.filter(n => n !== '').map(n => parseInt(n));
    if (baseClean.length !== 19) {
      showToast("Preencha os 19 números base!");
      return;
    }
    const generated = generateGamesFromBase(baseClean);
    setGames(generated);
    setShowResults(false);
    showToast("50 Jogos Gerados!");
  };

  const handleClear = () => {
    setBaseNumbers(Array(19).fill(''));
    setResultNumbers(Array(15).fill(''));
    setGames([]);
    setShowResults(false);
    showToast("Campos limpos!");
  };

  const copyBase = () => {
    const text = baseNumbers.filter(n => n !== '').join(' ');
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast("Números base copiados!");
  };

  const copyResult = () => {
    const text = resultNumbers.filter(n => n !== '').join(' ');
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast("Resultado copiado!");
  };

  const handleConferir = () => {
    const resInt = resultNumbers.filter(n => n !== '').map(n => parseInt(n));
    if (resInt.length !== 15) {
      showToast("Preencha os 15 números do resultado!");
      return;
    }
    if (games.length === 0) {
      showToast("Gere os jogos primeiro!");
      return;
    }
    setShowResults(true);
    showToast("Conferência realizada!");
  };

  const stats = useMemo(() => {
    const s: Stats = { 11: 0, 12: 0, 13: 0, 14: 0, 15: 0 };
    const resInt = resultNumbers.filter(n => n !== '').map(n => parseInt(n));
    if (resInt.length !== 15) return s;

    games.forEach(game => {
      const hits = game.filter(n => resInt.includes(n)).length;
      if (hits >= 11 && hits <= 15) {
        s[hits as keyof Stats]++;
      }
    });
    return s;
  }, [games, resultNumbers]);

  const financialSummary = useMemo(() => {
    const vAposta = parseCurrencyString(financial.valorAposta);
    const custo = vAposta * 50;
    let premio = 0;
    premio += stats[11] * parseCurrencyString(financial.v11);
    premio += stats[12] * parseCurrencyString(financial.v12);
    premio += stats[13] * parseCurrencyString(financial.v13);
    premio += stats[14] * parseCurrencyString(financial.v14);
    premio += stats[15] * parseCurrencyString(financial.v15);
    const lucro = premio - custo;
    return {
      custo: formatCurrency(custo),
      premio: formatCurrency(premio),
      lucro: formatCurrency(lucro),
      lucroValue: lucro
    };
  }, [financial, stats]);

  const handlePdfExport = () => {
    const baseInt = baseNumbers.map(n => parseInt(n)).filter(n => !isNaN(n));
    const resInt = resultNumbers.map(n => parseInt(n)).filter(n => !isNaN(n));
    
    const isOfficialResult = latestConcurso && 
      latestConcurso.dezenas.every(d => resultNumbers.includes(d.toString().padStart(2, '0')));
    
    exportToPdf(
      baseInt, 
      resInt, 
      financialSummary, 
      games, 
      stats, 
      isOfficialResult ? latestConcurso.numero : null
    );
  };

  return (
    <>
      <WelcomeScreen onFinish={() => setShowIntro(false)} />
      
      {!showIntro && (
        <div className="max-w-4xl mx-auto p-4 md:py-10 animate-in fade-in duration-700">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-screen">
            
            {/* Header */}
            <header className="bg-[#930089] text-white p-6 text-center border-b-4 border-[#E20084] relative">
              <h1 className="text-2xl md:text-3xl font-bold">Lotofácil Premium</h1>
              <p className="mt-2 text-xs md:text-sm opacity-90">Fechamento Inteligente 19 → 15 → 50 Jogos</p>
              <p className="mt-1 text-[10px] md:text-xs opacity-75">Garantia de premiações múltiplas caso os 15 sorteados estejam entre seus 19.</p>
              
              <div className="absolute top-2 right-2 bg-white/20 px-3 py-1 rounded-full flex items-center gap-2 text-[10px]">
                <span className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-[#00FF00]' : 'bg-purple-400'}`}></span>
                <span>{apiStatus === 'online' ? 'API Online' : apiStatus === 'loading' ? 'Buscando...' : 'Offline'}</span>
              </div>
            </header>

            {/* Section 1: Base Numbers */}
            <section className="p-5 md:p-8 border-b border-purple-100">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-[#930089] font-bold text-lg">1. Escolha 19 Números Base</h3>
              </div>
              <NumberInputGrid 
                count={19} 
                prefix="base" 
                values={baseNumbers} 
                onChange={handleBaseChange} 
                onPaste={handleBasePaste}
              />
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button onClick={handleGenerateGames} className="bg-[#930089] text-white px-5 py-2.5 rounded-full font-bold hover:bg-[#72006a] transition-all shadow-md active:scale-95 text-sm">⚡ Gerar Jogos</button>
                <button onClick={generateAleatorios} className="bg-[#E20084] text-white px-5 py-2.5 rounded-full font-bold hover:bg-[#c10070] transition-all shadow-md active:scale-95 text-sm">🎲 Aleatórios</button>
                <button onClick={copyBase} className="bg-[#bc00ae] text-white px-5 py-2.5 rounded-full font-bold hover:bg-[#9e0093] transition-all shadow-md text-sm">📋 Copiar Base</button>
                <button onClick={handleClear} className="bg-[#5e0057] text-white px-5 py-2.5 rounded-full font-bold hover:bg-[#4a0045] transition-all text-sm">🗑️ Limpar</button>
              </div>
            </section>

            {/* Section 2: Conferencia */}
            <section className="p-5 md:p-8 border-b border-purple-100 bg-purple-50/20">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-[#930089] font-bold text-lg">2. Conferir Resultado (15 Números)</h3>
              </div>
              <NumberInputGrid 
                count={15} 
                prefix="conf" 
                values={resultNumbers} 
                onChange={handleResultChange} 
                onPaste={handleResultPaste}
              />
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button onClick={handleConferir} className="bg-[#930089] text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-md text-sm">🔍 Conferir</button>
                <button onClick={handleFetchApi} className="bg-[#E20084] text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-md text-sm flex items-center gap-2">
                  🔄 {apiStatus === 'loading' ? 'Buscando...' : 'Resultado Oficial'}
                </button>
                <button onClick={copyResult} className="bg-[#bc00ae] text-white px-5 py-2.5 rounded-full font-bold text-sm">📋 Copiar Resultado</button>
              </div>
            </section>

            {/* Financial Panel - Only visible after Clicking "Conferir" */}
            {showResults && games.length > 0 && (
              <section className="m-5 md:m-8 p-6 bg-purple-50 border border-purple-200 rounded-2xl shadow-sm animate-in fade-in duration-500">
                <div className="text-left mb-4">
                  <h3 className="text-[#930089] font-bold text-lg inline-block">3. Calculadora de Prêmios 🏆</h3>
                  <p className="text-[10px] text-purple-600 mt-1 font-semibold">
                    Última Atualização: Conc. 3590 (17/01/2026) | Fonte: Caixa Econômica Federal
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-xl border border-purple-100 flex flex-col items-center shadow-sm">
                    <label className="text-[10px] text-[#930089] uppercase font-bold mb-1">Valor da Aposta (Unitário)</label>
                    <input 
                      type="text" 
                      className="w-full text-center font-bold text-[#930089] border border-purple-200 p-2 rounded-lg bg-white outline-none focus:ring-2 focus:ring-purple-300 transition-all"
                      value={financial.valorAposta}
                      onChange={(e) => setFinancial({ ...financial, valorAposta: formatCurrencyInput(e.target.value) })}
                    />
                  </div>
                  <div className="bg-[#930089] p-4 rounded-xl text-white flex items-center justify-center font-bold shadow-md">
                    Custo Total (50 Jogos): {financialSummary.custo}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                  {[11, 12, 13, 14, 15].map(hit => (
                    <div key={hit} className="bg-white p-3 rounded-xl border border-purple-100 text-center flex flex-col items-center shadow-sm">
                      <label className="text-[9px] text-[#930089] uppercase mb-1 font-bold">
                        {hit} Acertos (x <strong>{stats[hit as keyof Stats]}</strong>)
                      </label>
                      <input 
                        type="text" 
                        className="w-full text-center font-bold text-[#E20084] border border-purple-100 p-1.5 rounded-lg text-xs bg-white outline-none transition-all"
                        value={financial[`v${hit}` as keyof FinancialState]}
                        onChange={(e) => setFinancial({ ...financial, [`v${hit}` as keyof FinancialState]: formatCurrencyInput(e.target.value) })}
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl p-5 text-center border-2 border-dashed border-[#930089] shadow-inner">
                  <div className="text-[#930089] font-bold text-lg">Prêmio Bruto: {financialSummary.premio}</div>
                  <div className={`mt-2 py-3 px-4 rounded-xl font-black text-xl md:text-2xl ${financialSummary.lucroValue >= 0 ? 'bg-[#930089]/10 text-[#930089]' : 'bg-[#E20084]/10 text-[#E20084]'}`}>
                    Lucro Líquido: {financialSummary.lucro}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  <button onClick={handlePdfExport} className="bg-[#930089] text-white px-6 py-3 rounded-full font-bold hover:bg-[#4a0045] transition-all flex items-center gap-2 shadow-lg">
                    🖨️ Download PDF
                  </button>
                </div>
              </section>
            )}

            {/* Games Grid Section */}
            {games.length > 0 && (
              <section className="p-5 md:p-8 bg-purple-50/10">
                <h3 className="text-[#930089] font-bold text-lg mb-5 text-center md:text-left">4. Jogos Gerados</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {games.map((nums, i) => (
                    <JogoCard 
                      key={i} 
                      index={i} 
                      numbers={nums} 
                      results={resultNumbers.filter(n => n !== '').map(n => parseInt(n))} 
                      showResults={showResults}
                      onCopy={(ns) => {
                        navigator.clipboard.writeText(ns.join(' '));
                        showToast("Jogo copiado!");
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Footer */}
            <footer className="mt-auto bg-purple-50 p-6 text-center border-t border-purple-100 text-[10px] md:text-xs text-[#930089]/70 space-y-2">
              <p>@ 2026 Lotofacil Premium by André Miranda</p>
              <p className="italic text-purple-400">Este projeto não é afiliado à Caixa Econômica Federal. Use por sua conta e risco.</p>
            </footer>
          </div>

          {/* Floating Action Button for Print */}
          {games.length > 0 && (
            <button 
              onClick={handlePdfExport}
              className="fixed bottom-6 right-6 w-14 h-14 bg-[#930089] text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all z-50 md:hidden"
            >
              🖨️
            </button>
          )}

          {/* Toast Notification */}
          <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#930089] text-white px-6 py-3 rounded-full text-sm shadow-xl transition-all duration-300 z-[100] ${toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
            {toast.message}
          </div>
        </div>
      )}
    </>
  );
};

export default App;
