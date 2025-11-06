import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom"; // ⬅️ add this
import "./HamburgerMenu.css";

const MENU_ITEMS = [
  { href: "#home", label: "Pradžia" },
  { href: "#ceremony", label: "Ceremonija" },
  { href: "#venue", label: "Šventės vieta" },
  { href: "#dresscode", label: "Dress kodas" },
  { href: "#dinner", label: "Vakarienė ir nakvynė" },
  { href: "#gifts", label: "Dovanos" },
  { href: "#extra", label: "Papildomai" },
  { href: "#photos", label: "Šventės akimirkos" },
];

const BREAKPOINT = 600;

export default function MobileHamburger() {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // ⬅️ for SSR safety

  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const labelId = useId();
  const panelId = useId();

  useEffect(() => {
    setMounted(true);
  }, []); // ⬅️ only portal after mount

  // Show only on phones
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile(
        (e as MediaQueryListEvent).matches ?? (e as MediaQueryList).matches
      );
    setIsMobile(mql.matches);
    mql.addEventListener
      ? mql.addEventListener("change", handler)
      : mql.addListener(handler as any);
    return () => {
      mql.removeEventListener
        ? mql.removeEventListener("change", handler)
        : mql.removeListener(handler as any);
    };
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc + simple focus trap
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current!;
    const focusables = panel.querySelectorAll<HTMLElement>(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (focusables[0] || panel).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        btnRef.current?.focus();
      }
      if (e.key === "Tab" && focusables.length) {
        const first = focusables[0],
          last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Backdrop click closes
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (e.target === backdropRef.current) setOpen(false);
    };
    backdropRef.current?.addEventListener("click", onClick);
    return () => backdropRef.current?.removeEventListener("click", onClick);
  }, [open]);

  if (!mounted || !isMobile) return null;

  const ui = (
    <div className="hm-layer">
      {" "}
      {/* ⬅️ fixed, top-level layer */}
      <div className="hm-bar">
        <button
          ref={btnRef}
          type="button"
          className="hm-btn"
          aria-haspopup="dialog"
          aria-controls={panelId}
          aria-expanded={open}
          aria-labelledby={labelId}
          onClick={() => setOpen((v) => !v)}
        >
          <span id={labelId} className="sr-only">
            {open ? "Close menu" : "Open menu"}
          </span>
          <div style={{ display: "flex", gap: 5, flexDirection: "column" }}>
            <div style={{ width: 24, height: 3, background: "black" }} />
            <div style={{ width: 24, height: 3, background: "black" }} />
            <div style={{ width: 24, height: 3, background: "black" }} />
          </div>
        </button>
      </div>
      <div
        ref={backdropRef}
        className={`hm-backdrop ${open ? "open" : ""}`}
        aria-hidden={!open}
      >
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
          className={`hm-drawer right ${open ? "open" : ""}`}
          tabIndex={-1}
        >
          <nav className="hm-nav">
            <ul>
              {MENU_ITEMS.map((it) => (
                <li key={it.href}>
                  <a
                    href={it.href}
                    onClick={(e) => {
                      const href = it.href;
                      if (href.startsWith("#")) {
                        e.preventDefault();
                        const target = document.querySelector(
                          href
                        ) as HTMLElement | null;
                        // close first (iOS fix), then scroll
                        document.body.style.overflow = "";
                        setOpen(false);
                        const doScroll = () => {
                          requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                              target?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                              history.replaceState(null, "", href);
                            });
                          });
                        };
                        const drawer = panelRef.current;
                        if (drawer) {
                          const onEnd = () => {
                            drawer.removeEventListener("transitionend", onEnd);
                            doScroll();
                          };
                          drawer.addEventListener("transitionend", onEnd, {
                            once: true,
                          });
                          setTimeout(onEnd, 260);
                        } else {
                          doScroll();
                        }
                      } else {
                        setOpen(false);
                      }
                    }}
                  >
                    {it.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );

  // ⬅️ Render at <body> level to escape any transformed/z-index ancestors
  return createPortal(ui, document.body);
}
