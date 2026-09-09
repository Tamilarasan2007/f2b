import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import RoleSwitcherBar from '../components/RoleSwitcherBar';
import { Home, Plus, Truck, Wallet, LogOut, TrendingUp, MessageSquare, Gavel, BookOpen } from 'lucide-react';

export default function FarmerLayout() {
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useLanguage();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f4' }}>
      {/* Top Demo & Role Switcher */}
      <RoleSwitcherBar />

      {/* Mobile Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 38, zIndex: 30, background: 'white', padding: '14px 20px', borderBottom: '1px solid #e7e5e4' }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#15803d', margin: 0 }}>F2B 🌱 {t('farmer')}</h1>
          <p style={{ fontSize: 12, color: '#78716c', margin: 0 }}>{getGreeting(t)}, {user?.name || user?.full_name || 'Farmer'}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <NavLink
            to="/farmer/manual"
            title={t('user_manual')}
            style={{
              background: '#fef3c7',
              color: '#92400e',
              border: '1px solid #fde68a',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <BookOpen size={15} />
            <span>{lang === 'ta' ? 'கையேடு 📖' : lang === 'hi' ? 'मैनुअल 📖' : 'Guide 📖'}</span>
          </NavLink>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{ padding: '6px 8px', border: '1px solid #d6d3d1', borderRadius: 8, fontSize: 12, background: 'white', fontWeight: 600 }}
          >
            <option value="en">English</option>
            <option value="ta">தமிழ்</option>
            <option value="hi">हिन्दी</option>
          </select>
          <button onClick={logout} title="Logout" style={{ background: '#f5f5f4', border: '1px solid #e7e5e4', cursor: 'pointer', width: 34, height: 34, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 16, paddingBottom: 80 }}>
        <Outlet />
      </div>

      {/* Bottom Nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e7e5e4', zIndex: 50, padding: '6px 0 calc(6px + env(safe-area-inset-bottom))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', overflowX: 'auto' }}>
          <NavLink to="/farmer/dashboard" style={({ isActive }) => navStyle(isActive)}>
            <Home size={20} />
            <span>{t('home')}</span>
          </NavLink>
          <NavLink to="/farmer/add-crop" style={({ isActive }) => navStyle(isActive)}>
            <Plus size={20} />
            <span>{t('add_crop')}</span>
          </NavLink>
          <NavLink to="/farmer/negotiations" style={({ isActive }) => navStyle(isActive)}>
            <MessageSquare size={20} />
            <span>F2C {lang === 'ta' ? 'பேரம்' : lang === 'hi' ? 'मोलभाव' : 'Bargain'}</span>
          </NavLink>
          <NavLink to="/farmer/bidding" style={({ isActive }) => navStyle(isActive)}>
            <Gavel size={20} />
            <span>F2D {lang === 'ta' ? 'ஏலம் 🏆' : lang === 'hi' ? 'नीलामी 🏆' : 'Auction 🏆'}</span>
          </NavLink>
          <NavLink to="/farmer/manual" style={({ isActive }) => navStyle(isActive)}>
            <BookOpen size={20} />
            <span>{lang === 'ta' ? 'கையேடு' : lang === 'hi' ? 'मैनुअल' : 'Manual'}</span>
          </NavLink>
          <NavLink to="/farmer/forecast" style={({ isActive }) => navStyle(isActive)}>
            <TrendingUp size={20} />
            <span>{t('demand_forecast')}</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

function navStyle(isActive) {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: '6px 12px',
    color: isActive ? '#16a34a' : '#78716c',
    textDecoration: 'none',
    fontSize: 11,
    fontWeight: isActive ? 700 : 500,
    minWidth: 60,
  };
}

function getGreeting(t) {
  const hour = new Date().getHours();
  if (hour < 12) return t('good_morning');
  if (hour < 17) return t('good_afternoon');
  return t('good_evening');
}
