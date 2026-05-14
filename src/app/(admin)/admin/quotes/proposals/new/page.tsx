"use client";
import React, { useState, useCallback } from "react";
import { createProposal } from "@/app/actions/quotes";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type BlockType = "rich-text" | "price-table" | "checklist";
interface Block { id: string; type: BlockType; title: string; content: string; items?: Array<{ desc: string; cost: number; pvp: number }> }

const uid = () => Math.random().toString(36).slice(2);
const inputStyle: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,154,106,0.3)", color: "var(--text-primary)", padding: "0.6rem 0.75rem", fontFamily: "var(--font-body)", fontSize: "0.9rem", outline: "none" };
const labelStyle: React.CSSProperties = { display: "block", fontFamily: "var(--font-condensed)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.3rem" };
const formatCOP = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

function SortableBlock({ block, onUpdate, onRemove }: { block: Block; onUpdate: (b: Block) => void; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={{ ...style, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(184,154,106,0.15)", padding: "1rem", marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span {...attributes} {...listeners} style={{ cursor: "grab", color: "var(--text-secondary)", fontSize: "1.2rem" }}>⠿</span>
          <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--sand-tactical)", border: "1px solid rgba(184,154,106,0.3)", padding: "0.15rem 0.4rem" }}>{block.type}</span>
        </div>
        <button onClick={onRemove} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "0.9rem" }}>✕</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <input placeholder="Block title" value={block.title} onChange={e => onUpdate({ ...block, title: e.target.value })} style={inputStyle} />
        {block.type === "rich-text" && (
          <textarea placeholder="Content..." value={block.content} onChange={e => onUpdate({ ...block, content: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
        )}
        {block.type === "checklist" && (
          <textarea placeholder="Items (one per line)" value={block.content} onChange={e => onUpdate({ ...block, content: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
        )}
        {block.type === "price-table" && (
          <div>
            {(block.items ?? []).map((item, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "0.4rem", marginBottom: "0.4rem" }}>
                <input placeholder="Description" value={item.desc} onChange={e => { const items = [...(block.items ?? [])]; items[i] = { ...item, desc: e.target.value }; onUpdate({ ...block, items }); }} style={{ ...inputStyle, padding: "0.4rem 0.5rem" }} />
                <input placeholder="Cost" type="number" value={item.cost} onChange={e => { const items = [...(block.items ?? [])]; items[i] = { ...item, cost: +e.target.value }; onUpdate({ ...block, items }); }} style={{ ...inputStyle, padding: "0.4rem 0.5rem" }} />
                <input placeholder="PVP" type="number" value={item.pvp} onChange={e => { const items = [...(block.items ?? [])]; items[i] = { ...item, pvp: +e.target.value }; onUpdate({ ...block, items }); }} style={{ ...inputStyle, padding: "0.4rem 0.5rem" }} />
                <button onClick={() => { const items = (block.items ?? []).filter((_, j) => j !== i); onUpdate({ ...block, items }); }} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}>✕</button>
              </div>
            ))}
            <button onClick={() => onUpdate({ ...block, items: [...(block.items ?? []), { desc: "", cost: 0, pvp: 0 }] })} style={{ background: "none", border: "1px dashed rgba(184,154,106,0.3)", color: "var(--sand-tactical)", fontFamily: "var(--font-condensed)", fontSize: "0.75rem", padding: "0.4rem 0.75rem", cursor: "pointer", width: "100%", marginTop: "0.25rem" }}>+ Add line item</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewProposalPage() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const addBlock = (type: BlockType) => setBlocks(b => [...b, { id: uid(), type, title: "", content: "", items: type === "price-table" ? [] : undefined }]);
  const updateBlock = useCallback((id: string, updated: Block) => setBlocks(b => b.map(bl => bl.id === id ? updated : bl)), []);
  const removeBlock = useCallback((id: string) => setBlocks(b => b.filter(bl => bl.id !== id)), []);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks(b => { const oldIdx = b.findIndex(bl => bl.id === active.id); const newIdx = b.findIndex(bl => bl.id === over.id); return arrayMove(b, oldIdx, newIdx); });
    }
  }

  const Preview = () => (
    <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.15)", padding: "1.5rem", position: "sticky", top: "2rem", maxHeight: "80vh", overflowY: "auto" }}>
      <h3 style={{ fontFamily: "var(--font-hero)", fontSize: "1.5rem", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>{title || "Proposal Title"}</h3>
      {subtitle && <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", marginBottom: "1rem", fontSize: "0.85rem" }}>{subtitle}</p>}
      {blocks.map(block => (
        <div key={block.id} style={{ marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(184,154,106,0.08)" }}>
          {block.title && <h4 style={{ fontFamily: "var(--font-hero)", fontSize: "1rem", letterSpacing: "0.05em", marginBottom: "0.5rem", color: "var(--sand-tactical)" }}>{block.title}</h4>}
          {block.type === "rich-text" && <p style={{ fontFamily: "var(--font-condensed)", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{block.content}</p>}
          {block.type === "checklist" && block.content.split("\n").filter(Boolean).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "0.5rem", fontFamily: "var(--font-condensed)", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
              <span style={{ color: "#22c55e" }}>✓</span><span>{item}</span>
            </div>
          ))}
          {block.type === "price-table" && block.items && block.items.length > 0 && (
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-condensed)", fontSize: "0.75rem" }}>
              <thead><tr style={{ borderBottom: "1px solid rgba(184,154,106,0.2)" }}>{["Item","Cost","PVP","Margin"].map(h => <th key={h} style={{ textAlign: "left", padding: "0.3rem 0.5rem", color: "var(--text-secondary)" }}>{h}</th>)}</tr></thead>
              <tbody>{block.items.map((item, i) => <tr key={i}><td style={{ padding: "0.3rem 0.5rem" }}>{item.desc}</td><td>{formatCOP(item.cost)}</td><td style={{ color: "var(--metal-gold)" }}>{formatCOP(item.pvp)}</td><td style={{ color: item.pvp > item.cost ? "#22c55e" : "#f87171" }}>{item.cost > 0 ? `${Math.round(((item.pvp - item.cost) / item.cost) * 100)}%` : "—"}</td></tr>)}</tbody>
            </table>
          )}
        </div>
      ))}
      {blocks.length === 0 && <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", fontSize: "0.8rem" }}>Add blocks to see preview...</p>}
    </div>
  );

  return (
    <div style={{ padding: "2.5rem" }}>
      <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "2.5rem", letterSpacing: "0.1em", marginBottom: "2rem" }}>NEW PROPOSAL</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
            <div><label style={labelStyle}>Proposal Title</label><input value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>Subtitle</label><input value={subtitle} onChange={e => setSubtitle(e.target.value)} style={inputStyle} /></div>
          </div>
          {/* Add block buttons */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
            {(["rich-text", "price-table", "checklist"] as BlockType[]).map(type => (
              <button key={type} onClick={() => addBlock(type)} style={{ background: "transparent", border: "1px solid rgba(184,154,106,0.3)", color: "var(--sand-tactical)", fontFamily: "var(--font-condensed)", fontSize: "0.75rem", padding: "0.4rem 0.75rem", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                + {type.replace("-", " ")}
              </button>
            ))}
          </div>
          {/* DnD Blocks */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              {blocks.map(block => (
                <SortableBlock key={block.id} block={block} onUpdate={updated => updateBlock(block.id, updated)} onRemove={() => removeBlock(block.id)} />
              ))}
            </SortableContext>
          </DndContext>
          {/* Submit */}
          <form action={createProposal}>
            <input type="hidden" name="title" value={title} />
            <input type="hidden" name="subtitle" value={subtitle} />
            <input type="hidden" name="content" value={JSON.stringify(blocks)} />
            <button type="submit" style={{ background: "var(--sand-tactical)", color: "var(--coffee-black)", border: "none", padding: "0.75rem 2rem", fontFamily: "var(--font-hero)", letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer", fontSize: "1rem", marginTop: "1rem" }}>Save Proposal</button>
          </form>
        </div>
        <Preview />
      </div>
    </div>
  );
}
