import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Trophy, Clock, Gavel, CheckCircle2, TrendingUp, AlertCircle, Building2 } from 'lucide-react';

export default function BuyerDealerBidding() {
  const { t } = useLanguage();

  const [secondsLeft, setSecondsLeft] = useState(225);
  const [bids, setBids] = useState([
    { id: 1, dealer: 'Kerala Direct Wholesale Mandi', amount: 33.5, time: '2 mins ago', isHighest: true },
    { id: 2, dealer: 'Coimbatore Mandi Traders (You)', amount: 32.0, time: '4 mins ago', isHighest: false, isUser: true },
    { id: 3, dealer: 'Udumalpet Agro Aggregators', amount: 30.5, time: '7 mins ago', isHighest: false },
    { id: 4, dealer: 'Salem Super Vegetable Mart', amount: 28.0, time: '12 mins ago', isHighest: false },
  ]);

  const [bidAmount, setBidAmount] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const highestBid = bids[0];

  const handlePlaceBid = (e) => {
    e.preventDefault();
    const val = parseFloat(bidAmount);
    if (isNaN(val) || val <= highestBid.amount) {
      alert(`Your bid must exceed current highest bid: ₹${highestBid.amount.toFixed(2)}/kg`);
      return;
    }

    const newBid = {
      id: Date.now(),
      dealer: 'Coimbatore Mandi Traders (You)',
      amount: val,
      time: 'Just now',
      isHighest: true,
      isUser: true,
    };

    setBids([newBid, ...bids.map(b => ({ ...b, isHighest: false }))]);
    setBidAmount('');
    setNotice(`🏆 You are now the HIGHEST BIDDER at ₹${val.toFixed(2)}/kg! Highest bid wins when window closes.`);
    setTimeout(() => setNotice(''), 5000);
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '20px',
        padding: '24px',
        color: 'white',
        marginBottom: '20px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
            <Gavel size={14} /> Wholesale Mandi Auction
          </div>
          <div style={{ background: '#eab308', color: '#713f12', padding: '6px 14px', borderRadius: '12px', fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} /> {t('window_closes_in')}: {formatTimer(secondsLeft)}
          </div>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '12px 0 6px 0' }}>
          {t('f2d_title')}
        </h2>
        <p style={{ margin: 0, opacity: 0.85, fontSize: '13px' }}>
          {t('f2d_subtitle')}
        </p>
      </div>

      {notice && (
        <div style={{ background: '#dcfce7', border: '1.5px solid #86efac', color: '#15803d', padding: '14px', borderRadius: '14px', marginBottom: '20px', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={20} /> {notice}
        </div>
      )}

      {/* Highest Bid Showcase */}
      <div style={{ background: 'white', border: '2px solid #facc15', borderRadius: '20px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#b45309', background: '#fef3c7', padding: '4px 10px', borderRadius: '6px' }}>
              Lot #TN-402 • 1,500 kg {t('crop_tomato')}
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: '900', margin: '8px 0 0 0', color: '#0f172a' }}>
              Current Leader: <span style={{ color: highestBid.isUser ? '#16a34a' : '#b45309' }}>{highestBid.dealer}</span>
            </h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{t('highest_bid')}</span>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#b45309' }}>
              ₹{highestBid.amount.toFixed(2)} <span style={{ fontSize: '14px', color: '#64748b' }}>/ kg</span>
            </div>
          </div>
        </div>

        {/* Place Bid Form */}
        <form onSubmit={handlePlaceBid} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="number"
            step="0.5"
            min={highestBid.amount + 0.5}
            placeholder={`Enter higher bid (Min. ₹${(highestBid.amount + 1).toFixed(2)})`}
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            required
            style={{ flex: 1, minWidth: '220px', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '16px', fontWeight: '700' }}
          />
          <button
            type="submit"
            style={{ background: '#16a34a', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '15px', cursor: 'pointer' }}
          >
            {t('place_dealer_bid')} 🚀
          </button>
        </form>
      </div>

      {/* Bid Log */}
      <div style={{ background: 'white', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 14px 0', color: '#1e293b' }}>
          {t('live_bids_count')} ({bids.length})
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {bids.map((b, idx) => (
            <div
              key={b.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '10px',
                background: b.isHighest ? '#fefce8' : '#f8fafc',
                border: b.isHighest ? '1.5px solid #facc15' : '1px solid #e2e8f0'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: '900', color: b.isHighest ? '#ca8a04' : '#64748b' }}>
                  {b.isHighest ? '🏆 #1' : `#${idx + 1}`}
                </span>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '13px', color: '#0f172a' }}>{b.dealer}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{b.time}</div>
                </div>
              </div>
              <div style={{ fontWeight: '900', fontSize: '16px', color: b.isHighest ? '#b45309' : '#334155' }}>
                ₹{b.amount.toFixed(2)}/kg
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
