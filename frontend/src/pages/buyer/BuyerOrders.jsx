import React, { useState } from 'react';
import StatusBadge from '../../components/StatusBadge';
import { ShoppingCart, FileText, CheckCircle2 } from 'lucide-react';

export default function BuyerOrders() {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-8821',
      crop: 'Country Tomato (நாட்டு தக்காளி)',
      hub: 'Thondamuthur Collection Center',
      quantity_kg: 500,
      rate_per_kg: 28,
      total_amount: 14000,
      delivery_address: 'MGR Wholesale Vegetable Mandi, Shop #14, Coimbatore',
      status: 'DISPATCHED',
      dispatch_date: '2026-09-08',
      driver: 'Muthu Vel (TN 38 B 9901)'
    },
    {
      id: 'ORD-8794',
      crop: 'Robusta Banana (வாழை)',
      hub: 'Thondamuthur Collection Center',
      quantity_kg: 1000,
      rate_per_kg: 34,
      total_amount: 34000,
      delivery_address: 'Nilgiris Supermarket Distribution Hub, Singanallur',
      status: 'DELIVERED',
      dispatch_date: '2026-09-06',
      driver: 'Suresh Kumar (TN 37 CY 4821)'
    },
    {
      id: 'ORD-8650',
      crop: 'Small Bellary Onion (வெங்காயம்)',
      hub: 'Karamadai Hub',
      quantity_kg: 800,
      rate_per_kg: 32,
      total_amount: 25600,
      delivery_address: 'RS Puram Retail Traders Association',
      status: 'DELIVERED',
      dispatch_date: '2026-09-02',
      driver: 'Praveen R (TN 43 E 1122)'
    }
  ]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1c1917', margin: '0 0 4px 0' }}>
          Buyer Purchase Invoices & Orders
        </h2>
        <p style={{ fontSize: '13px', color: '#78716c', margin: 0 }}>
          Manage your bulk agricultural produce sourcing orders and mandi delivery logs.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {orders.map((o) => (
          <div
            key={o.id}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #e7e5e4',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#78716c', fontWeight: '700' }}>{o.id} • {o.dispatch_date}</div>
                <h3 style={{ fontSize: '17px', fontWeight: '800', margin: '4px 0 2px 0', color: '#1c1917' }}>
                  {o.crop}
                </h3>
                <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: '600' }}>
                  Sourced from {o.hub}
                </span>
              </div>
              <StatusBadge status={o.status} />
            </div>

            <div style={{ background: '#fafaf9', padding: '12px', borderRadius: '10px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              <div>Quantity: <strong>{o.quantity_kg} kg</strong> @ ₹{o.rate_per_kg}/kg</div>
              <div>Invoice Total: <strong style={{ color: '#16a34a', fontSize: '14px' }}>₹{o.total_amount.toLocaleString('en-IN')}</strong></div>
              <div>Driver: <strong>{o.driver}</strong></div>
            </div>

            <div style={{ fontSize: '12px', color: '#78716c' }}>
              Delivery Destination: {o.delivery_address}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
