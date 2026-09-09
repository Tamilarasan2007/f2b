import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, ROLE_ROUTES } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Globe, LogOut, Home, Sprout } from 'lucide-react';

export default function RoleSwitcherBar() {
  const { user, loginAsRole, logout } = useAuth();
  const { lang, setLang, languageNames, t } = useLanguage();
  const navigate = useNavigate();

  const handleSwitch = (role) => {
    loginAsRole(role);
    navigate(ROLE_ROUTES[role]);
  };

  return (
    <div style={{
      background: '#1c1917',
      color: '#e7e5e4',
      padding: '8px 16px',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '8px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid #292524'
    }}>
      {/* Left: Brand & Home */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link to="/" style={{ color: '#4ade80', textDecoration: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sprout size={16} /> F2B Portal
        </Link>
        <span style={{ color: '#78716c' }}>|</span>
        <span style={{ color: '#a8a29e' }}>
          Role: <strong style={{ color: 'white' }}>{user?.role || 'Guest'}</strong>
        </span>
      </div>

      {/* Center: 1-Click Role Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleSwitch('FARMER')}
          style={{
            background: user?.role === 'FARMER' ? '#16a34a' : '#292524',
            color: 'white',
            border: '1px solid #44403c',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🌾 {t('farmer')}
        </button>
        <button
          onClick={() => handleSwitch('COLLECTION_POINT_OPERATOR')}
          style={{
            background: user?.role === 'COLLECTION_POINT_OPERATOR' ? '#4f46e5' : '#292524',
            color: 'white',
            border: '1px solid #44403c',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          📦 {t('operator')}
        </button>
        <button
          onClick={() => handleSwitch('DRIVER')}
          style={{
            background: user?.role === 'DRIVER' ? '#d97706' : '#292524',
            color: 'white',
            border: '1px solid #44403c',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🚛 {t('driver')}
        </button>
        <button
          onClick={() => handleSwitch('BUYER')}
          style={{
            background: user?.role === 'BUYER' ? '#db2777' : '#292524',
            color: 'white',
            border: '1px solid #44403c',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🏬 {t('buyer')}
        </button>
        <button
          onClick={() => handleSwitch('ADMIN')}
          style={{
            background: user?.role === 'ADMIN' ? '#dc2626' : '#292524',
            color: 'white',
            border: '1px solid #44403c',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          👑 {t('admin')}
        </button>
      </div>

      {/* Right: Language Toggle & Home */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link
          to="/manual"
          title={t('user_manual')}
          style={{
            color: '#fde047',
            textDecoration: 'none',
            fontSize: '11px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#422006',
            padding: '3px 8px',
            borderRadius: '6px',
            border: '1px solid #ca8a04'
          }}
        >
          📖 {lang === 'ta' ? 'கையேடு' : lang === 'hi' ? 'मैनुअल' : 'Guide'}
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#292524', padding: '3px 8px', borderRadius: '6px', border: '1px solid #44403c' }}>
          <Globe size={12} color="#a8a29e" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{ background: 'transparent', color: 'white', border: 'none', fontSize: '11px', fontWeight: '600', outline: 'none', cursor: 'pointer' }}
          >
            <option value="en" style={{ color: 'black' }}>English</option>
            <option value="ta" style={{ color: 'black' }}>தமிழ் (Tamil)</option>
            <option value="hi" style={{ color: 'black' }}>हिन्दी (Hindi)</option>
          </select>
        </div>

        <button
          onClick={() => navigate('/')}
          title="Return to Home"
          style={{ background: 'none', border: 'none', color: '#a8a29e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
        >
          <Home size={13} /> {t('home')}
        </button>
      </div>
    </div>
  );
}
