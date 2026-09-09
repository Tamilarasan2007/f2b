import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoleSwitcherBar from '../components/RoleSwitcherBar';
import { LayoutDashboard, Users, Truck, Route, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();

  const links = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/farmers', icon: Users, label: 'Farmers' },
    { to: '/admin/drivers', icon: Users, label: 'Drivers' },
    { to: '/admin/vehicles', icon: Truck, label: 'Vehicles' },
    { to: '/admin/routes', icon: Route, label: 'Routes' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f4' }}>
      <RoleSwitcherBar />

      <div className="app-layout">
        <div className="sidebar" style={{ top: 38 }}>
          <div className="sidebar-brand">
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#dc2626' }}>F2B Admin 👑</h1>
            <p>AgriRoute AI Command</p>
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
        <div className="mobile-header" style={{ top: 38 }}><h1>F2B Admin</h1></div>
        <div className="main-content"><Outlet /></div>
        <div className="bottom-nav">
          <div className="bottom-nav-inner">
            {links.slice(0, 4).map((l) => (
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
