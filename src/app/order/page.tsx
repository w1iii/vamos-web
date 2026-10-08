"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";

type PackageKey = "eclipse" | "prestige";
type ApiResponse = { ok: boolean; error?: string };

const endpoint = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL;

const packages = {
  eclipse: {
    name: "VIP ECLIPSE",
    label: "",
    price: 6499,
    capacity: "5 GUESTS INCLUDED",
    details: [
      "VIP Access for 5 Guests",
      "1 Cocktail Table (standing)",
      "1 Bottle of Bacardi Gold",
      "3 Mixers",
      "Access to curated complimentary food spread",
      "Dedicated VIP Service staff throughout the night",
      "Dedicated VIP Entry Gates — fast-track entry",
      "Maximum of 1 additional guest per Eclipse table at ₱999",
    ],
  },
  prestige: {
    name: "VIP PRESTIGE",
    label: "",
    price: 17499,
    capacity: "10 GUESTS INCLUDED",
    details: [
      "VIP Access for 10 guests",
      "VIP Table with cushioned seating for your group",
      "5 Mixers",
      "Access to curated complimentary food spread",
      "Dedicated VIP Service staff throughout the night",
      "Dedicated VIP Entry Gates — fast-track entry",
    ],
    bottleChoices: ["1L José Cuervo", "1L JW Black Label", "700mL Jägermeister", "Bacardi Gold"],
  },
} as const;

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="Vamos home">
          <Image className="brand-logo" src="/logo.png" alt="VAMOS" width={3281} height={593} priority />
        </Link>
        <nav className="main-nav"><Link href="/">Home</Link></nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Image src="/logo.png" alt="VAMOS" width={3281} height={593} />
          <p>Premium nightlife experiences, unforgettable tables, and nights worth remembering.</p>
        </div>
        <div className="footer-column">
          <h2>Explore</h2>
          <Link href="/#vip-reserve">VIP Tables</Link>
          <Link href="/#vip-reserve">Private Reserve</Link>
          <Link href="/order?package=prestige">Reserve a Table</Link>
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
  );
}

function OrderContent() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<PackageKey>(searchParams.get("package") === "eclipse" ? "eclipse" : "prestige");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const money = useMemo(() => (value: number) => `₱${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, []);

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || submitted) return;

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    if (!endpoint) {
      setError("Reservations are temporarily unavailable. Please try again later.");
      return;
    }

    const packageInfo = packages[selected];
    const formData = new FormData(form);
    setPending(true);
    setError("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          package: selected,
          amount: packageInfo.price,
          fullName: String(formData.get("name") || ""),
          messenger: String(formData.get("email") || ""),
          contactNumber: String(formData.get("phone") || ""),
        }),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.ok) {
        if (data.error === "SOLD_OUT") {
          setError("Your reservation could not be submitted. Please try again.");
        } else {
          throw new Error("The reservation could not be submitted.");
        }
        return;
      }
      setSubmitted(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "The reservation could not be submitted.");
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <div className="site-shell order-shell">
        <Header />
        <main className="order-main">
          <div className="order-atmosphere" />
          <div className="container order-content">
            <section className="booking-success">
              <span className="" />
              <h1>RESERVATION <em>RECEIVED</em></h1>
              <p>Your reservation request has been received, but please note that your booking is not yet confirmed. Kindly wait for a message from the VAMOS team confirming your reservation. Thank you!</p>
              <Link className="button" href="/">Back to Event <span>→</span></Link>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="site-shell order-shell">
      <Header />
      <main className="order-main">
        <div className="order-atmosphere" />
        <div className="container order-content">
          <section className="order-heading">
            <h1>RESERVE YOUR <em>PRIVATE SPACE</em></h1>
          </section>

          <div className="order-layout">
          <form className="order-form" id="reservation-form" onSubmit={submitBooking}>
            <section className="order-card">
              <div className="order-card-heading"><span className="status-dot" /><h2>Select VIP Table Tier</h2></div>
              <div className="tier-grid">
                {(Object.entries(packages) as [PackageKey, typeof packages.eclipse][]).map(([key, item]) => (
                  <label
                    className={`tier-card ${selected === key ? "selected" : ""}`}
                    key={key}
                  >
                    <input
                      type="radio"
                      name="table-package"
                      checked={selected === key}
                      onChange={() => setSelected(key)}
                    />
                    <span className="radio-mark">{selected === key ? "✓" : ""}</span>
                    <span className="tier-tag">{key === "prestige" ? "" : item.label}</span>
                    <h3>{item.name}</h3>
                    <div className="tier-price">{money(item.price)} </div>
                    <div className="tier-details">
                      {item.details.map((detail) => <span key={detail}><b>✦</b>{detail}</span>)}
                      {key === "prestige" && (
                        <span className="tier-bottle-details">
                          <b>✦</b>
                          <span>
                            2 Premium Bottles of your choice
                            <ul>
                              {packages.prestige.bottleChoices.map((bottle) => <li key={bottle}>{bottle}</li>)}
                            </ul>
                          </span>
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section className="order-card">
              <div className="order-card-heading"><span className="status-dot" /><h2>INFORMATION</h2></div>
              <div className="field-grid">
                <label>Full name<input required name="name" placeholder="e.g. Mateo Joaquin Alvarez" /></label>
                <label>Facebook / Messenger<input required name="email" placeholder="https://www.facebook.com/[name]" /></label>
                <label>Contact no.<input required name="phone" type="tel" inputMode="tel" pattern="[+0-9 ()-]+" placeholder="+63 917 888 1031" /></label>
              </div>
            </section>

            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button full" type="submit" disabled={pending}>
              {pending ? "Reserving..." : "Reserve Table"} <span>→</span>
            </button>
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
