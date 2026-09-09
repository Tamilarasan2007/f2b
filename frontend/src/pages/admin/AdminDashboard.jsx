import React from 'react';
import { Users, Truck, Building2, IndianRupee, Sprout, Route, TrendingUp, Leaf } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

export default function AdminDashboard() {
  const harvestTrendData = [
    { day: 'Mon', kg: 1420, costSaved: 1850 },
    { day: 'Tue', kg: 1980, costSaved: 2400 },
    { day: 'Wed', kg: 2350, costSaved: 3100 },
    { day: 'Thu', kg: 1800, costSaved: 2200 },
    { day: 'Fri', kg: 2900, costSaved: 3950 },
    { day: 'Sat', kg: 3400, costSaved: 4600 },
    { day: 'Sun', kg: 2600, costSaved: 3400 },
  ];

  const cropVolumeData = [
    { crop: 'Tomato', tons: 14.5 },
    { crop: 'Banana', tons: 22.0 },
    { crop: 'Onion', tons: 11.2 },
    { crop: 'Tapioca', tons: 18.7 },
    { crop: 'Cabbage', tons: 8.4 },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1c1917', margin: '0 0 4px 0' }}>
          AgriRoute AI — Executive Platform Intelligence
        </h2>
        <p style={{ fontSize: '13px', color: '#78716c', margin: 0 }}>
          Central command center monitoring rural supply chains across Western Tamil Nadu districts.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e7e5e4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#78716c', fontWeight: '600' }}>Active Farmers</span>
            <Users size={20} color="#16a34a" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#1c1917' }}>1,482</div>
          <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>+48 new this week</span>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e7e5e4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#78716c', fontWeight: '600' }}>Consolidated Produce</span>
            <Sprout size={20} color="#2563eb" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#1c1917' }}>74.8 Tons</div>
          <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600' }}>This month</span>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e7e5e4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#78716c', fontWeight: '600' }}>Logistics Cost Saved</span>
            <IndianRupee size={20} color="#ea580c" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#1c1917' }}>₹3,84,500</div>
          <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>42% savings vs individual trips</span>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e7e5e4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#78716c', fontWeight: '600' }}>Carbon Offset</span>
            <Leaf size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#1c1917' }}>2,410 kg</div>
          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>CO₂ emissions averted</span>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Daily Volume Trend */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e7e5e4' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#1c1917' }}>
            🌾 Daily Harvest Transported (Kg)
          </h3>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={harvestTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="kg" stroke="#16a34a" fill="#dcfce7" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop breakdown */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e7e5e4' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#1c1917' }}>
            📦 Top Crops Handled (Tons)
          </h3>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropVolumeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="crop" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="tons" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
