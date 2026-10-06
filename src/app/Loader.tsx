"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const MINIMUM_DISPLAY_MS = 1200;
const GLITCH_DURATION_MS = 280;
const UNMOUNT_DELAY_MS = 600;

export default function Loader() {
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    document.body.classList.add("is-loading");
    document.body.classList.remove("site-ready");
    const startedAt = performance.now();
    let removeTimer: ReturnType<typeof setTimeout> | undefined;
    let revealTimer: ReturnType<typeof setTimeout> | undefined;

    const hideTimer = setTimeout(() => {
      setHidden(true);
      document.body.classList.remove("is-loading");
      revealTimer = setTimeout(() => document.body.classList.add("site-ready"), GLITCH_DURATION_MS);
      removeTimer = setTimeout(() => setMounted(false), UNMOUNT_DELAY_MS);
    }, Math.max(0, MINIMUM_DISPLAY_MS - (performance.now() - startedAt)));

    return () => {
      clearTimeout(hideTimer);
      if (revealTimer) clearTimeout(revealTimer);
      if (removeTimer) clearTimeout(removeTimer);
      document.body.classList.remove("is-loading");
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className={`loader ${hidden ? "hide" : ""}`} role="status" aria-live="polite" aria-label="Loading">
      <div className="loader-inner">
        <Image
          className="loader-logo"
          src="/vamos-after-dark.png"
          alt="Vamos After Dark"
          width={1606}
          height={535}
          priority
        />
      </div>
    </div>
  );
}
