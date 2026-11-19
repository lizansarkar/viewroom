import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faArrowTrendUp,
  faCreditCard,
  faReceipt,
  faBuildingColumns,
  faDownload,
  faFilter,
  faCircleCheck,
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
import Button from "../reuseable/Button";

// Realistic Monthly Revenue Data for 2026
const MONTHLY_REVENUE_DATA = [
  { month: "Jan", revenue: 4200, subscriptions: 2800, processing: 1400 },
  { month: "Feb", revenue: 4950, subscriptions: 3200, processing: 1750 },
  { month: "Mar", revenue: 5800, subscriptions: 3900, processing: 1900 },
  { month: "Apr", revenue: 6400, subscriptions: 4300, processing: 2100 },
  { month: "May", revenue: 7100, subscriptions: 4800, processing: 2300 },
  { month: "Jun", revenue: 7850, subscriptions: 5200, processing: 2650 },
  { month: "Jul", revenue: 8420, subscriptions: 5700, processing: 2720 },
  { month: "Aug", revenue: 9100, subscriptions: 6200, processing: 2900 },
  { month: "Sep", revenue: 9800, subscriptions: 6700, processing: 3100 },
  { month: "Oct", revenue: 10450, subscriptions: 7200, processing: 3250 },
  { month: "Nov", revenue: 11200, subscriptions: 7800, processing: 3400 },
  { month: "Dec", revenue: 12450, subscriptions: 8600, processing: 3850 },
];

// Yearly Revenue Trend
const YEARLY_REVENUE_DATA = [
  { year: "2024", revenue: 28400, growth: "+45%" },
  { year: "2025", revenue: 62800, growth: "+121%" },
  { year: "2026 (YTD)", revenue: 97720, growth: "+55%" },
];

// Revenue Stream Channel Breakdown
const REVENUE_BY_STREAM = [
  { name: "Pro Creator Subscription", value: 52768, percentage: "54%", color: "#2563eb" },
  { name: "Enterprise VR Studios", value: 31270, percentage: "32%", color: "#0ea5e9" },
  { name: "8K Panorama Processing", value: 13682, percentage: "14%", color: "#10b981" },
];

// Recent Transaction Log
const RECENT_TRANSACTIONS = [
  {
    id: "INV-2026-891",
    user: "alex.studio@viewroom.com",
    name: "Alex Vance",
    plan: "Pro Creator (Annual)",
    amount: "$299.00",
    date: "Today, 11:20 AM",
    status: "Completed",
    channel: "Stripe",
  },
  {
    id: "INV-2026-890",
    user: "horizon.realty@vrspaces.io",
    name: "Horizon Realty Group",
    plan: "Enterprise VR Studio",
    amount: "$849.00",
    date: "Yesterday",
    status: "Completed",
    channel: "Stripe",
  },
  {
    id: "INV-2026-889",
    user: "sarah.architect@gmail.com",
    name: "Sarah Jenkins",
    plan: "8K HDR Batch Processing (50 Scenes)",
    amount: "$75.00",
    date: "Nov 17, 2026",
    status: "Completed",
    channel: "Google Pay",
  },
  {
    id: "INV-2026-888",
    user: "metropolitan.hotel@luxury.com",
    name: "Metropolitan Grand Hotel",
    plan: "Enterprise White-label Domain",
    amount: "$499.00",
    date: "Nov 16, 2026",
    status: "Completed",
    channel: "Bank Transfer",
  },
  {
    id: "INV-2026-887",
    user: "david.design@creator.com",
    name: "David Kim",
    plan: "Pro Creator (Monthly)",
    amount: "$29.00",
    date: "Nov 15, 2026",
    status: "Completed",
    channel: "Stripe",
  },
];

export default function AdminRevenueDashboard() {
  const [timeframe, setTimeframe] = useState("monthly"); // "monthly" | "yearly"

  const customTooltipStyle = {
    backgroundColor: "var(--color-base-100, #ffffff)",
    borderColor: "var(--app-border, rgba(163, 163, 163, 0.2))",
    borderRadius: "6px",
    color: "var(--color-base-content, #0f172a)",
    fontSize: "12px",
    fontWeight: "600",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
  };

  const totalYtd = MONTHLY_REVENUE_DATA.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div className="space-y-6 text-base-content max-w-7xl mx-auto w-full">
      {/* 1. Header Card */}
      <div className="p-6 rounded-sm bg-base-100 border border-base-content/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-base-content/60 block mb-1">
            Financial Performance & Monetization
          </span>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-base-content flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-sm bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-sm shrink-0">
              <FontAwesomeIcon icon={faDollarSign} />
            </span>
            Total Revenue & Growth
          </h2>
          <p className="text-xs text-base-content/60 mt-0.5">
            Real-time platform billing, creator subscriptions, processing fees, and financial trajectories.
          </p>
        </div>

        {/* Timeframe & Export Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex rounded-sm p-1 bg-base-200/80 border border-base-content/10">
            <button
              onClick={() => setTimeframe("monthly")}
              className={`px-3 py-1.5 rounded-xs text-xs font-semibold transition-all cursor-pointer ${
                timeframe === "monthly"
                  ? "bg-base-100 text-base-content shadow-xs"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              Monthly (2026)
            </button>
            <button
              onClick={() => setTimeframe("yearly")}
              className={`px-3 py-1.5 rounded-xs text-xs font-semibold transition-all cursor-pointer ${
                timeframe === "yearly"
                  ? "bg-base-100 text-base-content shadow-xs"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              Yearly (2024-2026)
            </button>
          </div>

          <Button
            variant="secondary"
            onClick={() => window.print()}
            className="!py-2 !px-3 !text-xs !rounded-sm cursor-pointer"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-1.5 text-xs" /> Export Report
          </Button>
        </div>
      </div>

      {/* 2. Key Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-sm bg-base-100 border border-base-content/10 shadow-xs hover:border-base-content/20 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
              Total 2026 Revenue
            </span>
            <FontAwesomeIcon icon={faReceipt} className="text-base-content/40 text-xs" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
            ${totalYtd.toLocaleString()}
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <FontAwesomeIcon icon={faArrowTrendUp} className="text-[10px]" />
            +22.4% vs previous year
          </div>
        </div>

        <div className="p-5 rounded-sm bg-base-100 border border-base-content/10 shadow-xs hover:border-base-content/20 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
              Monthly Recurring (MRR)
            </span>
            <FontAwesomeIcon icon={faCreditCard} className="text-base-content/40 text-xs" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
            $12,450
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <FontAwesomeIcon icon={faArrowTrendUp} className="text-[10px]" />
            +11.2% MoM subscription growth
          </div>
        </div>

        <div className="p-5 rounded-sm bg-base-100 border border-base-content/10 shadow-xs hover:border-base-content/20 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
              Annual Run Rate (ARR)
            </span>
            <FontAwesomeIcon icon={faBuildingColumns} className="text-base-content/40 text-xs" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
            $149,400
          </div>
          <div className="text-[11px] font-semibold text-base-content/60 mt-1">
            Projected annual volume
          </div>
        </div>

        <div className="p-5 rounded-sm bg-base-100 border border-base-content/10 shadow-xs hover:border-base-content/20 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
              Average Order Value (AOV)
            </span>
            <FontAwesomeIcon icon={faFilter} className="text-base-content/40 text-xs" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
            $88.40
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            Across 348 transactions
          </div>
        </div>
      </div>

      {/* 3. Main Revenue Trend Chart & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trend Chart (Area Chart or Bar Chart based on timeframe) */}
        <div className="lg:col-span-2 p-6 rounded-sm bg-base-100 border border-base-content/10 shadow-xs flex flex-col justify-between">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-base-content">
                {timeframe === "monthly" ? "Monthly Revenue Performance (2026)" : "Year-over-Year Platform Revenue"}
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                {timeframe === "monthly"
                  ? "Recurring subscriptions vs. 8K panorama cloud processing fees."
                  : "Gross volume historical trajectory across operating fiscal years."}
              </p>
            </div>
            <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-sm self-start sm:self-auto">
              Currency: USD ($)
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {timeframe === "monthly" ? (
                <AreaChart data={MONTHLY_REVENUE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="subsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-content, #64748b)" strokeOpacity={0.08} />
                  <XAxis dataKey="month" tick={{ fill: "currentColor", fontSize: 11, opacity: 0.6 }} />
                  <YAxis tick={{ fill: "currentColor", fontSize: 11, opacity: 0.6 }} />
                  <Tooltip
                    contentStyle={customTooltipStyle}
                    itemStyle={{ color: "var(--color-base-content)" }}
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, ""]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Total Revenue"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="subscriptions"
                    name="Subscriptions"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#subsGradient)"
                  />
                </AreaChart>
              ) : (
                <BarChart data={YEARLY_REVENUE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-content, #64748b)" strokeOpacity={0.08} />
                  <XAxis dataKey="year" tick={{ fill: "currentColor", fontSize: 11, opacity: 0.6 }} />
                  <YAxis tick={{ fill: "currentColor", fontSize: 11, opacity: 0.6 }} />
                  <Tooltip
                    contentStyle={customTooltipStyle}
                    itemStyle={{ color: "var(--color-base-content)" }}
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" name="Annual Gross Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Stream Donut Chart */}
        <div className="p-6 rounded-sm bg-base-100 border border-base-content/10 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-base-content mb-1">
              Revenue Stream Breakdown
            </h3>
            <p className="text-xs text-base-content/60 mb-4">
              Income distribution across subscriptions, studios, and cloud processing.
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={REVENUE_BY_STREAM}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                  >
                    {REVENUE_BY_STREAM.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={customTooltipStyle}
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, "Volume"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-base-content/10 text-xs">
            {REVENUE_BY_STREAM.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-base-content/70">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name}
                </span>
                <span className="font-bold text-base-content">{s.percentage}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Recent Transactions & Billing Table */}
      <div className="p-6 rounded-sm bg-base-100 border border-base-content/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
              <FontAwesomeIcon icon={faReceipt} className="text-base-content/60" />
              Recent Revenue Transactions & Invoices
            </h3>
            <p className="text-xs text-base-content/60 mt-0.5">
              Live automated checkout events, creator renewals, and enterprise processing invoices.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-base-content/50">
            Showing latest 5 payouts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-base-200/70 uppercase text-[10px] font-semibold text-base-content/60 border-b border-base-content/10">
              <tr>
                <th className="p-3">Invoice ID</th>
                <th className="p-3">Client / Creator</th>
                <th className="p-3">Plan / Product</th>
                <th className="p-3">Date</th>
                <th className="p-3">Gateway</th>
                <th className="p-3">Amount</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-content/10">
              {RECENT_TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-base-200/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-primary">{tx.id}</td>
                  <td className="p-3">
                    <p className="font-bold text-base-content">{tx.name}</p>
                    <p className="text-[10px] text-base-content/60">{tx.user}</p>
                  </td>
                  <td className="p-3 font-medium text-base-content/80">{tx.plan}</td>
                  <td className="p-3 text-base-content/60 text-[11px]">{tx.date}</td>
                  <td className="p-3 text-base-content/70">{tx.channel}</td>
                  <td className="p-3 font-bold text-base-content">{tx.amount}</td>
                  <td className="p-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[9px]" />
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
