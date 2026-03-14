import { useState, useEffect, useRef } from "react";

// ─── Brand Logos ────────────────────────────────────────────────────────────
const PRISM_LOGO =
  "https://prismmarketing.co/wp-content/uploads/2023/03/prism-logo-new-logo.png";
const AP_LOGO =
  "https://auntporridge.com/wp-content/uploads/2022/04/cropped-cropped-Logo-png-01-01-300x300.png";

// ─── Design Tokens ──────────────────────────────────────────────────────────
const C = {
  bg: "#FAFAFA",
  surface: "#FFFFFF",
  surfaceAlt: "#F5F1F3",
  border: "#EDDFEA",
  borderLight: "#F0E8EE",
  prism: "#E22658",
  prismDark: "#B81E47",
  prismSoft: "rgba(226, 38, 88, 0.08)",
  prismSofter: "rgba(226, 38, 88, 0.04)",
  orange: "#F16622",
  orangeSoft: "rgba(241, 102, 34, 0.10)",
  green: "#0FA06A",
  greenSoft: "rgba(15, 160, 106, 0.10)",
  blue: "#2E6FD6",
  blueSoft: "rgba(46, 111, 214, 0.10)",
  purple: "#7C4DBA",
  purpleSoft: "rgba(124, 77, 186, 0.10)",
  text: "#1A1023",
  textMid: "#4A3F54",
  textMuted: "#7A6E85",
  textDim: "#A89CB4",
};

// ─── Data ────────────────────────────────────────────────────────────────────
const channelData = [
  { name: "Activations",   revenue: 4800000,  pct: 39, color: C.prism  },
  { name: "Supermarkets",  revenue: 4196000,  pct: 34, color: C.orange },
  { name: "Retail Shops",  revenue: 2000000,  pct: 16, color: C.blue   },
  { name: "Sales Rep",     revenue: 1311500,  pct: 11, color: C.purple },
];

const productData = [
  { name: "PP Green 500g",  units: 529, color: C.green  },
  { name: "BB Pink 500g",   units: 322, color: C.prism  },
  { name: "AP Green 1kg",   units: 319, color: C.green  },
  { name: "AP Pink 1kg",    units: 270, color: C.prism  },
  { name: "Instapo",        units: 88,  color: C.orange },
  { name: "AP BKT Green",   units: 53,  color: C.green  },
  { name: "AP BKT Pink",    units: 17,  color: C.prism  },
];

const retailData = [
  { name: "Crane Shoppers",   orders: 3 },
  { name: "Abrah Supermarket",orders: 3 },
  { name: "2K Soppers",       orders: 2 },
  { name: "Faruku & Sons",    orders: 2 },
];

const weeklyTrend = [
  { week: "Wk 1", revenue: 2100000 },
  { week: "Wk 2", revenue: 3400000 },
  { week: "Wk 3", revenue: 2800000 },
  { week: "Wk 4", revenue: 4007500 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => "UGX " + n.toLocaleString("en-UG");
const totalRevenue = channelData.reduce((s, d) => s + d.revenue, 0);
const totalUnits   = productData.reduce((s, d) => s + d.units, 0);

function useMedia(query) {
  const [match, setMatch] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatch(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return match;
}

function useAnimateIn() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);
  return ready;
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────
function DonutChart({ data, size }) {
  const cx = size / 2, cy = size / 2;
  const r = size * 0.37;
  const stroke = size * 0.11;
  const circumference = 2 * Math.PI * r;
  let cumulative = 0;

  const segments = data.map((d) => {
    const offset = cumulative;
    cumulative += d.pct;
    return { ...d, offset };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.borderLight} strokeWidth={stroke} />
      {segments.map((seg, i) => (
        <circle
          key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={seg.color} strokeWidth={stroke}
          strokeDasharray={`${(seg.pct / 100) * circumference} ${circumference}`}
          strokeDashoffset={`${-(seg.offset / 100) * circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)" }}
        />
      ))}
      <text x={cx} y={cy - 7} textAnchor="middle" fill={C.text}
        fontSize={size * 0.115} fontWeight="700" fontFamily="Montserrat, sans-serif">
        12.3M
      </text>
      <text x={cx} y={cy + 13} textAnchor="middle" fill={C.textDim}
        fontSize={size * 0.062} fontFamily="Hind, sans-serif">
        UGX Total
      </text>
    </svg>
  );
}

// ─── Horizontal Bar ───────────────────────────────────────────────────────────
function BarH({ value, max, color, animate }) {
  const pct = (value / max) * 100;
  return (
    <div style={{ height: 7, borderRadius: 4, background: C.borderLight, width: "100%", overflow: "hidden" }}>
      <div style={{
        height: "100%", borderRadius: 4, background: color,
        width: animate ? `${pct}%` : "0%",
        transition: "width 0.9s cubic-bezier(0.22,1,0.36,1)",
      }} />
    </div>
  );
}

// ─── Sparkline (Weekly Trend) ─────────────────────────────────────────────────
function Sparkline({ data, width = 200, height = 52 }) {
  const animate = useAnimateIn();
  const max = Math.max(...data.map((d) => d.revenue));
  const min = Math.min(...data.map((d) => d.revenue));
  const pad = 6;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * w;
    const y = pad + (1 - (d.revenue - min) / (max - min || 1)) * h;
    return [x, y];
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const fill = `${path} L${pts[pts.length - 1][0]},${height - pad} L${pts[0][0]},${height - pad} Z`;

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.prism} stopOpacity="0.18" />
          <stop offset="100%" stopColor={C.prism} stopOpacity="0" />
        </linearGradient>
      </defs>
      {animate && <path d={fill} fill="url(#sparkGrad)" />}
      {animate && (
        <path d={path} fill="none" stroke={C.prism} strokeWidth={2}
          strokeLinejoin="round" strokeLinecap="round" />
      )}
      {animate && pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill={C.prism} />
      ))}
    </svg>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, accent, icon }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: "20px 22px",
      borderTop: `3px solid ${accent}`,
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 26, fontWeight: 800, color: C.text, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.textMuted }}>{sub}</div>}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function Card({ title, children, style }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: "22px 22px 20px",
      ...style,
    }}>
      {title && (
        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700,
          color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase",
          marginBottom: 16, }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Channel Row ──────────────────────────────────────────────────────────────
function ChannelRow({ d, maxRev, animate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 500, color: C.textMid }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
          {d.name}
        </span>
        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: C.text }}>{d.pct}%</span>
      </div>
      <BarH value={d.revenue} max={maxRev} color={d.color} animate={animate} />
      <div style={{ fontSize: 11, color: C.textDim, textAlign: "right" }}>{fmt(d.revenue)}</div>
    </div>
  );
}

// ─── Product Row ──────────────────────────────────────────────────────────────
function ProductRow({ d, maxUnits, animate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: C.textMid }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
          {d.name}
        </span>
        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: C.text }}>{d.units.toLocaleString()}</span>
      </div>
      <BarH value={d.units} max={maxUnits} color={d.color} animate={animate} />
    </div>
  );
}

// ─── Retail Badge ─────────────────────────────────────────────────────────────
function RetailBadge({ d }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 14px", borderRadius: 10,
      background: C.surfaceAlt, border: `1px solid ${C.borderLight}`,
    }}>
      <span style={{ fontSize: 13, color: C.textMid, fontWeight: 500 }}>{d.name}</span>
      <span style={{
        fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700,
        color: C.orange, background: C.orangeSoft,
        padding: "2px 9px", borderRadius: 20,
      }}>
        {d.orders} orders
      </span>
    </div>
  );
}

// ─── Weekly Bar Chart ─────────────────────────────────────────────────────────
function WeeklyBars({ data, animate }) {
  const max = Math.max(...data.map((d) => d.revenue));
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 80 }}>
      {data.map((d, i) => {
        const pct = (d.revenue / max) * 100;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{ fontSize: 10, color: C.textDim, fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
              {(d.revenue / 1e6).toFixed(1)}M
            </div>
            <div style={{ width: "100%", background: C.borderLight, borderRadius: 6, overflow: "hidden", height: 52 }}>
              <div style={{
                width: "100%", background: `linear-gradient(180deg, ${C.prism}, ${C.prismDark})`,
                borderRadius: 6,
                height: animate ? `${pct}%` : "0%",
                marginTop: animate ? `${100 - pct}%` : "100%",
                transition: `height 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s, margin-top 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s`,
              }} />
            </div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{d.week}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function App() {
  const isMobile = useMedia("(max-width: 680px)");
  const isTablet = useMedia("(max-width: 1024px)");
  const animate = useAnimateIn();

  const maxRev   = Math.max(...channelData.map((d) => d.revenue));
  const maxUnits = Math.max(...productData.map((d) => d.units));

  const donutSize = isMobile ? 160 : 180;

  return (
    <div style={{ background: C.bg, minHeight: "100svh", padding: isMobile ? "0 0 32px" : "0 0 48px" }}>

      {/* ── Header ── */}
      <header style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: isMobile ? "14px 16px" : "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 10,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 20 }}>
          <img src={PRISM_LOGO} alt="Prism Marketing" height={isMobile ? 28 : 36}
            style={{ objectFit: "contain" }} />
          <div style={{ width: 1, height: 30, background: C.border }} />
          <img src={AP_LOGO} alt="Aunt Porridge" height={isMobile ? 28 : 36}
            style={{ objectFit: "contain" }} />
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: isMobile ? 13 : 15, fontWeight: 700, color: C.text }}>
            Sales Dashboard
          </div>
          <div style={{ fontSize: 11, color: C.textDim }}>March 2025 · Field Report</div>
        </div>
      </header>

      {/* ── Body ── */}
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "20px 12px" : "28px 28px" }}>

        {/* ── KPI Row ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: isMobile ? 10 : 14,
          marginBottom: isMobile ? 20 : 24,
        }}>
          <KpiCard label="Total Revenue"  value="UGX 12.3M"   sub="All channels"        accent={C.prism}  icon="💰" />
          <KpiCard label="Total Units"    value={totalUnits.toLocaleString()} sub="SKUs sold"  accent={C.orange} icon="📦" />
          <KpiCard label="Active Channels" value="4"          sub="Activations leading"  accent={C.blue}   icon="📡" />
          <KpiCard label="Supermarkets"   value="10"          sub="Unique retailers"      accent={C.green}  icon="🏪" />
        </div>

        {/* ── Revenue + Trend ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isTablet ? "1fr" : "1.3fr 1fr",
          gap: isMobile ? 12 : 16,
          marginBottom: isMobile ? 12 : 16,
        }}>

          {/* Channel Donut + Breakdown */}
          <Card title="Revenue by Channel">
            <div style={{ display: "flex", gap: isMobile ? 16 : 28, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flexShrink: 0 }}>
                <DonutChart data={channelData} size={donutSize} />
              </div>
              <div style={{ flex: 1, minWidth: 160, display: "flex", flexDirection: "column", gap: 12 }}>
                {channelData.map((d) => (
                  <ChannelRow key={d.name} d={d} maxRev={maxRev} animate={animate} />
                ))}
              </div>
            </div>
          </Card>

          {/* Weekly Trend */}
          <Card title="Weekly Revenue Trend">
            <WeeklyBars data={weeklyTrend} animate={animate} />
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.borderLight}` }}>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Avg per week</div>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 22, fontWeight: 800, color: C.text }}>
                UGX {(totalRevenue / weeklyTrend.length / 1e6).toFixed(2)}M
              </div>
              <div style={{ marginTop: 12 }}>
                <Sparkline data={weeklyTrend} width={isTablet ? 320 : 240} height={52} />
              </div>
            </div>
          </Card>
        </div>

        {/* ── Products + Retail ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isTablet ? "1fr" : "1.5fr 1fr",
          gap: isMobile ? 12 : 16,
        }}>

          {/* Product Units */}
          <Card title="Units Sold by SKU">
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {productData.map((d) => (
                <ProductRow key={d.name} d={d} maxUnits={maxUnits} animate={animate} />
              ))}
            </div>
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.borderLight}`,
              display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: C.textMuted }}>Total units</span>
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 800, color: C.text }}>
                {totalUnits.toLocaleString()} units
              </span>
            </div>
          </Card>

          {/* Retail Supermarkets */}
          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 12 : 16 }}>
            <Card title="Top Supermarkets">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {retailData.map((d) => (
                  <RetailBadge key={d.name} d={d} />
                ))}
              </div>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.borderLight}`,
                fontSize: 12, color: C.textMuted, textAlign: "center" }}>
                10 supermarkets total · 4 shown above
              </div>
            </Card>

            {/* Summary stat card */}
            <div style={{
              background: `linear-gradient(135deg, ${C.prism} 0%, ${C.prismDark} 100%)`,
              borderRadius: 16, padding: "20px 22px", color: "#fff",
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.75, marginBottom: 8 }}>
                Activations Revenue
              </div>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, lineHeight: 1.1 }}>
                UGX 4.8M
              </div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                39% of total · #1 channel
              </div>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.2)",
                display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 10, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.06em" }}>Supermarkets</div>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 15 }}>UGX 4.2M</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.06em" }}>Retail</div>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 15 }}>UGX 2.0M</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.06em" }}>Sales Rep</div>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 15 }}>UGX 1.3M</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ marginTop: 28, display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={PRISM_LOGO} alt="Prism" height={18} style={{ objectFit: "contain" }} />
            <span style={{ fontSize: 11, color: C.textDim }}>Powered by Prism Marketing</span>
          </div>
          <div style={{ fontSize: 11, color: C.textDim }}>
            Data: March 2025 · Aunt Porridge Uganda
          </div>
        </div>
      </main>
    </div>
  );
}
