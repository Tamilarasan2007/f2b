import React, { useState } from 'react';
import { Search, MapPin, Phone } from 'lucide-react';

export default function AdminFarmers() {
  const [farmers] = useState([
    { id: 1, name: 'Murugan K', phone: '9876543210', village: 'Thondamuthur South', district: 'Coimbatore', acreage: 3.5, crop: 'Tomato, Chilli', totalSuppliedKg: 14200, rating: 4.9 },
    { id: 2, name: 'Palanisamy V', phone: '9876543211', village: 'Narasipuram East', district: 'Coimbatore', acreage: 5.0, crop: 'Robusta Banana', totalSuppliedKg: 28500, rating: 4.8 },
    { id: 3, name: 'Ramu S', phone: '9876543212', village: 'Alandurai Gate', district: 'Coimbatore', acreage: 2.8, crop: 'Small Onion', totalSuppliedKg: 9800, rating: 4.7 },
    { id: 4, name: 'Selvam R', phone: '9876543213', village: 'Vadavalli West', district: 'Coimbatore', acreage: 4.2, crop: 'Tapioca, Turmeric', totalSuppliedKg: 19100, rating: 4.9 },
    { id: 5, name: 'Karthik N', phone: '9876543214', village: 'Vedapatti North', district: 'Coimbatore', acreage: 2.0, crop: 'Cabbage, Cauliflower', totalSuppliedKg: 6400, rating: 4.6 },
  ]);

  const [search, setSearch] = useState('');
  const filtered = farmers.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.village.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1c1917', margin: '0 0 4px 0' }}>
          Registered Farmers Roster
        </h2>
        <p style={{ fontSize: '13px', color: '#78716c', margin: 0 }}>
          Manage farmer partner profiles, acreage holdings, and historical harvest supply volumes.
        </p>
      </div>

      <div style={{ marginBottom: '16px', position: 'relative' }}>
        <input
          type="text"
          placeholder="Search by farmer name or village..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '12px 14px 12px 38px', borderRadius: '10px', border: '1px solid #d6d3d1', fontSize: '14px', boxSizing: 'border-box' }}
        />
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e7e5e4', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#fafaf9', borderBottom: '1px solid #e7e5e4', color: '#57534e' }}>
              <th style={{ padding: '12px 16px' }}>Farmer</th>
              <th style={{ padding: '12px 16px' }}>Location</th>
              <th style={{ padding: '12px 16px' }}>Holding</th>
              <th style={{ padding: '12px 16px' }}>Primary Crops</th>
              <th style={{ padding: '12px 16px' }}>Total Supplied</th>
              <th style={{ padding: '12px 16px' }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                <td style={{ padding: '12px 16px' }}>
                  <strong>{f.name}</strong>
                  <div style={{ fontSize: '11px', color: '#78716c' }}>{f.phone}</div>
                </td>
                <td style={{ padding: '12px 16px', color: '#44403c' }}>{f.village}, {f.district}</td>
                <td style={{ padding: '12px 16px' }}>{f.acreage} Acres</td>
                <td style={{ padding: '12px 16px', color: '#16a34a', fontWeight: '600' }}>{f.crop}</td>
                <td style={{ padding: '12px 16px', fontWeight: '700' }}>{f.totalSuppliedKg.toLocaleString()} kg</td>
                <td style={{ padding: '12px 16px', color: '#d97706', fontWeight: '700' }}>★ {f.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
