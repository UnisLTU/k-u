export default function AdditionalSection() {
  return (
    <section id="extra" className="section">
      <h2>Papildomai</h2>
      {/* <p>Parkavimas: vietoje yra nemokama aikštelė.</p> */}
      <h3>
        Jeigu turite klausimu, susijusių su vestuvėmis, visada galite kreiptis į
        musų vestuvių planuotoją Liną:
      </h3>
      <div>
        <a
          href="mailto:info@vestuviuvejai.lt"
          style={{ display: "block", marginBottom: 8 }}
        >
          info@vestuviuvejai.lt
        </a>
        <a href="tel:+37065682938" style={{ display: "block" }}>
          +370 656 82938
        </a>
      </div>
    </section>
  );
}
