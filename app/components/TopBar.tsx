export function TopBar({ compact }: { compact: boolean }) {
  return (
    <header className="topbar" data-compact={compact}>
      <a className="brand-lockup" href="#garage" aria-label="Oakenwrench Mechanical home">
        <span className="brand-emblem" aria-hidden="true">
          <img
            src="/media/brand/oakenwrench-logo-source.jpg"
            alt=""
            draggable={false}
          />
        </span>
        <span className="wordmark" aria-hidden="true">
          <span>Oakenwrench</span>
          <small>Mechanical</small>
        </span>
      </a>
      <a className="call-pill" href="tel:+15879176991">
        Call Dave
      </a>
    </header>
  );
}
