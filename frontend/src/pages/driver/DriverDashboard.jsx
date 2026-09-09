import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { Truck, MapPin, CheckCircle2, ArrowRight, Navigation } from 'lucide-react';

export default function DriverDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const getDemoRoute = () => ({
    id: 1,
    route_name: 'Thondamuthur - Alandurai Morning Milk-Run #101',
    status: 'IN_PROGRESS',
    total_distance_km: 18.5,
    estimated_duration_mins: 45,
    total_weight_kg: 750,
    max_capacity_kg: 1000,
    vehicle_number: 'TN 37 CY 4821 (Tata Ace)',
    stops_count: 3,
    destination: 'Thondamuthur Primary Collection Center',
    stops: [
      { id: 1, farmer_name: 'Murugan K', village: 'Thondamuthur', crop: t('crop_tomato'), qty: 250, completed: true },
      { id: 2, farmer_name: 'Palanisamy V', village: 'Narasipuram', crop: t('crop_banana'), qty: 300, completed: false },
      { id: 3, farmer_name: 'Ramu S', village: 'Alandurai', crop: t('crop_onion'), qty: 200, completed: false },
    ]
  });

  const [activeRoute, setActiveRoute] = useState(getDemoRoute());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActiveRoute();
  }, []);

  const fetchActiveRoute = async () => {
    try {
      const res = await api.get('/api/routes');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const found = res.data.find(r => r.status === 'IN_PROGRESS') || res.data[0];
        setActiveRoute(found);
      }
    } catch (err) {
      // Gracefully use demo data
    } finally {
      setLoading(false);
    }
  };

  const totalWeight = activeRoute?.total_load_kg || activeRoute?.total_weight_kg || 750;
  const maxCapacity = activeRoute?.vehicle_capacity_kg || activeRoute?.max_capacity_kg || 1000;
  const capacityPct = Math.min(100, Math.round((totalWeight / maxCapacity) * 100));
  const stopsCount = activeRoute?.stops_count || (activeRoute?.stops ? activeRoute.stops.length : 3);
  const routeName = activeRoute?.route_name || activeRoute?.name || `Milk-Run Route #${activeRoute?.id || 101}`;
  const destinationName = activeRoute?.destination || activeRoute?.destination_name || 'Thondamuthur Primary Collection Center';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Driver Header */}
      <div style={{
        background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
        borderRadius: '20px',
        padding: '24px',
        color: 'white',
        marginBottom: '20px',
        boxShadow: '0 8px 24px rgba(217, 119, 6, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '16px' }}>
            <Truck size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 4px 0' }}>
              {t('driver_greeting')}, {user?.name || user?.full_name || 'Suresh'}!
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '13px' }}>
              {t('vehicle')}: <strong>{activeRoute?.vehicle_number || 'TN 37 CY 4821 (Tata Ace)'}</strong>
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#78716c' }}>{t('loading')}</p>
      ) : activeRoute ? (
        <div>
          {/* Active Trip Card */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #e7e5e4',
            boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#b45309', fontWeight: '800', textTransform: 'uppercase' }}>
                  {t('todays_milk_run')}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 0 0', color: '#1c1917' }}>
                  {routeName}
                </h3>
              </div>
              <StatusBadge status={activeRoute.status} />
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
              <div style={{ background: '#fafaf9', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#0c0a09' }}>{activeRoute.total_distance_km || 18.5} km</div>
                <div style={{ fontSize: '11px', color: '#78716c', fontWeight: '700' }}>{t('distance_km')}</div>
              </div>
              <div style={{ background: '#fafaf9', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#0c0a09' }}>{activeRoute.estimated_duration_minutes || activeRoute.estimated_duration_mins || 45} {t('mins')}</div>
                <div style={{ fontSize: '11px', color: '#78716c', fontWeight: '700' }}>{t('est_travel_time')}</div>
              </div>
              <div style={{ background: '#fafaf9', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#0c0a09' }}>{stopsCount}</div>
                <div style={{ fontSize: '11px', color: '#78716c', fontWeight: '700' }}>{t('farm_stops_count')}</div>
              </div>
            </div>

            {/* Capacity Bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                <span>{t('vehicle_payload_cap')}</span>
                <span>{totalWeight} / {maxCapacity} kg ({capacityPct}%)</span>
              </div>
              <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${capacityPct}%`,
                  background: capacityPct > 85 ? '#ef4444' : '#16a34a',
                  borderRadius: '4px'
                }} />
              </div>
            </div>

            {/* Big Action Button */}
            <Link
              to={`/driver/route/${activeRoute.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: '#16a34a',
                color: 'white',
                padding: '16px',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '800',
                textDecoration: 'none',
                boxShadow: '0 6px 16px rgba(22, 163, 74, 0.35)'
              }}
            >
              <Navigation size={20} /> {t('open_waypoints_gps')}
            </Link>
          </div>

          {/* Destination Notice */}
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <MapPin size={24} color="#2563eb" />
            <div>
              <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: '700' }}>{t('final_dropoff_hub')}:</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#1e3a8a' }}>{destinationName}</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: 'white', padding: '32px', borderRadius: '20px', textAlign: 'center' }}>
          <p style={{ color: '#78716c' }}>{t('no_route_assigned')}</p>
        </div>
      )}
    </div>
  );
}
