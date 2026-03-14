import { useState, useEffect } from "react";

// ─── Logos ────────────────────────────────────────────────────────────────────
const PRISM_LOGO =
  "https://prismmarketing.co/wp-content/uploads/2023/03/prism-logo-new-logo.png";
const AP_LOGO =
  "https://auntporridge.com/wp-content/uploads/2022/04/cropped-cropped-Logo-png-01-01-300x300.png";

// ─── Tokens ───────────────────────────────────────────────────────────────────
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

// ─── Data ─────────────────────────────────────────────────────────────────────
const channelData = [
  { name: "Activations",  revenue: 4800000, pct: 39, color: C.prism  },
  { name: "Supermarkets", revenue: 4196000, pct: 34, color: C.orange },
  { name: "Retail Shops", revenue: 2000000, pct: 16, color: C.blue   },
  { name: "Sales Rep",    revenue: 1311500, pct: 11, color: C.purple },
];

const productData = [
  { name: "PP Green 500g", units: 529, color: C.green  },
  { name: "BB Pink 500g",  units: 322, color: C.prism  },
  { name: "AP Green 1kg",  units: 319, color: C.green  },
  { name: "AP Pink 1kg",   units: 270, color: C.prism  },
  { name: "Instapo",       units: 88,  color: C.orange },
  { name: "AP BKT Green",  units: 53,  color: C.green  },
  { name: "AP BKT Pink",   units: 17,  color: C.prism  },
];

const retailData = [
  { name: "Crane Shoppers",    orders: 3 },
  { name: "Abrah Supermarket", orders: 3 },
  { name: "2K Soppers",        orders: 2 },
  { name: "Faruku & Sons",     orders: 2 },
];

const weeklyTrend = [
  { week: "Wk 1", revenue: 2100000 },
  { week: "Wk 2", revenue: 3400000 },
  { week: "Wk 3", revenue: 2800000 },
  { week: "Wk 4", revenue: 4007500 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

// ─── GaugeArc ─────────────────────────────────────────────────────────────────
function GaugeArc({ value, size = 130 }) {
  const dashLen = (value / 100) * 170;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={size} height={size * 0.58} viewBox="0 0 140 80">
        <path d="M 12 72 A 58 58 0 0 1 128 72" fill="none" stroke={C.border}
          strokeWidth="13" strokeLinecap="round" />
        <path d="M 12 72 A 58 58 0 0 1 128 72" fill="none" stroke={C.prism}
          strokeWidth="13" strokeLinecap="round"
          strokeDasharray={`${dashLen} 188`}
          style={{ transition: "stroke-dasharray 1s ease" }} />
        <text x="70" y="64" textAnchor="middle" fill={C.text} fontSize="24"
          fontWeight="700" fontFamily="Montserrat, sans-serif">{value}%</text>
      </svg>
      <span style={{ fontSize: 11, color: C.textDim, fontFamily: "Hind, sans-serif", marginTop: 2 }}>
        Retail Conversion
      </span>
    </div>
  );
}

// ─── DonutChart ───────────────────────────────────────────────────────────────
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
        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
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

// ─── BarH ─────────────────────────────────────────────────────────────────────
function BarH({ value, max, color, animate }) {
  const pct = (value / max) * 100;
  return (
    <div style={{ height: 6, borderRadius: 4, background: C.borderLight, width: "100%", overflow: "hidden" }}>
      <div style={{
        height: "100%", borderRadius: 4, background: color,
        width: animate ? `${pct}%` : "0%",
        transition: "width 0.9s cubic-bezier(0.22,1,0.36,1)",
      }} />
    </div>
  );
}

// ─── WeeklyBars ───────────────────────────────────────────────────────────────
function WeeklyBars({ data, animate }) {
  const max = Math.max(...data.map((d) => d.revenue));
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 90 }}>
      {data.map((d, i) => {
        const pct = (d.revenue / max) * 100;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ fontSize: 10, color: C.textDim, fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
              {(d.revenue / 1e6).toFixed(1)}M
            </div>
            <div style={{ width: "100%", background: C.borderLight, borderRadius: 6, overflow: "hidden", height: 56 }}>
              <div style={{
                width: "100%",
                background: `linear-gradient(180deg, ${C.prism}, ${C.prismDark})`,
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

// ─── KPI ─────────────────────────────────────────────────────────────────────
function KPI({ label, value, sub, icon, color, softColor, mobile }) {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      padding: mobile ? "14px 14px" : "20px 22px",
      display: "flex", alignItems: "center", gap: mobile ? 12 : 16,
      flex: mobile ? "1 1 calc(50% - 4px)" : "1 1 0%",
      minWidth: mobile ? 0 : 200,
      boxShadow: "0 1px 3px rgba(26,16,35,0.04)",
    }}>
      <div style={{
        width: mobile ? 38 : 44, height: mobile ? 38 : 44, borderRadius: 10,
        background: softColor, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: mobile ? 17 : 19, flexShrink: 0,
      }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{
          color: C.textDim, fontSize: mobile ? 9 : 11, fontWeight: 600,
          letterSpacing: "0.05em", textTransform: "uppercase",
          fontFamily: "Hind, sans-serif", marginBottom: 2,
        }}>{label}</div>
        <div style={{
          color: color || C.text, fontSize: mobile ? 16 : 21,
          fontWeight: 700, lineHeight: 1.1, fontFamily: "Montserrat, sans-serif",
        }}>{value}</div>
        {sub && (
          <div style={{ color: C.textMuted, fontSize: mobile ? 9 : 11, marginTop: 2, fontFamily: "Hind, sans-serif" }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ title, children, style: s }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
      padding: "22px", boxShadow: "0 1px 4px rgba(26,16,35,0.04)", ...s,
    }}>
      {title && (
        <div style={{
          fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: "0.06em",
          textTransform: "uppercase", marginBottom: 16, fontFamily: "Montserrat, sans-serif",
        }}>{title}</div>
      )}
      {children}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [animate, setAnimate] = useState(false);
  const mobile = useMedia("(max-width: 680px)");
  const tablet = useMedia("(max-width: 960px)");

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(t);
  }, []);

  const maxRev   = Math.max(...channelData.map((d) => d.revenue));
  const maxUnits = Math.max(...productData.map((d) => d.units));
  const donutSize = mobile ? 140 : 170;

  return (
    <div style={{
      fontFamily: "'Hind', 'Segoe UI', sans-serif",
      background: C.bg, color: C.text, minHeight: "100vh",
      padding: mobile ? "14px 10px 32px" : "28px 24px 48px",
    }}>

      {/* ── Logo Bar ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: mobile ? 12 : 16, flexWrap: "wrap", gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: mobile ? 10 : 16 }}>
            <img src={PRISM_LOGO} alt="Prism Marketing"
              style={{ height: mobile ? 28 : 40, objectFit: "contain" }}
              crossOrigin="anonymous" />
            <div style={{ width: 1, height: mobile ? 22 : 30, background: C.border }} />
            <img src={AP_LOGO} alt="Aunt Porridge"
              style={{ height: mobile ? 34 : 46, objectFit: "contain", borderRadius: 6 }}
              crossOrigin="anonymous" />
          </div>
          <div style={{
            background: C.prismSoft, border: `1px solid ${C.border}`,
            borderRadius: 8, padding: "5px 12px",
            fontSize: 11, color: C.textMuted, fontFamily: "Hind, sans-serif",
          }}>
            Region:{" "}
            <span style={{ color: C.prism, fontWeight: 700, fontFamily: "Montserrat, sans-serif" }}>
              Jinja
            </span>
          </div>
        </div>

        {/* ── Title Block ── */}
        <div style={{
          background: `linear-gradient(135deg, ${C.prism}06 0%, ${C.orange}04 100%)`,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: mobile ? "14px 14px" : "22px 26px",
          marginBottom: mobile ? 14 : 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: C.prism,
              boxShadow: `0 0 10px ${C.prism}60`,
            }} />
            <span style={{
              fontSize: 10, fontWeight: 700, color: C.prism,
              letterSpacing: "0.1em", textTransform: "uppercase",
              fontFamily: "Montserrat, sans-serif",
            }}>
              Performance Analytics Dashboard
            </span>
          </div>
          <h1 style={{
            fontSize: mobile ? 18 : 25, fontWeight: 800, margin: 0, lineHeight: 1.25,
            fontFamily: "Montserrat, sans-serif", color: C.text,
          }}>
            Aunt Porridge{" "}
            <span style={{ color: C.prism }}>—</span>{" "}
            Jinja Market Activation
          </h1>
          <p style={{ color: C.textMuted, fontSize: 12, margin: "4px 0 0", fontFamily: "Hind, sans-serif" }}>
            Campaign sales performance &amp; conversion tracking · Prepared by Prism Marketing
          </p>
        </div>

        {/* ── KPI Row ── */}
        <div style={{
          display: "flex", gap: mobile ? 8 : 12,
          flexWrap: "wrap", marginBottom: mobile ? 14 : 20,
        }}>
          <KPI label="Total Revenue"  value={fmt(totalRevenue)} sub="All channels"    icon="💰" color={C.prism}  softColor={C.prismSoft}  mobile={mobile} />
          <KPI label="Units Sold"     value="1,598"             sub="7 SKUs"          icon="📦" color={C.orange} softColor={C.orangeSoft} mobile={mobile} />
          <KPI label="Shops Engaged"  value="17"                sub="4 converted"     icon="🏪" color={C.blue}   softColor={C.blueSoft}   mobile={mobile} />
          <KPI label="Rep Revenue"    value="UGX 1.3M"          sub="11% share"       icon="🤝" color={C.purple} softColor={C.purpleSoft} mobile={mobile} />
        </div>

        {/* ── Main Grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: tablet ? "1fr" : "1fr 1fr",
          gap: mobile ? 10 : 14,
          marginBottom: mobile ? 10 : 14,
        }}>

          {/* Channel Revenue Breakdown */}
          <Card title="Channel Revenue Breakdown">
            <div style={{
              display: "flex", gap: mobile ? 14 : 22, alignItems: "center",
              flexDirection: mobile ? "column" : "row",
            }}>
              <div style={{ flexShrink: 0 }}>
                <DonutChart data={channelData} size={donutSize} />
              </div>
              <div style={{ flex: 1, width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: 0 }}>
                {channelData.map((ch, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 12px",
                    background: i % 2 === 0 ? C.prismSofter : "transparent",
                    borderRadius: 10,
                    marginBottom: i < channelData.length - 1 ? 4 : 0,
                  }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: 3,
                      background: ch.color, flexShrink: 0,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "baseline", marginBottom: 4,
                      }}>
                        <span style={{ fontSize: 13, color: C.textMid, fontWeight: 500 }}>{ch.name}</span>
                        <span style={{
                          fontFamily: "Montserrat, sans-serif", fontSize: 12,
                          fontWeight: 700, color: C.text,
                        }}>
                          {ch.pct}%
                        </span>
                      </div>
                      <BarH value={ch.revenue} max={maxRev} color={ch.color} animate={animate} />
                      <div style={{ fontSize: 10, color: C.textDim, textAlign: "right", marginTop: 2 }}>
                        {fmt(ch.revenue)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Weekly Trend + GaugeArc */}
          <Card title="Weekly Revenue Trend">
            <WeeklyBars data={weeklyTrend} animate={animate} />
            <div style={{
              marginTop: 18, paddingTop: 14,
              borderTop: `1px solid ${C.borderLight}`,
              display: "flex", justifyContent: "space-between",
              alignItems: "center", flexWrap: "wrap", gap: 12,
            }}>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 3 }}>Avg per week</div>
                <div style={{
                  fontFamily: "Montserrat, sans-serif", fontSize: 20,
                  fontWeight: 800, color: C.text,
                }}>
                  {fmt(Math.round(totalRevenue / weeklyTrend.length))}
                </div>
              </div>
              <GaugeArc value={animate ? 68 : 0} size={mobile ? 110 : 130} />
            </div>
          </Card>

          {/* Product Units */}
          <Card title="Units Sold by SKU">
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {productData.map((d, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: C.textMid }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                      {d.name}
                    </span>
                    <span style={{
                      fontFamily: "Montserrat, sans-serif", fontSize: 13,
                      fontWeight: 700, color: C.text,
                    }}>
                      {d.units.toLocaleString()}
                    </span>
                  </div>
                  <BarH value={d.units} max={maxUnits} color={d.color} animate={animate} />
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 18, paddingTop: 12, borderTop: `1px solid ${C.borderLight}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 12, color: C.textMuted }}>Total units dispatched</span>
              <span style={{
                fontFamily: "Montserrat, sans-serif", fontSize: 16,
                fontWeight: 800, color: C.text,
              }}>
                {totalUnits.toLocaleString()} units
              </span>
            </div>
          </Card>

          {/* Right column: supermarkets + gradient summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: mobile ? 10 : 14 }}>

            <Card title="Top Supermarkets">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {retailData.map((d, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", borderRadius: 10,
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
                ))}
              </div>
              <div style={{
                marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.borderLight}`,
                fontSize: 11, color: C.textDim, textAlign: "center",
              }}>
                10 supermarkets total · 4 shown above
              </div>
            </Card>

            {/* Gradient summary */}
            <div style={{
              background: `linear-gradient(135deg, ${C.prism} 0%, ${C.prismDark} 100%)`,
              borderRadius: 16, padding: "20px 22px", color: "#fff", flex: 1,
            }}>
              <div style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
                textTransform: "uppercase", opacity: 0.75, marginBottom: 8,
              }}>
                #1 Channel — Activations
              </div>
              <div style={{
                fontFamily: "Montserrat, sans-serif", fontSize: 28,
                fontWeight: 800, lineHeight: 1.1,
              }}>
                {fmt(channelData[0].revenue)}
              </div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                {channelData[0].pct}% of total revenue
              </div>
              <div style={{
                marginTop: 16, paddingTop: 14,
                borderTop: "1px solid rgba(255,255,255,0.18)",
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8,
              }}>
                {channelData.slice(1).map((d) => (
                  <div key={d.name}>
                    <div style={{ fontSize: 9, opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {d.name}
                    </div>
                    <div style={{
                      fontFamily: "Montserrat, sans-serif", fontWeight: 700,
                      fontSize: 13, marginTop: 2,
                    }}>
                      {(d.revenue / 1e6).toFixed(1)}M
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          marginTop: 8, display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={PRISM_LOGO} alt="Prism" height={16} style={{ objectFit: "contain" }} />
            <span style={{ fontSize: 11, color: C.textDim }}>Powered by Prism Marketing</span>
          </div>
          <span style={{ fontSize: 11, color: C.textDim }}>
            Data: March 2025 · Aunt Porridge Uganda · Jinja
          </span>
        </div>
      </div>
    </div>
  );
}
