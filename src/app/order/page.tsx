"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";

type PackageKey = "eclipse" | "prestige";

const packages = {
  eclipse: {
    name: "VIP ECLIPSE",
    label: "COCKTAIL PODIUM",
    price: 6499,
    capacity: "5 GUESTS INCLUDED",
    details: ["Up to 5 Guests included", "1x Bacardi Gold (750mL)", "3x Artisanal Mixers & Ice Caddy", "Express VIP Lane Access"],
  },
  prestige: {
    name: "VIP PRESTIGE",
    label: "MAIN STAGE VIEW",
    price: 17499,
    capacity: "10 GUESTS INCLUDED",
    details: ["10 Guests included (Plush Booth Seating)", "2x Premium Bottles (Choice of Liquor)", "Dedicated VIP Butler & Security Escort", "Priority RFID wristband issuance"],
  },
} as const;

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="Vamos home"><span className="live-dot" /> VAMOS</Link>
        <nav className="main-nav"><Link href="/#vip-reserve">VIP Tables</Link></nav>
        <Link className="button button-small" href="/#vip-reserve">Back to Event <span>→</span></Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <strong>VAMOS <em>AFTER DARK</em></strong>
        <span>10.31.26</span>
        <small>© 2026 VAMOS. All rights reserved.</small>
      </div>
    </footer>
  );
}

function OrderContent() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<PackageKey>(searchParams.get("package") === "eclipse" ? "eclipse" : "prestige");

  const money = useMemo(() => (value: number) => `₱${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, []);

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="site-shell order-shell">
      <Header />
      <main className="order-main">
        <div className="order-atmosphere" />
        <div className="container order-content">
          <section className="order-heading">
            <h1>RESERVE YOUR <em>PRIVATE SPACE</em></h1>
            <p>Complete your booking for VAMOS Private Reserve. Select your tier package and register your lead booker credentials for Door 01 expedited clearance. Strictly 21+.</p>
          </section>

          <div className="order-layout">
          <form className="order-form" id="reservation-form" onSubmit={submitBooking}>
            <section className="order-card">
              <div className="order-card-heading"><span className="status-dot" /><h2>Select VIP Table Tier</h2></div>
              <div className="tier-grid">
                {(Object.entries(packages) as [PackageKey, typeof packages.eclipse][]).map(([key, item]) => (
                  <label className={`tier-card ${selected === key ? "selected" : ""}`} key={key}>
                    <input type="radio" name="table-package" checked={selected === key} onChange={() => setSelected(key)} />
                    <span className="radio-mark">{selected === key ? "✓" : ""}</span>
                    <span className="tier-tag">{key === "prestige" ? "MOST POPULAR" : item.label}</span>
                    <h3>{item.name}</h3>
                    <div className="tier-price">{money(item.price)} <small>/ ALLOCATION</small></div>
                    <div className="tier-details">{item.details.map((detail) => <span key={detail}><b>✦</b>{detail}</span>)}</div>
                  </label>
                ))}
              </div>
            </section>

            <section className="order-card">
              <div className="order-card-heading"><span className="status-dot" /><h2>Lead Booker &amp; KYC Verification</h2></div>
              <div className="field-grid">
                <label>Full name<input required name="name" placeholder="e.g. Mateo Joaquin Alvarez" /></label>
                <label>Facebook / Messenger<input required name="email" placeholder="Your Facebook or Messenger name" /></label>
                <label>Contact no.<input required name="phone" type="tel" placeholder="+63 917 888 1031" /></label>
              </div>
            </section>

          </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="order-loading">Loading reservation form…</div>}>
      <OrderContent />
    </Suspense>
  );
}
