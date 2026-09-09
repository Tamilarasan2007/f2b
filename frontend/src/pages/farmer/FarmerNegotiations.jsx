import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MessageSquare, CheckCircle2, XCircle, ArrowRight, UserCheck, RefreshCw, Sparkles, Tag, ShieldCheck } from 'lucide-react';

export default function FarmerNegotiations() {
  const { t, lang } = useLanguage();

  const [negotiations, setNegotiations] = useState([
    {
      id: 'NEG-101',
      customer_name: 'Sangeetha R. (Coimbatore Resident)',
      customer_phone: '9842100011',
      crop: t('crop_tomato'),
      quantity_kg: 250,
      asking_price: 34,
      current_offer: 29,
      status: 'PENDING_FARMER', // PENDING_FARMER, ACCEPTED, REJECTED, COUNTERED
      farmer_counter: null,
      rounds: [
        { by: 'farmer', text: `${t('asking_price')}: ₹34 / kg`, time: '10:00 AM' },
        { by: 'customer', text: `${t('customer_offer')}: ₹29 / kg`, time: '10:15 AM' }
      ]
    },
    {
      id: 'NEG-102',
      customer_name: 'Green Grocers Retail (R.S. Puram)',
      customer_phone: '9842100022',
      crop: t('crop_banana'),
      quantity_kg: 400,
      asking_price: 36,
      current_offer: 33,
      status: 'PENDING_FARMER',
      farmer_counter: null,
      rounds: [
        { by: 'farmer', text: `${t('asking_price')}: ₹36 / kg`, time: '09:30 AM' },
        { by: 'customer', text: `${t('customer_offer')}: ₹33 / kg`, time: '09:50 AM' }
      ]
    },
    {
      id: 'NEG-103',
      customer_name: 'Kavin Supermarket (Saravanampatti)',
      customer_phone: '9842100033',
      crop: t('crop_onion'),
      quantity_kg: 350,
      asking_price: 42,
      current_offer: 40,
      status: 'ACCEPTED',
      farmer_counter: 40,
      rounds: [
        { by: 'farmer', text: `${t('asking_price')}: ₹42 / kg`, time: 'Yesterday' },
        { by: 'customer', text: `${t('customer_offer')}: ₹38 / kg`, time: 'Yesterday' },
        { by: 'farmer', text: `${t('counter_price')}: ₹40 / kg`, time: 'Yesterday' },
        { by: 'customer', text: `${t('deal_locked')} (₹40/kg)`, time: 'Today 08:00 AM' }
      ]
    }
  ]);

  const [counterInputs, setCounterInputs] = useState({});
  const [successNotice, setSuccessNotice] = useState('');

  const handleAccept = (id) => {
    setNegotiations(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'ACCEPTED',
          rounds: [
            ...item.rounds,
            { by: 'farmer', text: `${t('accept_deal')} @ ₹${item.current_offer}/kg. ${t('deal_locked')}`, time: 'Just now' }
          ]
        };
      }
      return item;
    }));
    setSuccessNotice(`${t('deal_locked')} (${id})`);
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleCounter = (id, currentOffer) => {
    const entered = counterInputs[id];
    if (!entered || isNaN(entered) || Number(entered) <= 0) return;

    setNegotiations(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'COUNTERED',
          farmer_counter: Number(entered),
          rounds: [
            ...item.rounds,
            { by: 'farmer', text: `${t('counter_price')}: ₹${entered} / kg`, time: 'Just now' }
          ]
        };
      }
      return item;
    }));
    setCounterInputs(prev => ({ ...prev, [id]: '' }));
    setSuccessNotice(`${t('counter_sent_success')} (₹${entered}/kg)`);
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleDecline = (id) => {
    setNegotiations(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'REJECTED',
          rounds: [
            ...item.rounds,
            { by: 'farmer', text: t('farmer_declined_offer'), time: 'Just now' }
          ]
        };
      }
      return item;
    }));
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        borderRadius: '20px',
        padding: '24px',
        color: 'white',
        marginBottom: '20px',
        boxShadow: '0 8px 24px rgba(2, 132, 199, 0.25)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', marginBottom: '10px', fontWeight: '800' }}>
          <MessageSquare size={14} /> {t('small_quantity_badge')}
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px 0' }}>
          {t('f2c_title')}
        </h2>
        <p style={{ margin: 0, opacity: 0.95, fontSize: '13px', lineHeight: 1.5 }}>
          {t('f2c_subtitle')}
        </p>
      </div>

      {successNotice && (
        <div style={{
          background: '#dcfce7',
          border: '1.5px solid #86efac',
          color: '#15803d',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: '700',
          fontSize: '13px'
        }}>
          <CheckCircle2 size={18} /> {successNotice}
        </div>
      )}

      {/* Negotiations List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {negotiations.map((item) => {
          const isAccepted = item.status === 'ACCEPTED';
          const isRejected = item.status === 'REJECTED';
          const isCountered = item.status === 'COUNTERED';
          const totalEstimated = (item.farmer_counter || item.current_offer) * item.quantity_kg;

          return (
            <div
              key={item.id}
              style={{
                background: 'white',
                borderRadius: '18px',
                padding: '22px',
                border: isAccepted ? '2px solid #86efac' : '1px solid #e7e5e4',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
              }}
            >
              {/* Card Top */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#0284c7', background: '#e0f2fe', padding: '3px 8px', borderRadius: '6px' }}>
                      {item.id}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                      👤 {item.customer_name}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                    🌾 {item.crop} • <span style={{ color: '#16a34a' }}>{item.quantity_kg} kg</span>
                  </h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: '800',
                    background: isAccepted ? '#dcfce7' : isRejected ? '#fee2e2' : isCountered ? '#fef3c7' : '#e0f2fe',
                    color: isAccepted ? '#15803d' : isRejected ? '#b91c1c' : isCountered ? '#b45309' : '#0369a1'
                  }}>
                    {isAccepted ? `✓ ${t('status_completed')}` : isRejected ? `✕ ${t('status_cancelled')}` : isCountered ? t('counter_sent') : t('offer_pending')}
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#15803d', marginTop: '4px' }}>
                    ₹{totalEstimated.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Price Comparison Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>{t('asking_price')}</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#334155' }}>₹{item.asking_price}/kg</div>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: '700' }}>{t('customer_offer')}</div>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#0369a1' }}>₹{item.current_offer}/kg</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700' }}>{t('final_agreed_price')}</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: isAccepted ? '#16a34a' : '#94a3b8' }}>
                    {item.farmer_counter ? `₹${item.farmer_counter}/kg` : isAccepted ? `₹${item.current_offer}/kg` : t('status_pending')}
                  </div>
                </div>
              </div>

              {/* Bargaining Chat Timeline */}
              <div style={{ background: '#fafaf9', borderRadius: '10px', padding: '12px', marginBottom: '16px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>
                  💬 {t('negotiation_history')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {item.rounds.map((r, rIdx) => (
                    <div
                      key={rIdx}
                      style={{
                        alignSelf: r.by === 'farmer' ? 'flex-end' : 'flex-start',
                        background: r.by === 'farmer' ? '#dcfce7' : '#ffffff',
                        color: r.by === 'farmer' ? '#14532d' : '#1e293b',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        maxWidth: '85%',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                      }}
                    >
                      <span>{r.text}</span>
                      <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', marginTop: '2px', textAlign: 'right' }}>
                        {r.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons for Farmer */}
              {!isAccepted && !isRejected && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => handleAccept(item.id)}
                    style={{
                      flex: 1,
                      minWidth: '130px',
                      background: '#16a34a',
                      color: 'white',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <CheckCircle2 size={16} /> {t('accept_deal')} (₹{item.current_offer}/kg)
                  </button>

                  <div style={{ display: 'flex', gap: '6px', flex: 1.4, minWidth: '220px' }}>
                    <input
                      type="number"
                      placeholder={t('counter_price')}
                      value={counterInputs[item.id] || ''}
                      onChange={(e) => setCounterInputs({ ...counterInputs, [item.id]: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleCounter(item.id, item.current_offer)}
                      style={{
                        background: '#0284c7',
                        color: 'white',
                        padding: '9px 14px',
                        borderRadius: '10px',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {t('send_counter')}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDecline(item.id)}
                    style={{
                      background: '#f1f5f9',
                      color: '#64748b',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {t('reject_deal')}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
