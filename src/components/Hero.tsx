import React from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Brewed For <br />
          <span className="text-sand">Those Who Served</span>
        </h1>
        <p className={styles.subtitle}>
          Coffee for the mission. Loyalty to the brotherhood.
        </p>
        <div className={styles.ctaGroup}>
          <button className="btn">Shop Coffee</button>
          <button className="btn btn-outline">Shop Gear</button>
        </div>
      </div>
      <div className={styles.scrollIndicator}>
        <div className={styles.mouse}>
          <div className={styles.wheel}></div>
        </div>
        <p className="font-condensed">Explore Arsenal</p>
      </div>
    </section>
  );
};

export default Hero;
