import type { OverviewResponse, TimePoint } from "./types";

const API_BASE = "";

export async function fetchOverview(): Promise<OverviewResponse> {
  const res = await fetch(`${API_BASE}/api/overview`);
  if (!res.ok) {
    throw new Error(`Failed to fetch overview: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchCpiHistory(): Promise<TimePoint[]> {
  const res = await fetch(`${API_BASE}/api/cpi-history`);
  if (!res.ok) {
    throw new Error(`Failed to fetch CPI history`);
  }
  const data = await res.json();
  return data.map((d: any) => ({
    date: d.date,
    value: d.yoy,
    yoy: d.yoy,
  }));
}

export async function fetchUnemploymentHistory(): Promise<TimePoint[]> {
  const res = await fetch(`${API_BASE}/api/unemployment-history`);
  if (!res.ok) {
    throw new Error(`Failed to fetch unemployment history`);
  }
  const data = await res.json();
  return data.map((d: any) => ({
    date: d.date,
    value: d.value,
  }));
}
