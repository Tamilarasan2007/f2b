import React, { useState } from 'react';
import StatusBadge from '../../components/StatusBadge';

export default function AdminDrivers() {
  const [drivers] = useState([
    { id: 1, name: 'Suresh Kumar', phone: '9876543220', license: 'TN37-201500291', vehicle: 'TN 37 CY 4821 (Tata Ace)', completedTrips: 142, status: 'ON_DUTY', rating: 4.9 },
    { id: 2, name: 'Muthu Vel', phone: '9876543221', license: 'TN38-201800118', vehicle: 'TN 38 B 9901 (Ashok Leyland)', completedTrips: 88, status: 'AVAILABLE', rating: 4.8 },
    { id: 3, name: 'Praveen R', phone: '9876543222', license: 'TN43-202000843', vehicle: 'TN 43 E 1122 (Bolero)', completedTrips: 64, status: 'AVAILABLE', rating: 4.7 },
  ]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1c1917', margin: '0 0 4px 0' }}>
          Registered Drivers & Operators
        </h2>
        <p style={{ fontSize: '13px', color: '#78716c', margin: 0 }}>
          Manage certified logistics personnel, driving licenses, and performance ratings.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e7e5e4', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#fafaf9', borderBottom: '1px solid #e7e5e4', color: '#57534e' }}>
              <th style={{ padding: '12px 16px' }}>Driver</th>
              <th style={{ padding: '12px 16px' }}>DL License</th>
              <th style={{ padding: '12px 16px' }}>Assigned Vehicle</th>
              <th style={{ padding: '12px 16px' }}>Completed Trips</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                <td style={{ padding: '12px 16px' }}>
                  <strong>{d.name}</strong>
                  <div style={{ fontSize: '11px', color: '#78716c' }}>{d.phone}</div>
                </td>
                <td style={{ padding: '12px 16px', color: '#44403c' }}>{d.license}</td>
                <td style={{ padding: '12px 16px', color: '#2563eb', fontWeight: '600' }}>{d.vehicle}</td>
                <td style={{ padding: '12px 16px', fontWeight: '700' }}>{d.completedTrips} trips</td>
                <td style={{ padding: '12px 16px' }}>
                  <StatusBadge status={d.status} />
                </td>
                <td style={{ padding: '12px 16px', color: '#d97706', fontWeight: '700' }}>★ {d.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
