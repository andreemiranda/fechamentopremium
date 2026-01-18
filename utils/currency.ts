
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const parseCurrencyString = (str: string): number => {
  if (!str) return 0;
  const cleaned = str.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
  return parseFloat(cleaned) || 0;
};

export const formatCurrencyInput = (value: string): string => {
  let digits = value.replace(/\D/g, "");
  if (digits === "") return "";
  const num = (parseInt(digits) / 100).toFixed(2);
  const parts = num.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return "R$ " + parts.join(",");
};

export const numberToWords = (valor: number): string => {
  if (valor === 0) return "Zero reais";
  
  const unidades = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
  const dezenas = ["", "dez", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
  const onzeADezenove = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
  const centenas = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

  const getGroup = (n: number) => {
    let u = n % 10;
    let d = Math.floor((n % 100) / 10);
    let c = Math.floor(n / 100);
    let str: string[] = [];
    
    if (n === 100) return "cem";
    if (c > 0) str.push(centenas[c]);
    
    if (d === 1) {
      if (str.length) str.push("e");
      str.push(onzeADezenove[u]);
    } else {
      if (d > 1) {
        if (str.length) str.push("e");
        str.push(dezenas[d]);
      }
      if (u > 0) {
        if (str.length) str.push("e");
        str.push(unidades[u]);
      }
    }
    return str.join(" ");
  };

  let intPart = Math.floor(valor);
  let decPart = Math.round((valor - intPart) * 100);
  
  let parts: string[] = [];
  
  if (intPart > 0) {
    let milhoes = Math.floor(intPart / 1000000);
    let milhares = Math.floor((intPart % 1000000) / 1000);
    let resto = intPart % 1000;
    
    if (milhoes > 0) {
      parts.push(getGroup(milhoes) + (milhoes === 1 ? " milhão" : " milhões"));
    }
    
    if (milhares > 0) {
      if (parts.length) parts.push("e");
      if (milhares === 1 && milhoes === 0) parts.push("mil"); 
      else parts.push(getGroup(milhares) + " mil");
    }
    
    if (resto > 0) {
      if (parts.length) parts.push("e");
      parts.push(getGroup(resto));
    }
    
    parts.push(intPart === 1 ? "real" : "reais");
  }

  if (decPart > 0) {
    if (parts.length) parts.push("e");
    parts.push(getGroup(decPart));
    parts.push(decPart === 1 ? "centavo" : "centavos");
  }

  const result = parts.join(" ");
  return result.charAt(0).toUpperCase() + result.slice(1);
};
