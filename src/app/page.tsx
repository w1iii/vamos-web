"use client";

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
];

const prestigeInclusions = [
  "VIP Access for 10 guests",
  "VIP Table with cushioned seating for your group",
  "5 Mixers",
  "Access to curated complimentary food spread",
  "Dedicated VIP Service staff throughout the night",
  "Dedicated VIP Entry Gates — fast-track entry",
];

function Countdown() {
  const [time, setTime] = useState({ days: 5, hours: 22, minutes: 56, seconds: 0 });

  useEffect(() => {
    const target = new Date("2026-10-31T22:00:00").getTime();
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
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#" aria-label="Vamos home">
            <span className="live-dot" /> VAMOS
          </a>
          <nav className="main-nav">
            <a href="#vip-reserve">VIP Tables</a>
          </nav>
          <a className="button button-small" href="#vip-reserve">Get Passes <span>→</span></a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-overlay" />
          <div className="container hero-content">
            <p className="eyebrow">VAMOS PRESENTS</p>
            <h1>AFTER <em>DARK</em></h1>
            <p className="hero-copy">
              The doors to the dark side are officially open — secure your entry before the night takes over.
              On October 31st, reveal your alter ego under the moonlight as we ascend into the shadows.
            </p>
            <Countdown />
            <a className="button button-outline" href="#vip-reserve">VIP Tables &amp; Lounges <span>→</span></a>
          </div>
        </section>

        <section className="section container vip-section" id="vip-reserve">
          <div className="vip-intro">
            <span className="pill"><i /> Exclusive Table Packages</span>
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
                <div className="experience"><h5>THE ECLIPSE EXPERIENCE</h5><p>VIP ECLIPSE puts you right in the VIP Area with your own cocktail table, premium service assistance, complimentary eats, and fast-track entry.</p></div>
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
                <div className="bottles"><span>2 Premium Bottles of Your Choice</span><small>1L José Cuervo · 1L JW Black Label · 700mL Jägermeister · Bacardi Gold</small></div>
                <div className="experience highlighted"><h5>THE PRESTIGE EXPERIENCE</h5><p>The VIP Prestige offers a table with cushioned seating, complimentary food options, premium drinks, and dedicated VIP assistance. Settle in, skip the queues, and enjoy VAMOS in your own comfortable space.</p></div>
              </div>
              <Link className="button full" href="/order?package=prestige">Reserve VIP Prestige</Link>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <strong>VAMOS <em>AFTER DARK</em></strong>
          <span>10.31.26</span>
          <small>© 2026 VAMOS. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}
