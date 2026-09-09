import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import { Route, Truck, Clock, MapPin, ArrowRight } from 'lucide-react';

export default function OperatorRoutes() {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      route_name: 'Thondamuthur - Alandurai Morning Milk-Run #101',
      vehicle_number: 'TN 37 CY 4821 (Tata Ace)',
      driver_name: 'Suresh Kumar',
      stops_count: 3,
      total_weight_kg: 750,
      total_distance_km: 18.5,
      status: 'IN_PROGRESS',
      completed_stops: 1,
      created_at: 'Today, 07:30 AM',
    },
    {
      id: 2,
      route_name: 'Vadavalli - Vedapatti Evening Run #102',
      vehicle_number: 'TN 38 B 9901 (Ashok Leyland Dost)',
      driver_name: 'Muthu Vel',
      stops_count: 2,
      total_weight_kg: 550,
      total_distance_km: 14.2,
      status: 'SCHEDULED',
      completed_stops: 0,
      created_at: 'Today, 02:00 PM',
    },
  ]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1c1917', margin: '0 0 4px 0' }}>
            Dispatched Milk-Run Routes
          </h2>
          <p style={{ fontSize: '13px', color: '#78716c', margin: 0 }}>
            Live status of active collection trips and vehicle payload fulfillment.
          </p>
        </div>

        <Link
          to="/operator/routes/create"
          style={{
            background: '#16a34a',
            color: 'white',
            padding: '10px 18px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Route size={16} /> New AI Milk-Run
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {routes.map((r) => (
          <div
            key={r.id}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #e7e5e4',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '800', margin: '0 0 4px 0', color: '#1c1917' }}>
                  {r.route_name}
                </h3>
                <span style={{ fontSize: '13px', color: '#78716c' }}>
                  Driver: <strong>{r.driver_name}</strong> • Vehicle: <strong>{r.vehicle_number}</strong>
                </span>
              </div>
              <StatusBadge status={r.status} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', background: '#fafaf9', padding: '12px', borderRadius: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#78716c' }}>Waypoints</div>
                <div style={{ fontSize: '15px', fontWeight: '800' }}>{r.completed_stops} / {r.stops_count} Done</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#78716c' }}>Payload</div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#16a34a' }}>{r.total_weight_kg} kg</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#78716c' }}>Total Loop</div>
                <div style={{ fontSize: '15px', fontWeight: '800' }}>{r.total_distance_km} km</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#78716c' }}>Created</div>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>{r.created_at}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link
                to={`/driver/route/${r.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '700'
                }}
              >
                Inspect Waypoints & Map <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
