"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { useCart } from "@/app/context/CartContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { createClient } from "@/utils/supabase/client";
import CartDrawer from "./CartDrawer";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { itemCount, openCart } = useCart();
  const { locale, setLocale } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
    });
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleLocale = () => setLocale(locale === "es" ? "en" : "es");

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/images/logo/BaseCampBrew_Logo_v2.png"
              alt="Base Camp Brew Logo"
              width={120}
              height={40}
              className={styles.logoImage}
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className={styles.desktopMenu}>
            <Link href="/#coffee" className={styles.navLink}>Coffee</Link>
            <Link href="/#gear" className={styles.navLink}>Gear</Link>
            <Link href="/#mission" className={styles.navLink}>Mission</Link>
            <Link href="/#subscription" className={styles.navLink}>Subscription</Link>

            {/* Language Switcher */}
            <button
              className={styles.langBtn}
              onClick={toggleLocale}
              suppressHydrationWarning
              aria-label="Toggle language"
            >
              {locale === "es" ? "EN" : "ES"}
            </button>

            {/* Cart Icon */}
            <button
              className={styles.cartBtn}
              onClick={openCart}
              suppressHydrationWarning
              aria-label="Open cart"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {itemCount > 0 && (
                <span className={styles.cartBadge} suppressHydrationWarning>
                  {itemCount}
                </span>
              )}
            </button>

            {/* Auth Link */}
            {isLoggedIn ? (
              <Link href="/dashboard" className={`btn ${styles.btnSm}`}>
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className={`btn ${styles.btnSm}`}>
                My Account
              </Link>
            ) }
          </div>

          {/* Tactical Hamburger */}
          <button
            className={`${styles.hamburger} ${isOpen ? styles.active : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle Navigation"
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`${styles.mobileMenu} ${isOpen ? styles.show : ""}`}>
          <Link href="/" className={styles.mobileLogo} onClick={toggleMenu}>
            <Image
              src="/images/logo/BaseCampBrew_Logo_v2.png"
              alt="Base Camp Brew Logo"
              width={80}
              height={30}
              className={styles.logoImage}
            />
          </Link>
          <Link href="/#coffee" onClick={toggleMenu} className={styles.mobileLink}>Coffee</Link>
          <Link href="/#gear" onClick={toggleMenu} className={styles.mobileLink}>Gear</Link>
          <Link href="/#mission" onClick={toggleMenu} className={styles.mobileLink}>Mission</Link>
          <Link href="/#subscription" onClick={toggleMenu} className={styles.mobileLink}>Subscription</Link>
          <div className={styles.mobileActions}>
            <button className={styles.langBtn} onClick={toggleLocale} suppressHydrationWarning>
              {locale === "es" ? "EN" : "ES"}
            </button>
            <button className={styles.cartBtn} onClick={() => { toggleMenu(); openCart(); }} suppressHydrationWarning>
              🛒 {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
            </button>
          </div>
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn" onClick={toggleMenu}>Dashboard</Link>
          ) : (
            <Link href="/login" className="btn" onClick={toggleMenu}>My Account</Link>
          )}
        </div>
      </nav>
      <CartDrawer />
    </>
  );
};

export default Navbar;
