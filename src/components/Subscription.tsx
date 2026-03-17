import React from 'react';
import styles from './Subscription.module.css';

const Subscription = () => {
  return (
    <section id="subscription" className={styles.subscription}>
      <div className={styles.militaryPattern}></div>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className={styles.card}>
          <div className={styles.badge}>Monthly Mission</div>
          <h2 className="text-sand">Tactical Subscription Crate</h2>
          <p className={styles.description}>
            Get mission-ready coffee delivered to your deployment monthly. Exclusive gear, limited roasts, and true veteran camaraderie in every box.
          </p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.icon}>2</div>
              <p>Premium Bags / Mo</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.icon}>📦</div>
              <p>Exclusive Member Merch</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.icon}>🎖️</div>
              <p>Veteran Support Donation</p>
            </div>
          </div>

          <div className={styles.priceRow}>
            <div className={styles.price}>
              <span className={styles.amount}>$45</span>
              <span className={styles.per}>/MONTH</span>
            </div>
            <button className="btn" suppressHydrationWarning>Deploy Subscription</button>
          </div>
          
          <p className={styles.cancel}>No commitment. Cancel mission anytime.</p>
        </div>
      </div>
    </section>
  );
};

export default Subscription;
