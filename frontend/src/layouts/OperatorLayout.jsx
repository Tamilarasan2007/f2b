import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoleSwitcherBar from '../components/RoleSwitcherBar';
import { LayoutDashboard, ClipboardList, Route, Truck, LogOut } from 'lucide-react';

export default function OperatorLayout() {
  const { user, logout } = useAuth();

  const links = [
    { to: '/operator/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/operator/pickups', icon: ClipboardList, label: 'Pickups' },
    { to: '/operator/routes', icon: Route, label: 'Routes' },
    { to: '/operator/vehicles', icon: Truck, label: 'Vehicles' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f4' }}>
      <RoleSwitcherBar />

      <div className="app-layout">
        {/* Sidebar */}
        <div className="sidebar" style={{ top: 38 }}>
          <div className="sidebar-brand">
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#4338ca' }}>F2B Operator 📦</h1>
            <p>Collection Hub</p>
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

        {/* Mobile Header */}
        <div className="mobile-header" style={{ top: 38 }}>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#4338ca' }}>F2B Operator</h1>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <Outlet />
        </div>

        {/* Mobile Bottom Nav */}
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
