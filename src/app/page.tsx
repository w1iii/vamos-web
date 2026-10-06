"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

const eclipseInclusions = [
  "VIP Access for 5 Guests",
  "1 Cocktail Table (standing)",
  "1 Bottle of Bacardi Gold",
  "3 Mixers",
  "Access to curated complimentary food spread",
  "Dedicated VIP Service staff throughout the night",
  "Dedicated VIP Entry Gates — fast-track entry",
  "Maximum of 1 additional guest per Eclipse table at ₱999",
];

const prestigeInclusions = [
  "VIP Access for 10 guests",
  "VIP Table with cushioned seating for your group",
  "5 Mixers",
  "Access to curated complimentary food spread",
  "Dedicated VIP Service staff throughout the night",
  "Dedicated VIP Entry Gates — fast-track entry",
];

const premiumBottleChoices = [
  "1L José Cuervo",
  "1L JW Black Label",
  "700mL Jägermeister",
  "Bacardi Gold",
];

const heroImages = [
  "/header-1.jpg",
  "/header-2.jpg",
  "/header-3.jpg",
  "/header-4.jpg",
  "/header-5.jpg",
];

const mobileHeroImages = [
  "/phone1.JPG",
  "/phone2.JPG",
  "/phone3.JPG",
  "/phone4.JPG",
  "/phone5.JPG",
];

function Countdown() {
  const [time, setTime] = useState({ days: 5, hours: 22, minutes: 56, seconds: 0 });

  useEffect(() => {
    const target = new Date("2026-10-31T21:00:00").getTime();
    const update = () => {
      const difference = Math.max(0, target - Date.now());
      setTime({
        days: Math.floor(difference / 86400000),
        hours: Math.floor((difference / 3600000) % 24),
        minutes: Math.floor((difference / 60000) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="countdown" aria-label="Countdown to the event">
      {Object.entries(time).map(([label, value]) => (
        <div className="glass-card countdown-card" key={label}>
          <strong className={label === "seconds" ? "red" : ""}>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map((item) => (
        <li key={item}>
          <span className="check">✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const activeHeroImages = isMobile ? mobileHeroImages : heroImages;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const handleScroll = () => setIsScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 760px)");
    const updateViewport = () => {
      setIsMobile(mediaQuery.matches);
      setHeroImageIndex(0);
    };

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    activeHeroImages.forEach((image) => {
      const preload = new window.Image();
      preload.src = image;
    });

    const interval = window.setInterval(() => {
      setHeroImageIndex((currentIndex) => (currentIndex + 1) % activeHeroImages.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [activeHeroImages]);

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#" aria-label="Vamos home">
            <Image className="brand-logo" src="/logo.png" alt="VAMOS" width={3281} height={593} priority />
          </a>
          <nav className="main-nav">
            <a href="#vip-reserve">VIP Tables</a>
          </nav>
          <a className="button button-small" href="#vip-reserve">Get Passes <span>→</span></a>
        </div>
      </header>

      <main>
        <section
          className={`hero${isScrolled ? " is-scrolled" : ""}`}
        >
          <div className="hero-slideshow" aria-hidden="true">
            {activeHeroImages.map((image, index) => (
              <div
                className={`hero-slide${index === heroImageIndex ? " active" : ""}`}
                key={image}
                style={{ backgroundImage: `url("${image}")` }}
              />
            ))}
          </div>
          <div className="hero-overlay" />
          <div className="container hero-content">
            <p className="eyebrow">VAMOS PRESENTS</p>
            <Image
              className="hero-logo"
              src="/red.png"
              alt="Vamos"
              width={500}
              height={500}
              priority
            />
            <Countdown />
          </div>
          <a className="scroll-hint" href="#vip-reserve" aria-label="Scroll down to VIP tables">
            <span>Scroll down</span>
            <span className="scroll-hint-arrow" aria-hidden="true">↓</span>
          </a>
        </section>

        <section className="section container vip-section" id="vip-reserve">
          <div className="vip-intro">
            <h2>VAMOS <em>PRIVATE RESERVE</em></h2>
            <p>Step into VAMOS Private Reserve—an elevated VIP experience designed for those who appreciate exclusivity, comfort, and the finer details. Enjoy premium selections, dedicated service, and your own reserved space as you experience VAMOS at its most distinguished.</p>
          </div>

          <div className="packages">
            <article className="glass-card package">
              <div>
                <div className="package-meta"><span className="package-label">✦ VIP ECLIPSE</span><span>GOOD FOR 5 VIP GUESTS</span></div>
                <h3>VIP ECLIPSE</h3>
                <p className="package-copy">Enter the night with your own VIP ECLIPSE and enjoy an elevated VAMOS experience made for you and your crew.</p>
                <div className="price">₱6,499 <small>/ TABLE PACKAGE</small></div>
                <h4>TABLE INCLUSIONS</h4>
                <CheckList items={eclipseInclusions} />
                <h4> THE ECLIPSE EXPERIENCE </h4>
                <p className="package-copy">VIP ECLIPSE puts you right in the VIP Area with your own cocktail table, premium service assistance, complimentary eats, and fast-track entry. </p> 
              </div>
              <Link className="button button-outline full" href="/order?package=eclipse">Reserve VIP Eclipse</Link>
            </article>

            <article className="glass-card package featured">
              <span className="ultimate">✦ Ultimate Experience</span>
              <div>
                <div className="package-meta"><span className="package-label">✦ VIP PRESTIGE</span><span>10 VIP GUESTS</span></div>
                <h3>VIP PRESTIGE</h3>
                <p className="package-copy">Make the night yours with the VIP Prestige — a premium reserved table experience created for bigger crews who want more space, comfort, and elevated VIP experience.</p>
                <div className="price">₱17,499 <small>/ TABLE PACKAGE</small></div>
                <h4>TABLE INCLUSIONS</h4>
                <CheckList items={prestigeInclusions} />
                <ul className="check-list">
                  <li>
                    <span className="check">✓</span>
                    <span>
                      2 Premium Bottles of your choice
                      <ul className="bottle-choices">
                        {premiumBottleChoices.map((bottle) => <li key={bottle}>{bottle}</li>)}
                      </ul>
                    </span>
                  </li>
                </ul>
                <h4> THE PRESTIGE EXPERIENCE </h4>
                <p className="package-copy">
                  The VIP Prestige offers a table with cushioned seating, complimentary food options, premium drinks, and dedicated VIP assistance. Settle in, skip the queues, and enjoy VAMOS in your own comfortable space.
                </p> 
              </div>
              <Link className="button full" href="/order?package=prestige">Reserve VIP Prestige</Link>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Image src="/logo.png" alt="VAMOS" width={3281} height={593} />
            <p>Premium nightlife experiences, unforgettable tables, and nights worth remembering.</p>
          </div>
          <div className="footer-column">
            <h2>Explore</h2>
            <a href="#vip-reserve">VIP Tables</a>
            <a href="#vip-reserve">Private Reserve</a>
            <a href="/order?package=prestige">Reserve a Table</a>
          </div>
          <div className="footer-column">
            <h2>Connect</h2>
            <a href="mailto:vamosponsorhips@gmail.com">vamosponsorhips@gmail.com</a>
            <div className="footer-socials" aria-label="Social media">
              <a href="https://www.facebook.com/profile.php?id=61558155861009" target="_blank" rel="noreferrer">Facebook</a>
              <a href="https://www.instagram.com/vamos.bcd/" target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
          <div className="footer-column footer-cta">
            <h2>Make it yours</h2>
            <p>Secure your VIP experience before the night takes over.</p>
            <a className="button button-small" href="mailto:vamosponsorhips@gmail.com?subject=VAMOS%20VIP%20Inquiry">Contact VAMOS <span>→</span></a>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>10.31.26</span>
          <small>© 2026 VAMOS. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}
