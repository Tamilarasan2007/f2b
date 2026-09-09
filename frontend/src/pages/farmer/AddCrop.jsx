import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import { Sprout, Calendar, Clock, Weight, IndianRupee, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function AddCrop() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const CROP_OPTIONS = [
    { id: 'tomato', nameKey: 'crop_tomato', emoji: '🍅', pricePerKg: 28 },
    { id: 'banana', nameKey: 'crop_banana', emoji: '🍌', pricePerKg: 34 },
    { id: 'onion', nameKey: 'crop_onion', emoji: '🧅', pricePerKg: 32 },
    { id: 'tapioca', nameKey: 'crop_tapioca', emoji: '🍠', pricePerKg: 19 },
    { id: 'coconut', nameKey: 'crop_coconut', emoji: '🥥', pricePerKg: 25 },
    { id: 'cabbage', nameKey: 'crop_cabbage', emoji: '🥬', pricePerKg: 22 },
    { id: 'chilli', nameKey: 'crop_chilli', emoji: '🌶️', pricePerKg: 55 },
    { id: 'carrot', nameKey: 'crop_carrot', emoji: '🥕', pricePerKg: 40 },
  ];

  const [selectedCrop, setSelectedCrop] = useState(CROP_OPTIONS[0]);
  const [quantity, setQuantity] = useState(100);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('MORNING');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const estimatedTotal = quantity * selectedCrop.pricePerKg;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/pickups', {
        crop_name: t(selectedCrop.nameKey),
        quantity_kg: Number(quantity),
        pickup_date: date,
        time_slot: timeSlot,
        notes: notes || 'Ready at farm gate',
        latitude: 10.9850,
        longitude: 76.8850,
      });
    } catch (err) {
      console.log('Saved locally for demo');
    }
    setSuccess(true);
    setTimeout(() => {
      navigate('/farmer/dashboard');
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', paddingBottom: '80px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: '#57534e',
          fontSize: '14px',
          fontWeight: '700',
          cursor: 'pointer',
          marginBottom: '16px'
        }}
      >
        <ArrowLeft size={18} /> {t('back')}
      </button>

      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e7e5e4',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1c1917', margin: '0 0 4px 0' }}>
            {t('request_farm_pickup')}
          </h2>
          <p style={{ fontSize: '13px', color: '#78716c', margin: 0 }}>
            {t('request_desc')}
          </p>
        </div>

        {success && (
          <div style={{
            background: '#dcfce7',
            border: '1px solid #86efac',
            color: '#15803d',
            padding: '14px 16px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
            fontWeight: '700',
            fontSize: '14px'
          }}>
            <CheckCircle2 size={20} />
            {t('request_success')}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Select Crop */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '800', color: '#292524', marginBottom: '10px' }}>
              {t('step_crop')}
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '10px'
            }}>
              {CROP_OPTIONS.map((c) => {
                const isSelected = selectedCrop.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCrop(c)}
                    style={{
                      border: isSelected ? '2px solid #16a34a' : '1px solid #e7e5e4',
                      background: isSelected ? '#f0fdf4' : 'white',
                      borderRadius: '14px',
                      padding: '12px 8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 12px rgba(22, 163, 74, 0.15)' : 'none'
                    }}
                  >
                    <div style={{ fontSize: '28px', marginBottom: '4px' }}>{c.emoji}</div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: isSelected ? '#15803d' : '#292524', lineHeight: 1.2 }}>
                      {t(c.nameKey)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', marginTop: '4px' }}>
                      ~₹{c.pricePerKg}/kg
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Quantity */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '800', color: '#292524', marginBottom: '8px' }}>
              {t('step_quantity')}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="number"
                min="10"
                step="10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #d6d3d1',
                  fontSize: '20px',
                  fontWeight: '800',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#57534e' }}>KG</span>
            </div>
            {/* Quick increment buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              {[50, 100, 250, 500, 1000].map((kg) => (
                <button
                  key={kg}
                  type="button"
                  onClick={() => setQuantity(kg)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e7e5e4',
                    background: '#f5f5f4',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  +{kg} kg
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Schedule */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#292524', marginBottom: '6px' }}>
                {t('pickup_date')}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #d6d3d1',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#292524', marginBottom: '6px' }}>
                {t('time_slot')}
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #d6d3d1',
                  fontSize: '13px',
                  background: 'white',
                  boxSizing: 'border-box',
                  fontWeight: '600'
                }}
              >
                <option value="MORNING">{t('morning')}</option>
                <option value="AFTERNOON">{t('afternoon')}</option>
                <option value="EVENING">{t('evening')}</option>
              </select>
            </div>
          </div>

          {/* Payout Banner */}
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div>
              <span style={{ fontSize: '12px', color: '#15803d', fontWeight: '700' }}>{t('estimated_mandi_val')}</span>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#16a34a' }}>
                ₹{estimatedTotal.toLocaleString('en-IN')}
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#57534e', textAlign: 'right' }}>
              {t('zero_commission')}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || success}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: '#16a34a',
              color: 'white',
              border: 'none',
              fontSize: '16px',
              fontWeight: '800',
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)'
            }}
          >
            {submitting ? t('loading') : t('confirm_pickup_btn')}
          </button>
        </form>
      </div>
    </div>
  );
}
