
import React from 'react';

interface JogoCardProps {
  index: number;
  numbers: number[];
  results: number[];
  showResults: boolean;
  onCopy: (nums: number[]) => void;
}

const JogoCard: React.FC<JogoCardProps> = ({ index, numbers, results, showResults, onCopy }) => {
  const hits = numbers.filter(n => results.includes(n)).length;

  const getStatusColor = () => {
    if (!showResults) return 'text-[#930089]/40';
    if (hits === 15) return 'text-[#E20084]';
    if (hits >= 11) return 'text-[#930089]';
    return 'text-[#930089]/60';
  };

  return (
    <div className="bg-white border border-purple-100 rounded-xl p-3 shadow-sm border-l-4 border-l-[#930089]">
      <div className="flex justify-between items-center mb-3 text-xs font-bold text-[#930089]/60 uppercase tracking-wider">
        <span>Jogo {(index + 1).toString().padStart(2, '0')}</span>
        <button 
          onClick={() => onCopy(numbers)}
          className="px-2 py-1 bg-purple-50 hover:bg-purple-100 rounded text-[10px] text-[#930089] transition-colors font-bold"
        >
          Copiar
        </button>
      </div>
      <div className="flex flex-wrap gap-1 justify-center">
        {numbers.map(n => {
          const isHit = showResults && results.includes(n);
          return (
            <div 
              key={n}
              className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                isHit ? 'bg-[#930089] text-white' : 'bg-purple-100 text-[#930089]/80'
              }`}
            >
              {n.toString().padStart(2, '0')}
            </div>
          );
        })}
      </div>
      <div className={`mt-2 text-center font-bold text-sm ${getStatusColor()}`}>
        {showResults ? (hits >= 11 ? `${hits} ACERTOS!` : `${hits} ACERTOS`) : "-"}
      </div>
    </div>
  );
};

export default JogoCard;
