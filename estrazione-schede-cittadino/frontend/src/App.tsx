import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import RicercaSingola from './pages/RicercaSingola';
import RicercaMultipla from './pages/RicercaMultipla';

type Tab = 'singola' | 'multipla';

export default function App() {
  const [tab, setTab] = useState<Tab>('singola');

  return (
    <div className="app-layout">
      <Header />

      <main className="container">
        <h1>Ricerca cittadini</h1>

        <div className="tabs">
          <button
            className={tab === 'singola' ? 'tab active' : 'tab'}
            onClick={() => setTab('singola')}
          >
            Ricerca singola
          </button>
          <button
            className={tab === 'multipla' ? 'tab active' : 'tab'}
            onClick={() => setTab('multipla')}
          >
            Ricerca multipla
          </button>
        </div>

        <div className="tab-content">
          {tab === 'singola' ? <RicercaSingola /> : <RicercaMultipla />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
