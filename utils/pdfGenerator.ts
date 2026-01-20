
import { numberToWords } from './currency';

export const exportToPdf = async (
  base: number[], 
  conf: number[], 
  financialData: any, 
  games: number[][],
  hits: Record<number, number>,
  concursoNumber?: number | null
) => {
  const jspdfModule = (window as any).jspdf;
  if (!jspdfModule || !jspdfModule.jsPDF) {
    console.error("Biblioteca jsPDF não encontrada.");
    return;
  }
  const { jsPDF } = jspdfModule;

  const doc = new jsPDF();
  const R_PURPLE = 147, G_PURPLE = 0, B_PURPLE = 137;
  const TXT_GREY = 60;
  const SITE_URL = "https://lotofacilpremium.netlify.app/";

  const now = new Date();
  const dateTimeStr = `${now.toLocaleDateString('pt-BR')} - ${now.toLocaleTimeString('pt-BR')}`;

  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const filename = `Fechamento-lotofacil-premium-${dd}${mm}${yyyy}-${hh}${min}${ss}.pdf`;

  // Header Rect
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

  let y = 34;
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
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("Nenhum resultado selecionado para conferência automática.", 14, y);
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
  doc.text(`* Custo Total (50 Jogos): ${financialData.custo}`, 14, y); y += 6;
  
  if (conf.length > 0) {
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
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("(Premiações e lucro não calculados - Fechamento não conferido)", 14, y);
    y += 10;
  }

  // 4. RESUMO DE ACERTOS
  drawTitle("4. RESUMO DE ACERTOS");
  
  if (conf.length === 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(TXT_GREY, TXT_GREY, TXT_GREY);
    doc.text("Atenção: Este fechamento ainda não foi conferido com um resultado oficial.", 14, y);
    y += 10;
  } else {
    const resumoItems = [];
    for (let i = 11; i <= 15; i++) {
      if (hits[i] && hits[i] > 0) {
        resumoItems.push(`${i} Acertos (x ${hits[i]})`);
      }
    }
    if (resumoItems.length > 0) {
      doc.setFontSize(9);
      doc.text(resumoItems.join(" | "), 14, y);
      y += 10;
    } else {
      doc.text("Nenhuma premiação identificada.", 14, y);
      y += 10;
    }
  }

  // 5. JOGOS GERADOS
  drawTitle("5. JOGOS GERADOS", 6);
  const rows = games.map((game, i) => {
    const hitsCount = conf.length > 0 ? game.filter(n => conf.includes(n)).length : 0;
    const gameString = game.map(n => n.toString().padStart(2, '0')).join(' - ');
    return [(i + 1).toString().padStart(2, '0'), gameString, hitsCount >= 11 ? `${hitsCount} ACERTOS` : '-'];
  });

  (doc as any).autoTable({
    startY: y,
    head: [['#', 'DEZENAS DO JOGO', 'STATUS']],
    body: rows,
    theme: 'striped',
    styles: { fontSize: 10, cellPadding: 1.2 }, 
    headStyles: { fillColor: [R_PURPLE, G_PURPLE, B_PURPLE], halign: 'center' },
    columnStyles: { 0: { halign: 'center', cellWidth: 10 }, 1: { halign: 'center', fontStyle: 'bold' }, 2: { halign: 'center', cellWidth: 40 } },
    margin: { bottom: 12 }, 
    rowPageBreak: 'avoid',
    didParseCell: (data: any) => {
      if (data.section === 'body' && data.column.index === 2) {
        const textValue = data.cell.text ? data.cell.text[0] : '';
        if (textValue === '14 ACERTOS' || textValue === '15 ACERTOS') {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.textColor = [R_PURPLE, G_PURPLE, B_PURPLE];
        }
      }
    },
    didDrawCell: (data: any) => {
      if (data.section === 'body' && data.column.index === 1) {
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
          const isHit = conf.length > 0 && conf.includes(parseInt(numStr));
          doc.setTextColor(isHit ? R_PURPLE : TXT_GREY, isHit ? G_PURPLE : TXT_GREY, isHit ? B_PURPLE : TXT_GREY);
          doc.text(numStr, currentX, cellY + (cellH / 2) + 1.2);
          currentX += doc.getTextWidth(numStr);
          if (idx < dezenasStr.length - 1) {
            doc.setTextColor(TXT_GREY, TXT_GREY, TXT_GREY);
            doc.text(" - ", currentX, cellY + (cellH / 2) + 1.2);
            currentX += doc.getTextWidth(" - ");
          }
        });
      }
    }
  });

  // 6. INFORMAÇÕES ADICIONAIS
  y = (doc as any).lastAutoTable.finalY + 10;
  if (y > 240) { doc.addPage(); y = 30; }
  drawTitle("6. INFORMAÇÕES ADICIONAIS");
  doc.setFontSize(9);
  const infoText = "A principal vantagem de utilizar um fechamento com 19 números está na redução significativa do risco matemático. Enquanto uma aposta simples de 15 números tem probabilidade de acerto de 1 em 3.268.760, ao selecionar 19 dezenas você cobre um universo que equivale a 3.876 combinações possíveis. Com isso, a chance de os 15 números sorteados estarem dentro do seu grupo de 19 é de 1 em 843 — uma melhora expressiva. Este fechamento de 50 jogos distribui estrategicamente suas dezenas para maximizar as possibilidades de premiação e otimizar o retorno do investimento. Em vez de depender exclusivamente da sorte, você transforma sua aposta em uma abordagem mais inteligente e eficiente, ideal para quem joga com regularidade.";
  doc.text(infoText, 14, y, { maxWidth: 182, align: 'justify' });

  // Paginacao e Headers/Footers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Header URL (canto superior direito)
    doc.setFontSize(9);
    if (i === 1) {
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setTextColor(TXT_GREY, TXT_GREY, TXT_GREY);
    }
    doc.text(SITE_URL, 196, 10, { align: "right" });

    // Rodapé
    doc.setTextColor(TXT_GREY, TXT_GREY, TXT_GREY);
    doc.setFontSize(9);
    
    // Paginação no canto inferior esquerdo
    doc.text(`Página ${i} de ${pageCount}`, 14, 290);
    
    // Copyright no centro
    doc.text("© 2026 Lotofacil Premium by André Miranda", 105, 290, { align: "center" });
    
    // Data/Hora no canto inferior direito
    doc.text(`${dateTimeStr}`, 196, 290, { align: "right" });
  }

  doc.save(filename);
};
