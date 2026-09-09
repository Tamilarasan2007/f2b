import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { Sprout, PlusCircle, Truck, TrendingUp, SunMedium, ArrowRight, Sparkles, MessageSquare, Trophy, BookOpen } from 'lucide-react';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      const res = await api.get('/api/pickups/my-pickups');
      if (res.data && res.data.length > 0) {
        setPickups(res.data);
      } else {
        setPickups(getDemoPickups());
      }
    } catch (err) {
      setPickups(getDemoPickups());
    } finally {
      setLoading(false);
    }
  };

  const getDemoPickups = () => [
    {
      id: 1,
      crop_name: t('crop_tomato'),
      quantity_kg: 250,
      status: 'ASSIGNED',
      pickup_date: '2026-09-09',
      driver_name: 'Suresh Kumar',
      vehicle_number: 'TN 37 CY 4821',
      eta_minutes: 25,
      otp: '4829'
    }
  ];

  const marketRates = [
    { crop: t('crop_tomato'), rate: '₹28 / kg', trend: t('trend_up') },
    { crop: t('crop_banana'), rate: '₹34 / kg', trend: t('trend_stable') },
    { crop: t('crop_onion'), rate: '₹32 / kg', trend: t('trend_up') },
    { crop: t('crop_tapioca'), rate: '₹19 / kg', trend: t('trend_stable') }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Welcome Card */}
      <div style={{
        background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
        borderRadius: '20px',
        padding: '24px',
        color: 'white',
        marginBottom: '20px',
        boxShadow: '0 8px 24px rgba(22, 163, 74, 0.25)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', marginBottom: '8px', fontWeight: '600' }}>
              <SunMedium size={14} /> {t('weather_notice')}
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0' }}>
              {t('greeting')}, {user?.name || user?.full_name || 'Farmer'}!
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '13px' }}>
              {user?.village || 'Thondamuthur Village'}, {user?.district || 'Coimbatore'}
            </p>
          </div>

          <Link
            to="/farmer/add-crop"
            style={{
              background: 'white',
              color: '#15803d',
              padding: '12px 20px',
              borderRadius: '12px',
              fontWeight: '800',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              fontSize: '14px'
            }}
          >
            <PlusCircle size={18} /> {t('add_crop')}
          </Link>
        </div>
      </div>

      {/* Demand Forecast Highlight Card */}
      <Link
        to="/farmer/forecast"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
          border: '1.5px solid #6ee7b7',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '20px',
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(5, 150, 105, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#059669', color: 'white', padding: '10px', borderRadius: '12px' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#065f46' }}>
              ✨ {t('forecast_title')}
            </div>
            <div style={{ fontSize: '12px', color: '#047857' }}>
              {lang === 'ta'
                ? 'அடுத்த வாரம் தக்காளி, வெங்காயம் விலை உயர்வு வாய்ப்பு! விவரங்கள் பார்க்க கிளிக் செய்க.'
                : lang === 'hi'
                ? 'अगले हफ्ते टमाटर और प्याज के भाव बढ़ने का अनुमान! मूल्य रुझान देखने के लिए क्लिक करें।'
                : 'Prices projected to rise for Tomato and Onion! Tap to view 14-day price predictions.'}
            </div>
          </div>
        </div>
        <ArrowRight size={18} color="#059669" />
      </Link>

      {/* User Manual & Simple Guide Highlight Card */}
      <Link
        to="/farmer/manual"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '1.5px solid #fcd34d',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '20px',
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(217, 119, 6, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#d97706', color: 'white', padding: '10px', borderRadius: '12px' }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#92400e' }}>
              📖 {t('user_manual')}
            </div>
            <div style={{ fontSize: '12px', color: '#b45309' }}>
              {t('user_manual_desc')}
            </div>
          </div>
        </div>
        <ArrowRight size={18} color="#d97706" />
      </Link>

      {/* F2C and F2D Action Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {/* F2C Negotiation Card */}
        <Link
          to="/farmer/negotiations"
          style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: '1.5px solid #7dd3fc',
            borderRadius: '16px',
            padding: '16px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#0284c7', color: 'white', padding: '10px', borderRadius: '12px' }}>
              <MessageSquare size={20} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#0284c7' }}>
                {t('small_quantity_badge')}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0369a1', margin: '2px 0' }}>
                💬 {t('f2c_title')}
              </div>
              <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>
                {lang === 'ta' ? '2 வாடிக்கையாளர் விலை முன்மொழிவுகள்' : lang === 'hi' ? '2 ग्राहक भाव प्रस्ताव उपलब्ध' : '2 pending customer price offers'}
              </div>
            </div>
          </div>
          <ArrowRight size={16} color="#0284c7" />
        </Link>

        {/* Demand Forecast Card */}
        <Link
          to="/farmer/forecast"
          style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            border: '1.5px solid #86efac',
            borderRadius: '16px',
            padding: '16px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(22, 163, 74, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#16a34a', color: 'white', padding: '10px', borderRadius: '12px' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#16a34a' }}>
                {t('ai_forecast_badge') || 'AI Market Intelligence'}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#15803d', margin: '2px 0' }}>
                📈 {t('demand_forecast')}
              </div>
              <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>
                {lang === 'ta' ? 'அடுத்த 7 நாட்கள் தேவை கணிப்புகள்' : lang === 'hi' ? 'अगले 7 दिनों का मांग पूर्वानुमान' : 'Next 7-day crop demand predictions'}
              </div>
            </div>
          </div>
          <ArrowRight size={16} color="#16a34a" />
        </Link>
      </div>

      {/* 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '16px 12px', borderRadius: '16px', border: '1px solid #e7e5e4', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#16a34a' }}>{pickups.length}</div>
          <div style={{ fontSize: '11px', color: '#78716c', fontWeight: '700' }}>{t('active_pickups')}</div>
        </div>
        <div style={{ background: 'white', padding: '16px 12px', borderRadius: '16px', border: '1px solid #e7e5e4', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#2563eb' }}>
            {pickups.reduce((sum, p) => sum + (p.quantity_kg || 0), 0)} kg
          </div>
          <div style={{ fontSize: '11px', color: '#78716c', fontWeight: '700' }}>{t('total_harvest')}</div>
        </div>
        <div style={{ background: 'white', padding: '16px 12px', borderRadius: '16px', border: '1px solid #e7e5e4', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#ea580c' }}>₹7,000</div>
          <div style={{ fontSize: '11px', color: '#78716c', fontWeight: '700' }}>{t('est_payout')}</div>
        </div>
      </div>

      {/* Active Pickups */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: '#1c1917' }}>
            🌾 {t('current_pickup_status')}
          </h3>
          <Link to="/farmer/pickups" style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700', textDecoration: 'none' }}>
            {t('view_history')}
          </Link>
        </div>

        {loading ? (
          <p style={{ color: '#78716c', fontSize: '13px' }}>{t('loading')}</p>
        ) : pickups.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px 16px', textAlign: 'center', border: '1px dashed #d6d3d1' }}>
            <Sprout size={36} color="#a8a29e" style={{ marginBottom: '10px' }} />
            <p style={{ color: '#78716c', margin: '0 0 16px 0', fontSize: '13px' }}>
              {t('no_active_pickups')}
            </p>
            <Link
              to="/farmer/add-crop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#16a34a',
                color: 'white',
                padding: '10px 18px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '13px'
              }}
            >
              <PlusCircle size={16} /> {t('request_first_pickup')}
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pickups.map((p) => (
              <div
                key={p.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '18px',
                  border: '1px solid #e7e5e4',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 4px 0', color: '#1c1917' }}>
                      {p.crop_name}
                    </h4>
                    <span style={{ fontSize: '13px', color: '#78716c' }}>
                      {t('quantity')}: <strong>{p.quantity_kg} kg</strong> • {t('pickup_date')}: {p.pickup_date}
                    </span>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                {/* Handover OTP */}
                {p.otp && (
                  <div style={{
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <span style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>
                      🔑 {t('handover_otp')}:
                    </span>
                    <strong style={{ fontSize: '16px', letterSpacing: '2px', color: '#0f172a' }}>
                      {p.otp}
                    </strong>
                  </div>
                )}

                {p.driver_name && (
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ background: '#16a34a', color: 'white', padding: '8px', borderRadius: '8px' }}>
                        <Truck size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#15803d' }}>
                          {t('driver_assigned')}: {p.driver_name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#4b5563' }}>
                          {t('vehicle_assigned')}: {p.vehicle_number}
                        </div>
                      </div>
                    </div>
                    {p.eta_minutes && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', color: '#15803d', fontWeight: '700' }}>{t('live_eta')}</div>
                        <div style={{ fontSize: '16px', fontWeight: '900', color: '#16a34a' }}>
                          ~{p.eta_minutes} {t('mins')}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mandi Prices */}
      <div>
        <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '12px', color: '#1c1917' }}>
          📈 {t('todays_mandi_rates')}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
          {marketRates.map((m, idx) => (
            <div key={idx} style={{ background: 'white', padding: '14px', borderRadius: '14px', border: '1px solid #e7e5e4' }}>
              <div style={{ fontSize: '12px', color: '#78716c', fontWeight: '700' }}>{m.crop}</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#16a34a', margin: '4px 0' }}>{m.rate}</div>
              <div style={{ fontSize: '11px', color: '#15803d', fontWeight: '700' }}>{m.trend}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
