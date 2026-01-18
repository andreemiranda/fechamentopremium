
import React, { useRef, useEffect } from 'react';

interface NumberInputGridProps {
  count: number;
  values: string[];
  onChange: (index: number, value: string) => void;
  onPaste: (values: string[]) => void;
  prefix: string;
}

const NumberInputGrid: React.FC<NumberInputGridProps> = ({ count, values, onChange, onPaste, prefix }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, count);
  }, [count]);

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 2);
    
    // Validação de intervalo 01-25
    if (val.length === 2) {
      const num = parseInt(val);
      if (num < 1) val = '01';
      if (num > 25) val = '25';
    }

    // Prevenir duplicados
    if (val.length > 0) {
      const isDuplicate = values.some((v, i) => i !== index && v === (val.length === 1 ? val.padStart(2, '0') : val));
      if (isDuplicate) {
        // Se for duplicado, limpa o campo
        onChange(index, '');
        return;
      }
    }

    onChange(index, val);

    if (val.length === 2) {
      if (index < count - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleBlur = (index: number) => {
    let val = values[index];
    if (val && val.length === 1) {
      const padded = val.padStart(2, '0');
      // Verifica duplicado após o padding também
      const isDuplicate = values.some((v, i) => i !== index && v === padded);
      onChange(index, isDuplicate ? '' : padded);
    }
  };

  const handlePasteEvent = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const matches = pastedText.match(/\d+/g);
    if (matches) {
      const uniqueNumbers: string[] = [];
      matches.forEach(m => {
        const n = parseInt(m);
        if (n >= 1 && n <= 25) {
          const s = n.toString().padStart(2, '0');
          if (!uniqueNumbers.includes(s)) {
            uniqueNumbers.push(s);
          }
        }
      });
      onPaste(uniqueNumbers);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <input
          key={`${prefix}-${i}`}
          ref={el => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={2}
          placeholder={(i + 1).toString().padStart(2, '0')}
          onPaste={handlePasteEvent}
          className={`w-10 h-10 md:w-11 md:h-11 rounded-full border-2 bg-white text-center font-bold focus:ring-2 transition-all outline-none text-sm md:text-base shadow-sm 
            ${prefix === 'base' ? 'border-purple-300 text-[#930089] focus:border-[#E20084] focus:ring-[#E20084]/20' : 'border-purple-200 text-[#72006a] focus:border-[#930089] focus:ring-[#930089]/20'}`}
          value={values[i] || ''}
          onChange={(e) => handleInputChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onBlur={() => handleBlur(i)}
          autoComplete="off"
        />
      ))}
    </div>
  );
};

export default NumberInputGrid;
