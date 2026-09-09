import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { KeyRound, Truck } from 'lucide-react';

export default function FarmerPickups() {
  const { t } = useLanguage();
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
        setPickups(getDemoList());
      }
    } catch (err) {
      setPickups(getDemoList());
    } finally {
      setLoading(false);
    }
  };

  const getDemoList = () => [
    {
      id: 1,
      crop_name: t('crop_tomato'),
      quantity_kg: 250,
      pickup_date: '2026-09-09',
      status: 'ASSIGNED',
      otp_code: '4829',
      driver_name: 'Suresh Kumar',
      vehicle_number: 'TN 37 CY 4821',
    },
    {
      id: 2,
      crop_name: t('crop_banana'),
      quantity_kg: 500,
      pickup_date: '2026-09-05',
      status: 'DELIVERED',
      otp_code: '1934',
      driver_name: 'Muthu Vel',
      vehicle_number: 'TN 38 B 9901',
    }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1c1917', margin: '0 0 4px 0' }}>
          {t('my_pickups')}
        </h2>
        <p style={{ fontSize: '13px', color: '#78716c', margin: 0 }}>
          {t('view_history')}
        </p>
      </div>

      {loading ? (
        <p style={{ color: '#78716c', fontSize: '13px' }}>{t('loading')}</p>
      ) : pickups.length === 0 ? (
        <div style={{ background: 'white', padding: '32px', borderRadius: '16px', textAlign: 'center', border: '1px solid #e7e5e4' }}>
          <p style={{ color: '#78716c' }}>{t('no_active_pickups')}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {pickups.map((p) => (
            <div
              key={p.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #e7e5e4',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', margin: '0 0 4px 0', color: '#1c1917' }}>
                    {p.crop_name}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#78716c', display: 'flex', gap: '10px' }}>
                    <span>{t('quantity')}: <strong>{p.quantity_kg} kg</strong></span>
                    <span>•</span>
                    <span>{t('pickup_date')}: {p.pickup_date}</span>
                  </div>
                </div>
                <StatusBadge status={p.status} />
              </div>

              {/* Handover OTP */}
              {p.otp_code && (
                <div style={{
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '13px', fontWeight: '700' }}>
                    <KeyRound size={16} /> {t('handover_otp')}:
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '2px', color: '#0f172a' }}>
                    {p.otp_code}
                  </div>
                </div>
              )}

              {p.driver_name && (
                <div style={{ fontSize: '13px', color: '#4b5563', display: 'flex', gap: '16px', borderTop: '1px solid #f3f4f6', paddingTop: '10px' }}>
                  <span>🚛 {t('driver')}: <strong>{p.driver_name}</strong></span>
                  <span>{t('vehicle')}: <strong>{p.vehicle_number}</strong></span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
