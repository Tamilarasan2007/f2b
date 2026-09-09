import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { TrendingUp, Calendar, AlertTriangle, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function DemandForecast() {
  const { t, lang } = useLanguage();

  const [selectedCrop, setSelectedCrop] = useState('tomato');

  const FORECAST_DATA = {
    tomato: {
      name: t('crop_tomato'),
      currentPrice: 28,
      predictedPrice: 36,
      demandLevel: t('demand_high'),
      action: t('recommendation_hold'),
      color: '#ef4444',
      chart: [
        { day: 'Day 1', price: 28 },
        { day: 'Day 3', price: 29 },
        { day: 'Day 5', price: 31 },
        { day: 'Day 7', price: 34 },
        { day: 'Day 10', price: 36 },
        { day: 'Day 14', price: 35 },
      ],
      insight: lang === 'ta'
        ? 'கோயம்புத்தூர் & கேரளா எல்லை சந்தைகளில் தக்காளி தேவை அடுத்த வாரம் 35% அதிகரிக்கும். 3 நாட்கள் கழித்து அறுவடை செய்தால் கூடுதல் லாபம் கிடைக்கும்.'
        : lang === 'hi'
        ? 'कोयंबटूर और नजदीकी मंडियों में टमाटर की मांग अगले सप्ताह 35% बढ़ेगी। 3 दिन रुककर कटाई करने से प्रति किलो ₹7-8 अधिक भाव मिलेगा।'
        : 'Wholesale retail demand in Coimbatore & Kerala border mandis projected to surge by 35%. Stagger harvest by 3 days for maximum realization.'
    },
    banana: {
      name: t('crop_banana'),
      currentPrice: 34,
      predictedPrice: 35,
      demandLevel: t('demand_moderate'),
      action: t('recommendation_sell'),
      color: '#eab308',
      chart: [
        { day: 'Day 1', price: 34 },
        { day: 'Day 3', price: 34 },
        { day: 'Day 5', price: 35 },
        { day: 'Day 7', price: 35 },
        { day: 'Day 10', price: 34 },
        { day: 'Day 14', price: 34 },
      ],
      insight: lang === 'ta'
        ? 'வாழைப்பழ விலை சீராக உள்ளது. வழக்கம் போல் அறுவடை செய்து விற்பனை செய்யலாம்.'
        : lang === 'hi'
        ? 'केले की मांग और भाव स्थिर बने रहेंगे। अपनी सुविधानुसार नियमित कटाई करें।'
        : 'Stable steady demand throughout the fortnight. Regular harvesting recommended.'
    },
    onion: {
      name: t('crop_onion'),
      currentPrice: 32,
      predictedPrice: 42,
      demandLevel: t('demand_high'),
      action: t('recommendation_hold'),
      color: '#8b5cf6',
      chart: [
        { day: 'Day 1', price: 32 },
        { day: 'Day 3', price: 34 },
        { day: 'Day 5', price: 38 },
        { day: 'Day 7', price: 40 },
        { day: 'Day 10', price: 42 },
        { day: 'Day 14', price: 44 },
      ],
      insight: lang === 'ta'
        ? 'மழை காரணமாக வெளிமாநில வரத்து குறைந்துள்ளது. அடுத்த வாரம் விலை ₹42 வரை உயரும் வாய்ப்பு அதிகம்!'
        : lang === 'hi'
        ? 'बाहरी आवक घटने के कारण प्याज के भाव अगले 7-10 दिनों में ₹42 तक उछलने का अनुमान है।'
        : 'Supply constraints from northern belts expected to drive local onion prices up to ₹42/kg within 10 days.'
    },
    tapioca: {
      name: t('crop_tapioca'),
      currentPrice: 19,
      predictedPrice: 16,
      demandLevel: t('demand_low'),
      action: t('recommendation_rush'),
      color: '#0284c7',
      chart: [
        { day: 'Day 1', price: 19 },
        { day: 'Day 3', price: 18 },
        { day: 'Day 5', price: 17 },
        { day: 'Day 7', price: 16 },
        { day: 'Day 10', price: 16 },
        { day: 'Day 14', price: 15 },
      ],
      insight: lang === 'ta'
        ? 'சேலம் மற்றும் நாமக்கல்லில் மரவள்ளிக்கிழங்கு வரத்து அதிகரிப்பதால் உடனடியாக அறுவடை செய்து விற்பது நல்லது.'
        : lang === 'hi'
        ? 'सलेम और नामक्कल से भारी आवक शुरू होने वाली है। भाव गिरने से पहले तुरंत कटाई कर बेचें।'
        : 'High incoming supply from neighboring districts starting next week. Early harvest advised before price softening.'
    }
  };

  const crop = FORECAST_DATA[selectedCrop] || FORECAST_DATA.tomato;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        borderRadius: '20px',
        padding: '24px',
        color: 'white',
        marginBottom: '20px',
        boxShadow: '0 8px 24px rgba(5, 150, 105, 0.25)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', marginBottom: '10px', fontWeight: '700' }}>
          <Sparkles size={14} /> {t('forecast_title')}
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px 0' }}>
          {t('forecast_title')}
        </h2>
        <p style={{ margin: 0, opacity: 0.95, fontSize: '13px', lineHeight: 1.5 }}>
          {t('forecast_desc')}
        </p>
      </div>

      {/* Crop Selector Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
        {Object.entries(FORECAST_DATA).map(([key, data]) => {
          const isSelected = selectedCrop === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedCrop(key)}
              style={{
                padding: '12px 6px',
                borderRadius: '12px',
                border: isSelected ? '2px solid #059669' : '1px solid #e7e5e4',
                background: isSelected ? '#ecfdf5' : 'white',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: isSelected ? '0 4px 12px rgba(5, 150, 105, 0.15)' : 'none'
              }}
            >
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>
                {key === 'tomato' ? '🍅' : key === 'banana' ? '🍌' : key === 'onion' ? '🧅' : '🍠'}
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: isSelected ? '#047857' : '#292524' }}>
                {data.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: '700', marginTop: '2px' }}>
                ₹{data.currentPrice}/kg
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Forecast Card */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e7e5e4',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#78716c', fontWeight: '600' }}>{t('crop')}</span>
            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0 0 0', color: '#1c1917' }}>
              {crop.name}
            </h3>
          </div>
          <div style={{
            background: crop.currentPrice < crop.predictedPrice ? '#ecfdf5' : '#fff7ed',
            color: crop.currentPrice < crop.predictedPrice ? '#047857' : '#c2410c',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: '800',
            border: `1px solid ${crop.currentPrice < crop.predictedPrice ? '#a7f3d0' : '#fed7aa'}`
          }}>
            {crop.action}
          </div>
        </div>

        {/* 2-Column Pricing Metric */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: '#fafaf9', padding: '16px', borderRadius: '14px', border: '1px solid #e7e5e4' }}>
            <span style={{ fontSize: '12px', color: '#78716c', fontWeight: '600' }}>{t('current_price')}</span>
            <div style={{ fontSize: '26px', fontWeight: '900', color: '#1c1917', margin: '4px 0' }}>
              ₹{crop.currentPrice} <span style={{ fontSize: '13px', color: '#78716c', fontWeight: 'normal' }}>/ kg</span>
            </div>
            <span style={{ fontSize: '11px', color: '#78716c' }}>Coimbatore Mandi Today</span>
          </div>

          <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
            <span style={{ fontSize: '12px', color: '#15803d', fontWeight: '700' }}>{t('projected_price')} (7-10 Days)</span>
            <div style={{ fontSize: '26px', fontWeight: '900', color: '#16a34a', margin: '4px 0' }}>
              ₹{crop.predictedPrice} <span style={{ fontSize: '13px', color: '#15803d', fontWeight: 'normal' }}>/ kg</span>
            </div>
            <span style={{ fontSize: '11px', color: '#15803d', fontWeight: '700' }}>
              {crop.predictedPrice > crop.currentPrice ? `▲ +₹${crop.predictedPrice - crop.currentPrice}/kg profit surge` : `▼ -₹${crop.currentPrice - crop.predictedPrice}/kg expected drop`}
            </span>
          </div>
        </div>

        {/* Chart */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#57534e', marginBottom: '10px' }}>
            📈 14-Day Price Trajectory (₹ / KG)
          </h4>
          <div style={{ height: '180px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={crop.chart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip />
                <Area type="monotone" dataKey="price" stroke="#059669" fill="#d1fae5" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actionable AI Advice in Tamil / Hindi */}
        <div style={{
          background: '#f8fafc',
          borderLeft: '4px solid #059669',
          padding: '14px 16px',
          borderRadius: '0 12px 12px 0',
          fontSize: '13px',
          color: '#334155',
          lineHeight: 1.6
        }}>
          <strong>💡 {lang === 'ta' ? 'விவசாயிகளுக்கான வழிகாட்டல்:' : lang === 'hi' ? 'किसान सलाह:' : 'Farmer Recommendation:'}</strong><br />
          {crop.insight}
        </div>
      </div>
    </div>
  );
}
