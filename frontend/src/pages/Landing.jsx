import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Sprout, Building2, ShieldCheck, MapPin, ChevronRight, CheckCircle2, ArrowRight, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth, ROLE_ROUTES } from '../context/AuthContext';

export default function Landing() {
  const { lang, setLang, languageNames, t } = useLanguage();
  const { user, loginAsRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleQuickEnter = (role) => {
    loginAsRole(role);
    navigate(ROLE_ROUTES[role] || '/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafaf9' }}>
      {/* Navbar */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e7e5e4',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            color: 'white',
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(22, 163, 74, 0.25)'
          }}>
            <Sprout size={24} />
          </div>
          <div>
            <span style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', color: '#1c1917' }}>F2B</span>
            <span style={{ fontSize: '12px', display: 'block', color: '#16a34a', fontWeight: '600', marginTop: '-4px' }}>Farmer to Buyer</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* 3-Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f5f5f4', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e7e5e4' }}>
            <Globe size={16} color="#57534e" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{ background: 'transparent', border: 'none', fontSize: '13px', fontWeight: '600', outline: 'none', cursor: 'pointer' }}
            >
              {Object.entries(languageNames).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to={ROLE_ROUTES[user.role] || '/login'} style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#16a34a',
                color: 'white',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>{t('go_to_dashboard') || 'My Portal'}</span>
                <ArrowRight size={14} />
              </Link>
              <button
                onClick={() => logout()}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e7e5e4',
                  background: 'white',
                  color: '#dc2626',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {t('logout') || 'Logout'}
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #16a34a',
                color: '#16a34a',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {t('login')}
              </Link>

              <Link to="/register" style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#16a34a',
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)'
              }}>
                {t('register')}
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '56px 20px',
        textAlign: 'center',
        maxWidth: '1000px',
        margin: '0 auto',
        flex: 1
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#dcfce7',
          color: '#15803d',
          padding: '6px 16px',
          borderRadius: '9999px',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '20px'
        }}>
          <span>Smart India Hackathon 2026</span>
          <span>•</span>
          <span>AgriRoute AI Architecture</span>
        </div>

        <h1 style={{
          fontSize: '46px',
          fontWeight: '900',
          color: '#0c0a09',
          lineHeight: '1.15',
          letterSpacing: '-1px',
          marginBottom: '16px'
        }}>
          {lang === 'hi' ? (
            <>स्मार्ट मार्ग। <span style={{ color: '#16a34a' }}>समृद्ध फसलें।</span></>
          ) : lang === 'ta' ? (
            <>சிறந்த வழிகள். <span style={{ color: '#16a34a' }}>வலுவான அறுவடைகள்.</span></>
          ) : (
            <>Smart Routes. <span style={{ color: '#16a34a' }}>Stronger Harvests.</span></>
          )}
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#57534e',
          maxWidth: '720px',
          margin: '0 auto 32px',
          lineHeight: '1.6'
        }}>
          {t('hero_desc')}
        </p>

        {/* Quick Role Navigation Bar */}
        <div style={{
          background: 'white',
          padding: '16px 20px',
          borderRadius: '16px',
          border: '1px solid #e7e5e4',
          boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '48px'
        }}>
          {user ? (
            <>
              <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#292524' }}>
                👋 {lang === 'ta' ? 'வணக்கம்' : lang === 'hi' ? 'नमस्ते' : 'Welcome back'}, <strong>{user.full_name || user.name || user.email}</strong>!
                <span style={{ marginLeft: '6px', color: '#16a34a', fontWeight: '800' }}>({user.role})</span>
              </span>
              <button
                onClick={() => navigate(ROLE_ROUTES[user.role] || '/login')}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  background: '#16a34a',
                  border: 'none',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{t('go_to_dashboard') || 'Go to My Portal'}</span>
                <ArrowRight size={15} />
              </button>
              <button
                onClick={() => logout()}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {t('logout') || 'Log Out'}
              </button>
            </>
          ) : (
            <>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#78716c', alignSelf: 'center', marginRight: '6px' }}>
                ⚡ {t('direct_portal_access')}:
              </span>
              <button
                onClick={() => handleQuickEnter('FARMER')}
                style={{ padding: '8px 14px', borderRadius: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
              >
                🌾 {t('open_farmer_portal')}
              </button>
              <button
                onClick={() => handleQuickEnter('COLLECTION_POINT_OPERATOR')}
                style={{ padding: '8px 14px', borderRadius: '10px', background: '#eef2ff', border: '1px solid #c7d2fe', color: '#4338ca', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
              >
                📦 {t('open_operator_portal')}
              </button>
              <button
                onClick={() => handleQuickEnter('DRIVER')}
                style={{ padding: '8px 14px', borderRadius: '10px', background: '#fff7ed', border: '1px solid #fed7aa', color: '#c2410c', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
              >
                🚛 {t('open_driver_portal')}
              </button>
              <button
                onClick={() => handleQuickEnter('BUYER')}
                style={{ padding: '8px 14px', borderRadius: '10px', background: '#fdf2f8', border: '1px solid #fbcfe8', color: '#be185d', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
              >
                🏬 {t('open_buyer_portal')}
              </button>
              <button
                onClick={() => handleQuickEnter('ADMIN')}
                style={{ padding: '8px 14px', borderRadius: '10px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
              >
                👑 {t('open_admin_portal')}
              </button>
            </>
          )}
        </div>

        {/* Feature Cards Grid */}
        <div id="roles" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          textAlign: 'left'
        }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e7e5e4', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ background: '#dcfce7', color: '#16a34a', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Sprout size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{t('farmer')}</h3>
            <p style={{ fontSize: '14px', color: '#78716c', marginBottom: '16px' }}>
              {t('farmer_card_desc')}
            </p>
            <button
              onClick={() => handleQuickEnter('FARMER')}
              style={{ background: 'none', border: 'none', padding: 0, color: '#16a34a', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {t('open_farmer_portal')} <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e7e5e4', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ background: '#e0e7ff', color: '#4338ca', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Building2 size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{t('operator')}</h3>
            <p style={{ fontSize: '14px', color: '#78716c', marginBottom: '16px' }}>
              {t('operator_card_desc')}
            </p>
            <button
              onClick={() => handleQuickEnter('COLLECTION_POINT_OPERATOR')}
              style={{ background: 'none', border: 'none', padding: 0, color: '#4338ca', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {t('open_operator_portal')} <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e7e5e4', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ background: '#fef3c7', color: '#b45309', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Truck size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{t('driver')}</h3>
            <p style={{ fontSize: '14px', color: '#78716c', marginBottom: '16px' }}>
              {t('driver_card_desc')}
            </p>
            <button
              onClick={() => handleQuickEnter('DRIVER')}
              style={{ background: 'none', border: 'none', padding: 0, color: '#b45309', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {t('open_driver_portal')} <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e7e5e4', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ background: '#fee2e2', color: '#b91c1c', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Building2 size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{t('buyer')}</h3>
            <p style={{ fontSize: '14px', color: '#78716c', marginBottom: '16px' }}>
              {t('buyer_card_desc')}
            </p>
            <button
              onClick={() => handleQuickEnter('BUYER')}
              style={{ background: 'none', border: 'none', padding: 0, color: '#b91c1c', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {t('open_buyer_portal')} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1c1917', color: '#a8a29e', padding: '28px 20px', textAlign: 'center', fontSize: '13px' }}>
        <p style={{ marginBottom: '6px', color: 'white', fontWeight: '600' }}>F2B — Smart Routes. Stronger Harvests.</p>
        <p style={{ margin: 0 }}>Built for Indian Agriculture Logistics & Smart India Hackathon 2026</p>
      </footer>
    </div>
  );
}
