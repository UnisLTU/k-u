import GalleryUploader from "./GalleryUploader";

export default function PhotosSection() {
  return (
    <section id="photos" className="section">
      <h2>Šventės akimirkos</h2>
      <p style={{ paddingTop: 12 }}>
        Po šventės labai lauksime jūsų nuotraukų ir video!
      </p>
      <GalleryUploader />
    </section>
  );
}
