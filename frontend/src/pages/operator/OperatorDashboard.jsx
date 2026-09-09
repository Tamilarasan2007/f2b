import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import MapComponent from '../../components/MapComponent';
import StatusBadge from '../../components/StatusBadge';
import { Building2, Truck, Sprout, Route, PlusCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function OperatorDashboard() {
  const [stats, setStats] = useState({
    pendingPickups: 6,
    activeVehicles: 3,
    todayHarvestKg: 1950,
    activeRoutes: 2,
  });
  const [loading, setLoading] = useState(false);

  // Markers for collection point and surrounding pending farms
  const hubLocation = [10.9985, 76.8920]; // Thondamuthur Center
  const markers = [
    {
      id: 'hub',
      lat: 10.9985,
      lng: 76.8920,
      type: 'collection',
      title: 'Thondamuthur Collection Center',
      description: 'Hub Capacity: 15,000 kg • Cold Storage Active',
    },
    {
      id: 'f1',
      lat: 10.9850,
      lng: 76.8850,
      type: 'farmer',
      title: 'Murugan Farm (Thondamuthur South)',
      description: 'Tomato: 250 kg • Status: Ready for pickup',
    },
    {
      id: 'f2',
      lat: 10.9720,
      lng: 76.8710,
      type: 'farmer',
      title: 'Palanisamy Farm (Narasipuram)',
      description: 'Banana: 300 kg • Status: Ready for pickup',
    },
    {
      id: 'f3',
      lat: 10.9610,
      lng: 76.8520,
      type: 'farmer',
      title: 'Ramu Farm (Alandurai)',
      description: 'Onion: 200 kg • Status: Ready for pickup',
    },
    {
      id: 'f4',
      lat: 11.0250,
      lng: 76.8990,
      type: 'farmer',
      title: 'Selvam Farm (Vadavalli West)',
      description: 'Tapioca: 400 kg • Status: Unassigned',
    },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4338ca 0%, #312e81 100%)',
        borderRadius: '20px',
        padding: '24px',
        color: 'white',
        marginBottom: '24px',
        boxShadow: '0 10px 25px rgba(67, 56, 202, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', marginBottom: '8px' }}>
            <Building2 size={14} /> Thondamuthur Hub #04 • Active Operations
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 4px 0' }}>
            Collection Center Operations
          </h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '13px' }}>
            AI-assisted farm consolidation, dynamic route dispatch & cold-storage monitoring
          </p>
        </div>

        <Link
          to="/operator/routes/create"
          style={{
            background: '#16a34a',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)',
            fontSize: '14px'
          }}
        >
          <Route size={18} /> Run AI Route Optimizer
        </Link>
      </div>

      {/* 4 Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e7e5e4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#78716c', fontWeight: '600' }}>Pending Pickups</span>
            <Sprout size={20} color="#16a34a" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#1c1917' }}>{stats.pendingPickups}</div>
          <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>4 ready to cluster</span>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e7e5e4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#78716c', fontWeight: '600' }}>Harvest Consolidating</span>
            <Building2 size={20} color="#2563eb" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#1c1917' }}>{stats.todayHarvestKg} kg</div>
          <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600' }}>32% of hub capacity</span>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e7e5e4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#78716c', fontWeight: '600' }}>Active Milk-Runs</span>
            <Route size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#1c1917' }}>{stats.activeRoutes}</div>
          <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '600' }}>All on schedule</span>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e7e5e4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#78716c', fontWeight: '600' }}>Fleet Available</span>
            <Truck size={20} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#1c1917' }}>{stats.activeVehicles} / 5</div>
          <span style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '600' }}>Ready for dispatch</span>
        </div>
      </div>

      {/* Map & Actions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid #e7e5e4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#1c1917' }}>
              📍 Hub Catchment Area & Pending Farms
            </h3>
            <span style={{ fontSize: '12px', color: '#78716c' }}>Radius: 15 km</span>
          </div>
          <MapComponent
            center={hubLocation}
            zoom={12}
            markers={markers}
            height="360px"
          />
        </div>

        {/* Quick Operations panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid #e7e5e4' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '12px', color: '#1c1917' }}>
              ⚡ Fast Actions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                to="/operator/routes/create"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: '#f0fdf4',
                  color: '#15803d',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '700'
                }}
              >
                <span>🤖 Optimize Pending Harvests</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/operator/pickups"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  color: '#1e293b',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                <span>📦 View Harvest Requests (6)</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/operator/vehicles"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  color: '#1e293b',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                <span>🚛 Vehicle Fleet Status</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div style={{
            background: '#fafaf9',
            borderRadius: '16px',
            padding: '18px',
            border: '1px solid #e7e5e4'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#15803d', fontWeight: '700', fontSize: '13px' }}>
              <ShieldCheck size={18} /> AI Efficiency Tip
            </div>
            <p style={{ fontSize: '12px', color: '#57534e', margin: 0, lineHeight: 1.5 }}>
              Bundling the 3 southern farms (Thondamuthur, Narasipuram, Alandurai) reduces total round-trip distance from 42 km to 18.5 km, saving ~56% on diesel costs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
