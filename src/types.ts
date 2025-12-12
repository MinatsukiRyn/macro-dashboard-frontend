export interface SimplePoint {
  value: number | null;
  date: string | null;
}

export interface OverviewResponse {
  fedFunds: SimplePoint;

  inflation: {
    cpiIndex: number | null;
    cpiYoY: number | null;
    coreCpiYoY: number | null;
    date: string | null;
  };

  labour: {
    unemploymentRate: SimplePoint;
  };

  yields: {
    twoYear: SimplePoint;
    tenYear: SimplePoint;
    threeMonth: SimplePoint;
    termSpread: number | null;
  };

  financial: {
    hyoas: SimplePoint;
    nfci: SimplePoint;
  };

  policyBias: {
    label: "hawkish" | "neutral" | "dovish";
    score: number;
    explanationShort: string;
  };
}

export interface TimePoint {
  date: string;
  value?: number | null;
  yoy?: number | null;
}

