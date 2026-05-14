"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { upsertSubscription } from "@/app/actions/subscriptions";

const DEPARTMENTS = [
  "Amazonas","Antioquia","Arauca","Atlántico","Bolívar","Boyacá","Caldas","Caquetá",
  "Casanare","Cauca","Cesar","Chocó","Córdoba","Cundinamarca","Guainía","Guaviare",
  "Huila","La Guajira","Magdalena","Meta","Nariño","Norte de Santander","Putumayo",
  "Quindío","Risaralda","San Andrés y Providencia","Santander","Sucre","Tolima",
  "Valle del Cauca","Vaupés","Vichada"
];

const PLANS = [
  { id: "essential", name: "Essential Devotion", price: 35000, description: "The perfect starting mission. Single origin, consistent quality." },
  { id: "alchemy", name: "Alchemy & Contrast", price: 48000, description: "Two origins per delivery. Explore flavor contrasts." },
  { id: "curator", name: "Private Curation", price: 65000, description: "Exclusive micro-lots. The pinnacle of specialty coffee." },
];

const WEIGHT_MULTIPLIERS: Record<string, number> = { "250g": 1, "500g": 1.8, "2.5kg": 8 };
const FREQ_LABELS: Record<string, string> = { weekly: "Weekly", "bi-weekly": "Bi-weekly", monthly: "Monthly" };
const STEPS = ["Plan", "Customize", "Frequency", "Shipping"];
const formatCOP = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default function BuilderContent() {
  const searchParams = useSearchParams();
  const preselectedPlan = searchParams.get("plan");

  const [step, setStep] = useState(preselectedPlan ? 1 : 0);
  const [planId, setPlanId] = useState(preselectedPlan ?? "essential");
  const [weight, setWeight] = useState("250g");
  const [grind, setGrind] = useState("whole");
  const [grindLevel, setGrindLevel] = useState("espresso");
  const [frequency, setFrequency] = useState("monthly");
  const [shippingState, setShippingState] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingDetails, setShippingDetails] = useState("");
  const [pending, setPending] = useState(false);

  const selectedPlan = PLANS.find((p) => p.id === planId) ?? PLANS[0];
  const computedPrice = Math.round(selectedPlan.price * (WEIGHT_MULTIPLIERS[weight] ?? 1));

  const sectionStyle: React.CSSProperties = { background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.15)", padding: "2rem", minHeight: "60vh" };
  const btnStyle: React.CSSProperties = { fontFamily: "var(--font-hero)", background: "var(--sand-tactical)", color: "var(--coffee-black)", border: "none", padding: "0.75rem 2rem", cursor: "pointer", letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "1rem", transition: "all 0.3s ease" };
  const outlineBtnStyle: React.CSSProperties = { ...btnStyle, background: "transparent", border: "1px solid rgba(184,154,106,0.4)", color: "var(--sand-tactical)" };
  const inputStyle: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,154,106,0.3)", color: "var(--text-primary)", padding: "0.75rem 1rem", fontFamily: "var(--font-body)", fontSize: "1rem", outline: "none" };
  const labelStyle: React.CSSProperties = { display: "block", fontFamily: "var(--font-condensed)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.4rem" };
  const optionBtn = (active: boolean): React.CSSProperties => ({ ...outlineBtnStyle, ...(active ? { background: "var(--sand-tactical)", color: "var(--coffee-black)", border: "1px solid var(--sand-tactical)" } : {}), flex: "1", minWidth: 80, textAlign: "center" });

  return (
    <div style={{ minHeight: "100vh", background: "var(--coffee-black)", paddingTop: "5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "3rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>BUILD YOUR SUBSCRIPTION</h1>
        <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", marginBottom: "2rem" }}>Customize your mission-ready coffee delivery.</p>

        {/* Step indicator */}
        <div style={{ display: "flex", marginBottom: "2rem" }}>
          {STEPS.map((s, i) => (
            <div key={s} onClick={() => { if (i < step) setStep(i); }} style={{ flex: 1, textAlign: "center", padding: "0.75rem", background: i === step ? "var(--sand-tactical)" : i < step ? "rgba(184,154,106,0.2)" : "rgba(255,255,255,0.05)", color: i === step ? "var(--coffee-black)" : i < step ? "var(--sand-tactical)" : "var(--text-secondary)", fontFamily: "var(--font-condensed)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", borderRight: i < STEPS.length - 1 ? "1px solid rgba(184,154,106,0.2)" : "none", cursor: i < step ? "pointer" : "default" }}>
              {i + 1}. {s}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" }}>
          <div style={sectionStyle}>
            {/* Step 0: Plan */}
            {step === 0 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.8rem", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>SELECT PLAN</h2>
                {PLANS.map((plan) => (
                  <div key={plan.id} onClick={() => setPlanId(plan.id)} style={{ padding: "1.5rem", border: `1px solid ${planId === plan.id ? "var(--sand-tactical)" : "rgba(184,154,106,0.15)"}`, cursor: "pointer", background: planId === plan.id ? "rgba(184,154,106,0.05)" : "transparent", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-hero)", fontSize: "1.3rem", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>{plan.name}</h3>
                      <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", fontSize: "0.85rem" }}>{plan.description}</p>
                    </div>
                    <span style={{ fontFamily: "var(--font-hero)", fontSize: "1.5rem", color: "var(--metal-gold)", flexShrink: 0, marginLeft: "1rem" }}>{formatCOP(plan.price)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Step 1: Customize */}
            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.8rem", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>CUSTOMIZE</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div><label style={labelStyle}>Weight</label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {["250g", "500g", "2.5kg"].map((w) => <button key={w} style={optionBtn(weight === w)} onClick={() => setWeight(w)}>{w}</button>)}
                    </div>
                  </div>
                  <div><label style={labelStyle}>Grind Type</label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {[{ v: "whole", l: "Whole Bean" }, { v: "ground", l: "Ground" }].map(({ v, l }) => <button key={v} style={optionBtn(grind === v)} onClick={() => setGrind(v)}>{l}</button>)}
                    </div>
                  </div>
                  {grind === "ground" && (
                    <div><label style={labelStyle}>Grind Level</label>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {[{ v: "espresso", l: "Espresso" }, { v: "drip", l: "Drip" }, { v: "french-press", l: "French Press" }].map(({ v, l }) => <button key={v} style={optionBtn(grindLevel === v)} onClick={() => setGrindLevel(v)}>{l}</button>)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Frequency */}
            {step === 2 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.8rem", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>DELIVERY FREQUENCY</h2>
                {Object.entries(FREQ_LABELS).map(([v, l]) => (
                  <div key={v} onClick={() => setFrequency(v)} style={{ padding: "1.25rem 1.5rem", border: `1px solid ${frequency === v ? "var(--sand-tactical)" : "rgba(184,154,106,0.15)"}`, cursor: "pointer", background: frequency === v ? "rgba(184,154,106,0.05)" : "transparent", fontFamily: "var(--font-hero)", letterSpacing: "0.05em", fontSize: "1.1rem", marginBottom: "1rem" }}>
                    {l}
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Shipping */}
            {step === 3 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.8rem", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>SHIPPING INFO</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div><label style={labelStyle}>Department</label>
                    <select value={shippingState} onChange={(e) => setShippingState(e.target.value)} style={{ ...inputStyle, background: "var(--camo-dark)" }}>
                      <option value="">Select department</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div><label style={labelStyle}>City</label><input value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Address</label><input value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Apartment / Details</label><input value={shippingDetails} onChange={(e) => setShippingDetails(e.target.value)} style={inputStyle} /></div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(184,154,106,0.1)" }}>
              {step > 0 ? <button style={outlineBtnStyle} onClick={() => setStep(step - 1)}>← Back</button> : <div />}
              {step < STEPS.length - 1 ? (
                <button style={btnStyle} onClick={() => setStep(step + 1)}>Next →</button>
              ) : (
                <form action={upsertSubscription} onSubmit={() => setPending(true)}>
                  <input type="hidden" name="plan_id" value={planId} />
                  <input type="hidden" name="weight" value={weight} />
                  <input type="hidden" name="grind" value={grind} />
                  <input type="hidden" name="grind_level" value={grindLevel} />
                  <input type="hidden" name="frequency" value={frequency} />
                  <input type="hidden" name="shipping_state" value={shippingState} />
                  <input type="hidden" name="shipping_city" value={shippingCity} />
                  <input type="hidden" name="shipping_address" value={shippingAddress} />
                  <input type="hidden" name="shipping_details" value={shippingDetails} />
                  <button type="submit" style={btnStyle} disabled={pending}>{pending ? "Confirming..." : "Confirm Subscription"}</button>
                </form>
              )}
            </div>
          </div>

          {/* Sticky Summary */}
          <div style={{ position: "sticky", top: "6rem", background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.2)", padding: "1.5rem" }}>
            <h3 style={{ fontFamily: "var(--font-hero)", fontSize: "1.2rem", letterSpacing: "0.1em", marginBottom: "1rem", color: "var(--sand-tactical)" }}>MISSION SUMMARY</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontFamily: "var(--font-condensed)", fontSize: "0.85rem" }}>
              {([["Plan", selectedPlan.name], ["Weight", weight], ["Grind", grind === "whole" ? "Whole Bean" : "Ground"], ...(grind === "ground" ? [["Level", grindLevel]] : []), ["Frequency", FREQ_LABELS[frequency]], ...(shippingState ? [["State", shippingState]] : [])] as [string, string][]).map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
                  <span style={{ color: "var(--text-primary)", textAlign: "right", maxWidth: "55%" }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(184,154,106,0.2)", marginTop: "1.25rem", paddingTop: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", textTransform: "uppercase" }}>Price</span>
                <span style={{ fontFamily: "var(--font-hero)", fontSize: "1.5rem", color: "var(--metal-gold)" }}>{formatCOP(computedPrice)}</span>
              </div>
              <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", fontSize: "0.7rem", marginTop: "0.5rem" }}>Per {FREQ_LABELS[frequency].toLowerCase()} delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
