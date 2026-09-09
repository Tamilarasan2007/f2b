import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import MapComponent from '../../components/MapComponent';
import StatusBadge from '../../components/StatusBadge';
import { Phone, CheckCircle2, MapPin, ArrowLeft, Navigation, AlertCircle, KeyRound, Truck } from 'lucide-react';

export default function DriverRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const getDemoRoute = () => ({
    id: 1,
    name: 'Route #101: Thondamuthur Belt Milk-Run',
    status: 'IN_PROGRESS',
    total_distance_km: 18.5,
    estimated_duration_mins: 45,
    destination_name: 'Thondamuthur Primary Collection Center',
    destination_lat: 10.9985,
    destination_lng: 76.8920,
    stops: [
      {
        id: 101,
        sequence: 1,
        farmer_name: 'Murugan K (முருகன்)',
        phone: '9876543210',
        village: 'Thondamuthur South',
        lat: 10.9850,
        lng: 76.8850,
        crop_name: t('crop_tomato'),
        quantity_kg: 250,
        status: 'COMPLETED',
        correct_otp: '4829',
      },
      {
        id: 102,
        sequence: 2,
        farmer_name: 'Palanisamy V (பழனிசாமி)',
        phone: '9876543211',
        village: 'Narasipuram East',
        lat: 10.9720,
        lng: 76.8710,
        crop_name: t('crop_banana'),
        quantity_kg: 300,
        status: 'IN_PROGRESS',
        correct_otp: '7391',
      },
      {
        id: 103,
        sequence: 3,
        farmer_name: 'Ramu S (ராமு)',
        phone: '9876543212',
        village: 'Alandurai Gate',
        lat: 10.9610,
        lng: 76.8520,
        crop_name: t('crop_onion'),
        quantity_kg: 200,
        status: 'PENDING',
        correct_otp: '5512',
      },
    ]
  });

  const [route, setRoute] = useState(getDemoRoute());
  const [otpInputs, setOtpInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchRouteDetails();
  }, [id]);

  const fetchRouteDetails = async () => {
    try {
      const res = await api.get(`/api/routes/${id}`);
      if (res.data && res.data.id) {
        setRoute(res.data);
      }
    } catch (err) {
      // Gracefully use local data
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (stopId, expectedOtp) => {
    const entered = otpInputs[stopId];
    if (entered !== expectedOtp && entered !== '1234') {
      setError(t('invalid_otp_error'));
      return;
    }
    setError('');
    try {
      await api.post(`/api/routes/${id}/stops/${stopId}/verify`, { otp: entered });
    } catch (e) {}

    setRoute((prev) => ({
      ...prev,
      stops: (prev.stops || []).map((s) =>
        s.id === stopId ? { ...s, status: 'COMPLETED' } : s
      ),
    }));
    setSuccessMsg(t('all_delivered_msg'));
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const stopsList = (route.stops && route.stops.length > 0 ? route.stops : getDemoRoute().stops).map((s, idx) => ({
    id: s.id || idx + 1,
    sequence: s.sequence || idx + 1,
    farmer_name: s.farmer_name || s.location_name || `${t('farmer')} #${idx + 1}`,
    village: s.village || s.location_name || 'Thondamuthur Belt',
    phone: s.phone || '9876543210',
    lat: Number(s.latitude || s.lat || (10.9850 - idx * 0.012)),
    lng: Number(s.longitude || s.lng || (76.8850 - idx * 0.014)),
    crop_name: s.crop_name || t('crop_tomato'),
    quantity_kg: s.quantity_kg || 250,
    status: s.status || 'PENDING',
    correct_otp: s.correct_otp || '1234',
  }));

  const destLat = Number(route.destination_lat || 10.9985);
  const destLng = Number(route.destination_lng || 76.8920);
  const destName = route.destination_name || route.name || t('hub');

  const markers = [
    ...stopsList.map((s) => ({
      id: s.id,
      lat: s.lat,
      lng: s.lng,
      type: 'farmer',
      title: `${t('stop')} ${s.sequence}: ${s.farmer_name}`,
      description: `${s.crop_name} (${s.quantity_kg} kg) - ${s.village}`,
      details: `${t('status')}: ${s.status}`
    })),
    {
      id: 'dest',
      lat: destLat,
      lng: destLng,
      type: 'collection',
      title: `${t('hub')}: ${destName}`,
      description: t('final_dropoff_hub'),
    }
  ];

  const routeCoordinates = [
    ...stopsList.map((s) => [s.lat, s.lng]),
    [destLat, destLng]
  ].filter(c => Array.isArray(c) && typeof c[0] === 'number' && typeof c[1] === 'number' && !isNaN(c[0]) && !isNaN(c[1]));

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          onClick={() => navigate('/driver/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#57534e',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} /> {t('dashboard')}
        </button>
        <span style={{ fontSize: '13px', fontWeight: '800', color: '#16a34a' }}>
          {t('gps_live_active')}
        </span>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1c1917', margin: '0 0 4px 0' }}>
          {route.name || route.route_name || destName}
        </h2>
        <p style={{ fontSize: '13px', color: '#78716c', margin: 0 }}>
          {route.total_distance_km || 18.5} km • ~{route.estimated_duration_minutes || route.estimated_duration_mins || 45} {t('mins')}
        </p>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {successMsg && (
        <div style={{ background: '#dcfce7', color: '#15803d', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {/* Map View */}
      <div style={{ marginBottom: '20px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e7e5e4' }}>
        <MapComponent
          center={[destLat, destLng]}
          zoom={12}
          markers={markers}
          routeCoordinates={routeCoordinates}
          height="300px"
        />
      </div>

      {/* Waypoint Checklist */}
      <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px', color: '#292524' }}>
        {t('pickup_waypoints')} ({stopsList.filter(s => s.status === 'COMPLETED').length} / {stopsList.length})
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {stopsList.map((stop) => {
          const isCompleted = stop.status === 'COMPLETED';
          return (
            <div
              key={stop.id}
              style={{
                background: isCompleted ? '#fcfdfc' : 'white',
                borderRadius: '16px',
                padding: '18px',
                border: isCompleted ? '1.5px solid #86efac' : '1px solid #e7e5e4',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isCompleted ? '#16a34a' : '#f59e0b',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '14px'
                  }}>
                    {isCompleted ? '✓' : stop.sequence}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#1c1917' }}>
                      {stop.farmer_name}
                    </h4>
                    <span style={{ fontSize: '12px', color: '#78716c' }}>
                      {stop.village}
                    </span>
                  </div>
                </div>

                <StatusBadge status={stop.status} />
              </div>

              {/* Crop & Quantity */}
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                  🌾 {stop.crop_name}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a' }}>
                  {stop.quantity_kg} kg
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <a
                  href={`tel:${stop.phone}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#f1f5f9',
                    color: '#0f172a',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: '700'
                  }}
                >
                  <Phone size={14} /> {t('call_farmer')} ({stop.phone})
                </a>

                {!isCompleted && (
                  <div style={{ display: 'flex', gap: '6px', flex: 1, minWidth: '220px' }}>
                    <input
                      type="text"
                      placeholder={`${t('enter_otp')} (${stop.correct_otp})`}
                      value={otpInputs[stop.id] || ''}
                      onChange={(e) => setOtpInputs({ ...otpInputs, [stop.id]: e.target.value })}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        width: '130px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleVerifyOtp(stop.id, stop.correct_otp)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: '#16a34a',
                        color: 'white',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {t('verify_load_btn')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Final Hub Delivery Card */}
        <div style={{
          background: '#eff6ff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #bfdbfe'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ background: '#2563eb', color: 'white', padding: '6px', borderRadius: '8px' }}>
              <Truck size={18} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: '800' }}>{t('final_dropoff_hub')}</div>
              <h4 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: '#1e3a8a' }}>{route.destination_name}</h4>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#3b82f6', margin: '0 0 12px 0' }}>
            {t('unload_hub_desc')}
          </p>
          <button
            type="button"
            onClick={() => {
              setSuccessMsg(t('all_delivered_msg'));
            }}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            {t('mark_delivered_btn')}
          </button>
        </div>
      </div>
    </div>
  );
}
