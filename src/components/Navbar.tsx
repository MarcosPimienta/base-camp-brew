'use client';

import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          BASE CAMP BREW
        </div>

        {/* Desktop Menu */}
        <div className={styles.desktopMenu}>
          <a href="#coffee" className={styles.navLink}>Coffee</a>
          <a href="#gear" className={styles.navLink}>Gear</a>
          <a href="#mission" className={styles.navLink}>Mission</a>
          <a href="#subscription" className={styles.navLink}>Subscription</a>
          <button className="btn btn-sm">Shop Now</button>
        </div>

        {/* Tactical Hamburger */}
        <button 
          className={`${styles.hamburger} ${isOpen ? styles.active : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle Navigation"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.show : ''}`}>
        <a href="#coffee" onClick={toggleMenu} className={styles.mobileLink}>Coffee</a>
        <a href="#gear" onClick={toggleMenu} className={styles.mobileLink}>Gear</a>
        <a href="#mission" onClick={toggleMenu} className={styles.mobileLink}>Mission</a>
        <a href="#subscription" onClick={toggleMenu} className={styles.mobileLink}>Subscription</a>
        <button className="btn" onClick={toggleMenu}>Shop Now</button>
      </div>
    </nav>
  );
};

export default Navbar;
