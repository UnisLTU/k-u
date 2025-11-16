import { useEffect, useRef, useState } from "react";
import "../components/Header.css";

export default function Header() {
  // === Date / counter (2026-07-04)
  const target = new Date(2026, 6, 4);
  const today = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysTill = Math.ceil(
    (target.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) / msPerDay
  );

  // === Config
  const EXPANDED_H = 700;
  const isOnPhone = window.innerWidth < 600;
  const COLLAPSED_H = isOnPhone ? 0 : 70;
  const UNSTICK_AT_TOP_PX = 2; // expand only when truly at top (≤2px)

  // === Refs / state
  const headerRef = useRef(null);
  const [stuck, setStuck] = useState(false);
  const stuckRef = useRef(false);
  useEffect(() => {
    stuckRef.current = stuck;
  }, [stuck]);

  // Keep --header-h synced with real header height (drives spacer + anchor offset)
  useEffect(() => {
    const el = headerRef.current as HTMLElement | null;
    if (!el) return;

    const setVar = (h: number) => {
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    };

    // initial
    setVar(Math.round(el.getBoundingClientRect().height || COLLAPSED_H));

    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setVar(Math.round(entry.contentRect.height));
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    } else {
      // fallback
      let raf: number;
      const poll = () => {
        setVar(Math.round(el.getBoundingClientRect().height || COLLAPSED_H));
        raf = requestAnimationFrame(poll);
      };
      poll();
      return () => cancelAnimationFrame(raf);
    }
  }, []);

  // Collapse once you leave the top; expand only when back at the very top
  useEffect(() => {
    let ticking = false;

    const update = () => {
      const y =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      if (y > UNSTICK_AT_TOP_PX && !stuckRef.current) {
        setStuck(true);
      } else if (y <= UNSTICK_AT_TOP_PX && stuckRef.current) {
        setStuck(false);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    onScroll(); // set initial state (supports reload mid-page)
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Smooth in-page navigation; collapse first so offset lands right
  const onNavClick = (e: React.MouseEvent) => {
    const href = e.currentTarget.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    e.preventDefault();
    const targetEl = document.querySelector(href);
    if (!targetEl) return;

    if (!stuckRef.current) setStuck(true);
    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* FIXED header pinned to top */}
      <header
        ref={headerRef}
        className={`header ${stuck ? "is-collapsed" : ""}`}
        style={{
          height: `${stuck ? COLLAPSED_H : EXPANDED_H}px`,
        }}
      >
        <div className="header-content">
          <img
            src="image.png"
            alt="logo"
            className="header-logo"
            style={{
              transform: `scale(${stuck ? 1 : 1.4})`,
              opacity: stuck ? 0 : 1,
            }}
          />

          <div className="header-text">
            <h1>Kornelija ir Ugnius</h1>
            <div className="subtext">
              <h3>2026, Liepos 4 d.</h3>
              {daysTill > 0 && (
                <>
                  <span className="dot">•</span>
                  <h3>{`Liko ${daysTill} dien${daysTill > 1 ? "os" : "a"}`}</h3>
                </>
              )}
            </div>
          </div>

          {/* === MENU === */}
          <nav className="menu">
            <ul>
              <li>
                <a href="#home" onClick={onNavClick}>
                  Pradžia
                </a>
              </li>
              <li>
                <a href="#plan" onClick={onNavClick}>
                  Dienos planas
                </a>
              </li>
              <li>
                <a href="#ceremony" onClick={onNavClick}>
                  Ceremonijos vieta
                </a>
              </li>
              <li>
                <a href="#venue" onClick={onNavClick}>
                  Šventės vieta
                </a>
              </li>
              <li>
                <a href="#dresscode" onClick={onNavClick}>
                  Aprangos kodas
                </a>
              </li>
              <li>
                <a href="#dinner" onClick={onNavClick}>
                  Vakarienė ir Nakvynė
                </a>
              </li>
              <li>
                <a href="#gifts" onClick={onNavClick}>
                  Dovanos
                </a>
              </li>
              <li>
                <a href="#extra" onClick={onNavClick}>
                  Papildomai
                </a>
              </li>
              <li>
                <a href="#photos" onClick={onNavClick}>
                  Šventės akimirkos
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Spacer reserves space so content doesn't jump under the fixed header */}
      <div className="header-spacer" aria-hidden />
    </>
  );
}
