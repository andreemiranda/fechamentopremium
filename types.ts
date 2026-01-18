
export type ApiStatus = 'online' | 'offline' | 'loading';

export interface LotteryResult {
  numero: number;
  dezenas: string[];
  premios: Record<number, number>;
  data: string;
}

export interface FinancialState {
  valorAposta: string;
  v11: string;
  v12: string;
  v13: string;
  v14: string;
  v15: string;
}

// Added numeric index signature to resolve "Index signature for type 'number' is missing" error
export interface Stats {
  11: number;
  12: number;
  13: number;
  14: number;
  15: number;
  [key: number]: number;
}