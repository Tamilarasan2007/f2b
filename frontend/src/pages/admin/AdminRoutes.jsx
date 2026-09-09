import React, { useState } from 'react';
import StatusBadge from '../../components/StatusBadge';
import { Route, Fuel, TrendingUp } from 'lucide-react';

export default function AdminRoutes() {
  const [routes] = useState([
    { id: 101, name: 'Thondamuthur South Milk-Run', vehicle: 'TN 37 CY 4821', driver: 'Suresh Kumar', distanceKm: 18.5, stops: 3, weightKg: 750, savedCost: '₹450', status: 'IN_PROGRESS', date: '2026-09-08' },
    { id: 100, name: 'Karamadai Foothill Loop', vehicle: 'TN 38 B 9901', driver: 'Muthu Vel', distanceKm: 24.2, stops: 4, weightKg: 1100, savedCost: '₹620', status: 'COMPLETED', date: '2026-09-07' },
    { id: 99, name: 'Pollachi South Coconut Run', vehicle: 'TN 43 E 1122', driver: 'Praveen R', distanceKm: 31.0, stops: 5, weightKg: 1400, savedCost: '₹890', status: 'COMPLETED', date: '2026-09-06' },
  ]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1c1917', margin: '0 0 4px 0' }}>
          Platform Route Optimization Audit Log
        </h2>
        <p style={{ fontSize: '13px', color: '#78716c', margin: 0 }}>
          Inspect executed milk-run routes, vehicle payload efficiencies, and fuel conservation audits.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e7e5e4', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#fafaf9', borderBottom: '1px solid #e7e5e4', color: '#57534e' }}>
              <th style={{ padding: '12px 16px' }}>Route ID & Name</th>
              <th style={{ padding: '12px 16px' }}>Driver & Vehicle</th>
              <th style={{ padding: '12px 16px' }}>Distance / Stops</th>
              <th style={{ padding: '12px 16px' }}>Total Payload</th>
              <th style={{ padding: '12px 16px' }}>Fuel Saved</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                <td style={{ padding: '12px 16px' }}>
                  <strong>#{r.id} {r.name}</strong>
                  <div style={{ fontSize: '11px', color: '#78716c' }}>{r.date}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {r.driver}
                  <div style={{ fontSize: '11px', color: '#78716c' }}>{r.vehicle}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>{r.distanceKm} km ({r.stops} stops)</td>
                <td style={{ padding: '12px 16px', fontWeight: '700' }}>{r.weightKg} kg</td>
                <td style={{ padding: '12px 16px', fontWeight: '700', color: '#16a34a' }}>{r.savedCost}</td>
                <td style={{ padding: '12px 16px' }}>
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
