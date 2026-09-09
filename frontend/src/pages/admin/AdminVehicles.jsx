import React, { useState } from 'react';
import StatusBadge from '../../components/StatusBadge';
import { Truck } from 'lucide-react';

export default function AdminVehicles() {
  const [vehicles] = useState([
    { id: 1, reg: 'TN 37 CY 4821', type: 'Small Commercial Vehicle', model: 'Tata Ace', fuel: 'Diesel', cap: '1,000 kg', status: 'ON_ROUTE', odo: '42,100 km', fitnessValidTill: '2027-04-15' },
    { id: 2, reg: 'TN 38 B 9901', type: 'Light Commercial Vehicle', model: 'Ashok Leyland Dost', fuel: 'CNG', cap: '1,500 kg', status: 'AVAILABLE', odo: '29,400 km', fitnessValidTill: '2027-08-20' },
    { id: 3, reg: 'TN 43 E 1122', type: 'Pickup Truck', model: 'Mahindra Bolero Maxi', fuel: 'Diesel', cap: '1,200 kg', status: 'AVAILABLE', odo: '51,800 km', fitnessValidTill: '2026-11-30' },
    { id: 4, reg: 'TN 37 K 7765', type: 'Electric 3-Wheeler', model: 'Piaggio Ape Extra', fuel: 'Electric EV', cap: '600 kg', status: 'MAINTENANCE', odo: '12,300 km', fitnessValidTill: '2028-01-10' },
  ]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1c1917', margin: '0 0 4px 0' }}>
          Platform Transport Fleet Registry
        </h2>
        <p style={{ fontSize: '13px', color: '#78716c', margin: 0 }}>
          Inspect registered transport vehicles, payloads, fuel types, and RTO fitness certs.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e7e5e4', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#fafaf9', borderBottom: '1px solid #e7e5e4', color: '#57534e' }}>
              <th style={{ padding: '12px 16px' }}>Registration</th>
              <th style={{ padding: '12px 16px' }}>Model & Fuel</th>
              <th style={{ padding: '12px 16px' }}>Max Payload</th>
              <th style={{ padding: '12px 16px' }}>Odometer</th>
              <th style={{ padding: '12px 16px' }}>Fitness Valid</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                <td style={{ padding: '12px 16px', fontWeight: '700' }}>{v.reg}</td>
                <td style={{ padding: '12px 16px' }}>{v.model} ({v.fuel})</td>
                <td style={{ padding: '12px 16px', fontWeight: '700', color: '#16a34a' }}>{v.cap}</td>
                <td style={{ padding: '12px 16px', color: '#44403c' }}>{v.odo}</td>
                <td style={{ padding: '12px 16px', color: '#78716c' }}>{v.fitnessValidTill}</td>
                <td style={{ padding: '12px 16px' }}>
                  <StatusBadge status={v.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
