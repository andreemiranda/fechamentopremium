
import { numberToWords } from './currency';

export const exportToPdf = async (
  base: number[], 
  conf: number[], 
  financialData: any, 
  games: number[][],
  hits: Record<number, number>,
  concursoNumber?: number | null
) => {
  const { jsPDF } = (window as any).jspdf;
  if (!jsPDF) return;

  // A4: 210 x 297 mm
  const doc = new jsPDF();
  const R_PURPLE = 147, G_PURPLE = 0, B_PURPLE = 137;
  const TXT_GREY = 60;

  const now = new Date();
  const dateTimeStr = `${now.toLocaleDateString('pt-BR')} - ${now.toLocaleTimeString('pt-BR')}`;

  // Header
  doc.setFillColor(R_PURPLE, G_PURPLE, B_PURPLE);
  doc.rect(0, 0, 210, 26, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("Fechamento Inteligente Lotofácil 19 -> 15 -> 50", 105, 7, { align: "center" });
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("LOTOFÁCIL PREMIUM", 105, 16, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Garantia de premiações múltiplas com 19 dezenas selecionadas estrategicamente", 105, 23, { align: "center" });

  let y = 34; // Começando um pouco mais acima
  const drawTitle = (text: string, customGap = 12) => {
    doc.setFontSize(12);
    doc.setTextColor(R_PURPLE, G_PURPLE, B_PURPLE);
    doc.setFont("helvetica", "bold");
    doc.text(text, 14, y);
    doc.setDrawColor(R_PURPLE, G_PURPLE, B_PURPLE);
    doc.setLineWidth(0.5);
    doc.line(14, y + 2, 196, y + 2);
    y += customGap; 
    doc.setTextColor(TXT_GREY, TXT_GREY, TXT_GREY);
    doc.setFont("helvetica", "normal");
  };

  // 1. Números Base
  drawTitle("1. NÚMEROS BASE (19 Escolhidos)");
  if (base.length === 0) {
    doc.text("Nenhum número base selecionado.", 14, y);
    y += 10;
  } else {
    doc.setFontSize(10);
    let xBase = 14;
    [...base].sort((a, b) => a - b).forEach(n => {
      if (xBase > 180) { xBase = 14; y += 10; }
      const txt = n.toString().padStart(2, '0');
      doc.setFillColor(R_PURPLE, G_PURPLE, B_PURPLE);
      doc.circle(xBase + 3, y - 1, 4, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(txt, xBase + 3, y + 0.3, { align: 'center' });
      xBase += 10;
    });
    y += 12;
  }

  // 2. Resultado Conferido
  const resultTitle = concursoNumber 
    ? `2. RESULTADO CONFERIDO (Concurso nº ${concursoNumber})` 
    : "2. RESULTADO CONFERIDO";
  drawTitle(resultTitle);

  if (conf.length === 0) {
    doc.text("Nenhum resultado inserido para conferência.", 14, y);
    y += 10;
  } else {
    let xConf = 14;
    [...conf].sort((a, b) => a - b).forEach(n => {
      const txt = n.toString().padStart(2, '0');
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(R_PURPLE, G_PURPLE, B_PURPLE);
      doc.circle(xConf + 3, y - 1, 4, 'FD');
      doc.setTextColor(R_PURPLE, G_PURPLE, B_PURPLE);
      doc.setFont("helvetica", "bold");
      doc.text(txt, xConf + 3, y + 0.3, { align: 'center' });
      xConf += 10;
    });
    y += 12;
  }

  // 3. Resumo Financeiro
  drawTitle("3. RESUMO FINANCEIRO");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`* Custo Total (50 Jogos): ${financialData.custo}`, 14, y); y += 6;
  doc.text(`* Prêmio Bruto: ${financialData.premio}`, 14, y); y += 6;
  doc.setFont("helvetica", "bold");
  doc.text(`* Lucro Líquido: ${financialData.lucro}`, 14, y);
  doc.setFont("helvetica", "normal");
  y += 6;

  if (financialData.lucroValue > 0) {
    const extenso = numberToWords(financialData.lucroValue);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120);
    const splitExtenso = doc.splitTextToSize(`(${extenso})`, 180);
    doc.text(splitExtenso, 14, y);
    y += (splitExtenso.length * 5) + 4; 
  } else {
    y += 6;
  }

  // 4. RESUMO DE ACERTOS
  drawTitle("4. RESUMO DE ACERTOS");
  const resumoItems = [];
  for (let i = 11; i <= 15; i++) {
    if (hits[i] && hits[i] > 0) {
      resumoItems.push(`${i} Acertos (x ${hits[i]})`);
    }
  }
  if (resumoItems.length > 0) {
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(resumoItems.join(" | "), 14, y);
    y += 10;
  } else {
    doc.text("Nenhuma premiação identificada.", 14, y);
    y += 10;
  }

  // 5. JOGOS GERADOS
  // Reduzindo o espaço entre o título 5 e o início dos jogos
  drawTitle("5. JOGOS GERADOS", 6);
  
  const rows = games.map((game, i) => {
    const hitsCount = game.filter(n => conf.includes(n)).length;
    const gameString = game.map(n => n.toString().padStart(2, '0')).join(' - ');
    return [
      (i + 1).toString().padStart(2, '0'), 
      gameString, 
      hitsCount >= 11 ? `${hitsCount} ACERTOS` : '-'
    ];
  });

  doc.autoTable({
    startY: y,
    head: [['#', 'DEZENAS DO JOGO', 'STATUS']],
    body: rows,
    theme: 'striped',
    styles: { fontSize: 10, cellPadding: 1.2 }, // Reduzindo padding para caber mais jogos
    headStyles: { fillColor: [R_PURPLE, G_PURPLE, B_PURPLE], halign: 'center' },
    columnStyles: { 
      0: { halign: 'center', cellWidth: 10 }, 
      1: { halign: 'center', fontStyle: 'bold' }, 
      2: { halign: 'center', cellWidth: 40 } 
    },
    margin: { bottom: 12 }, // Margem reduzida para caber até o jogo 42 na primeira página
    rowPageBreak: 'avoid',
    didDrawCell: (data: any) => {
      // Destaque nos números sorteados
      if (data.section === 'body' && data.column.index === 1 && conf.length > 0) {
        const game = games[data.row.index];
        const cellX = data.cell.x;
        const cellY = data.cell.y;
        const cellW = data.cell.width;
        const cellH = data.cell.height;
        
        doc.setFillColor(data.row.index % 2 === 0 ? 255 : 248, 248, 255);
        doc.rect(cellX + 0.2, cellY + 0.2, cellW - 0.4, cellH - 0.4, 'F');
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");

        const dezenasStr = game.map(d => d.toString().padStart(2, '0'));
        let currentX = cellX + (cellW / 2) - (doc.getTextWidth(dezenasStr.join(' - ')) / 2);
        
        dezenasStr.forEach((numStr, idx) => {
          const isHit = conf.includes(parseInt(numStr));
          if (isHit) {
            doc.setTextColor(R_PURPLE, G_PURPLE, B_PURPLE); 
          } else {
            doc.setTextColor(TXT_GREY, TXT_GREY, TXT_GREY);
          }
          
          doc.text(numStr, currentX, cellY + (cellH / 2) + 1.2);
          currentX += doc.getTextWidth(numStr);
          
          if (idx < dezenasStr.length - 1) {
            doc.setTextColor(TXT_GREY, TXT_GREY, TXT_GREY);
            const separator = " - ";
            doc.text(separator, currentX, cellY + (cellH / 2) + 1.2);
            currentX += doc.getTextWidth(separator);
          }
        });
      }
      
      // Destaque na coluna STATUS para 14 e 15 Acertos: Negrito e Roxo
      if (data.section === 'body' && data.column.index === 2 && conf.length > 0) {
        const text = data.cell.text[0];
        if (text && (text.includes('14') || text.includes('15'))) {
          doc.setTextColor(R_PURPLE, G_PURPLE, B_PURPLE);
          doc.setFont("helvetica", "bold");
          // Re-renderizando o texto em negrito (o autoTable renderiza o texto original primeiro)
          const cellX = data.cell.x;
          const cellY = data.cell.y;
          const cellW = data.cell.width;
          const cellH = data.cell.height;
          
          // Limpa fundo para o texto negrito
          doc.setFillColor(data.row.index % 2 === 0 ? 255 : 248, 248, 255);
          doc.rect(cellX + 0.5, cellY + 0.5, cellW - 1, cellH - 1, 'F');
          
          doc.text(text, cellX + (cellW / 2), cellY + (cellH / 2) + 1.2, { align: 'center' });
        }
      }
    }
  });

  // 6. INFORMAÇÕES ADICIONAIS
  y = doc.lastAutoTable.finalY + 10;
  
  if (y > 240) {
    doc.addPage();
    y = 30;
  }

  drawTitle("6. INFORMAÇÕES ADICIONAIS");
  doc.setFontSize(9);
  doc.setTextColor(TXT_GREY, TXT_GREY, TXT_GREY);
  
  const infoText = "A principal vantagem de utilizar um fechamento com 19 números está na redução significativa do risco matemático. Enquanto uma aposta simples de 15 números tem probabilidade de acerto de 1 em 3.268.760, ao selecionar 19 dezenas você cobre um universo que equivale a 3.876 combinações possíveis. Com isso, a chance de os 15 números sorteados estarem dentro do seu grupo de 19 é de 1 em 843 — uma melhora expressiva. Este fechamento de 50 jogos distribui estrategicamente suas dezenas para maximizar as possibilidades de premiação e otimizar o retorno do investimento. Em vez de depender exclusivamente da sorte, você transforma sua aposta em uma abordagem mais inteligente e eficiente, ideal para quem joga com regularidade.";

  doc.text(infoText, 14, y, { maxWidth: 182, align: 'justify' });

  // Footers
  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(`Gerado em: ${dateTimeStr}`, 14, 290);
    doc.text("@ 2026 Lotofacil Premium by André Miranda", 105, 290, { align: "center" });
    doc.text(`Página ${i} de ${pageCount}`, 196, 290, { align: "right" });
  }

  doc.save('Relatorio_Lotofacil_Premium_50_Jogos.pdf');
};
