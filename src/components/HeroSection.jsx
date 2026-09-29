import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, HeartHandshake, Sparkles, Crown, Globe, Users, Star } from 'lucide-react';

// Animated counter hook
function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

// Journey steps data
const JOURNEY_STEPS = [
  { num: '1', title: 'Sign Up', text: 'Create your free account in 2 min' },
  { num: '2', title: 'Build Profile', text: 'Add photos, kundali & lifestyle' },
  { num: '3', title: 'Smart Search', text: 'Filter by religion, city, income' },
  { num: '4', title: 'AI Match', text: 'Get 15-dimension compatibility' },
  { num: '5', title: 'Connect', text: 'Chat, video call, share biodata' },
  { num: '6', title: 'Shaadi Mubarak', text: 'Your forever begins here 💍' },
];

export default function HeroSection({ searchFilters, setSearchFilters, onSearchSubmit }) {
  const profiles = useCounter(24_680, 2200);
  const matches  = useCounter(12_450, 1800);
  const weddings = useCounter(3_820, 1600);

  return (
    <>
      {/* ── HERO BANNER ── */}
      <section className="hero-banner-section">
        <div className="hero-banner-container">

          {/* ── 2-COLUMN HERO SPLIT (TEXT + LUXURY WEDDING COUPLE PORTRAIT) ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'center',
            marginBottom: '40px',
            textAlign: 'left'
          }}>

            {/* Left Side: Headline & Live Stats */}
            <div>
              <div className="hero-tag-badge" style={{ animationDelay: '0.1s' }}>
                <Sparkles size={13} style={{ color: '#D4AF37' }} />
                India's #1 Most Trusted Matrimonial Network • Est. 2009
              </div>

              <h1 className="hero-main-title animate-float-up" style={{ animationDelay: '0.15s' }}>
                Find Your Forever Partner<br />
                <span className="gold-text">with Trust & Sacred Dignity</span>
              </h1>

              <p className="hero-sub-text animate-float-up" style={{ animationDelay: '0.22s', margin: '0 0 28px' }}>
                100% verified Brides & Grooms curated by family values, Kundali compatibility,
                education, and lifestyle — powered by Gemini AI.
              </p>

              {/* Live Stats Row */}
              <div className="animate-float-up" style={{
                display: 'flex', gap: '28px', flexWrap: 'wrap', animationDelay: '0.28s'
              }}>
                {[
                  { num: profiles.toLocaleString() + '+', label: 'Verified Profiles' },
                  { num: matches.toLocaleString() + '+', label: 'Successful Matches' },
                  { num: weddings.toLocaleString() + '+', label: 'Happy Weddings' },
                ].map(({ num, label }) => (
                  <div key={label}>
                    <div style={{ fontFamily: 'Cinzel', fontSize: '28px', fontWeight: 900, color: '#D4AF37', lineHeight: 1 }}>
                      {num}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(244,232,193,0.75)', fontWeight: 600, marginTop: '4px', letterSpacing: '.5px' }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Royal Arched Portrait of Wedding Couple */}
            <div className="animate-float-up" style={{ position: 'relative', display: 'flex', justifyContent: 'center', animationDelay: '0.25s' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                height: '440px',
                borderRadius: '180px 180px 24px 24px',
                overflow: 'hidden',
                border: '3px solid #D4AF37',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(212,175,55,0.3)',
                background: 'linear-gradient(180deg, #7A0026 0%, #3D0015 100%)'
              }}>
                <img
                  src="/images/hero_wedding_couple.png"
                  alt="Royal Indian Wedding Couple"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                />

                {/* Floating Badge 1 - Verified */}
                <div style={{
                  position: 'absolute', top: '20px', left: '16px',
                  background: 'rgba(15, 23, 42, 0.88)', backdropFilter: 'blur(8px)',
                  border: '1px solid #D4AF37', borderRadius: '50px',
                  padding: '6px 14px', color: '#F4E8C1', fontSize: '11px', fontWeight: 900,
                  display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.35)'
                }}>
                  <ShieldCheck size={14} style={{ color: '#D4AF37' }} /> 100% Aadhaar Verified
                </div>

                {/* Floating Badge 2 - Kundali & AI Match */}
                <div style={{
                  position: 'absolute', bottom: '20px', right: '16px',
                  background: 'rgba(122, 0, 38, 0.92)', backdropFilter: 'blur(8px)',
                  border: '1px solid #D4AF37', borderRadius: '50px',
                  padding: '7px 16px', color: '#FFFFFF', fontSize: '11px', fontWeight: 900,
                  display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
                }}>
                  <Sparkles size={14} style={{ color: '#D4AF37' }} /> Kundali & Gemini AI Match
                </div>
              </div>
            </div>

          </div>

          {/* ── Quick Search Card ── */}
          <div className="search-card-box animate-float-up" style={{ animationDelay: '0.3s' }}>

            {/* Card Header */}
            <div className="search-card-header">
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px',
                background: 'linear-gradient(135deg,#7A0026,#A8003A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Crown size={14} style={{ color: '#D4AF37' }} />
              </div>
              Quick Match Finder
              <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 700, color: '#10B981', background: '#ECFDF5', padding: '3px 10px', borderRadius: '50px', border: '1px solid #86EFAC' }}>
                ✦ AI-Powered
              </span>
            </div>

            {/* Filter Grid */}
            <div className="search-grid-container">

              {/* 1. Looking for */}
              <div className="field-group">
                <label className="field-label">
                  <span style={{ fontSize: '14px' }}>🎯</span> I am looking for
                </label>
                <select
                  value={searchFilters.gender}
                  disabled
                  className="custom-select"
                  style={{ background: '#FFFBEB', borderColor: '#FDE68A', color: '#7A0026', fontWeight: 900, cursor: 'not-allowed' }}
                >
                  {searchFilters.gender === 'Bride'
                    ? <option value="Bride">👰 Bride (Female Profiles)</option>
                    : <option value="Groom">🤵 Groom (Male Profiles)</option>
                  }
                </select>
                <span style={{ fontSize: '9px', color: '#D4AF37', fontWeight: 700, marginTop: '-4px' }}>
                  🔒 Set by your gender at signup
                </span>
              </div>

              {/* 2. Religion */}
              <div className="field-group">
                <label className="field-label"><span style={{ fontSize: '14px' }}>🛕</span> Religion</label>
                <select value={searchFilters.religion}
                  onChange={e => setSearchFilters({ ...searchFilters, religion: e.target.value })}
                  className="custom-select">
                  <option value="All">All Religions</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Christian">Christian</option>
                  <option value="Jain">Jain</option>
                  <option value="Buddhist">Buddhist</option>
                </select>
              </div>

              {/* 3. Mother Tongue */}
              <div className="field-group">
                <label className="field-label"><span style={{ fontSize: '14px' }}>🗣️</span> Mother Tongue</label>
                <select value={searchFilters.motherTongue}
                  onChange={e => setSearchFilters({ ...searchFilters, motherTongue: e.target.value })}
                  className="custom-select">
                  <option value="All">All Languages</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Kannada">Kannada</option>
                </select>
              </div>

              {/* 4. City */}
              <div className="field-group">
                <label className="field-label"><span style={{ fontSize: '14px' }}>📍</span> Location / NRI</label>
                <select value={searchFilters.city}
                  onChange={e => setSearchFilters({ ...searchFilters, city: e.target.value })}
                  className="custom-select">
                  <option value="All">🌍 Any Location / NRI</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="New Delhi">New Delhi / NCR</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Pune">Pune</option>
                  <option value="NRI USA">NRI (USA / UK / Dubai)</option>
                </select>
              </div>
            </div>

            {/* Trust Row + CTA */}
            <div className="search-card-footer">
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {[
                  { icon: ShieldCheck, color: '#0284C7', label: '100% Aadhaar Verified' },
                  { icon: HeartHandshake, color: '#7A0026', label: 'Photo Privacy Control' },
                  { icon: Globe, color: '#059669', label: 'NRI Profiles Available' },
                ].map(({ icon: Icon, color, label }) => (
                  <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>
                    <Icon size={15} style={{ color }} /> {label}
                  </span>
                ))}
              </div>
              <button onClick={onSearchSubmit} className="btn-ruby" style={{ fontSize: '14px', padding: '13px 32px' }}>
                <Search size={16} /> Find My Match
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── JOURNEY STEPS BAR ── */}
      <section className="journey-steps-bar">
        <div className="journey-steps-inner">
          {JOURNEY_STEPS.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div className="journey-step">
                <div className="journey-step-num">{step.num}</div>
                <div>
                  <span className="journey-step-title">{step.title}</span>
                  <span className="journey-step-text">{step.text}</span>
                </div>
              </div>
              {idx < JOURNEY_STEPS.length - 1 && (
                <div className="journey-step-arrow">›</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>
    </>
  );
}
