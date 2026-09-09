import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Phone, User, Mail, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'FARMER',
    village: 'Thondamuthur',
    taluk: 'Coimbatore South',
    district: 'Coimbatore',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #e0e7ff 100%)',
      padding: '24px 16px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '36px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        border: '1px solid #e7e5e4'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            color: 'white',
            marginBottom: '10px'
          }}>
            <Sprout size={28} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1c1917', margin: 0 }}>Join F2B Platform</h2>
          <p style={{ fontSize: '13px', color: '#78716c', marginTop: '4px' }}>Register as Farmer, Driver, or Buyer</p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '13px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#44403c', marginBottom: '4px' }}>
              Select Your Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d6d3d1',
                fontSize: '14px',
                outline: 'none',
                background: '#fafaf9'
              }}
            >
              <option value="FARMER">🌾 Farmer (விவசாயி)</option>
              <option value="DRIVER">🚛 Driver (ஓட்டுநர்)</option>
              <option value="COLLECTION_POINT_OPERATOR">📦 Collection Center Operator</option>
              <option value="BUYER">🏬 Buyer / Mandi Trader</option>
            </select>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#44403c', marginBottom: '4px' }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Ramesh Kumar"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#44403c', marginBottom: '4px' }}>
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                placeholder="10-digit mobile"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#44403c', marginBottom: '4px' }}>
                Email (Optional)
              </label>
              <input
                type="email"
                name="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#44403c', marginBottom: '4px' }}>
                Village / Area
              </label>
              <input
                type="text"
                name="village"
                placeholder="Village"
                value={formData.village}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#44403c', marginBottom: '4px' }}>
                District
              </label>
              <input
                type="text"
                name="district"
                placeholder="District"
                value={formData.district}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#44403c', marginBottom: '4px' }}>
              Create Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              background: '#16a34a',
              color: 'white',
              border: 'none',
              fontSize: '15px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading ? 'Registering...' : 'Complete Registration'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/login" style={{ fontSize: '13px', color: '#16a34a', textDecoration: 'none', fontWeight: '600' }}>
            Already registered? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
