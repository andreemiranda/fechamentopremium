
import React, { useEffect, useState } from 'react';

interface WelcomeScreenProps {
  onFinish: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Sequência de animação
    const timers = [
      setTimeout(() => setStage(1), 100),   // Começa fade in
      setTimeout(() => setStage(2), 2500),  // Começa fade out
      setTimeout(() => {
        setIsVisible(false);
        onFinish();
      }, 3000) // Finaliza
    ];

    return () => timers.forEach(t => clearTimeout(t));
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[1000] flex items-center justify-center bg-[#4a0045] transition-opacity duration-500 ${stage >= 2 ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`text-center transform transition-all duration-1000 ${stage === 1 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
        
        {/* Logo SVG Premium */}
        <div className="mb-6 relative inline-block">
          <div className="absolute inset-0 bg-[#E20084] blur-2xl opacity-20 animate-pulse"></div>
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative drop-shadow-2xl">
            <circle cx="50" cy="50" r="48" fill="url(#grad1)" stroke="white" strokeWidth="1" />
            <path d="M35 25V75H65" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="65" cy="40" r="12" fill="#E20084" />
            <text x="65" y="44" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="Arial">19</text>
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#930089', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#4a0045', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className="text-white text-4xl md:text-5xl font-black tracking-tighter mb-2">
          LOTOFÁCIL <span className="text-[#E20084]">PREMIUM</span>
        </h1>
        <div className="w-24 h-1 bg-[#E20084] mx-auto rounded-full mb-4"></div>
        <p className="text-purple-200 text-sm md:text-base font-medium opacity-80">
          Fechamento Inteligente & Gestão Financeira
        </p>

        <div className="mt-12 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-[#E20084] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-[#E20084] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-[#E20084] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
