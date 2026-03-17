import React from 'react';
import styles from './Mission.module.css';

const Mission = () => {
  return (
    <section id="mission" className={styles.mission}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.imageCol}>
            <div className={styles.imageFrame}>
              <div className={styles.accent_1}></div>
              <div className={styles.accent_2}></div>
              {/* Using a placeholder for now, since I didn't generate a specific mission image yet */}
              <div className={styles.placeholderImage}></div>
            </div>
          </div>
          <div className={styles.contentCol}>
            <h2 className="text-gold">Veteran Owned. Mission Ready.</h2>
            <p className={styles.lead}>
              Base Camp Brew is more than a coffee company. We are a veteran-founded arsenal dedicated to those who served.
            </p>
            <div className={styles.points}>
              <div className={styles.point}>
                <h4>Precision Roasted</h4>
                <p>Every batch is roasted with military precision for maximum flavor and strength.</p>
              </div>
              <div className={styles.point}>
                <h4>Unbreakable Loyalty</h4>
                <p>We support our brothers and sisters in arms through every bag sold.</p>
              </div>
              <div className={styles.point}>
                <h4>Direct Action</h4>
                <p>Crafted by veterans, for veterans. No compromise, no retreat.</p>
              </div>
            </div>
            <button className="btn btn-outline">Read Our Story</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
