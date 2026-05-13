"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./CoffeeArsenal.module.css";

const coffees = [
  {
    id: "antioquia-recon",
    name: "Antioquia Recon",
    image: "/images/Antioquia-Recon.png",
    intensity: "Medium",
    origin: "Antioquia, Colombia",
    notes: "Sugar Cane, Chocolate, Walnuts",
    history:
      "Direct action for your morning. Inspired by the tactical movements in the field.",
    colorTheme: "#4B5320", // Olive
    weights: ["250g", "500g", "2.5kg"],
    grinds: ["Whole Bean", "Ground"],
    basePrice: 35000,
  },
  {
    id: "huila-recon",
    name: "Huila Recon",
    image: "/images/Huila-Recon.png",
    intensity: "Medium",
    origin: "La Plata - Huila, Colombia",
    notes: "Sugar Cane, Chamomile, Lime",
    history: "Total operational silence. The darkest roast in our arsenal.",
    colorTheme: "#111111",
    weights: ["250g", "500g", "2.5kg"],
    grinds: ["Whole Bean", "Ground"],
    basePrice: 38000,
  },
  {
    id: "sierra-recon",
    name: "Sierra Recon",
    image: "/images/La-Sierra-Recon.png",
    intensity: "Medium",
    origin: "Minca - Magdalena, Colombia",
    notes: "Chocolate, Caramel, Honey",
    history: "Unleash the storm. Engineered for maximum alertness and energy.",
    colorTheme: "#D35400", // Warning Orange
    weights: ["250g", "500g", "2.5kg"],
    grinds: ["Whole Bean", "Ground"],
    basePrice: 36000,
  },
];

const CoffeeCard = ({ coffee }: { coffee: typeof coffees[0] }) => {
  const [selectedWeight, setSelectedWeight] = useState(coffee.weights[0]);
  const [selectedGrind, setSelectedGrind] = useState(coffee.grinds[0]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={coffee.image}
          alt={coffee.name}
          fill
          style={{ objectFit: "cover" }}
          className={styles.image}
        />
      </div>
      <div className={styles.details}>
        <div
          className={styles.badge}
          style={{ borderColor: coffee.colorTheme }}
        >
          {coffee.intensity}
        </div>
        <h3>{coffee.name}</h3>
        <p className={styles.historyText}>{coffee.history}</p>
        
        <div className={styles.notesContainer}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.notesIcon}>
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className={styles.notesText}>{coffee.notes.toUpperCase()}</span>
        </div>

        <div className={styles.selectorSection}>
          <label className={styles.selectorLabel}>WEIGHT</label>
          <div className={styles.selectorGrid}>
            {coffee.weights.map((weight) => (
              <button
                key={weight}
                className={`${styles.selectorButton} ${
                  selectedWeight === weight ? styles.active : ""
                }`}
                onClick={() => setSelectedWeight(weight)}
              >
                {weight}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.selectorSection}>
          <label className={styles.selectorLabel}>GRIND TYPE</label>
          <div className={styles.selectorGrid}>
            {coffee.grinds.map((grind) => (
              <button
                key={grind}
                className={`${styles.selectorButton} ${
                  selectedGrind === grind ? styles.active : ""
                }`}
                onClick={() => setSelectedGrind(grind)}
              >
                {grind}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>{formatPrice(coffee.basePrice)}</div>
          <button className={`btn ${styles.addToCart}`} suppressHydrationWarning>
            <span className={styles.plus}>+</span> Add to Kit
          </button>
        </div>
      </div>
    </div>
  );
};

const CoffeeArsenal = () => {
  return (
    <section id="coffee" className={styles.arsenal}>
      <div className="container">
        <div className={styles.header}>
          <h2 className="text-sand">Coffee Arsenal</h2>
          <p className="font-condensed">
            Weaponize your morning with tactical blends.
          </p>
        </div>

        <div className={styles.grid}>
          {coffees.map((coffee) => (
            <CoffeeCard key={coffee.id} coffee={coffee} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoffeeArsenal;
