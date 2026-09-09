import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import RoleSwitcherBar from '../components/RoleSwitcherBar';
import { ArrowLeft, Home, Globe } from 'lucide-react';

export default function DriverLayout() {
  const { user } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f4' }}>
      <RoleSwitcherBar />

      {/* Header */}
      <div style={{ position: 'sticky', top: 38, zIndex: 30, background: 'white', padding: '14px 20px', borderBottom: '1px solid #e7e5e4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <ArrowLeft size={20} color="#57534e" />
          </button>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#b45309', margin: 0 }}>
              F2B {t('driver_nav_title')}
            </h1>
            <p style={{ fontSize: 12, color: '#78716c', margin: 0 }}>
              {user?.name || user?.full_name || t('driver')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{ padding: '6px 8px', border: '1px solid #d6d3d1', borderRadius: 8, fontSize: 12, background: 'white', fontWeight: 600, cursor: 'pointer' }}
          >
            <option value="en">English</option>
            <option value="ta">தமிழ்</option>
            <option value="hi">हिन्दी</option>
          </select>
          <button
            onClick={() => navigate('/')}
            title={t('home')}
            style={{ background: '#f5f5f4', border: '1px solid #e7e5e4', cursor: 'pointer', width: 34, height: 34, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Home size={16} color="#78716c" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>
        <Outlet />
      </div>
    </div>
  );
}
