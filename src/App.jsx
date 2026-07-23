import { useState } from 'react';
import { Provider } from './store';
import HomePage from './components/HomePage';
import SettingsPage from './components/SettingsPage';

export default function App() {
  const [page, setPage] = useState('home');
  return (
    <Provider>
      {page === 'home' && <HomePage onSettings={() => setPage('settings')} />}
      {page === 'settings' && <SettingsPage onBack={() => setPage('home')} />}
      <nav className="nav">
        <button className={`nav-btn ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>
          <span className="nav-icon">🏠</span> الرئيسية
        </button>
        <button className={`nav-btn ${page === 'settings' ? 'active' : ''}`} onClick={() => setPage('settings')}>
          <span className="nav-icon">⚙️</span> الإعدادات
        </button>
      </nav>
    </Provider>
  );
}
