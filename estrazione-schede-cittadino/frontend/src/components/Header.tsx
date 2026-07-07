export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header__top">
        <div className="app-header__inner">
          <a
            href="https://innovazione.gov.it/"
            target="_blank"
            rel="noreferrer"
            className="app-header__dip"
          >
            Dipartimento per la trasformazione digitale
          </a>
        </div>
      </div>
      <div className="app-header__main">
        <div className="app-header__inner">
          <img
            src="/logo-rd-white.png"
            alt="Repubblica Digitale"
            className="app-header__logo"
          />
          <div className="app-header__titles">
            <div className="app-header__title">Facilita</div>
            <div className="app-header__subtitle">
              La piattaforma dei servizi di facilitazione digitale
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
