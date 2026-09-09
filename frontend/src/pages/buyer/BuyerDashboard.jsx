import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Building2, Sprout, ArrowRight, TrendingUp, CheckCircle } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

export default function BuyerDashboard() {
  const [availableProduce, setAvailableProduce] = useState([
    { id: 1, crop: 'Country Tomato (நாட்டு தக்காளி)', center: 'Thondamuthur Hub', availableKg: 1250, pricePerKg: 28, grade: 'Grade A Export', harvestDate: 'Today' },
    { id: 2, crop: 'Robusta Banana (வாழை)', center: 'Thondamuthur Hub', availableKg: 2100, pricePerKg: 34, grade: 'Grade A', harvestDate: 'Today' },
    { id: 3, crop: 'Small Bellary Onion (வெங்காயம்)', center: 'Karamadai Hub', availableKg: 850, pricePerKg: 32, grade: 'Grade A', harvestDate: 'Yesterday' },
    { id: 4, crop: 'Raw Tapioca (மரவள்ளிக்கிழங்கு)', center: 'Pollachi Hub', availableKg: 3500, pricePerKg: 19, grade: 'Industrial / Fresh', harvestDate: 'Today' },
  ]);

  const [recentOrders, setRecentOrders] = useState([
    { id: 'ORD-8821', crop: 'Country Tomato', qty: 500, total: 14000, status: 'DISPATCHED', date: '2026-09-08' },
    { id: 'ORD-8794', crop: 'Robusta Banana', qty: 1000, total: 34000, status: 'DELIVERED', date: '2026-09-06' },
  ]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
        borderRadius: '20px',
        padding: '24px',
        color: 'white',
        marginBottom: '24px',
        boxShadow: '0 10px 25px rgba(185, 28, 28, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', marginBottom: '8px' }}>
            <Building2 size={14} /> Wholesale Buyer & Mandi Portal
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 4px 0' }}>
            Fresh Farm Harvests Direct from Hubs
          </h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '13px' }}>
            Source directly from consolidated village collection centers at mandi transparent prices.
          </p>
        </div>

        <Link
          to="/buyer/orders/create"
          style={{
            background: 'white',
            color: '#b91c1c',
            padding: '12px 20px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '14px'
          }}
        >
          <ShoppingCart size={18} /> Place Produce Order
        </Link>
      </div>

      {/* Fresh Stock Arrival */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#1c1917' }}>
            🌱 Verified Stock Arriving at Hubs Today
          </h3>
          <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: '600' }}>Live inventory updated 5m ago</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {availableProduce.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #e7e5e4',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#78716c', fontWeight: '700', textTransform: 'uppercase' }}>
                  {item.center}
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', margin: '4px 0 6px 0', color: '#1c1917' }}>
                  {item.crop}
                </h4>
                <div style={{ fontSize: '12px', color: '#15803d', fontWeight: '600', marginBottom: '12px' }}>
                  {item.grade} • Harvested {item.harvestDate}
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#16a34a', marginBottom: '4px' }}>
                  ₹{item.pricePerKg} <span style={{ fontSize: '12px', color: '#78716c', fontWeight: 'normal' }}>/ kg</span>
                </div>
                <div style={{ fontSize: '13px', color: '#44403c' }}>
                  Available: <strong>{item.availableKg} kg</strong>
                </div>
              </div>

              <Link
                to={`/buyer/orders/create?crop=${encodeURIComponent(item.crop)}`}
                style={{
                  marginTop: '16px',
                  background: '#fef2f2',
                  color: '#b91c1c',
                  border: '1px solid #fecaca',
                  padding: '10px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '700'
                }}
              >
                Buy from Hub
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#1c1917' }}>
          📦 My Recent Purchase Orders
        </h3>
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e7e5e4', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#fafaf9', borderBottom: '1px solid #e7e5e4', color: '#57534e' }}>
                <th style={{ padding: '12px 16px' }}>Order ID</th>
                <th style={{ padding: '12px 16px' }}>Crop</th>
                <th style={{ padding: '12px 16px' }}>Quantity</th>
                <th style={{ padding: '12px 16px' }}>Total Amount</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700' }}>{o.id}</td>
                  <td style={{ padding: '12px 16px', color: '#1c1917' }}>{o.crop}</td>
                  <td style={{ padding: '12px 16px' }}>{o.qty} kg</td>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#16a34a' }}>₹{o.total.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
