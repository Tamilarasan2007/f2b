import React, { useState } from 'react';
import { Truck, CheckCircle2, AlertCircle, Wrench, Shield } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

export default function OperatorVehicles() {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      reg_number: 'TN 37 CY 4821',
      model: 'Tata Ace (Chhota Hathi)',
      fuel_type: 'Diesel',
      capacity_kg: 1000,
      status: 'ON_ROUTE',
      driver: 'Suresh Kumar',
      active_route: 'Milk-Run #101',
      payload: '750 kg (75%)',
    },
    {
      id: 2,
      reg_number: 'TN 38 B 9901',
      model: 'Ashok Leyland Dost',
      fuel_type: 'CNG',
      capacity_kg: 1500,
      status: 'AVAILABLE',
      driver: 'Muthu Vel',
      active_route: 'None',
      payload: '0 kg (Idle)',
    },
    {
      id: 3,
      reg_number: 'TN 43 E 1122',
      model: 'Mahindra Bolero Maxi Truck',
      fuel_type: 'Diesel',
      capacity_kg: 1200,
      status: 'AVAILABLE',
      driver: 'Praveen R',
      active_route: 'None',
      payload: '0 kg (Idle)',
    },
    {
      id: 4,
      reg_number: 'TN 37 K 7765',
      model: 'Piaggio Ape Extra LDX',
      fuel_type: 'Electric (EV)',
      capacity_kg: 600,
      status: 'MAINTENANCE',
      driver: 'Unassigned',
      active_route: 'Service Scheduled',
      payload: '0 kg',
    },
  ]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1c1917', margin: '0 0 4px 0' }}>
          Collection Fleet Vehicles
        </h2>
        <p style={{ fontSize: '13px', color: '#78716c', margin: 0 }}>
          Manage local transport trucks, payload utilization, and maintenance status.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {vehicles.map((v) => (
          <div
            key={v.id}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #e7e5e4',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  background: v.status === 'ON_ROUTE' ? '#fef3c7' : v.status === 'AVAILABLE' ? '#dcfce7' : '#f3f4f6',
                  color: v.status === 'ON_ROUTE' ? '#b45309' : v.status === 'AVAILABLE' ? '#16a34a' : '#6b7280',
                  padding: '10px',
                  borderRadius: '12px'
                }}>
                  <Truck size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#1c1917' }}>
                    {v.reg_number}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#78716c' }}>{v.model}</div>
                </div>
              </div>
              <StatusBadge status={v.status} />
            </div>

            <div style={{ fontSize: '13px', color: '#44403c', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #f5f5f4', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#78716c' }}>Capacity:</span>
                <strong>{v.capacity_kg} kg ({v.fuel_type})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#78716c' }}>Assigned Driver:</span>
                <strong>{v.driver}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#78716c' }}>Current Payload:</span>
                <strong>{v.payload}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
