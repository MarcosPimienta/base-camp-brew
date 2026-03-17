import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <h2 className={styles.logo}>Base Camp Brew</h2>
            <p className={styles.tagline}>Brewed for those who served.</p>
            <div className={styles.socials}>
              {/* Social icons placeholders */}
              <div className={styles.socialIcon}>IG</div>
              <div className={styles.socialIcon}>FB</div>
              <div className={styles.socialIcon}>YT</div>
            </div>
          </div>
          
          <div className={styles.linksCol}>
            <h4>Shop</h4>
            <ul>
              <li><a href="#coffee">Coffee Arsenal</a></li>
              <li><a href="#gear">Tactical Gear</a></li>
              <li><a href="#subscription">Subscriptions</a></li>
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h4>Mission</h4>
            <ul>
              <li><a href="#mission">Our Story</a></li>
              <li><a href="#impact">Impact Report</a></li>
              <li><a href="#community">Community</a></li>
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h4>Support</h4>
            <ul>
              <li><a href="#">Contact HQ</a></li>
              <li><a href="#">Shipping Ops</a></li>
              <li><a href="#">Veteran Jobs</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 Base Camp Brew. All Rights Reserved.</p>
          <div className={styles.legal}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
