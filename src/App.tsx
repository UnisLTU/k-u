import { useEffect } from "react";
import "./App.css";
import HamburgerMenu from "./components/HamburgerMenu";
import Header from "./components/Header";
import PhotosSection from "./components/PhotosSection";

function useRevealOnLoad() {
  useEffect(() => {
    const selectors = [
      ".content .section",
      ".venue-grid .card",
      ".venue-photo",
      ".map-embed",
    ].join(", ");

    const els = Array.from(document.querySelectorAll(selectors));

    // prepare + assign stagger delay
    els.forEach((el, i) => {
      el.classList.add("reveal-init");
      el.style.setProperty("--reveal-delay", `${i * 80}ms`);
    });

    if (!("IntersectionObserver" in window)) {
      // Fallback: reveal after a tick
      requestAnimationFrame(() =>
        els.forEach((el) => el.classList.add("reveal-in"))
      );
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function App() {
  useRevealOnLoad();
  return (
    <div className="main background-main">
      <Header />
      <HamburgerMenu />

      <main className="content">
        {/* 1) PRADŽIA */}
        <section id="home" className="section home-section">
          <h2>Pradžia</h2>
          <p>
            Sveiki atvykę į mūsų vestuvių svetainę! ❤️ Čia rasite visą
            svarbiausią informaciją apie mūsų šventę.
          </p>
        </section>

        {/* 2) ŠVENTĖS VIETA */}
        <section id="venue" className="section venue-section">
          <h2>Šventės vieta</h2>

          <div className="venue-grid">
            <article className="card">
              <h3>Bažnyčia</h3>
              <p>
                Ceremonija vyks <strong>Surdegio bažnyčioje</strong>, pradžia
                12:00. Atvykite keliomis minutėmis anksčiau 🙏
              </p>
              <img
                className="venue-photo"
                src="../public/SurdegioBaznycia.jpg"
                alt="Barono vilos nuotrauka"
              />
              <div className="map-embed">
                <iframe
                  title="Bažnyčia (žemėlapis)"
                  src="https://www.google.com/maps?q=Vilniaus+Katedra&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </article>

            <article className="card">
              <h3>Barono vila</h3>
              <p>
                Šventės dalis po ceremonijos vyks <strong>Barono viloje</strong>
                . Laukia jauki aplinka prie ežero.
              </p>
              <img
                className="venue-photo"
                src="../public/BaronoVila.jpg"
                alt="Barono vilos nuotrauka"
              />
              <div className="map-embed">
                <iframe
                  title="Barono vila (žemėlapis)"
                  src="https://www.google.com/maps?q=Barono+Vila&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </article>
          </div>
        </section>

        {/* 3) DRESS KODAS */}
        <section id="dresscode" className="section">
          <h2>Dress kodas</h2>
          <p>
            Prašome rinktis <strong>pusiau oficialų</strong> stilių. Spalvų
            paletė: švelnios žemės ir pasteliniai tonai. Venkite baltos spalvos
            suknelių. Patogūs batai pravers pasivaikščioti gamtoje. 👗🕺
          </p>
        </section>

        {/* 4) VAKARIENĖ */}
        <section id="dinner" className="section">
          <h2>Vakarienė</h2>
          <p style={{ marginBottom: 4 }}>18:00 – Užkandžiai ir sveikinimai</p>
          <p style={{ marginBottom: 4 }}>
            19:00 – Pagrindinis patiekalas (mėsos / žuvies / vegetariškas)
          </p>
          <p style={{ marginBottom: 4 }}>21:00 – Desertas ir tortas</p>

          <p style={{ marginBottom: 4 }}>
            Jei turite alergijų ar specialių pageidavimų – parašykite mums
            (kontaktai žemiau).
          </p>
        </section>

        {/* 5) DOVANOS */}
        <section id="gifts" className="section">
          <h2>Dovanos</h2>
          <p>
            Didžiausia dovana – jūsų buvimas kartu su mumis. Jei norite
            prisidėti, mums labiausiai praverstų parama <em>medaus mėnesiui</em>
            . Gėlių prašome nenešti 🌿
          </p>
        </section>

        {/* 6) PAPILDOMAI */}
        <section id="extra" className="section">
          <h2>Papildomai</h2>
          <p>Parkavimas: vietoje yra nemokama aikštelė.</p>
          <p>
            Apgyvendinimas: ribotas kambarių skaičius viloje – registracija iki{" "}
            <strong>[data]</strong>.
          </p>
          <h3>Kontaktai: </h3>
          <a href="mailto:kurbonait7@email.com">kurbonait7@email.com</a>
          <p style={{ margin: 4 }}>arba</p>
          <a href="mailto:tyla.ugnius@email.com">tyla.ugnius@email.com</a>
        </section>

        {/* 7) NUOTRAUKOS */}
        <PhotosSection />
      </main>
    </div>
  );
}

export default App;
