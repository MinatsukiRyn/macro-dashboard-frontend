import { useEffect, useState } from "react";
import { fetchOverview, fetchCpiHistory, fetchUnemploymentHistory } from "./api";
import type { OverviewResponse, TimePoint } from "./types";
import "./App.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";


function formatNumber(value: number | null, digits = 2) {
  if (value === null || Number.isNaN(value)) return "-";
  return value.toFixed(digits);
}

function formatDate(date: string | null) {
  if (!date) return "-";
  return date; // 之後你可以改成更漂亮的格式
}

function App() {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cpiHistory, setCpiHistory] = useState<TimePoint[] | null>(null);
  const [unempHistory, setUnempHistory] = useState<TimePoint[] | null>(null);


  useEffect(() => {
        async function load() {
      try {
        setLoading(true);
        setError(null);
        const [overview, cpi, unemp] = await Promise.all([
          fetchOverview(),
          fetchCpiHistory(),
          fetchUnemploymentHistory(),
        ]);
        setData(overview);
        setCpiHistory(cpi);
        setUnempHistory(unemp);
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Macro Dashboard – Overview</h1>
        <p>Data source: FRED via Cloudflare Worker</p>
      </header>

      {loading && <p>Loading macro data…</p>}
      {error && (
        <p style={{ color: "red" }}>
          Failed to load data: {error}
        </p>
      )}

      {data && (
        <>
                    <section className="charts-section">
            <div className="chart-card">
              <h3>CPI YoY (%)</h3>
              {cpiHistory ? (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={cpiHistory}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d) => d.slice(0, 7)}
                      minTickGap={20}
                    />
                    <YAxis domain={["auto", "auto"]} />
                    <Tooltip
                      formatter={(value: any) =>
                        value === null ? "-" : `${(value as number).toFixed(2)} %`
                      }
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="yoy"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p>Loading CPI history…</p>
              )}
            </div>

            <div className="chart-card">
              <h3>Unemployment Rate (%)</h3>
              {unempHistory ? (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={unempHistory}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d) => d.slice(0, 7)}
                      minTickGap={20}
                    />
                    <YAxis domain={["auto", "auto"]} />
                    <Tooltip
                      formatter={(value: any) =>
                        value === null ? "-" : `${(value as number).toFixed(2)} %`
                      }
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p>Loading unemployment history…</p>
              )}
            </div>
          </section>


          <section className="policy-section">
            <h2>Policy Bias</h2>
            <PolicyBadge label={data.policyBias.label} score={data.policyBias.score} />
            <p className="policy-explanation">{data.policyBias.explanationShort}</p>
          </section>
        </>
      )}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

function MetricCard({ title, value, subtitle }: MetricCardProps) {
  return (
    <div className="metric-card">
      <div className="metric-title">{title}</div>
      <div className="metric-value">{value}</div>
      {subtitle && <div className="metric-subtitle">{subtitle}</div>}
    </div>
  );
}

function PolicyBadge({ label, score }: { label: "hawkish" | "neutral" | "dovish"; score: number }) {
  let text = "";
  if (label === "hawkish") text = "Hawkish (偏鹰)";
  else if (label === "dovish") text = "Dovish (偏鸽)";
  else text = "Neutral (中性)";

  return (
    <div className={`policy-badge policy-${label}`}>
      {text} • score: {score.toFixed(2)}
    </div>
  );
}

export default App;
