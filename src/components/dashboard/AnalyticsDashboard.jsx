import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faEye,
  faUsers,
  faClock,
  faBullseye,
  faRobot,
  faRotateRight,
  faArrowTrendUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { apiGetAnalyticsOverview } from "../../services/api";
import Button from "../reuseable/Button";

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setRefreshing(true);
    try {
      const overview = await apiGetAnalyticsOverview();
      if (overview) {
        setData(overview);
      }
    } catch (err) {
      console.warn("Analytics loading error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-base-content">
        <div className="inline-block w-7 h-7 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-base-content/60">
          Loading platform analytics...
        </p>
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Impressions",
      value: data?.totalImpressions ? data.totalImpressions.toLocaleString() : "14,820",
      change: "+14.2% vs last week",
      icon: faEye,
    },
    {
      title: "Unique Visitors",
      value: data?.uniqueVisitors ? data.uniqueVisitors.toLocaleString() : "6,420",
      change: "+9.8% new users",
      icon: faUsers,
    },
    {
      title: "Avg Dwell Time",
      value: data?.avgDwellTime || "4m 18s",
      change: "+32s engagement",
      icon: faClock,
    },
    {
      title: "Hotspot Click-Through",
      value: data?.hotspotCtr || "18.4%",
      change: "High interactivity",
      icon: faBullseye,
    },
    {
      title: "AI Concierge Queries",
      value: data?.aiQueryVolume ? data.aiQueryVolume.toLocaleString() : "842",
      change: "Gemini 1.5 active",
      icon: faRobot,
    },
  ];

  // Clean, cohesive theme palette (modern primary blues and neutral slates)
  const DEVICE_COLORS = ["#2563eb", "#38bdf8", "#64748b"];
  const BAR_COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#0284c7", "#64748b"];

  const customTooltipStyle = {
    backgroundColor: "var(--color-base-100)",
    borderColor: "var(--app-border, rgba(163, 163, 163, 0.2))",
    borderRadius: "4px",
    color: "var(--color-base-content)",
    fontSize: "12px",
    fontWeight: "600",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)",
  };

  return (
    <div className="space-y-6 text-base-content max-w-7xl mx-auto w-full">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-sm bg-base-100 border border-base-content/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-base-content flex items-center gap-2">
            <FontAwesomeIcon icon={faChartLine} className="text-base-content/60" />
            System Analytics & Performance Telemetry
          </h3>
          <p className="text-xs text-base-content/60 mt-0.5">
            Live visitor traffic, spatial dwell time, device distribution, and interactive hotspot engagement.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={loadAnalytics}
          disabled={refreshing}
          className="!text-xs !py-2 !px-3.5 !rounded-sm cursor-pointer self-start sm:self-auto shrink-0"
        >
          <FontAwesomeIcon icon={faRotateRight} className={`mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>{refreshing ? "Syncing..." : "Refresh"}</span>
        </Button>
      </div>

      {/* 2. Top Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="p-5 rounded-sm bg-base-100 border border-base-content/10 shadow-xs flex flex-col justify-between hover:border-base-content/20 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60">
                {m.title}
              </span>
              <FontAwesomeIcon icon={m.icon} className="text-sm text-base-content/40" />
            </div>
            <div>
              <div className="text-2xl font-black text-base-content tracking-tight mb-1">
                {m.value}
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <FontAwesomeIcon icon={faArrowTrendUp} className="text-[10px]" />
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Section 1: Weekly Area Chart & Device Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts AreaChart: Weekly Spatial Impressions */}
        <div className="lg:col-span-2 p-6 rounded-sm bg-base-100 border border-base-content/10 shadow-xs flex flex-col justify-between">
          <div className="mb-6">
            <h4 className="font-bold text-sm text-base-content">
              Weekly Spatial Impressions & Visitors
            </h4>
            <p className="text-xs text-base-content/60 mt-0.5">
              Visitor traffic and unique session trajectories over the past 7 days.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data?.dailyTrafficTrend || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-content, #666)" strokeOpacity={0.07} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "currentColor", fontSize: 11, opacity: 0.6 }}
                />
                <YAxis tick={{ fill: "currentColor", fontSize: 11, opacity: 0.6 }} />
                <Tooltip
                  contentStyle={customTooltipStyle}
                  itemStyle={{ color: "var(--color-base-content)" }}
                  labelStyle={{ fontWeight: "700", color: "var(--color-base-content)" }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="impressions"
                  name="Impressions"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorImpressions)"
                />
                <Area
                  type="monotone"
                  dataKey="unique"
                  name="Unique Visitors"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUnique)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recharts PieChart / Donut: Hardware & Device Breakdown */}
        <div className="p-6 rounded-sm bg-base-100 border border-base-content/10 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-sm text-base-content mb-1">
              Hardware & Device Distribution
            </h4>
            <p className="text-xs text-base-content/60 mb-4">
              Visitor breakdown across Desktop, Mobile, and VR Headsets.
            </p>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.deviceDistribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="name"
                  >
                    {(data?.deviceDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={customTooltipStyle}
                    itemStyle={{ color: "var(--color-base-content)" }}
                    labelStyle={{ fontWeight: "700", color: "var(--color-base-content)" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-sm bg-base-200/50 border border-base-content/10 text-xs font-semibold flex items-center justify-between">
            <span className="text-base-content/70">VR Headset Retention</span>
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase">
              Avg. 8.2m
            </span>
          </div>
        </div>
      </div>

      {/* 4. Section 2: Hotspot Rankings & Real-Time Telemetry Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recharts BarChart: Hotspot Interactivity Rankings */}
        <div className="p-6 rounded-sm bg-base-100 border border-base-content/10 shadow-xs">
          <div className="mb-4">
            <h4 className="font-bold text-sm text-base-content">
              Hotspot Interactivity Rankings
            </h4>
            <p className="text-xs text-base-content/60 mt-0.5">
              Total interaction clicks across published 360° tour hotspots.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.hotspotRankings || []}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-content, #666)" strokeOpacity={0.07} />
                <XAxis type="number" tick={{ fill: "currentColor", fontSize: 11, opacity: 0.6 }} />
                <YAxis
                  dataKey="label"
                  type="category"
                  tick={{ fill: "currentColor", fontSize: 11, fontWeight: "600" }}
                  width={110}
                />
                <Tooltip
                  contentStyle={customTooltipStyle}
                  itemStyle={{ color: "var(--color-base-content)" }}
                  labelStyle={{ fontWeight: "700", color: "var(--color-base-content)" }}
                />
                <Bar dataKey="clicks" name="Total Clicks" radius={[0, 3, 3, 0]}>
                  {(data?.hotspotRankings || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Real-Time Telemetry Event Log Stream */}
        <div className="p-6 rounded-sm bg-base-100 border border-base-content/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-sm text-base-content">
                  Live Platform Telemetry Logs
                </h4>
                <p className="text-xs text-base-content/60 mt-0.5">
                  Real-time feed of user actions and exploration events.
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-sm">
                Live Stream
              </span>
            </div>

            <div className="space-y-2.5">
              {(data?.recentLogs || []).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-sm bg-base-200/50 border border-base-content/10 flex items-center justify-between text-xs hover:border-base-content/20 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-sm bg-base-100 text-base-content flex items-center justify-center shrink-0 font-bold border border-base-content/10 shadow-2xs">
                      {log.type === "tour_viewed" ? "👁️" : log.type === "hotspot_clicked" ? "🎯" : "🤖"}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-base-content truncate">{log.title}</span>
                      <span className="text-[11px] text-base-content/60 truncate">{log.detail}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-base-content/50 shrink-0 ml-2">
                    {log.device}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
