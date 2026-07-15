export function TopBar({ compact }: { compact: boolean }) {
  return (
    <header className="topbar" data-compact={compact}>
      <a className="wordmark" href="#garage" aria-label="Oakenwrench Mechanical home">
        <span>Oakenwrench</span>
        <small>Mechanical</small>
      </a>
      <a className="call-pill" href="tel:+15879176991">
        Call Dave
      </a>
    </header>
  );
}
