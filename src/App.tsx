import { useEffect } from "react";
import "./App.css";
import HamburgerMenu from "./components/HamburgerMenu";
import Header from "./components/Header";
import PhotosSection from "./components/PhotosSection";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import AdditionalSection from "./components/AdditionalSection";
import FoodForm from "./components/FoodForm";

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
    els.forEach((el: HTMLElement, i) => {
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

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

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
              <p style={{ minHeight: 50 }}>
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
              <p style={{ minHeight: 50 }}>
                Po ceremonijos susitiksime Barono viloje. Jūsų lauks jauki
                aplinka ir daug erdvės sukurti gražiausius atsiminimus!
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
          <p style={{ marginBottom: 20 }}>
            Neprašyme Jūsų nieko įmantraus, tik bendros spalvų paletės. Labai
            pamalonintumėte mus, savo aprangai pasirinkę rudos spalvų gamos
            drabužius. Keletas nuotraukų įkvėpimui:
          </p>
          <Carousel responsive={responsive} className="carousel">
            <div className="carousel-item">Item 1</div>
            <div className="carousel-item">Item 2</div>
            <div className="carousel-item">Item 3</div>
            <div className="carousel-item">Item 4</div>
          </Carousel>
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

          <h3>Prašome užpildyti šią formą:</h3>
          <FoodForm />
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
        <AdditionalSection />

        {/* 7) NUOTRAUKOS */}
        <PhotosSection />
      </main>
    </div>
  );
}

export default App;
