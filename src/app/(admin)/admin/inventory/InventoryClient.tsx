"use client";
import React, { useState } from "react";
import { createMovement, adjustStock, createProdAlta } from "@/app/actions/inventory";

type InventoryItem = { id: string; product_code: string; product_name: string; category: string; unit: string; current_stock: number; min_stock: number; notes?: string };
type Movement = { id: string; inventory_id: string; type: string; quantity: number; reason?: string; movement_date: string; created_at: string; inventory?: { product_name: string; product_code: string } };
type AuditLog = { id: string; action_type: string; entity_type: string; admin_id?: string; created_at: string; details?: Record<string, unknown> };

const TABS = ["Inventario","Entradas","Empaque","Salidas","Reportes","Auditoría"];
const formatCOP = (n: number) => new Intl.NumberFormat("es-CO",{maximumFractionDigits:2}).format(n);

function StockBadge({ item }: { item: InventoryItem }) {
  const ok = item.current_stock > item.min_stock;
  const low = item.current_stock > 0 && item.current_stock <= item.min_stock;
  const color = ok ? "#22c55e" : low ? "#f59e0b" : "#ef4444";
  const label = ok ? "OK" : low ? "LOW" : "OUT";
  return <span style={{border:`1px solid ${color}`,color,fontFamily:"var(--font-condensed)",fontSize:"0.65rem",letterSpacing:"0.1em",padding:"0.2rem 0.5rem",textTransform:"uppercase"}}>{label}</span>;
}

const inputStyle: React.CSSProperties = {width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(184,154,106,0.3)",color:"var(--text-primary)",padding:"0.6rem 0.75rem",fontFamily:"var(--font-body)",fontSize:"0.9rem",outline:"none"};
const labelStyle: React.CSSProperties = {display:"block",fontFamily:"var(--font-condensed)",fontSize:"0.7rem",letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--text-secondary)",marginBottom:"0.3rem"};
const btnStyle: React.CSSProperties = {background:"var(--sand-tactical)",color:"var(--coffee-black)",border:"none",padding:"0.6rem 1.5rem",fontFamily:"var(--font-hero)",letterSpacing:"0.05em",textTransform:"uppercase",cursor:"pointer",fontSize:"0.9rem"};

export default function InventoryClient({ inventory, movements, auditLogs }: { inventory: InventoryItem[]; movements: Movement[]; auditLogs: AuditLog[] }) {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [historyItem, setHistoryItem] = useState<InventoryItem | null>(null);
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);

  const filtered = inventory.filter(i =>
    (catFilter === "all" || i.category === catFilter) &&
    (i.product_name.toLowerCase().includes(search.toLowerCase()) || i.product_code.toLowerCase().includes(search.toLowerCase()))
  );

  const tabBtn = (i: number) => ({
    background: tab === i ? "var(--sand-tactical)" : "transparent",
    color: tab === i ? "var(--coffee-black)" : "var(--text-secondary)",
    border: "none", padding: "0.6rem 1rem", fontFamily: "var(--font-condensed)",
    fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" as const,
    cursor: "pointer", transition: "all 0.2s ease",
  });

  return (
    <div style={{padding:"2.5rem"}}>
      <h1 style={{fontFamily:"var(--font-hero)",fontSize:"2.5rem",letterSpacing:"0.1em",marginBottom:"0.25rem"}}>INVENTORY</h1>
      <p style={{fontFamily:"var(--font-condensed)",color:"var(--text-secondary)",marginBottom:"2rem"}}>{inventory.length} SKUs tracked</p>

      {/* Tabs */}
      <div style={{display:"flex",gap:0,borderBottom:"1px solid rgba(184,154,106,0.15)",marginBottom:"2rem",flexWrap:"wrap"}}>
        {TABS.map((t,i) => <button key={t} style={tabBtn(i)} onClick={() => setTab(i)}>{t}</button>)}
      </div>

      {/* Tab 0: Inventario */}
      {tab === 0 && (
        <div>
          {/* Summary cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1rem",marginBottom:"2rem"}}>
            {[["Total SKUs", inventory.length,"📦"],["Low Stock",inventory.filter(i=>i.current_stock>0&&i.current_stock<=i.min_stock).length,"⚠️"],["Out of Stock",inventory.filter(i=>i.current_stock<=0).length,"🔴"]].map(([l,v,ic]) => (
              <div key={l as string} style={{background:"var(--camo-dark)",border:"1px solid rgba(184,154,106,0.15)",padding:"1.25rem"}}>
                <p style={{fontFamily:"var(--font-condensed)",fontSize:"0.7rem",color:"var(--text-secondary)",textTransform:"uppercase",letterSpacing:"0.1em"}}>{l}</p>
                <p style={{fontFamily:"var(--font-hero)",fontSize:"2rem",color:"var(--metal-gold)",marginTop:"0.25rem"}}>{ic} {v}</p>
              </div>
            ))}
          </div>
          {/* Filters */}
          <div style={{display:"flex",gap:"1rem",marginBottom:"1rem",flexWrap:"wrap"}}>
            <input placeholder="Search SKU or name..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inputStyle,maxWidth:300}} />
            <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{...inputStyle,maxWidth:180,background:"var(--camo-dark)"}}>
              <option value="all">All Categories</option>
              <option value="cafe">Café</option>
              <option value="empaque">Empaque</option>
              <option value="accesorio">Accesorio</option>
            </select>
          </div>
          {/* Table */}
          <div style={{background:"var(--camo-dark)",border:"1px solid rgba(184,154,106,0.15)"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 2fr 1fr 1fr 1fr 1fr auto",gap:"0.75rem",padding:"0.6rem 1rem",borderBottom:"1px solid rgba(184,154,106,0.1)",fontFamily:"var(--font-condensed)",fontSize:"0.65rem",color:"var(--text-secondary)",textTransform:"uppercase",letterSpacing:"0.1em"}}>
              <span>Code</span><span>Name</span><span>Category</span><span>Stock</span><span>Min</span><span>Status</span><span>Actions</span>
            </div>
            {filtered.map(item => (
              <div key={item.id} style={{display:"grid",gridTemplateColumns:"1fr 2fr 1fr 1fr 1fr 1fr auto",gap:"0.75rem",padding:"0.75rem 1rem",borderBottom:"1px solid rgba(184,154,106,0.05)",alignItems:"center"}}>
                <span style={{fontFamily:"var(--font-condensed)",fontSize:"0.75rem",color:"var(--text-secondary)"}}>{item.product_code}</span>
                <span style={{fontFamily:"var(--font-condensed)",fontSize:"0.85rem"}}>{item.product_name}</span>
                <span style={{fontFamily:"var(--font-condensed)",fontSize:"0.75rem",color:"var(--text-secondary)",textTransform:"capitalize"}}>{item.category}</span>
                <span style={{fontFamily:"var(--font-hero)",fontSize:"1rem",color:"var(--metal-gold)"}}>{formatCOP(item.current_stock)}</span>
                <span style={{fontFamily:"var(--font-condensed)",fontSize:"0.8rem",color:"var(--text-secondary)"}}>{formatCOP(item.min_stock)}</span>
                <StockBadge item={item} />
                <div style={{display:"flex",gap:"0.5rem"}}>
                  <button onClick={()=>setAdjustItem(item)} style={{...btnStyle,padding:"0.3rem 0.6rem",fontSize:"0.7rem"}}>Adjust</button>
                  <button onClick={()=>setHistoryItem(item)} style={{background:"transparent",border:"1px solid rgba(184,154,106,0.3)",color:"var(--sand-tactical)",padding:"0.3rem 0.6rem",fontFamily:"var(--font-condensed)",fontSize:"0.7rem",cursor:"pointer",textTransform:"uppercase",letterSpacing:"0.05em"}}>History</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Entradas */}
      {tab === 1 && (
        <div style={{maxWidth:600}}>
          <h2 style={{fontFamily:"var(--font-hero)",fontSize:"1.5rem",letterSpacing:"0.05em",marginBottom:"1.5rem"}}>LOG INCOMING STOCK</h2>
          <form action={createMovement} style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
            <input type="hidden" name="type" value="entrada" />
            <input type="hidden" name="tab_source" value="entradas" />
            <div><label style={labelStyle}>Product</label>
              <select name="inventory_id" required style={{...inputStyle,background:"var(--camo-dark)"}}>
                <option value="">Select product...</option>
                {inventory.map(i=><option key={i.id} value={i.id}>{i.product_name} ({i.product_code})</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
              <div><label style={labelStyle}>Quantity</label><input name="quantity" type="number" step="0.001" required style={inputStyle} /></div>
              <div><label style={labelStyle}>Entry Type</label>
                <select name="entry_type" style={{...inputStyle,background:"var(--camo-dark)"}}>
                  <option value="compra">Compra</option><option value="donacion">Donación</option><option value="ajuste">Ajuste</option>
                </select>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
              <div><label style={labelStyle}>Lot (Lote)</label><input name="lote" style={inputStyle} /></div>
              <div><label style={labelStyle}>Date</label><input name="movement_date" type="date" style={inputStyle} /></div>
            </div>
            <div><label style={labelStyle}>Responsible</label><input name="responsable" style={inputStyle} /></div>
            <div><label style={labelStyle}>Notes</label><input name="reason" style={inputStyle} /></div>
            <button type="submit" style={btnStyle}>Log Entry</button>
          </form>
        </div>
      )}

      {/* Tab 2: Empaque/Altas */}
      {tab === 2 && (
        <div style={{maxWidth:600}}>
          <h2 style={{fontFamily:"var(--font-hero)",fontSize:"1.5rem",letterSpacing:"0.05em",marginBottom:"0.5rem"}}>PRODUCTION PACKING</h2>
          <p style={{fontFamily:"var(--font-condensed)",color:"var(--text-secondary)",fontSize:"0.85rem",marginBottom:"1.5rem"}}>Log finished packaged units. Materials are auto-deducted.</p>
          <form action={createProdAlta} style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
            <div><label style={labelStyle}>Output Product</label>
              <select name="output_inventory_id" required style={{...inputStyle,background:"var(--camo-dark)"}}>
                <option value="">Select finished product...</option>
                {inventory.filter(i=>i.category==="cafe").map(i=><option key={i.id} value={i.id}>{i.product_name} ({i.product_code})</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
              <div><label style={labelStyle}>Units Produced</label><input name="output_quantity" type="number" step="1" min="1" required style={inputStyle} /></div>
              <div><label style={labelStyle}>Lot</label><input name="lote" style={inputStyle} /></div>
            </div>
            <div><label style={labelStyle}>Date</label><input name="movement_date" type="date" style={inputStyle} /></div>
            <input type="hidden" name="materials" value={JSON.stringify([
              {inventory_id: inventory.find(i=>i.product_code==="EMP-BOLSA")?.id ?? "", quantity: 1},
              {inventory_id: inventory.find(i=>i.product_code==="ETQ-CAFE")?.id ?? "", quantity: 1},
            ])} />
            <p style={{fontFamily:"var(--font-condensed)",fontSize:"0.75rem",color:"var(--text-secondary)"}}>Auto-deducts: 1 bag (EMP-BOLSA) + 1 label (ETQ-CAFE) per unit</p>
            <button type="submit" style={btnStyle}>Confirm Production</button>
          </form>
        </div>
      )}

      {/* Tab 3: Salidas */}
      {tab === 3 && (
        <div style={{maxWidth:600}}>
          <h2 style={{fontFamily:"var(--font-hero)",fontSize:"1.5rem",letterSpacing:"0.05em",marginBottom:"1.5rem"}}>LOG EXIT</h2>
          <form action={createMovement} style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
            <input type="hidden" name="type" value="salida" />
            <input type="hidden" name="tab_source" value="salidas" />
            <div><label style={labelStyle}>Product</label>
              <select name="inventory_id" required style={{...inputStyle,background:"var(--camo-dark)"}}>
                <option value="">Select product...</option>
                {inventory.map(i=><option key={i.id} value={i.id}>{i.product_name} ({i.product_code}) — Stock: {formatCOP(i.current_stock)}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
              <div><label style={labelStyle}>Quantity</label><input name="quantity" type="number" step="0.001" min="0.001" required style={inputStyle} /></div>
              <div><label style={labelStyle}>Date</label><input name="movement_date" type="date" style={inputStyle} /></div>
            </div>
            <div><label style={labelStyle}>Reason</label><input name="reason" required style={inputStyle} /></div>
            <button type="submit" style={btnStyle}>Log Exit</button>
          </form>
        </div>
      )}

      {/* Tab 4: Reportes */}
      {tab === 4 && (
        <div>
          <h2 style={{fontFamily:"var(--font-hero)",fontSize:"1.5rem",letterSpacing:"0.05em",marginBottom:"1.5rem"}}>REPORTS</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.5rem"}}>
            {["cafe","empaque","accesorio"].map(cat => {
              const items = inventory.filter(i=>i.category===cat);
              return (
                <div key={cat} style={{background:"var(--camo-dark)",border:"1px solid rgba(184,154,106,0.15)",padding:"1.5rem"}}>
                  <h3 style={{fontFamily:"var(--font-hero)",fontSize:"1.1rem",letterSpacing:"0.05em",marginBottom:"1rem",color:"var(--sand-tactical)",textTransform:"capitalize"}}>{cat}</h3>
                  {items.map(item => {
                    const pct = item.min_stock > 0 ? Math.min(100,(item.current_stock/item.min_stock)*100) : 100;
                    const color = item.current_stock > item.min_stock ? "#22c55e" : item.current_stock > 0 ? "#f59e0b" : "#ef4444";
                    return (
                      <div key={item.id} style={{marginBottom:"1rem"}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.3rem"}}>
                          <span style={{fontFamily:"var(--font-condensed)",fontSize:"0.8rem"}}>{item.product_name}</span>
                          <span style={{fontFamily:"var(--font-hero)",fontSize:"0.85rem",color:"var(--metal-gold)"}}>{formatCOP(item.current_stock)}</span>
                        </div>
                        <div style={{height:6,background:"rgba(255,255,255,0.1)",borderRadius:3}}>
                          <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:3,transition:"width 0.5s ease"}} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          {/* Movement summary */}
          <div style={{marginTop:"2rem",background:"var(--camo-dark)",border:"1px solid rgba(184,154,106,0.15)",padding:"1.5rem"}}>
            <h3 style={{fontFamily:"var(--font-hero)",fontSize:"1.1rem",letterSpacing:"0.05em",marginBottom:"1rem"}}>RECENT MOVEMENT SUMMARY</h3>
            {["entrada","salida","ajuste"].map(type => {
              const count = movements.filter(m=>m.type===type).length;
              const total = movements.filter(m=>m.type===type).reduce((s,m)=>s+Math.abs(m.quantity),0);
              return (
                <div key={type} style={{display:"flex",justifyContent:"space-between",padding:"0.5rem 0",borderBottom:"1px solid rgba(184,154,106,0.08)"}}>
                  <span style={{fontFamily:"var(--font-condensed)",fontSize:"0.8rem",textTransform:"capitalize",color:"var(--text-secondary)"}}>{type}</span>
                  <span style={{fontFamily:"var(--font-condensed)",fontSize:"0.8rem"}}>{count} movements · {formatCOP(total)} units</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: Auditoría */}
      {tab === 5 && (
        <div>
          <h2 style={{fontFamily:"var(--font-hero)",fontSize:"1.5rem",letterSpacing:"0.05em",marginBottom:"1.5rem"}}>AUDIT LOG</h2>
          <div style={{background:"var(--camo-dark)",border:"1px solid rgba(184,154,106,0.15)"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 2fr 1.5fr",gap:"0.75rem",padding:"0.6rem 1rem",borderBottom:"1px solid rgba(184,154,106,0.1)",fontFamily:"var(--font-condensed)",fontSize:"0.65rem",color:"var(--text-secondary)",textTransform:"uppercase",letterSpacing:"0.1em"}}>
              <span>Action</span><span>Entity</span><span>Details</span><span>Time</span>
            </div>
            {auditLogs.map(log => (
              <div key={log.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 2fr 1.5fr",gap:"0.75rem",padding:"0.75rem 1rem",borderBottom:"1px solid rgba(184,154,106,0.05)",alignItems:"center"}}>
                <span style={{fontFamily:"var(--font-condensed)",fontSize:"0.75rem",color: log.action_type==="DELETE"?"#ef4444":log.action_type==="CREATE"?"#22c55e":"#3b82f6"}}>{log.action_type}</span>
                <span style={{fontFamily:"var(--font-condensed)",fontSize:"0.75rem",color:"var(--text-secondary)"}}>{log.entity_type}</span>
                <span style={{fontFamily:"var(--font-condensed)",fontSize:"0.75rem",color:"var(--text-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{JSON.stringify(log.details)}</span>
                <span style={{fontFamily:"var(--font-condensed)",fontSize:"0.75rem",color:"var(--text-secondary)"}}>{new Date(log.created_at).toLocaleString("es-CO")}</span>
              </div>
            ))}
            {auditLogs.length === 0 && <div style={{padding:"2rem",textAlign:"center",fontFamily:"var(--font-condensed)",color:"var(--text-secondary)"}}>No audit logs.</div>}
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {adjustItem && (
        <div style={{position:"fixed",inset:0,zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div onClick={()=>setAdjustItem(null)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)"}} />
          <div style={{position:"relative",background:"var(--camo-dark)",width:"min(460px,95vw)",padding:"2rem",border:"1px solid rgba(184,154,106,0.2)"}}>
            <h3 style={{fontFamily:"var(--font-hero)",fontSize:"1.3rem",letterSpacing:"0.05em",marginBottom:"0.25rem"}}>ADJUST STOCK</h3>
            <p style={{fontFamily:"var(--font-condensed)",color:"var(--text-secondary)",fontSize:"0.85rem",marginBottom:"1.5rem"}}>{adjustItem.product_name} — Current: {formatCOP(adjustItem.current_stock)}</p>
            <form action={adjustStock} onSubmit={()=>setAdjustItem(null)} style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
              <input type="hidden" name="inventory_id" value={adjustItem.id} />
              <div><label style={labelStyle}>New Stock Value</label><input name="new_stock" type="number" step="0.001" defaultValue={adjustItem.current_stock} required style={inputStyle} /></div>
              <div><label style={labelStyle}>Reason</label><input name="reason" required style={inputStyle} /></div>
              <div style={{display:"flex",gap:"0.75rem"}}>
                <button type="submit" style={btnStyle}>Apply</button>
                <button type="button" onClick={()=>setAdjustItem(null)} style={{...btnStyle,background:"transparent",border:"1px solid rgba(184,154,106,0.3)",color:"var(--sand-tactical)"}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Drawer */}
      {historyItem && (
        <div style={{position:"fixed",inset:0,zIndex:2000,display:"flex",justifyContent:"flex-end"}}>
          <div onClick={()=>setHistoryItem(null)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)"}} />
          <div style={{position:"relative",background:"var(--camo-dark)",width:"min(500px,95vw)",height:"100%",overflowY:"auto",borderLeft:"1px solid rgba(184,154,106,0.2)",padding:"2rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
              <h3 style={{fontFamily:"var(--font-hero)",fontSize:"1.3rem",letterSpacing:"0.05em"}}>{historyItem.product_name}</h3>
              <button onClick={()=>setHistoryItem(null)} style={{background:"none",border:"none",color:"var(--text-primary)",fontSize:"1.3rem",cursor:"pointer"}}>✕</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
              {movements.filter(m=>m.inventory_id===historyItem.id).slice(0,50).map(m => (
                <div key={m.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.5rem",padding:"0.75rem",border:"1px solid rgba(184,154,106,0.08)",background:"rgba(255,255,255,0.02)"}}>
                  <span style={{fontFamily:"var(--font-condensed)",fontSize:"0.75rem",textTransform:"uppercase",color:m.type==="entrada"?"#22c55e":m.type==="salida"?"#ef4444":"#f59e0b"}}>{m.type}</span>
                  <span style={{fontFamily:"var(--font-hero)",fontSize:"0.9rem",color:"var(--metal-gold)"}}>{m.quantity > 0 ? "+" : ""}{formatCOP(m.quantity)}</span>
                  <span style={{fontFamily:"var(--font-condensed)",fontSize:"0.7rem",color:"var(--text-secondary)"}}>{m.movement_date}</span>
                  {m.reason && <span style={{gridColumn:"1/-1",fontFamily:"var(--font-condensed)",fontSize:"0.7rem",color:"var(--text-secondary)"}}>{m.reason}</span>}
                </div>
              ))}
              {movements.filter(m=>m.inventory_id===historyItem.id).length === 0 && (
                <p style={{fontFamily:"var(--font-condensed)",color:"var(--text-secondary)",textAlign:"center",padding:"2rem"}}>No movements recorded.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
