import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faEye,
  faUsers,
  faClock,
  faBullseye,
  faRobot,
  faDesktop,
  faMobileScreen,
  faVrCardboard,
  faRotateRight,
  faArrowTrendUp,
  faFire,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { apiGetAnalyticsOverview } from "../../services/api";

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
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">
          Loading 360° Platform Analytics...
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
      accent: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
    },
    {
      title: "UNIQUE SPATIAL VISITORS",
      value: data?.uniqueVisitors ? data.uniqueVisitors.toLocaleString() : "6,420",
      change: "+9.8% new users",
      icon: faUsers,
      accent: "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30",
    },
    {
      title: "AVG DWELL TIME",
      value: data?.avgDwellTime || "4m 18s",
      change: "+32s engagement",
      icon: faClock,
      accent: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      title: "HOTSPOT CLICK-THROUGH",
      value: data?.hotspotCtr || "18.4%",
      change: "High Interactivity",
      icon: faBullseye,
      accent: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
    },
    {
      title: "AI CONCIERGE QUERIES",
      value: data?.aiQueryVolume ? data.aiQueryVolume.toLocaleString() : "842",
      change: "Active Gemini 1.5",
      icon: faRobot,
      accent: "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30",
    },
  ];

  const maxImpressions = Math.max(...(data?.dailyTrafficTrend || []).map((d) => d.impressions), 3500);

  return (
    <div className="space-y-8 text-[var(--app-text-primary)]">
      
      {/* Header & Refresh Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)] block mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            REAL-TIME TELEMETRY & INSIGHTS
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl uppercase tracking-tight">
            360° SPATIAL ANALYTICS HUB
          </h2>
        </div>

        <button
          onClick={loadAnalytics}
          disabled={refreshing}
          className="px-4 py-2 rounded-full bg-base-200 border border-[var(--app-border)]/30 text-xs font-bold uppercase tracking-wider hover:bg-base-300 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <FontAwesomeIcon icon={faRotateRight} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Syncing..." : "Refresh Insights"}
        </button>
      </div>

      {/* Top 5 Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl bg-gradient-to-br ${m.accent} border backdrop-blur-md flex flex-col justify-between shadow-md`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-base-content/70">
                {m.title}
              </span>
              <FontAwesomeIcon icon={m.icon} className="text-base" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
                {m.value}
              </div>
              <span className="text-[11px] font-bold opacity-80 flex items-center gap-1">
                <FontAwesomeIcon icon={faArrowTrendUp} className="text-[10px]" />
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Section: Interactive Traffic Chart & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly Traffic Trend SVG Chart (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base uppercase tracking-tight flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} className="text-cyan-400" />
                WEEKLY SPATIAL IMPRESSIONS & VISITORS
              </h3>
              <p className="text-xs text-[var(--app-text-secondary)]">
                Daily panorama views and unique visitor traffic over the last 7 days.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-cyan-400 inline-block" /> Impressions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-purple-500 inline-block" /> Unique
              </span>
            </div>
          </div>

          {/* Responsive SVG Bar Chart */}
          <div className="h-64 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[var(--app-border)]/15">
            {(data?.dailyTrafficTrend || []).map((item, idx) => {
              const impHeight = Math.round((item.impressions / maxImpressions) * 100);
              const unqHeight = Math.round((item.unique / maxImpressions) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                  {/* Tooltip Hover Badge */}
                  <div className="absolute -top-10 hidden group-hover:flex flex-col items-center bg-black/90 text-white text-[10px] px-2.5 py-1 rounded-md z-20 shadow-xl border border-white/20 whitespace-nowrap">
                    <span>{item.impressions} Views</span>
                    <span className="text-purple-300">{item.unique} Unique</span>
                  </div>

                  {/* Dual Bars */}
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    <div
                      style={{ height: `${impHeight}%` }}
                      className="w-1/2 max-w-[24px] rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:brightness-125 transition-all"
                    />
                    <div
                      style={{ height: `${unqHeight}%` }}
                      className="w-1/2 max-w-[24px] rounded-t-lg bg-gradient-to-t from-purple-600 to-purple-400 group-hover:brightness-125 transition-all"
                    />
                  </div>

                  <span className="text-[11px] font-bold text-base-content/70 uppercase">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device & Hardware Distribution (1 Col) */}
        <div className="p-6 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base uppercase tracking-tight mb-1 flex items-center gap-2">
              <FontAwesomeIcon icon={faGlobe} className="text-purple-400" />
              HARDWARE DISTRIBUTION
            </h3>
            <p className="text-xs text-[var(--app-text-secondary)] mb-6">
              Platform access across browsers, mobile, and VR.
            </p>

            <div className="space-y-5">
              {(data?.deviceDistribution || []).map((dev, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2">
                      {dev.name === "Desktop" && <FontAwesomeIcon icon={faDesktop} className="text-cyan-400" />}
                      {dev.name === "Mobile" && <FontAwesomeIcon icon={faMobileScreen} className="text-emerald-400" />}
                      {dev.name === "VR Headsets" && <FontAwesomeIcon icon={faVrCardboard} className="text-purple-400" />}
                      {dev.name}
                    </span>
                    <span>{dev.percentage}% ({dev.count.toLocaleString()})</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 rounded-full bg-base-300 overflow-hidden">
                    <div
                      style={{ width: `${dev.percentage}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        dev.name === "Desktop"
                          ? "bg-cyan-400"
                          : dev.name === "Mobile"
                          ? "bg-emerald-400"
                          : "bg-purple-400"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-bold flex items-center justify-between">
            <span>VR Headset Engagement</span>
            <span className="bg-primary text-primary-content px-2 py-0.5 rounded-full text-[10px]">
              High Retention (8.2m)
            </span>
          </div>
        </div>
      </div>

      {/* Hotspots Heatmap Rankings & Live Event Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Hotspot CTR Heatmap Ranking */}
        <div className="p-6 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-base uppercase tracking-tight flex items-center gap-2">
              <FontAwesomeIcon icon={faFire} className="text-amber-400" />
              TOP HOTSPOT ENGAGEMENT RANKINGS
            </h3>
            <span className="text-xs text-[var(--app-text-secondary)] font-bold uppercase">
              By Clicks & CTR
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--app-border)]/20 text-[11px] font-extrabold uppercase text-[var(--app-text-secondary)]">
                  <th className="py-3 px-2">HOTSPOT LABEL</th>
                  <th className="py-3 px-2">CATEGORY</th>
                  <th className="py-3 px-2">CLICKS</th>
                  <th className="py-3 px-2 text-right">CTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]/10 text-xs">
                {(data?.hotspotRankings || []).map((hp) => (
                  <tr key={hp.id} className="hover:bg-base-200/60 transition-colors">
                    <td className="py-3.5 px-2 font-bold">{hp.label}</td>
                    <td className="py-3.5 px-2">
                      <span className="px-2 py-0.5 rounded-full bg-base-300 text-[10px] font-bold uppercase">
                        {hp.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-semibold">{hp.clicks.toLocaleString()}</td>
                    <td className="py-3.5 px-2 text-right font-black text-amber-400">{hp.ctr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Real-Time Activity Feed Stream */}
        <div className="p-6 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-base uppercase tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE EVENT TELEMETRY STREAM
              </h3>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                Real-Time Logs
              </span>
            </div>

            <div className="space-y-3">
              {(data?.recentLogs || []).map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-base-100/70 border border-[var(--app-border)]/15 flex items-center justify-between text-xs transition-all hover:border-[var(--app-border)]/40"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">
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

          <div className="mt-4 pt-4 border-t border-[var(--app-border)]/15 text-[11px] text-[var(--app-text-secondary)] text-center font-bold uppercase tracking-wider">
            Streaming live telemetry to Express API backend
          </div>
        </div>

      </div>

    </div>
  );
}
