import React from 'react';
import styles from './Impact.module.css';

const Impact = () => {
  return (
    <section id="impact" className={styles.impact}>
      <div className="container">
        <div className={styles.header}>
          <h2 className="text-gold">Veteran Impact</h2>
          <p className="font-condensed">Our mission extends beyond the cup.</p>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.number}>10%</span>
            <span className={styles.label}>of profits donated</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.number}>500+</span>
            <span className={styles.label}>Veterans Reskilled</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.number}>$1.2M</span>
            <span className={styles.label}>Mental Health Funding</span>
          </div>
        </div>

        <div className={styles.causes}>
          <div className={styles.cause}>
            <h3>Mental Health</h3>
            <p>Direct support for PTSD counseling and reintegration programs.</p>
          </div>
          <hr className={styles.divider} />
          <div className={styles.cause}>
            <h3>Employment</h3>
            <p>Hiring and training veterans in coffee roasting and logistics.</p>
          </div>
          <hr className={styles.divider} />
          <div className={styles.cause}>
            <h3>Community</h3>
            <p>Building a network of support for those who transitioned from service.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
