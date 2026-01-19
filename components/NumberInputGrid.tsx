
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
    // Permite apenas dígitos e limita a 2 caracteres
    const rawVal = e.target.value.replace(/\D/g, '').slice(0, 2);
    
    // Atualiza o estado imediatamente para que o usuário veja o que está digitando (ex: '1', '2')
    onChange(index, rawVal);

    // Se o usuário digitou os 2 dígitos, realizamos a validação e o auto-avanço
    if (rawVal.length === 2) {
      let num = parseInt(rawVal, 10);
      
      // Limites: de 01 a 25
      if (num > 25) num = 25;
      if (num < 1) num = 1;

      const formatted = num.toString().padStart(2, '0');

      // Verifica se o número já existe em OUTRO campo
      const isDuplicate = values.some((v, i) => i !== index && v === formatted);
      
      if (isDuplicate) {
        // Se for duplicado, limpamos o campo para indicar erro
        onChange(index, '');
      } else {
        // Salva o valor formatado e avança o foco para o próximo input
        onChange(index, formatted);
        if (index < count - 1) {
          inputRefs.current[index + 1]?.focus();
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ao apertar Backspace em um campo vazio, volta para o campo anterior
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Navegação entre campos com as setas do teclado
    if (e.key === 'ArrowRight' && index < count - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleBlur = (index: number) => {
    const val = values[index];
    // Ao perder o foco, se o campo tiver apenas 1 dígito (ex: '5'), preenchemos como '05'
    if (val && val.length === 1) {
      const num = parseInt(val, 10);
      const padded = num.toString().padStart(2, '0');
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
        const n = parseInt(m, 10);
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
