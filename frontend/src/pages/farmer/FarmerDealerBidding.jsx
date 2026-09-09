import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Trophy, Clock, ArrowUpRight, CheckCircle2, ShieldCheck, TrendingUp, DollarSign, Building2, Gavel } from 'lucide-react';

export default function FarmerDealerBidding() {
  const { t, lang } = useLanguage();

  // Auction Lot Details
  const [lot, setLot] = useState({
    id: 'LOT-TN-402',
    crop: t('crop_tomato'),
    quantity_kg: 1500,
    base_price: 25.0,
    status: 'ACTIVE', // ACTIVE, FINALIZED
  });

  // Countdown timer in seconds (e.g. 3 mins 45 secs)
  const [secondsLeft, setSecondsLeft] = useState(225);
  const [newBidAmount, setNewBidAmount] = useState('');
  const [dealerNameInput, setDealerNameInput] = useState('');
  const [notice, setNotice] = useState('');

  // Live Dealer Bids (sorted by highest first)
  const [bids, setBids] = useState([
    { id: 1, dealer: 'Kerala Direct Wholesale Mandi', location: 'Palakkad Terminal', amount: 33.5, time: '2 mins ago', isHighest: true },
    { id: 2, dealer: 'Coimbatore APMC Traders', location: 'Mettupalayam Market', amount: 32.0, time: '4 mins ago', isHighest: false },
    { id: 3, dealer: 'Udumalpet Agro Aggregators', location: 'Udumalpet Mandi', amount: 30.5, time: '7 mins ago', isHighest: false },
    { id: 4, dealer: 'Salem Super Vegetable Mart', location: 'Salem Yard', amount: 28.0, time: '12 mins ago', isHighest: false },
  ]);

  // Timer countdown
  useEffect(() => {
    if (lot.status !== 'ACTIVE' || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoFinalize();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, lot.status]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const highestBid = bids[0];

  const handlePlaceBid = (e) => {
    e?.preventDefault();
    const bidVal = parseFloat(newBidAmount);
    if (isNaN(bidVal) || bidVal <= highestBid.amount) {
      alert(`Bid must be higher than current highest bid: ₹${highestBid.amount.toFixed(2)}/kg`);
      return;
    }

    const newDealerName = dealerNameInput.trim() || 'New Participating Dealer';
    const newBid = {
      id: Date.now(),
      dealer: newDealerName,
      location: 'Tamil Nadu Agri Hub',
      amount: bidVal,
      time: 'Just now',
      isHighest: true,
    };

    // Mark previous as not highest and put new bid at top
    setBids((prev) => [
      newBid,
      ...prev.map((b) => ({ ...b, isHighest: false })),
    ]);

    setNewBidAmount('');
    setDealerNameInput('');
    setNotice(`🔥 New Highest Bid placed: ₹${bidVal.toFixed(2)}/kg by ${newDealerName}!`);
    setTimeout(() => setNotice(''), 4000);
  };

  const handleAutoFinalize = () => {
    setLot((prev) => ({ ...prev, status: 'FINALIZED' }));
    setNotice(`🏆 ${t('auction_ended_winner')} (₹${highestBid.amount}/kg by ${highestBid.dealer})`);
  };

  const totalAuctionValue = highestBid ? Math.round(highestBid.amount * lot.quantity_kg) : 0;

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
        borderRadius: '20px',
        padding: '24px',
        color: 'white',
        marginBottom: '20px',
        boxShadow: '0 8px 24px rgba(124, 58, 237, 0.25)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.25)', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>
              <Gavel size={14} /> {t('wholesale_quantity_badge')}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
              <Trophy size={14} /> {t('highest_bid_wins_badge')}
            </div>
          </div>

          {/* Countdown Clock Badge */}
          <div style={{
            background: lot.status === 'ACTIVE' ? 'rgba(0,0,0,0.3)' : '#10b981',
            padding: '6px 14px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '800'
          }}>
            <Clock size={16} color="#fef08a" />
            <span>{lot.status === 'ACTIVE' ? `${t('window_closes_in')}: ${formatTimer(secondsLeft)}` : t('bidding_closed')}</span>
          </div>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '12px 0 6px 0' }}>
          {t('f2d_title')}
        </h2>
        <p style={{ margin: 0, opacity: 0.95, fontSize: '13px', lineHeight: 1.5 }}>
          {t('f2d_subtitle')}
        </p>
      </div>

      {notice && (
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
          fontSize: '14px'
        }}>
          <Trophy size={20} color="#eab308" /> {notice}
        </div>
      )}

      {/* Highest Bid Winner Card */}
      <div style={{
        background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
        border: '2px solid #facc15',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 6px 18px rgba(234, 179, 8, 0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eab308', color: '#713f12', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}>
              <Trophy size={14} /> {t('highest_bid_wins_badge')}
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#713f12', margin: '8px 0 4px 0' }}>
              🌾 {lot.crop} ({lot.quantity_kg.toLocaleString()} kg)
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#854d0e', fontWeight: '600' }}>
              {t('highest_bidder')}: <strong>{highestBid.dealer}</strong> ({highestBid.location})
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: '#854d0e', fontWeight: '700' }}>{t('highest_bid')}</span>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#854d0e' }}>
              ₹{highestBid.amount.toFixed(2)} <span style={{ fontSize: '14px', fontWeight: 'bold' }}>/ kg</span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#15803d' }}>
              {t('total_lot_value')}: ₹{totalAuctionValue.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Award Button for Farmer */}
        {lot.status === 'ACTIVE' ? (
          <button
            type="button"
            onClick={handleAutoFinalize}
            style={{
              width: '100%',
              marginTop: '18px',
              background: '#7c3aed',
              color: 'white',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '15px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
            }}
          >
            <Gavel size={18} /> {t('award_highest_bidder')}
          </button>
        ) : (
          <div style={{
            marginTop: '18px',
            background: '#15803d',
            color: 'white',
            padding: '12px',
            borderRadius: '12px',
            textAlign: 'center',
            fontWeight: '800',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={18} /> {t('auction_ended_winner')}
          </div>
        )}
      </div>

      {/* Place New Dealer Bid (Interactive Simulator) */}
      {lot.status === 'ACTIVE' && (
        <div style={{
          background: 'white',
          borderRadius: '18px',
          padding: '20px',
          border: '1px solid #e7e5e4',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          marginBottom: '24px'
        }}>
          <h4 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 4px 0', color: '#1e293b' }}>
            ⚡ {t('place_dealer_bid')}
          </h4>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0' }}>
            {t('min_higher_bid_desc')} <strong>₹{(highestBid.amount + 1).toFixed(2)}/kg</strong>.
          </p>

          <form onSubmit={handlePlaceBid} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr auto', gap: '10px' }}>
            <input
              type="text"
              placeholder={t('dealer_name')}
              value={dealerNameInput}
              onChange={(e) => setDealerNameInput(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <input
              type="number"
              step="0.5"
              min={highestBid.amount + 0.5}
              placeholder={`Min. ₹${(highestBid.amount + 1).toFixed(2)}`}
              value={newBidAmount}
              onChange={(e) => setNewBidAmount(e.target.value)}
              required
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                fontWeight: '700',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#16a34a',
                color: 'white',
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: '800',
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {t('place_dealer_bid')}
            </button>
          </form>
        </div>
      )}

      {/* Live Bids History Table */}
      <div style={{
        background: 'white',
        borderRadius: '18px',
        padding: '22px',
        border: '1px solid #e7e5e4',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#1e293b' }}>
            📋 {t('live_bids_count')} ({bids.length})
          </h4>
          <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700' }}>
            {lot.status === 'ACTIVE' ? t('bidding_active') : t('bidding_closed')}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {bids.map((b, idx) => (
            <div
              key={b.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                background: b.isHighest ? '#fefce8' : '#f8fafc',
                border: b.isHighest ? '1.5px solid #facc15' : '1px solid #e2e8f0',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: b.isHighest ? '#eab308' : '#94a3b8',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '13px'
                }}>
                  {b.isHighest ? '👑' : `#${idx + 1}`}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
                    {b.dealer} {b.isHighest && <span style={{ color: '#ca8a04', fontSize: '11px' }}>({t('highest_bid_wins_badge')})</span>}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {b.location} • {b.time}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: '900', color: b.isHighest ? '#b45309' : '#334155' }}>
                  ₹{b.amount.toFixed(2)} / kg
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  ₹{(b.amount * lot.quantity_kg).toLocaleString('en-IN')} ({t('total_lot_value')})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
