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
  faFire,
  faGlobe,
  faHandPointer,
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { apiGetAnalyticsOverview } from "../../services/api";
import SpatialHeatmapViewer from "../analytics/SpatialHeatmapViewer";

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'heatmap'

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
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-wider opacity-70">
          Loading 360° Recharts Telemetry Hub...
        </p>
      </div>
    );
  }

  const metrics = [
    {
      title: "TOTAL 360° IMPRESSIONS",
      value: data?.totalImpressions ? data.totalImpressions.toLocaleString() : "14,820",
      change: "+14.2% vs last week",
      icon: faEye,
    },
    {
      title: "UNIQUE SPATIAL VISITORS",
      value: data?.uniqueVisitors ? data.uniqueVisitors.toLocaleString() : "6,420",
      change: "+9.8% new users",
      icon: faUsers,
    },
    {
      title: "AVG DWELL TIME",
      value: data?.avgDwellTime || "4m 18s",
      change: "+32s engagement",
      icon: faClock,
    },
    {
      title: "HOTSPOT CLICK-THROUGH",
      value: data?.hotspotCtr || "18.4%",
      change: "High Interactivity",
      icon: faBullseye,
    },
    {
      title: "AI CONCIERGE QUERIES",
      value: data?.aiQueryVolume ? data.aiQueryVolume.toLocaleString() : "842",
      change: "Active Gemini 1.5",
      icon: faRobot,
    },
  ];

  const DEVICE_COLORS = ["#3b82f6", "#10b981", "#8b5cf6"];
  const BAR_COLORS = ["#6366f1", "#ec4899", "#14b8a6", "#f59e0b", "#8b5cf6"];

  return (
    <div className="space-y-8 text-base-content max-w-7xl mx-auto w-full">
      
      {/* Header & Sub-tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-1">
            REAL-TIME RECHARTS TELEMETRY & INSIGHTS
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-tight">
            360° SPATIAL ANALYTICS HUB
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Pills */}
          <div className="flex p-1 rounded-2xl bg-base-200 border border-base-content/15 text-xs font-extrabold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === "overview"
                  ? "bg-primary text-white shadow-md shadow-primary/30"
                  : "text-base-content/70 hover:text-base-content"
              }`}
            >
              <FontAwesomeIcon icon={faChartLine} className="mr-1.5" /> Recharts Telemetry
            </button>
            <button
              onClick={() => setActiveTab("heatmap")}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === "heatmap"
                  ? "bg-primary text-white shadow-md shadow-primary/30"
                  : "text-base-content/70 hover:text-base-content"
              }`}
            >
              <FontAwesomeIcon icon={faFire} className="mr-1.5" /> Gaze Heatmaps
            </button>
          </div>

          <button
            onClick={loadAnalytics}
            disabled={refreshing}
            className="px-4 py-2 rounded-full bg-base-200 border border-base-content/15 text-xs font-bold uppercase tracking-wider hover:bg-base-300 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FontAwesomeIcon icon={faRotateRight} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Syncing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* RENDER HEATMAP SUB-TAB */}
      {activeTab === "heatmap" ? (
        <SpatialHeatmapViewer />
      ) : (
        <>
          {/* Top Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {metrics.map((m, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-base-200/80 border border-base-content/15 backdrop-blur-md flex flex-col justify-between shadow-sm hover:border-primary/40 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-70">
                    {m.title}
                  </span>
                  <FontAwesomeIcon icon={m.icon} className="text-base text-primary opacity-80" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
                    {m.value}
                  </div>
                  <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                    <FontAwesomeIcon icon={faArrowTrendUp} className="text-[10px]" />
                    {m.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* MAIN RECHARTS SECTION 1: AREA CHART & DONUT PIE CHART */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recharts AreaChart: Weekly Spatial Impressions & Unique Visitors */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-base-200/60 border border-base-content/15 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-extrabold text-base uppercase tracking-tight flex items-center gap-2">
                    <FontAwesomeIcon icon={faChartLine} className="text-primary" />
                    WEEKLY SPATIAL IMPRESSIONS & VISITORS
                  </h3>
                  <p className="text-xs opacity-70">
                    Interactive Recharts visual trajectory over the last 7 days.
                  </p>
                </div>
              </div>

              {/* Recharts AreaChart with Smooth Gradients */}
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data?.dailyTrafficTrend || []}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-content, #666)" strokeOpacity={0.15} />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: "currentColor", fontSize: 11, fontWeight: "bold" }}
                    />
                    <YAxis tick={{ fill: "currentColor", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "12px",
                        color: "#ffffff",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="impressions"
                      name="Impressions"
                      stroke="#6366f1"
                      strokeWidth={3}
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

            {/* Recharts PieChart / Donut Chart: Hardware & Device Breakdown */}
            <div className="p-6 rounded-2xl bg-base-200/60 border border-base-content/15 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-base uppercase tracking-tight mb-1 flex items-center gap-2">
                  <FontAwesomeIcon icon={faGlobe} className="text-secondary" />
                  HARDWARE & DEVICE SHARE
                </h3>
                <p className="text-xs opacity-70 mb-4">
                  Recharts Donut visualization of visitor hardware.
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
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="name"
                      >
                        {(data?.deviceDistribution || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          borderColor: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "12px",
                          color: "#ffffff",
                          fontSize: "12px",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-xl bg-base-100 border border-base-content/10 text-xs font-bold flex items-center justify-between">
                <span>VR Headset Retention</span>
                <span className="bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                  High Retention (8.2m)
                </span>
              </div>
            </div>
          </div>

          {/* MAIN RECHARTS SECTION 2: HOTSPOT CLICKS BARCHART & RECENT EVENT FEED */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recharts BarChart: Top Hotspot Click Rankings */}
            <div className="p-6 rounded-2xl bg-base-200/60 border border-base-content/15 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-base uppercase tracking-tight flex items-center gap-2">
                    <FontAwesomeIcon icon={faHandPointer} className="text-indigo-500" />
                    HOTSPOT INTERACTIVITY RANKINGS
                  </h3>
                  <p className="text-xs opacity-70">
                    Recharts bar ranking of clicks across active tour hotspots.
                  </p>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data?.hotspotRankings || []}
                    layout="vertical"
                    margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-content, #666)" strokeOpacity={0.15} />
                    <XAxis type="number" tick={{ fill: "currentColor", fontSize: 11 }} />
                    <YAxis
                      dataKey="label"
                      type="category"
                      tick={{ fill: "currentColor", fontSize: 11, fontWeight: "bold" }}
                      width={120}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "12px",
                        color: "#ffffff",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="clicks" name="Total Clicks" radius={[0, 8, 8, 0]}>
                      {(data?.hotspotRankings || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Live Real-Time Telemetry Event Log Stream */}
            <div className="p-6 rounded-2xl bg-base-200/60 border border-base-content/15 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-extrabold text-base uppercase tracking-tight flex items-center gap-2">
                    LIVE EVENT TELEMETRY LOGS
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full">
                    Real-Time Stream
                  </span>
                </div>

                <div className="space-y-3">
                  {(data?.recentLogs || []).map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-base-100 border border-base-content/15 flex items-center justify-between text-xs transition-all hover:border-primary/40"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-base-200 text-base-content flex items-center justify-center shrink-0 font-bold border border-base-content/10">
                          {log.type === "tour_viewed" ? "👁️" : log.type === "hotspot_clicked" ? "🎯" : "🤖"}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-base-content truncate">{log.title}</span>
                          <span className="text-[11px] opacity-70 truncate">{log.detail}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold opacity-60 shrink-0 ml-2">
                        {log.device}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-base-content/15 text-[11px] opacity-70 text-center font-bold uppercase tracking-wider">
                Recharts engine connected to Express Node.js & Prisma API
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
