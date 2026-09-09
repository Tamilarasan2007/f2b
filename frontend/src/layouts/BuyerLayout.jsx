import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoleSwitcherBar from '../components/RoleSwitcherBar';
import { LayoutDashboard, ShoppingCart, Plus, LogOut, Gavel, MessageSquare } from 'lucide-react';

export default function BuyerLayout() {
  const { user, logout } = useAuth();

  const links = [
    { to: '/buyer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/buyer/bidding', icon: Gavel, label: 'Dealer Bidding 🏆' },
    { to: '/buyer/negotiations', icon: MessageSquare, label: 'F2C Deals 💬' },
    { to: '/buyer/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/buyer/orders/create', icon: Plus, label: 'New Order' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f4' }}>
      <RoleSwitcherBar />

      <div className="app-layout">
        <div className="sidebar" style={{ top: 38 }}>
          <div className="sidebar-brand">
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#b91c1c' }}>F2B Buyer 🏬</h1>
            <p>Wholesale Mandi</p>
          </div>
          <nav className="sidebar-nav">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? 'active' : ''}>
                <l.icon size={18} />
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, padding: '0 20px' }}>
            <div style={{ fontSize: 13, color: '#78716c', marginBottom: 8 }}>{user?.name || user?.full_name}</div>
            <button onClick={logout} className="btn btn-secondary btn-block" style={{ fontSize: 13 }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
        <div className="mobile-header" style={{ top: 38 }}><h1>F2B Market</h1></div>
        <div className="main-content"><Outlet /></div>
        <div className="bottom-nav">
          <div className="bottom-nav-inner">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? 'active' : ''}>
                <l.icon size={22} />
                <span>{l.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
