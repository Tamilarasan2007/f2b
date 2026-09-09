import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { Sprout, Filter, Route, Search, MapPin, Calendar } from 'lucide-react';

export default function OperatorPickups() {
  const [pickups, setPickups] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Demo data for collection point operator
    setPickups([
      { id: 1, farmer_name: 'Murugan K', phone: '9876543210', village: 'Thondamuthur South', crop_name: 'Tomato', quantity_kg: 250, pickup_date: '2026-09-09', status: 'ASSIGNED', time_slot: 'Morning' },
      { id: 2, farmer_name: 'Palanisamy V', phone: '9876543211', village: 'Narasipuram East', crop_name: 'Banana', quantity_kg: 300, pickup_date: '2026-09-09', status: 'ASSIGNED', time_slot: 'Morning' },
      { id: 3, farmer_name: 'Ramu S', phone: '9876543212', village: 'Alandurai Gate', crop_name: 'Onion', quantity_kg: 200, pickup_date: '2026-09-09', status: 'ASSIGNED', time_slot: 'Morning' },
      { id: 4, farmer_name: 'Selvam R', phone: '9876543213', village: 'Vadavalli West', crop_name: 'Tapioca', quantity_kg: 400, pickup_date: '2026-09-09', status: 'PENDING', time_slot: 'Afternoon' },
      { id: 5, farmer_name: 'Karthik N', phone: '9876543214', village: 'Vedapatti North', crop_name: 'Cabbage', quantity_kg: 150, pickup_date: '2026-09-10', status: 'PENDING', time_slot: 'Morning' },
      { id: 6, farmer_name: 'Venkatesh P', phone: '9876543215', village: 'Perur Road', crop_name: 'Green Chilli', quantity_kg: 80, pickup_date: '2026-09-10', status: 'PENDING', time_slot: 'Morning' },
    ]);
  }, []);

  const filtered = pickups.filter(p =>
    p.farmer_name.toLowerCase().includes(search.toLowerCase()) ||
    p.crop_name.toLowerCase().includes(search.toLowerCase()) ||
    p.village.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1c1917', margin: '0 0 4px 0' }}>
            Farm Harvest Pickup Requests
          </h2>
          <p style={{ fontSize: '13px', color: '#78716c', margin: 0 }}>
            List of individual farmer orders registered in the Thondamuthur catchment.
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
          <Route size={16} /> Run Route Optimizer
        </Link>
      </div>

      {/* Search Filter */}
      <div style={{ marginBottom: '16px', position: 'relative' }}>
        <input
          type="text"
          placeholder="Filter by farmer name, crop, or village..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 14px 12px 38px',
            borderRadius: '10px',
            border: '1px solid #d6d3d1',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
      </div>

      {/* Table / List */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e7e5e4', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#fafaf9', borderBottom: '1px solid #e7e5e4', color: '#57534e' }}>
              <th style={{ padding: '12px 16px' }}>Farmer</th>
              <th style={{ padding: '12px 16px' }}>Village</th>
              <th style={{ padding: '12px 16px' }}>Crop</th>
              <th style={{ padding: '12px 16px' }}>Quantity</th>
              <th style={{ padding: '12px 16px' }}>Slot</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                <td style={{ padding: '12px 16px' }}>
                  <strong>{p.farmer_name}</strong>
                  <div style={{ fontSize: '11px', color: '#78716c' }}>{p.phone}</div>
                </td>
                <td style={{ padding: '12px 16px', color: '#44403c' }}>{p.village}</td>
                <td style={{ padding: '12px 16px', fontWeight: '600', color: '#16a34a' }}>{p.crop_name}</td>
                <td style={{ padding: '12px 16px', fontWeight: '700' }}>{p.quantity_kg} kg</td>
                <td style={{ padding: '12px 16px', color: '#78716c' }}>{p.pickup_date} ({p.time_slot})</td>
                <td style={{ padding: '12px 16px' }}>
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
