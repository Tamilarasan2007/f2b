import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  BookOpen,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Truck,
  MessageSquare,
  Gavel,
  ArrowRight,
  Sprout,
  Clock,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function UserManual() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', paddingBottom: '90px' }}>
      {/* Hero Guide Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
          borderRadius: '24px',
          padding: '28px',
          color: 'white',
          marginBottom: '24px',
          boxShadow: '0 10px 25px rgba(22, 101, 52, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '800', marginBottom: '12px' }}>
          <Sparkles size={16} /> {t('guide_badge')}
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: '900', margin: '0 0 10px 0', lineHeight: 1.3 }}>
          {t('user_manual')}
        </h1>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.95, lineHeight: 1.6, maxWidth: '680px' }}>
          {t('user_manual_desc')}
        </p>
      </div>

      {/* Crucial Distinction Card: Wholesale vs Small Quantity Rule */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px',
          border: '2px solid #86efac',
          boxShadow: '0 4px 18px rgba(0,0,0,0.04)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ background: '#dcfce7', padding: '8px', borderRadius: '12px', color: '#15803d' }}>
            <HelpCircle size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: '#166534' }}>
              {t('rule_summary_title')}
            </h3>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Small Quantity Rule */}
          <div
            style={{
              background: '#f0f9ff',
              border: '1.5px solid #bae6fd',
              borderRadius: '16px',
              padding: '18px'
            }}
          >
            <div style={{ display: 'inline-block', background: '#0284c7', color: 'white', fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', marginBottom: '8px' }}>
              {t('small_quantity_badge')}
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0369a1', margin: '0 0 6px 0' }}>
              {t('small_qty_rule_action')}
            </h4>
            <p style={{ fontSize: '13px', color: '#334155', margin: '0 0 12px 0', lineHeight: 1.5 }}>
              {t('manual_step_2_desc')}
            </p>
            <button
              type="button"
              onClick={() => navigate('/farmer/negotiations')}
              style={{
                background: '#0284c7',
                color: 'white',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <MessageSquare size={14} /> {t('f2c_title')} <ArrowRight size={14} />
            </button>
          </div>

          {/* Wholesale Bidding Rule */}
          <div
            style={{
              background: '#faf5ff',
              border: '1.5px solid #e9d5ff',
              borderRadius: '16px',
              padding: '18px'
            }}
          >
            <div style={{ display: 'inline-block', background: '#7c3aed', color: 'white', fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', marginBottom: '8px' }}>
              {t('wholesale_quantity_badge')}
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#6d28d9', margin: '0 0 6px 0' }}>
              {t('wholesale_qty_rule_action')}
            </h4>
            <p style={{ fontSize: '13px', color: '#334155', margin: '0 0 12px 0', lineHeight: 1.5 }}>
              {t('manual_step_3_desc')}
            </p>
            <div style={{
              background: '#ede9fe',
              color: '#5b21b6',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>🔒 {lang === 'ta' ? 'வியாபாரி ஏலம் (விவசாயிகள் அணுகல் இல்லை)' : lang === 'hi' ? 'व्यापारी नीलामी (किसान पहुंच प्रतिबंधित)' : 'Dealer Auction (Buyer portal only)'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 4px' }}>
        {t('how_it_works')}
      </h3>

      {/* 5 Step Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Step 1 */}
        <div
          style={{
            background: 'white',
            borderRadius: '18px',
            padding: '22px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start'
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: '#dcfce7',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Sprout size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
              {t('manual_step_1_title')}
            </h4>
            <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.6 }}>
              {t('manual_step_1_desc')}
            </p>
            <button
              type="button"
              onClick={() => navigate('/farmer/add-crop')}
              style={{
                background: '#16a34a',
                color: 'white',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {t('request_farm_pickup')} <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div
          style={{
            background: 'white',
            borderRadius: '18px',
            padding: '22px',
            border: '1px solid #bae6fd',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start'
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <MessageSquare size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-block', background: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', marginBottom: '6px' }}>
              {t('small_quantity_badge')}
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
              {t('manual_step_2_title')}
            </h4>
            <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.6 }}>
              {t('manual_step_2_desc')}
            </p>
            <button
              type="button"
              onClick={() => navigate('/farmer/negotiations')}
              style={{
                background: '#0284c7',
                color: 'white',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {t('f2c_title')} <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div
          style={{
            background: 'white',
            borderRadius: '18px',
            padding: '22px',
            border: '1px solid #e9d5ff',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start'
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: '#f3e8ff',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Gavel size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-block', background: '#f3e8ff', color: '#6d28d9', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', marginBottom: '6px' }}>
              {t('wholesale_quantity_badge')}
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
              {t('manual_step_3_title')}
            </h4>
            <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.6 }}>
              {t('manual_step_3_desc')}
            </p>
            <div style={{
              background: '#f3e8ff',
              color: '#6d28d9',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>🔒 {lang === 'ta' ? 'வியாபாரிகளுக்கான பிரத்யேக ஏலம் (விவசாயிகள் நேரடியாக பங்கேற்க முடியாது)' : lang === 'hi' ? 'व्यापारियों के लिए विशेष नीलामी (किसानों के लिए प्रतिबंधित)' : 'Exclusive to Mandi Buyers/Dealers (Restricted for Farmers)'}</span>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div
          style={{
            background: 'white',
            borderRadius: '18px',
            padding: '22px',
            border: '1px solid #fed7aa',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start'
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: '#ffedd5',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
              {t('manual_step_4_title')}
            </h4>
            <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.6 }}>
              {t('manual_step_4_desc')}
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff7ed', border: '1px dashed #fdba74', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', color: '#c2410c', fontWeight: '700' }}>
              🔒 {t('handover_otp')}: ****
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div
          style={{
            background: 'white',
            borderRadius: '18px',
            padding: '22px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start'
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: '#e0e7ff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <TrendingUp size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
              {t('manual_step_5_title')}
            </h4>
            <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.6 }}>
              {t('manual_step_5_desc')}
            </p>
            <button
              type="button"
              onClick={() => navigate('/farmer/demand-forecast')}
              style={{
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {t('demand_forecast')} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Back to Dashboard Button */}
      <div style={{ marginTop: '28px', textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => navigate('/farmer')}
          style={{
            background: '#334155',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          ← {t('back_to_dashboard')}
        </button>
      </div>
    </div>
  );
}
