import Image from "next/image";
import styles from "./Hero.module.css";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>
          BASE CAMP BREW
        </h1>
        <h2 className={styles.heroSubtitle}>
          Fuel For The Mission
        </h2>
        <p className={styles.description}>
          Premium coffee crafted for those who know the value of discipline, hard work, and brotherhood.
        </p>
        <div className={styles.ctaGroup}>
          <button className="btn" suppressHydrationWarning>Shop Coffee</button>
          <button className="btn btn-outline" suppressHydrationWarning>Shop Apparel</button>
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
