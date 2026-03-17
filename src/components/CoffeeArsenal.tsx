import React from 'react';
import Image from 'next/image';
import styles from './CoffeeArsenal.module.css';

const coffees = [
  {
    id: 'ground-war',
    name: 'Ground War',
    image: '/images/ground_war_coffee_bag_tactical_1773720359320.png',
    intensity: 'High / Dark Roast',
    origin: 'Colombia & Ethiopia',
    notes: 'Dark chocolate, smoky, oak',
    history: 'Direct action for your morning. Inspired by the tactical movements in the field.',
    colorTheme: '#4B5320' // Olive
  },
  {
    id: 'blackout-roast',
    name: 'Blackout Roast',
    image: '/images/blackout_roast_coffee_bag_tactical_1773720373257.png',
    intensity: 'Extreme / French Roast',
    origin: 'Brazil & Sumatra',
    notes: 'Molasses, burnt caramel, earthy',
    history: 'Total operational silence. The darkest roast in our arsenal.',
    colorTheme: '#111111'
  },
  {
    id: 'havoc-fuel',
    name: 'Havoc Fuel',
    image: '/images/havoc_fuel_coffee_bag_tactical_1773720387240.png',
    intensity: 'Medium / High Caffeine',
    origin: 'Guatemala & Vietnam',
    notes: 'Brown sugar, citrus, spice',
    history: 'Unleash the storm. Engineered for maximum alertness and energy.',
    colorTheme: '#D35400' // Warning Orange
  }
];

const CoffeeArsenal = () => {
  return (
    <section id="coffee" className={styles.arsenal}>
      <div className="container">
        <div className={styles.header}>
          <h2 className="text-sand">Coffee Arsenal</h2>
          <p className="font-condensed">Weaponize your morning with tactical blends.</p>
        </div>

        <div className={styles.grid}>
          {coffees.map((coffee) => (
            <div key={coffee.id} className={styles.card}>
              <div className={styles.imageContainer}>
                <Image 
                  src={coffee.image} 
                  alt={coffee.name} 
                  fill 
                  style={{ objectFit: 'cover' }}
                  className={styles.image}
                />
              </div>
              <div className={styles.details}>
                <div className={styles.badge} style={{ borderColor: coffee.colorTheme }}>
                  {coffee.intensity}
                </div>
                <h3>{coffee.name}</h3>
                <p className={styles.origin}><strong>Origin:</strong> {coffee.origin}</p>
                <p className={styles.notes}><strong>Notes:</strong> {coffee.notes}</p>
                <div className={styles.history}>
                  <p>{coffee.history}</p>
                </div>
                <button className="btn btn-sm" suppressHydrationWarning>Add to Kit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoffeeArsenal;
