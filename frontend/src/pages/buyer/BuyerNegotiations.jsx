import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MessageSquare, CheckCircle2, ArrowRight, Tag, ShieldCheck } from 'lucide-react';

export default function BuyerNegotiations() {
  const { t } = useLanguage();

  const [offers, setOffers] = useState([
    {
      id: 'OFFER-801',
      farmer_name: 'Murugan K (Thondamuthur)',
      crop: t('crop_tomato'),
      quantity_kg: 500,
      asking_price: 32,
      my_offer: 28,
      farmer_counter: 30,
      status: 'COUNTER_RECEIVED', // PENDING, COUNTER_RECEIVED, ACCEPTED
    },
    {
      id: 'OFFER-802',
      farmer_name: 'Palanisamy V (Narasipuram)',
      crop: t('crop_banana'),
      quantity_kg: 600,
      asking_price: 36,
      my_offer: 33,
      farmer_counter: null,
      status: 'PENDING',
    }
  ]);

  const [notice, setNotice] = useState('');

  const handleAcceptCounter = (id, price) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: 'ACCEPTED', my_offer: price } : o));
    setNotice(`Deal locked at ₹${price}/kg! Farmer notified for harvest pickup.`);
    setTimeout(() => setNotice(''), 4000);
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #be185d 0%, #9d174d 100%)',
        borderRadius: '20px',
        padding: '24px',
        color: 'white',
        marginBottom: '20px',
        boxShadow: '0 8px 24px rgba(190, 24, 93, 0.25)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
          <MessageSquare size={14} /> F to C Direct Purchase Bargaining
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px 0' }}>
          {t('f2c_title')}
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '13px' }}>
          {t('f2c_subtitle')}
        </p>
      </div>

      {notice && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> {notice}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {offers.map(o => (
          <div key={o.id} style={{ background: 'white', borderRadius: '18px', padding: '22px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#be185d', background: '#fdf2f8', padding: '3px 8px', borderRadius: '6px' }}>
                  {o.id}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '6px 0 2px 0', color: '#0f172a' }}>
                  {o.crop} ({o.quantity_kg} kg)
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Farmer: {o.farmer_name}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Farmer Asking:</span>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>₹{o.asking_price}/kg</div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Your Proposed Offer</span>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#0284c7' }}>₹{o.my_offer}/kg</div>
              </div>
              {o.farmer_counter && (
                <div>
                  <span style={{ fontSize: '11px', color: '#be185d', fontWeight: '700' }}>Farmer Counter Offer</span>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#be185d' }}>₹{o.farmer_counter}/kg</div>
                </div>
              )}
            </div>

            {o.status === 'COUNTER_RECEIVED' && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleAcceptCounter(o.id, o.farmer_counter)}
                  style={{ flex: 1, background: '#16a34a', color: 'white', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}
                >
                  Accept Farmer's Counter @ ₹{o.farmer_counter}/kg
                </button>
              </div>
            )}

            {o.status === 'ACCEPTED' && (
              <div style={{ background: '#f0fdf4', color: '#15803d', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: '800', fontSize: '13px' }}>
                ✓ {t('deal_locked')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
