import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Globe, LogOut, Sprout, User } from 'lucide-react';

const ROLE_BADGES = {
  FARMER: { label: 'Farmer Portal', icon: '🌾', color: '#16a34a', bg: '#14532d' },
  BUYER: { label: 'Buyer / Mandi Portal', icon: '🏬', color: '#db2777', bg: '#831843' },
  DRIVER: { label: 'Driver Logistics', icon: '🚛', color: '#d97706', bg: '#78350f' },
  COLLECTION_POINT_OPERATOR: { label: 'Hub Operator', icon: '📦', color: '#4f46e5', bg: '#312e81' },
  ADMIN: { label: 'Admin Console', icon: '👑', color: '#ef4444', bg: '#7f1d1d' },
};

export default function RoleSwitcherBar() {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleInfo = (user && ROLE_BADGES[user.role]) || {
    label: user?.role || 'Guest',
    icon: '👤',
    color: '#a8a29e',
    bg: '#292524',
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
      {/* Left: Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link to="/" style={{ color: '#4ade80', textDecoration: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sprout size={16} /> F2B Portal
        </Link>
        <span style={{ color: '#78716c' }}>|</span>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: roleInfo.bg,
          color: 'white',
          padding: '2px 10px',
          borderRadius: '9999px',
          fontSize: '11px',
          fontWeight: '700',
          border: `1px solid ${roleInfo.color}`
        }}>
          <span>{roleInfo.icon}</span>
          <span>{roleInfo.label}</span>
        </div>
      </div>

      {/* Center: Current User Information */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d6d3d1', fontSize: '11.5px' }}>
        <User size={13} color="#a8a29e" />
        <span>{user?.full_name || user?.name || user?.email || 'Logged in user'}</span>
        {user?.village && (
          <span style={{ color: '#78716c' }}>({user.village})</span>
        )}
      </div>

      {/* Right: Language Toggle & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
          onClick={handleLogout}
          title="Log Out"
          style={{
            background: '#b91c1c',
            border: 'none',
            color: 'white',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <LogOut size={12} /> {t('logout') || 'Logout'}
        </button>
      </div>
    </div>
  );
}
