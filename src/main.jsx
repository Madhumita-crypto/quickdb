import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const partners = [
  {name:"TATA 1mg", orders:8897, share:33.2, delivery:70.8, cancel:22.4, tat:19.8, late:20.2, gmv:6.11},
  {name:"Apollo", orders:5577, share:20.8, delivery:52.8, cancel:47.2, tat:30.3, late:12.2, gmv:4.02},
  {name:"Pharmeasy", orders:5542, share:20.7, delivery:89.4, cancel:10.5, tat:22.9, late:15.5, gmv:3.74},
  {name:"PillO", orders:3836, share:14.3, delivery:86.8, cancel:12.9, tat:0.8, late:0.3, gmv:2.28},
  {name:"Wellness Forever", orders:1933, share:7.2, delivery:90.3, cancel:9.7, tat:1.2, late:2.0, gmv:0.83},
  {name:"PillUp", orders:309, share:1.2, delivery:65.0, cancel:35.0, tat:128.6, late:88.6, gmv:0.34}
];

const monthly = [
  {m:"Mar", orders:23910, delivered:18150, cancel:20.5, gmv:15.3},
  {m:"Apr", orders:24880, delivered:18740, cancel:21.0, gmv:15.9},
  {m:"May", orders:25740, delivered:19080, cancel:21.6, gmv:16.4},
  {m:"Jun", orders:25110, delivered:18690, cancel:22.0, gmv:16.8},
  {m:"Jul", orders:26430, delivered:19440, cancel:22.3, gmv:17.0},
  {m:"Aug", orders:26795, delivered:19872, cancel:22.7, gmv:17.32}
];

const sources = [
  ["D&B",17990,67.1],["Tele Consult Rx",6821,25.5],["S&B",901,3.4],["Others AHC / Wellness",878,3.3],["Scan & Pay",197,0.7],["D2P",8,0.0]
];

const tickets = [
  ["Order / delivery issue",5120,24.0],["Medicine availability",3910,18.3],["Cancellation / refund",3550,16.6],["Partner fulfilment",3020,14.1],["Prescription / validation",2410,11.3],["Other",4052,19.0]
];

const orders = [
  {id:"QP-260818-48192", partner:"TATA 1mg", city:"Mumbai", sponsor:"Niva Bupa", amount:1486, status:"Delivered", tat:"18.4h", source:"D&B", payment:"UPI", medicines:4},
  {id:"QP-260827-73421", partner:"Apollo", city:"Delhi", sponsor:"Niva Bupa", amount:2280, status:"Cancelled", tat:"—", source:"Tele Consult Rx", payment:"Card", medicines:6},
  {id:"QP-260829-19304", partner:"Pharmeasy", city:"Bengaluru", sponsor:"ICICI Lombard", amount:932, status:"Delivered", tat:"12.2h", source:"D&B", payment:"UPI", medicines:2},
  {id:"QP-260830-88310", partner:"PillUp", city:"Gurugram", sponsor:"Niva Bupa", amount:1240, status:"Pending", tat:"96.8h", source:"D&B", payment:"UPI", medicines:3},
  {id:"QP-260831-44182", partner:"Wellness Forever", city:"Mumbai", sponsor:"HDFC ERGO", amount:760, status:"Delivered", tat:"1.1h", source:"S&B", payment:"UPI", medicines:2},
  {id:"QP-260901-55173", partner:"TATA 1mg", city:"Noida", sponsor:"Niva Bupa", amount:1815, status:"Cancelled", tat:"—", source:"Scan & Pay", payment:"UPI", medicines:5}
];

const cities = [
  ["Delhi",6120,73.4,24.1],["Mumbai",4310,78.2,19.2],["Bengaluru",3010,81.5,15.0],
  ["Gurugram",2240,75.6,21.8],["Noida",1880,72.1,24.8],["Pune",1760,76.8,20.0],
  ["Hyderabad",1510,79.0,18.2],["Chennai",1320,77.3,19.7]
];

function fmt(n){return n.toLocaleString("en-IN")}
function money(n){return "₹"+n.toFixed(2)+" Cr"}
function pct(n){return n.toFixed(1)+"%"}
function cls(v, good=false){return good ? (v>=80?"good":v>=70?"warn":"bad") : (v<=15?"good":v<=25?"warn":"bad")}

function Icon({children}){return <span className="icon">{children}</span>}

function Header({page,setPage}){
 const nav=[["Overview","◈"],["Order Explorer","⌕"],["Trends","⌁"],["Partners","◉"],["Network","⌖"],["Sponsors","◇"],["Operations","◷"],["Cancellations","×"],["Customer Tickets","▤"],["Commercial & KPIs","₹"],["More","•••"]];
 return <header>
   <div className="brand"><div className="brandmark">Q</div><div><div className="brandtitle">Quick Pharmacy</div><div className="brandsub">Analytics workspace</div></div></div>
   <nav>{nav.map(([n,i])=><button key={n} className={page===n?"active":""} onClick={()=>setPage(n)}><span>{i}</span>{n}</button>)}</nav>
   <div className="top-actions"><span className="prototype">Prototype</span><button className="avatar">MA</button></div>
 </header>
}

function Filters(){
 return <div className="filters"><div className="filter"><small>PERIOD</small><b>Aug 2026</b><span>⌄</span></div><div className="filter"><small>SPONSOR</small><b>All sponsors</b><span>⌄</span></div><div className="filter"><small>PARTNER</small><b>All partners</b><span>⌄</span></div><div className="filter"><small>SOURCE</small><b>All sources</b><span>⌄</span></div><button className="reset">Reset</button></div>
}

function Kpi({label,value,sub,accent}){
 return <div className="kpi"><div className="kpi-label">{label}</div><div className={"kpi-value "+(accent||"")}>{value}</div>{sub&&<div className="kpi-sub">{sub}</div>}</div>
}

function Section({title,sub,children,action}){
 return <section className="section"><div className="section-head"><div><h2>{title}</h2>{sub&&<p>{sub}</p>}</div>{action&&<button className="ghost">{action} →</button>}</div>{children}</section>
}

function SparkChart(){
 const vals=[23910,24880,25740,25110,26430,26795], max=Math.max(...vals);
 return <div className="spark"><div className="spark-bars">{vals.map((v,i)=><div className="barwrap" key={i}><div className="bar" style={{height:(v/max*100)+"%"}}/><span>{monthly[i].m}</span></div>)}</div><div className="legend"><span><i/> Orders</span><span className="muted">Aug is +1.4% vs Jul</span></div></div>
}

function Donut(){
 return <div className="donut-wrap"><div className="donut"><div><strong>26,795</strong><span>orders</span></div></div><div className="donut-legend">{sources.slice(0,5).map(([n,v,p])=><div key={n}><i/><span>{n}</span><b>{p}%</b></div>)}</div></div>
}

function Overview({setPage}){
 return <main><div className="hero"><div><div className="eyebrow">AUGUST 2026 · QUICK PHARMACY</div><h1>From network signal to the exact order driving it</h1><p>Investigate pharmacy performance, operations and customer pain in one workspace.</p></div><button className="primary" onClick={()=>setPage("Order Explorer")}>Open Order Explorer →</button></div>
 <Filters/>
 <div className="grid kpis"><Kpi label="Orders" value="26,795" sub="+1.4% vs Jul"/><Kpi label="Delivered" value="19,872" sub="74.2% delivery rate"/><Kpi label="Cancelled" value="6,081" sub="22.7% cancellation rate" accent="badtext"/><Kpi label="Net GMV" value="₹17.32 Cr" sub="₹975 net AOV"/><Kpi label="Tickets / 1K" value="113.1" sub="Customer support load"/></div>
 <div className="two"><Section title="Order volume" sub="Monthly order movement"><SparkChart/></Section><Section title="Source mix" sub="Where August orders originated"><Donut/></Section></div>
 <Section title="Five signals worth opening today" sub="Use the cards below to jump from aggregate signal to investigation."><div className="signals">
   <button onClick={()=>setPage("Partners")}><span className="signal-icon bad">↓</span><div><b>Apollo delivery rate</b><strong>52.8%</strong><small>47.2% cancelled · highest partner exception</small></div><span>→</span></button>
   <button onClick={()=>setPage("Partners")}><span className="signal-icon bad">!</span><div><b>Apollo cancellation</b><strong>47.2%</strong><small>2,632 cancelled orders in August</small></div><span>→</span></button>
   <button onClick={()=>setPage("Operations")}><span className="signal-icon warn">◷</span><div><b>PillUp median TAT</b><strong>128.6h</strong><small>88.6% of orders crossed 72h</small></div><span>→</span></button>
   <button onClick={()=>setPage("Cancellations")}><span className="signal-icon warn">?</span><div><b>Unclassified cancellations</b><strong>56.4%</strong><small>3,427 cancellations lack a usable reason</small></div><span>→</span></button>
   <button onClick={()=>setPage("Customer Tickets")}><span className="signal-icon">◌</span><div><b>Customer pain</b><strong>3,550</strong><small>cancellation / refund tickets</small></div><span>→</span></button>
 </div></Section>
 <Section title="Partner performance" sub="August operating view" action="View partners"><table><thead><tr><th>Partner</th><th>Orders</th><th>Delivery</th><th>Cancel</th><th>Median TAT</th><th>&gt;72h</th></tr></thead><tbody>{partners.map(p=><tr key={p.name}><td><b>{p.name}</b></td><td>{fmt(p.orders)}</td><td><span className={"pill "+cls(p.delivery,true)}>{pct(p.delivery)}</span></td><td><span className={"pill "+cls(p.cancel)}>{pct(p.cancel)}</span></td><td>{p.tat}h</td><td>{p.late}%</td></tr>)}</tbody></table></Section>
 </main>
}

function Trends(){
 return <main><PageTitle eyebrow="BUSINESS PERFORMANCE" title="Trends & seasonality" sub="Track volume, fulfilment and commercial movement over time."/><Filters/><div className="grid kpis"><Kpi label="6M order growth" value="+12.1%" sub="Mar → Aug"/><Kpi label="Aug delivery" value="74.2%" sub="vs 71.8% in Mar"/><Kpi label="Aug cancellation" value="22.7%" sub="highest in 6 months"/><Kpi label="Aug net GMV" value="₹17.32 Cr" sub="+13.2% vs Mar"/></div><Section title="Monthly performance" sub="Representative historical trend for the prototype"><table><thead><tr><th>Month</th><th>Orders</th><th>Delivered</th><th>Delivery rate</th><th>Cancel rate</th><th>Net GMV</th></tr></thead><tbody>{monthly.map(x=><tr key={x.m}><td><b>{x.m} 2026</b></td><td>{fmt(x.orders)}</td><td>{fmt(x.delivered)}</td><td>{pct(x.delivered/x.orders*100)}</td><td>{pct(x.cancel)}</td><td>₹{x.gmv.toFixed(2)} Cr</td></tr>)}</tbody></table></Section><div className="two"><Section title="Seasonality lens" sub="Volume pattern by month"><div className="line-visual">{monthly.map((x,i)=><div key={x.m} className="line-point" style={{left:(i/(monthly.length-1)*92+4)+"%",bottom:((x.orders-23000)/4500*72+10)+"%"}}><span>{fmt(x.orders/1000)}k</span><i/></div>)}</div></Section><Section title="Read the movement" sub="Context for the next drilldown"><div className="insight-list"><p><b>Volume:</b> orders have risen each month overall, with a small June dip.</p><p><b>Fulfilment:</b> delivery rate remains above 70% across the displayed period.</p><p><b>Exception:</b> cancellation rate has gradually increased and reaches 22.7% in August.</p></div></Section></div></main>
}

function Partners(){
 return <main><PageTitle eyebrow="PARTNER PERFORMANCE" title="Partner performance" sub="Compare fulfilment, cancellations and delivery speed without losing the operational detail."/><Filters/><Section title="Partner scorecard" sub="August 2026 · representative prototype values"><table><thead><tr><th>Partner</th><th>Orders</th><th>Share</th><th>Delivery</th><th>Cancel</th><th>Median TAT</th><th>&gt;72h</th><th>Net GMV</th></tr></thead><tbody>{partners.map(p=><tr key={p.name}><td><b>{p.name}</b></td><td>{fmt(p.orders)}</td><td>{p.share}%</td><td><span className={"pill "+cls(p.delivery,true)}>{p.delivery}%</span></td><td><span className={"pill "+cls(p.cancel)}>{p.cancel}%</span></td><td>{p.tat}h</td><td>{p.late}%</td><td>₹{p.gmv.toFixed(2)} Cr</td></tr>)}</tbody></table></Section><div className="two"><Section title="Delivery rate"><div className="rankbars">{partners.map(p=><div key={p.name}><div><span>{p.name}</span><b>{p.delivery}%</b></div><div className="track"><i style={{width:p.delivery+"%"}}/></div>)}</div></Section><Section title="Cancellation rate"><div className="rankbars">{partners.map(p=><div key={p.name}><div><span>{p.name}</span><b>{p.cancel}%</b></div><div className="track"><i className="dangerbar" style={{width:p.cancel*2+"%"}}/></div>)}</div></Section></div></main>
}

function Network(){
 return <main><PageTitle eyebrow="NETWORK" title="Network & geography" sub="See where order volume and fulfilment pressure are concentrated."/><Filters/><div className="grid kpis"><Kpi label="Tier 1 orders" value="19,144" sub="77.1% delivery"/><Kpi label="Tier 2 orders" value="4,651" sub="66.7% delivery"/><Kpi label="Tier 3 orders" value="2,998" sub="67.2% delivery"/><Kpi label="Top city" value="Delhi" sub="6,120 orders"/></div><Section title="City operating matrix" sub="Representative city-level prototype data"><table><thead><tr><th>City</th><th>Orders</th><th>Delivery</th><th>Cancel</th><th>Signal</th></tr></thead><tbody>{cities.map(c=><tr key={c[0]}><td><b>{c[0]}</b></td><td>{fmt(c[1])}</td><td>{c[2]}%</td><td>{c[3]}%</td><td><span className={"pill "+(c[2]>=78?"good":"warn")}>{c[2]>=78?"Stable":"Watch"}</span></td></tr>)}</tbody></table></Section><div className="map-placeholder"><div className="map-grid"/><div className="map-card"><span>NETWORK VIEW</span><strong>Delhi · Mumbai · Bengaluru</strong><p>Interactive map layer can be connected to station/city coordinates in the next data-backed version.</p></div></div></main>
}

function Sponsors(){
 const sponsors=[["Niva Bupa",11820,44.1,74.0],["ICICI Lombard",6240,23.3,76.1],["HDFC ERGO",4810,18.0,78.5],["Other sponsors",3925,14.6,70.4]];
 return <main><PageTitle eyebrow="SPONSORS" title="Sponsor performance" sub="Understand sponsored demand and its downstream fulfilment."/><Filters/><Section title="Sponsor mix" sub="August 2026"><div className="sponsor-grid">{sponsors.map(s=><div className="sponsor-card" key={s[0]}><div className="mini-ring" style={{"--p":s[2]*3.6+"deg"}}>{s[2]}%</div><div><b>{s[0]}</b><span>{fmt(s[1])} orders</span><small>{s[3]}% delivery</small></div></div>)}</div></Section><Section title="Sponsor table"><table><thead><tr><th>Sponsor</th><th>Orders</th><th>Share</th><th>Delivery</th><th>Notes</th></tr></thead><tbody>{sponsors.map(s=><tr key={s[0]}><td><b>{s[0]}</b></td><td>{fmt(s[1])}</td><td>{s[2]}%</td><td>{s[3]}%</td><td>Drill into partner mix</td></tr>)}</tbody></table></Section></main>
}

function Operations(){
 return <main><PageTitle eyebrow="OPERATIONS" title="Operations & exceptions" sub="Find the slowest queues, long-running orders and operational leakage."/><Filters/><div className="grid kpis"><Kpi label="Median TAT" value="22.9h" sub="August network median"/><Kpi label="Orders >72h" value="14.8%" sub="Needs operational review"/><Kpi label="Longest queue" value="PillUp" sub="128.6h median TAT"/><Kpi label="Open exceptions" value="1,284" sub="Representative prototype value"/></div><Section title="TAT by partner"><div className="rankbars">{partners.map(p=><div key={p.name}><div><span>{p.name}</span><b>{p.tat}h</b></div><div className="track"><i style={{width:Math.min(100,p.tat/1.286)+"%"}}/></div>)}</div></Section><Section title="Order exceptions" sub="Click an order to open the investigation drawer"><div className="exception-list">{orders.filter(o=>o.tat!=="—").map(o=><button key={o.id}><div><b>{o.id}</b><span>{o.partner} · {o.city}</span></div><strong className={o.tat.startsWith("9")?"badtext":""}>{o.tat}</strong><span>→</span></button>)}</div></Section></main>
}

function Cancellations(){
 return <main><PageTitle eyebrow="CUSTOMER PAIN" title="Cancellations" sub="Break down cancellation volume, attribution and the gaps in reason capture."/><Filters/><div className="grid kpis"><Kpi label="Cancelled orders" value="6,081" sub="22.7% of August orders"/><Kpi label="No usable reason" value="3,427" sub="56.4% of cancellations" accent="badtext"/><Kpi label="Partner attributed" value="62.3%" sub="of classified cancellations"/><Kpi label="Customer attributed" value="17.7%" sub="of classified cancellations"/></div><div className="two"><Section title="Attribution"><div className="attrib"><div><span>Partner</span><b>62.3%</b><i style={{width:"62.3%"}}/></div><div><span>Customer</span><b>17.7%</b><i style={{width:"17.7%"}}/></div><div><span>Ops</span><b>19.2%</b><i style={{width:"19.2%"}}/></div><div><span>Not specific</span><b>56.4%</b><i style={{width:"56.4%"}}/></div></div></Section><Section title="Reason capture"><div className="big-number">3,427</div><p className="muted">cancellations currently lack a usable reason in the August view. This is the largest investigation gap in the prototype.</p><button className="primary small">Open cancellation explorer →</button></Section></div><Section title="Reason buckets"><div className="reason-grid">{["Partner fulfilment","Customer request","Stock unavailable","Payment issue","Not Specific"].map((x,i)=><div key={x}><b>{x}</b><strong>{[1240,1080,740,294,3427][i].toLocaleString()}</strong><span>{[20.4,17.8,12.2,4.8,56.4][i]}%</span></div>)}</div></Section></main>
}

function Tickets(){
 return <main><PageTitle eyebrow="CUSTOMER SUPPORT" title="Customer tickets" sub="Connect ticket volume and reasons back to orders and partners."/><Filters/><div className="grid kpis"><Kpi label="Tickets" value="5,565" sub="113.1 per 1K orders"/><Kpi label="Open backlog" value="428" sub="Representative prototype value"/><Kpi label="Resolution rate" value="91.4%" sub="Representative prototype value"/><Kpi label="CSAT" value="4.3 / 5" sub="Representative prototype value"/></div><div className="two"><Section title="Top ticket reasons"><div className="reason-bars">{tickets.map(t=><div key={t[0]}><div><span>{t[0]}</span><b>{fmt(t[1])}</b></div><div className="track"><i style={{width:t[2]*1.9+"%"}}/></div>)}</div></Section><Section title="Ticket → order bridge"><div className="bridge"><div><span>Tickets</span><b>5,565</b></div><i>→</i><div><span>Order-linked</span><b>4,921</b></div><i>→</i><div><span>Partner cases</span><b>3,874</b></div></div><p className="muted">The intended workflow is to move from support signal to the exact order and partner context.</p></Section></div><Section title="Daily ticket movement"><div className="ticket-bars">{[42,55,48,72,61,80,68,91,76,83,71,95,86,74].map((x,i)=><div key={i} style={{height:x+"%"}}><span>{i+1}</span></div>)}</div></Section></main>
}

function Commercial(){
 return <main><PageTitle eyebrow="COMMERCIAL" title="Commercial & KPIs" sub="Keep revenue, discounts and realisation in the same operating view."/><Filters/><div className="grid kpis"><Kpi label="Gross GMV" value="₹23.18 Cr" sub="Order value before Visit discount"/><Kpi label="Net GMV" value="₹17.32 Cr" sub="After Visit-funded discount"/><Kpi label="GMV realisation" value="74.6%" sub="Net / gross GMV"/><Kpi label="Net AOV" value="₹975" sub="Net GMV / orders"/></div><div className="two"><Section title="Commercial bridge"><div className="bridge vertical"><div><span>Gross GMV</span><b>₹23.18 Cr</b></div><i>− ₹5.86 Cr</i><div><span>Discounts / leakage</span><b>₹5.86 Cr</b></div><i>=</i><div><span>Net GMV</span><b>₹17.32 Cr</b></div></div></Section><Section title="KPI definitions"><div className="definitions"><p><b>Gross GMV</b> — order value before Visit-funded discount.</p><p><b>Net GMV</b> — order value after Visit-funded discount.</p><p><b>Realisation</b> — Net GMV divided by Gross GMV.</p><p><b>Net AOV</b> — Net GMV divided by orders.</p></div></Section></div></main>
}

function OrderExplorer(){
 const [q,setQ]=useState(""); const [selected,setSelected]=useState(orders[0]);
 const filtered=orders.filter(o=>Object.values(o).join(" ").toLowerCase().includes(q.toLowerCase()));
 return <main><PageTitle eyebrow="INVESTIGATION LAYER" title="Order Explorer" sub="Move from an aggregate signal to the exact order, partner and case context."/><div className="explorer-toolbar"><div className="search">⌕<input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search order ID, partner, city, sponsor..." /></div><button className="filter-button">Filters · 4</button></div><div className="explorer"><div className="order-list"><div className="list-head"><b>{filtered.length} orders</b><span>August 2026</span></div>{filtered.map(o=><button className={selected.id===o.id?"selected":""} key={o.id} onClick={()=>setSelected(o)}><div><b>{o.id}</b><span>{o.partner} · {o.city}</span></div><div><strong>₹{fmt(o.amount)}</strong><small className={o.status==="Cancelled"?"badtext":o.status==="Pending"?"warntext":"goodtext"}>{o.status}</small></div></button>)}</div><div className="order-detail"><div className="detail-top"><div><span>ORDER</span><h2>{selected.id}</h2><p>{selected.partner} · {selected.city} · {selected.source}</p></div><span className={"status "+selected.status.toLowerCase()}>{selected.status}</span></div><div className="detail-grid"><div><small>Order value</small><b>₹{fmt(selected.amount)}</b></div><div><small>Delivery TAT</small><b>{selected.tat}</b></div><div><small>Medicines</small><b>{selected.medicines}</b></div><div><small>Payment</small><b>{selected.payment}</b></div><div><small>Sponsor</small><b>{selected.sponsor}</b></div><div><small>Source</small><b>{selected.source}</b></div></div><div className="timeline"><h3>Case timeline</h3><div><i/><p><b>Order created</b><span>Prescription received and order routed.</span></p></div><div><i/><p><b>Partner action</b><span>Partner acknowledgement captured.</span></p></div><div><i/><p><b>Current state</b><span>{selected.status==="Delivered"?"Delivered successfully":"Requires operational investigation."}</span></p></div></div><div className="detail-actions"><button className="primary">Open case details</button><button className="ghost">Copy order ID</button></div></div></div></main>
}

function More(){
 return <main><PageTitle eyebrow="GOVERNANCE" title="More" sub="Supporting layers that make the dashboard easier to trust and maintain."/><div className="more-grid"><div className="more-card"><span>01</span><h2>Data Quality</h2><p>Checks for duplicate order IDs, missing statuses, normalised city names and ticket deduplication.</p><b>105,471 rows checked · PASS</b></div><div className="more-card"><span>02</span><h2>Definitions</h2><p>Document the exact meaning of orders, delivery, cancellation, Gross GMV, Net GMV and TAT.</p><b>12 core KPI definitions</b></div><div className="more-card"><span>03</span><h2>Reconciliations</h2><p>Show where workbook and central data differ because of refresh timing or metric definitions.</p><b>Workbook vs central view</b></div><div className="more-card"><span>04</span><h2>Daily Orders</h2><p>Daily order movement, delivery and cancellation trends for operational review.</p><b>Aug 4 → Sep 8 view</b></div></div></main>
}

function PageTitle({eyebrow,title,sub}){return <div className="page-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{sub}</p></div></div>}

function App(){
 const [page,setPage]=useState("Overview");
 const content=page==="Overview"?<Overview setPage={setPage}/>:page==="Order Explorer"?<OrderExplorer/>:page==="Trends"?<Trends/>:page==="Partners"?<Partners/>:page==="Network"?<Network/>:page==="Sponsors"?<Sponsors/>:page==="Operations"?<Operations/>:page==="Cancellations"?<Cancellations/>:page==="Customer Tickets"?<Tickets/>:page==="Commercial & KPIs"?<Commercial/>:<More/>;
 return <><Header page={page} setPage={setPage}/>{content}<footer><span>Quick Pharmacy Analytics · Version 1</span><span>Mockup data · Designed for workflow validation</span></footer></>
}
createRoot(document.getElementById("root")).render(<App/>);