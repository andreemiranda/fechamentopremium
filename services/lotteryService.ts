
import { LotteryResult } from '../types';

const API_URLS = [
  'https://lottolookup.com.br/public/api/lotofacil',
  'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil'
];

export const fetchLatestResult = async (): Promise<LotteryResult | null> => {
  try {
    const res = await fetch(API_URLS[0]);
    if (!res.ok) throw new Error("Fallback to primary");
    const json = await res.json();
    return normalizeLottoLookup(json);
  } catch (error) {
    try {
      const res = await fetch(API_URLS[1]);
      if (!res.ok) throw new Error("API Failure");
      const json = await res.json();
      return normalizeCaixa(json);
    } catch (error2) {
      console.error("All APIs failed", error2);
      return null;
    }
  }
};

const normalizeLottoLookup = (json: any): LotteryResult => {
  const data = Array.isArray(json) ? json[0] : json;
  const premios: Record<number, number> = {};
  if (data.premiacoes) {
    data.premiacoes.forEach((p: any) => {
      let acertos: number | null = null;
      if (p.descricao?.includes('15')) acertos = 15;
      else if (p.descricao?.includes('14')) acertos = 14;
      else if (p.descricao?.includes('13')) acertos = 13;
      else if (p.descricao?.includes('12')) acertos = 12;
      else if (p.descricao?.includes('11')) acertos = 11;
      else if (p.faixa === 1) acertos = 15;
      if (acertos) premios[acertos] = parseFloat(p.valor_premio || p.premio || 0);
    });
  }
  return {
    numero: data.concurso,
    dezenas: data.dezenas,
    premios,
    data: data.data_concurso || data.data
  };
};

const normalizeCaixa = (json: any): LotteryResult => {
  const premios: Record<number, number> = {};
  if (json.listaRateioPremio) {
    json.listaRateioPremio.forEach((p: any) => {
      let acertos = 0;
      if (p.faixa === 1) acertos = 15;
      if (p.faixa === 2) acertos = 14;
      if (p.faixa === 3) acertos = 13;
      if (p.faixa === 4) acertos = 12;
      if (p.faixa === 5) acertos = 11;
      if (acertos > 0) premios[acertos] = p.valorPremio;
    });
  }
  return {
    numero: json.numero,
    dezenas: json.listaDezenas,
    premios,
    data: json.dataApuracao
  };
};
