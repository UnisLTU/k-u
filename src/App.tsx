import { useEffect } from "react";
import "./App.css";
import HamburgerMenu from "./components/HamburgerMenu";
import Header from "./components/Header";
import PhotosSection from "./components/PhotosSection";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import AdditionalSection from "./components/AdditionalSection";
// import FoodForm from "./components/FoodForm";

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

console.log(import.meta.env.VITE_FIREBASE_API_KEY);

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
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
            Sveiki atvykę į mūsų vestuvių svetainę! Čia rasite visą svarbiausią
            informaciją apie mūsų šventę.
          </p>
        </section>

        <section id="plan" className="section home-section">
          <h2>Dienos planas</h2>
          <p style={{ fontWeight: 700 }}>15:30</p>
          <p>
            Santuokos sakramentas – Surdegio Švč. Mergelės Marijos ėmimo į dangų
            bažnyčia
          </p>
          <br />
          <p style={{ fontWeight: 700 }}>16:00</p>
          <p>Šampano taurė prie bažnyčios</p>
          <br />
          <p style={{ fontWeight: 700 }}>17:30</p>
          <p>Svečių atvykimas į šventės vietą – Barono vila</p>
          <br />
          <p style={{ fontWeight: 700 }}>18:00</p>
          <p>Sveikinimai</p>
          <br />
          <p style={{ fontWeight: 700 }}>19:00</p>
          <p>Šventinė vakarienė & vakarėlis</p>
          <br />
          <p style={{ fontWeight: 700 }}>Po šventės</p>
          <p>
            Barono vila rezervuota dviem naktims – kviečiame likti dar vienai
            dienai pokalbiams, poilsiui ir pasimėgavimui nuostabia gamta bei
            privačiu tvenkiniu.
          </p>
        </section>

        {/* 2) ŠVENTĖS VIETA */}
        <section id="ceremony" className="section venue-section">
          <h2>Ceremonijos vieta</h2>

          <div className="venue-grid">
            <article className="card">
              <p style={{ marginBottom: 20 }}>
                Jūsų patogumui žemiau rasite nuorodas žemėlapyje atvesiančias
                tiksliai į{" "}
                <strong>
                  Surdegio Švč. Mergėlės Marijos ėmimo į dangų bažnyčią.{" "}
                </strong>
                Kaip ir minėjome dienos plane - ceremonijos pradžia{" "}
                <strong> 15:30. </strong>
                Lauksime Jūsų keliomis minutėmis ankščiau.
              </p>
              <div className="row">
                <img
                  className="venue-photo"
                  src="SurdegioBaznycia.png"
                  alt="Barono vilos nuotrauka"
                />
                <div className="map-embed">
                  <iframe
                    title="Surdegio bažnyčia"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1326.834921877609!2d24.809532213015707!3d55.668513995514836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46e7dab8a93bd68f%3A0xba88d8d20e7ebe6!2zU3VyZGVnaW8gxaB2xI0uIE1lcmdlbMSXcyBNYXJpam9zIMSXbWltbyDEryBkYW5nxbMgYmHFvm55xI1pYQ!5e1!3m2!1slt!2slt!4v1762246073884!5m2!1slt!2slt"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </article>
          </div>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Surdegio+bažnyčia"
            target="_blank"
            rel="noopener noreferrer"
            className="directions-btn"
          >
            Atidaryti žemėlapyje
          </a>
        </section>

        <section id="venue" className="section venue-section">
          <h2>Šventės vieta</h2>

          <div className="venue-grid">
            <article className="card">
              <h3>Barono vila</h3>
              <p style={{ marginBottom: 20 }}>
                Po ceremonijos susitiksime Barono viloje. Jūsų lauks jauki
                aplinka ir daug erdvės sukurti gražiausius atsiminimus! Žemiau
                rasite nuorodas padėsiančias atvykti į šventės vietą.
              </p>
              <div className="row">
                <img
                  className="venue-photo"
                  src="BaronoVila.jpg"
                  alt="Barono vilos nuotrauka"
                />
                <div className="map-embed">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d23028.32249829917!2d25.368010075266156!3d55.650011849778124!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46e7fcb30c44a3d7%3A0x4a173bd4c927fbd2!2sBARONO%20VILA%2C%20sodyba!5e1!3m2!1slt!2slt!4v1762246218406!5m2!1slt!2slt"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </article>
            <h3>Vietos automobiliams</h3>
            <p style={{ marginBottom: 20, marginTop: 20 }}>
              Vilos teritorijoje bus užtektinai vietos Jūsų transporto
              priemonėms, taip pat ir stotelė elektromobiliams.
            </p>
          </div>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Barono+vila"
            target="_blank"
            rel="noopener noreferrer"
            className="directions-btn"
          >
            Atidaryti žemėlapyje
          </a>
        </section>

        {/* 3) DRESS KODAS */}
        <section id="dresscode" className="section">
          <h2>Aprangos kodas</h2>
          <p style={{ marginBottom: 20 }}>
            Neprašysime Jūsų nieko įmantraus, tik bendros spalvų paletės. Labai
            pamalonintumėte mus, savo aprangai pasirinkę rudos spalvų gamos
            drabužius. Keletas nuotraukų įkvėpimui:
          </p>
          <Carousel responsive={responsive} className="carousel">
            <div className="carousel-item">
              <img
                src="outfit6.jpeg"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                alt="outfit6"
              />
            </div>
            <div className="carousel-item">
              <img
                src="outfit1.jpeg"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                alt="outfit1"
              />
            </div>
            <div className="carousel-item">
              <img
                src="outfit2.jpeg"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                alt="outfit2"
              />
            </div>
            <div className="carousel-item">
              <img
                src="outfit3.jpeg"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                alt="outfit3"
              />
            </div>
            <div className="carousel-item">
              <img
                src="outfit4.jpeg"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                alt="outfit4"
              />
            </div>
            <div className="carousel-item">
              <img
                src="outfit5.jpeg"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                alt="outfit5"
              />
            </div>

            <div className="carousel-item">
              <img
                src="outfit7.jpeg"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                alt="outfit7"
              />
            </div>
            <div className="carousel-item">
              <img
                src="outfit8.jpeg"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                alt="outfit8"
              />
            </div>
          </Carousel>
        </section>

        <section id="stay" className="section">
          <h2>Dalyvavimas ir nakvynė</h2>
          <p style={{ marginBottom: 4 }}>
            Prašome Jūsų žemiau esančioje formoje užpildyti informaciją apie
            dalyvavimą šventėje ir poreikį nakvynei.
          </p>
          <a href="https://forms.gle/yALx5gns5KNUQQG5A">Užpildyti formą</a>

          <p></p>
        </section>

        {/* 4) VAKARIENĖ */}
        <section id="dinner" className="section">
          <h2>Vakarienė</h2>
          <p style={{ marginBottom: 4 }}>
            Maisto pasirinkimai bus pateikti nuo gegužės 1 dienos.
          </p>
          {/* <p style={{ marginBottom: 4 }}>
            Jei turite alergijų ar specialių pageidavimų – nurodykite formoje
            žemiau.
          </p>
          <FoodForm /> */}

          <p></p>
        </section>

        {/* 5) DOVANOS */}
        <section id="gifts" className="section">
          <h2>Dovanos</h2>
          <p>
            Didžiausia dovana - jūsų buvimas kartu su mumis. Jei galvojate apie
            dovaną, mums labiausiai praverstų indėlis į medaus mėnesio kelionę.
            Gėles palikime žydėti laukuose.
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
