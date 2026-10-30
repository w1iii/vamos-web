"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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
            <h2>ALL VIP RESERVATIONS ARE <em>FULLY BOOKED</em></h2>
            <p>See you all at the function.</p>
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
