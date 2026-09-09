import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, ROLE_ROUTES } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Lock, Phone, AlertCircle, ArrowRight, Globe } from 'lucide-react';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginAsRole } = useAuth();
  const { lang, setLang, languageNames, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(identifier, password);
      if (res.success && res.user) {
        navigate(ROLE_ROUTES[res.user.role] || '/farmer/dashboard');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid phone/email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemo = (role) => {
    const user = loginAsRole(role);
    navigate(ROLE_ROUTES[user.role] || '/farmer/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #e0e7ff 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '36px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        border: '1px solid #e7e5e4'
      }}>
        {/* Language selector bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f5f5f4', padding: '4px 8px', borderRadius: '8px', border: '1px solid #e7e5e4' }}>
            <Globe size={14} color="#78716c" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{ background: 'transparent', border: 'none', fontSize: '12px', fontWeight: '600', outline: 'none', cursor: 'pointer' }}
            >
              {Object.entries(languageNames).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            color: 'white',
            marginBottom: '12px',
            boxShadow: '0 8px 16px rgba(22, 163, 74, 0.3)'
          }}>
            <Sprout size={32} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1c1917', margin: 0 }}>
            {t('app_name')} {t('login')}
          </h2>
          <p style={{ fontSize: '13px', color: '#78716c', marginTop: '4px' }}>{t('tagline')}</p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '13px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#44403c', marginBottom: '6px' }}>
              {t('phone')} / {t('email')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="9876543210 or farmer@f2b.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '10px',
                  border: '1px solid #d6d3d1',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a8a29e' }} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#44403c', marginBottom: '6px' }}>
              {t('password')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '10px',
                  border: '1px solid #d6d3d1',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a8a29e' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              background: '#16a34a',
              color: 'white',
              border: 'none',
              fontSize: '15px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
            }}
          >
            {loading ? t('loading') : t('login')} <ArrowRight size={18} />
          </button>
        </form>

        {/* 1-Click Instant Demo Portals */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f5f5f4' }}>
          <p style={{ fontSize: '12px', color: '#78716c', fontWeight: '700', marginBottom: '10px', textAlign: 'center' }}>
            ⚡ 1-Click Instant Demo (Opens Portal Directly)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleInstantDemo('FARMER')}
              style={{ padding: '10px', borderRadius: '10px', border: '1px solid #bbf7d0', background: '#f0fdf4', fontSize: '12px', fontWeight: '700', color: '#16a34a', cursor: 'pointer' }}
            >
              🌾 {t('farmer')} (Murugan)
            </button>
            <button
              type="button"
              onClick={() => handleInstantDemo('COLLECTION_POINT_OPERATOR')}
              style={{ padding: '10px', borderRadius: '10px', border: '1px solid #c7d2fe', background: '#eef2ff', fontSize: '12px', fontWeight: '700', color: '#4338ca', cursor: 'pointer' }}
            >
              📦 Operator Hub
            </button>
            <button
              type="button"
              onClick={() => handleInstantDemo('DRIVER')}
              style={{ padding: '10px', borderRadius: '10px', border: '1px solid #fed7aa', background: '#fff7ed', fontSize: '12px', fontWeight: '700', color: '#c2410c', cursor: 'pointer' }}
            >
              🚛 {t('driver')} (Suresh)
            </button>
            <button
              type="button"
              onClick={() => handleInstantDemo('BUYER')}
              style={{ padding: '10px', borderRadius: '10px', border: '1px solid #fbcfe8', background: '#fdf2f8', fontSize: '12px', fontWeight: '700', color: '#be185d', cursor: 'pointer' }}
            >
              🏬 Buyer / Mandi
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleInstantDemo('ADMIN')}
            style={{ width: '100%', marginTop: '8px', padding: '10px', borderRadius: '10px', border: '1px solid #fecaca', background: '#fef2f2', fontSize: '12px', fontWeight: '700', color: '#b91c1c', cursor: 'pointer' }}
          >
            👑 Admin Executive Dashboard
          </button>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/register" style={{ fontSize: '13px', color: '#16a34a', textDecoration: 'none', fontWeight: '600' }}>
            New user? {t('register')}
          </Link>
        </div>
      </div>
    </div>
  );
}
