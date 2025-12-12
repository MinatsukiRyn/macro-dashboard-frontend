export interface SimplePoint {
  value: number | null;
  date: string | null;
}

export interface OverviewResponse {
  fedFunds: SimplePoint;
  inflation: {
    cpiIndex: number | null;
    cpiYoY: number | null;
    date: string | null;
  };
  labour: {
    unemploymentRate: SimplePoint;
  };
  yields: {
    tenYear: SimplePoint;
    threeMonth: SimplePoint;
    termSpread: number | null;
  };
  policyBias: {
    label: "hawkish" | "neutral" | "dovish";
    score: number;
    explanationShort: string;
  };
}

export interface TimePoint {
  date: string;
  value?: number | null; // 给失业率
  yoy?: number | null;   // 给 CPI YoY
}
