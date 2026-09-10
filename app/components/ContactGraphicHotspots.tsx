export function ContactGraphicHotspots() {
  return (
    <div className="contact-graphic-surface">
      <nav className="contact-icon-hotspots" aria-label="Message Dave">
        <a data-channel="whatsapp" aria-label="WhatsApp Dave" href="https://wa.me/15879176991" />
        <a data-channel="messenger" aria-label="Message Dave on Messenger" href="https://m.me/61578764844956" />
        <a data-channel="facebook" aria-label="Open Dave's Facebook" href="https://www.facebook.com/profile.php?id=61578764844956" />
        <a data-channel="email" aria-label="Email Dave" href="mailto:Dave3052760@gmail.com" />
      </nav>
      <a className="contact-receiver-hotspot" aria-label="Call Dave at 587-917-6991" href="tel:+15879176991">
        <span className="contact-call-label">
          <strong>Call</strong>
          <span>587 · 917 · 6991</span>
        </span>
      </a>
      <p className="contact-status-note">Website currently being refined. Call or message Dave directly for service.</p>
    </div>
  );
}
