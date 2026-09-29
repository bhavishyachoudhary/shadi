import React from 'react';
import { Heart, ShieldCheck, MapPin, Briefcase, GraduationCap, Sparkles, Lock,
  Bookmark, Check, ArrowRight, Video, Calendar, Globe, X, Star } from 'lucide-react';

export default function ProfileCard({
  profile, onSelectProfile, onExpressInterest,
  isInterested, interestStatus, isShortlisted, onToggleShortlist,
  onOpenLifestyleReels, onOpenParivarMeet
}) {
  const isOnline = profile.activeStatus
    ? profile.activeStatus.includes('Online')
    : profile.id % 3 !== 0;

  // Interest button config
  const interestConfig = {
    accepted: { bg: 'linear-gradient(135deg,#059669,#047857)', label: 'Interest Accepted', icon: <Check size={14} /> },
    declined:  { bg: 'linear-gradient(135deg,#DC2626,#B91C1C)', label: 'Interest Declined', icon: <X size={14} /> },
    sent:      { bg: 'linear-gradient(135deg,#0D9488,#0F766E)', label: 'Interest Sent ✓', icon: <Heart size={14} style={{ fill: '#fff' }} /> },
    default:   { bg: undefined, label: 'Express Interest', icon: <Heart size={14} style={{ fill: '#fff' }} /> },
  };
  const iCfg = interestConfig[interestStatus] || interestConfig.default;

  // Calculate 36 Gunas score based on profile rashi
  const gunaScore = (() => {
    if (!profile.rashi) return { score: 32, cat: 'Uttham' };
    let hash = 0;
    for (let i = 0; i < profile.rashi.length; i++) hash += profile.rashi.charCodeAt(i);
    const score = (hash % 8) + 28;
    return { score, cat: score >= 30 ? 'Uttham Match' : 'Madhyam Match' };
  })();

  return (
    <article className="profile-card-item" style={{ animationFillMode: 'both' }}>

      {/* ─── LEFT COLUMN: PHOTO + STATUS & REEL ACTION ─── */}
      <div className="card-left-panel">
        {/* Photo Box */}
        <div className="photo-box">
          <img
            src={profile.photo}
            alt={profile.name}
            className="photo-img"
            style={{ filter: profile.photoPrivacy === 'Protected' ? 'blur(10px) brightness(0.7)' : 'none' }}
          />

          {/* Photo protected overlay */}
          {profile.photoPrivacy === 'Protected' && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', zIndex: 5
            }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(212,175,55,.2)', border: '2px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', backdropFilter: 'blur(4px)' }}>
                <Lock size={20} style={{ color: '#D4AF37' }} />
              </div>
              <p style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.5px' }}>Photo Protected</p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,.7)', marginTop: '3px' }}>24h Timed Permission</p>
            </div>
          )}

          {/* Confidential watermark */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0.08, transform: 'rotate(-28deg)', fontSize: '9px', fontWeight: 900,
            color: '#FFFFFF', whiteSpace: 'nowrap', letterSpacing: '2px', zIndex: 6
          }}>
            BANDHAN MATRIMONY • CONFIDENTIAL
          </div>

          {/* Bookmark button */}
          <button
            onClick={e => { e.stopPropagation(); onToggleShortlist(profile.id); }}
            className="bookmark-btn"
            style={{ zIndex: 10, backgroundColor: isShortlisted ? '#D4AF37' : 'rgba(255,255,255,0.93)' }}
            title={isShortlisted ? 'Remove Shortlist' : 'Add to Shortlist'}
          >
            <Bookmark size={15} style={{ fill: isShortlisted ? '#1A0D00' : 'none', color: isShortlisted ? '#1A0D00' : '#374151' }} />
          </button>

          {/* Overall AI Match score badge — bottom left */}
          <div className="match-score-badge" style={{ zIndex: 10 }}>
            <Sparkles size={11} style={{ color: '#D4AF37' }} />
            <span style={{ color: '#D4AF37', fontWeight: 900 }}>{profile.matchScore}%</span>
            <span style={{ color: 'rgba(255,255,255,.8)' }}>AI Match</span>
          </div>

          {/* Score visual bar at bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', zIndex: 10,
            background: `linear-gradient(90deg, ${
              profile.matchScore >= 85 ? '#10B981' : profile.matchScore >= 70 ? '#D4AF37' : '#EF4444'
            } ${profile.matchScore}%, rgba(255,255,255,.15) 0%)`
          }} />
        </div>

        {/* Sub-photo Panel: Status Pills & Watch Reel */}
        <div className="sub-photo-panel">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center' }}>
            {profile.isVerified && (
              <span style={{
                background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE',
                padding: '3px 9px', borderRadius: '50px', fontSize: '10px', fontWeight: 800,
                display: 'inline-flex', alignItems: 'center', gap: '3px'
              }}>
                <ShieldCheck size={11} className="text-[#2563EB]" /> Verified
              </span>
            )}

            <span style={{
              background: isOnline ? '#ECFDF5' : '#F3F4F6',
              color: isOnline ? '#065F46' : '#4B5563',
              border: `1px solid ${isOnline ? '#A7F3D0' : '#E5E7EB'}`,
              padding: '3px 9px', borderRadius: '50px', fontSize: '10px', fontWeight: 800,
              display: 'inline-flex', alignItems: 'center', gap: '4px'
            }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                backgroundColor: isOnline ? '#10B981' : '#9CA3AF',
                display: 'inline-block'
              }} />
              {isOnline ? 'Online' : 'Active'}
            </span>

            {profile.isNri && (
              <span style={{
                background: '#F3E8FF', color: '#6B21A8', border: '1px solid #DDD6FE',
                padding: '3px 9px', borderRadius: '50px', fontSize: '10px', fontWeight: 800
              }}>
                ✈️ NRI
              </span>
            )}
          </div>

          {/* Watch Reel Button (under photo) */}
          {profile.lifestyleVideo && (
            <button
              onClick={e => { e.stopPropagation(); onOpenLifestyleReels(profile); }}
              style={{
                width: '100%', marginTop: '6px',
                background: 'linear-gradient(135deg, #7A0026, #A8003A)',
                color: '#FFF9F0', padding: '7px 12px', borderRadius: '50px',
                fontSize: '11px', fontWeight: 800, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                boxShadow: '0 2px 8px rgba(122,0,38,0.2)', transition: 'transform 0.15s'
              }}
            >
              <Video size={13} style={{ color: '#D4AF37' }} /> Watch Reel
            </button>
          )}
        </div>
      </div>

      {/* ─── RIGHT COLUMN: DETAILS & 36 GUNAS MATCH BANNER ─── */}
      <div className="details-box">
        <div>
          {/* Header Row: Name & Parivar Meet Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 onClick={() => onSelectProfile(profile)} className="profile-name">
                {profile.name}
              </h3>
              <p className="profile-meta-text">
                {profile.age} Yrs • {profile.height} • {profile.religion} ({profile.caste})
              </p>

              {/* Distance Proximity & Radius Plan Badge */}
              {profile.minDistance !== undefined && (
                <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {profile.isInRadius ? (
                    <span style={{
                      background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0',
                      padding: '2px 10px', borderRadius: '50px', fontSize: '10px', fontWeight: 900,
                      display: 'inline-flex', alignItems: 'center', gap: '4px'
                    }}>
                      📍 {profile.minDistance === 0 ? 'Exact Center Location' : `${profile.minDistance} km from ${profile.nearestCenterName}`}
                    </span>
                  ) : (
                    <span style={{
                      background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', color: '#78350F', border: '1.5px solid #D4AF37',
                      padding: '2px 10px', borderRadius: '50px', fontSize: '10px', fontWeight: 900,
                      display: 'inline-flex', alignItems: 'center', gap: '4px'
                    }}>
                      🔒 {profile.minDistance} km Out of Radius • Pan-India Match Plan
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => onOpenParivarMeet(profile)}
              style={{
                flexShrink: 0,
                background: '#FFFBEB', border: '1.5px solid #D4AF37',
                color: '#7A0026', fontSize: '11px', fontWeight: 900,
                padding: '6px 13px', borderRadius: '50px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '5px',
                boxShadow: '0 2px 8px rgba(212,175,55,.25)'
              }}
            >
              <Calendar size={12} /> Parivar Meet
            </button>
          </div>

          {/* Visa Status Pill */}
          {profile.visaStatus && (
            <div style={{ marginTop: '8px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: '#F0FDF4', color: '#065F46', padding: '3px 12px',
                borderRadius: '50px', fontSize: '10px', fontWeight: 800,
                border: '1px solid #86EFAC'
              }}>
                <Globe size={10} style={{ color: '#10B981' }} /> {profile.visaStatus}
              </span>
            </div>
          )}

          {/* 🌟 ELEGANT 36 GUNAS KUNDALI COMPATIBILITY BAR 🌟 */}
          <div style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FFF4D9 100%)',
            border: '1.5px solid #D4AF37',
            borderRadius: '12px',
            padding: '8px 14px',
            margin: '12px 0',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            gap: '10px',
            boxShadow: '0 2px 8px rgba(212,175,55,0.18)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: '#D4AF37', flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '11px', fontWeight: 900, color: '#7A0026', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                  36 Gunas Kundali Score:
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#92400E', marginLeft: '6px' }}>
                  {gunaScore.cat}
                </span>
              </div>
            </div>

            <div style={{
              background: '#7A0026', color: '#F4E8C1',
              padding: '3px 12px', borderRadius: '50px',
              fontSize: '12px', fontWeight: 900, flexShrink: 0,
              border: '1px solid #D4AF37',
              boxShadow: '0 2px 6px rgba(122,0,38,0.2)'
            }}>
              ✨ {gunaScore.score} / 36 Gunas
            </div>
          </div>

          {/* Clean Particulars Grid */}
          <div className="specs-grid-box">
            <div className="spec-item">
              <GraduationCap size={14} style={{ color: '#7A0026', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.education}</span>
            </div>
            <div className="spec-item">
              <Briefcase size={14} style={{ color: '#7A0026', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.occupation}</span>
            </div>
            <div className="spec-item">
              <MapPin size={14} style={{ color: '#7A0026', flexShrink: 0 }} />
              <span>{profile.city}, {profile.state}</span>
            </div>
            <div className="spec-item">
              <Sparkles size={14} style={{ color: '#D4AF37', flexShrink: 0 }} />
              <span>Rashi: {profile.rashi} • {profile.manglik === 'No' ? 'Non-Manglik' : 'Manglik'}</span>
            </div>
          </div>

          {/* Income Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '10px 0' }}>
            <span style={{ background: '#FFF9F0', border: '1px solid #FDE68A', padding: '3px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 800, color: '#92400E' }}>
              💼 {profile.income}
            </span>
            {profile.family?.familyIncome && (
              <span style={{ background: '#F0FDF4', border: '1px solid #86EFAC', padding: '3px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 800, color: '#065F46' }}>
                🏰 Family: {profile.family.familyIncome}
              </span>
            )}
          </div>

          {/* Bio Snippet */}
          <p className="bio-text-snippet">"{profile.about}"</p>
        </div>

        {/* ─── Card Actions Footer ─── */}
        <div className="card-footer-actions">
          {/* Left: Full Bio link */}
          <button
            onClick={() => onSelectProfile(profile)}
            style={{
              background: 'none', border: 'none', color: '#7A0026',
              fontSize: '12px', fontWeight: 800, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '6px 0', transition: 'gap .2s'
            }}
          >
            Full Bio & AI Verdict <ArrowRight size={14} />
          </button>

          {/* Right: Interest button */}
          <button
            onClick={() => onExpressInterest(profile.id)}
            className="btn-ruby"
            style={{
              fontSize: '12px', padding: '8px 18px',
              background: iCfg.bg,
            }}
          >
            {iCfg.icon} {iCfg.label}
          </button>
        </div>
      </div>
    </article>
  );
}
