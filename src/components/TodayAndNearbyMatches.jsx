import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MapPin, CheckCircle2, Heart, Check, X, ArrowRight, ShieldCheck, Globe, GraduationCap, Briefcase, ChevronRight, ChevronLeft, Eye, Target } from 'lucide-react';

export default function TodayAndNearbyMatches({ profiles, filters, interestMap, onSelectProfile, onExpressInterest, onOpenLifestyleReels, onOpenParivarMeet }) {
  const [activeSectionTab, setActiveSectionTab] = useState('today'); // 'today' | 'nearby' | 'both'
  
  // Today's matches scroll state
  const todayScrollRef = useRef(null);
  const [todayViewedCount, setTodayViewedCount] = useState(1);
  const [isTodayCompleted, setIsTodayCompleted] = useState(false);

  // Nearby matches scroll state
  const nearbyScrollRef = useRef(null);
  const [nearbyViewedCount, setNearbyViewedCount] = useState(1);
  const [isNearbyCompleted, setIsNearbyCompleted] = useState(false);

  // Filter today's matches based on active gender and high match score / preferences
  const todayMatches = React.useMemo(() => {
    return profiles.filter(p => {
      if (filters.gender !== 'All' && p.gender !== filters.gender) return false;
      return (p.matchScore && p.matchScore >= 88) || (p.preferencesMatch && p.preferencesMatch.length >= 7);
    });
  }, [profiles, filters.gender]);

  // Filter nearby matches based on city proximity / regional matching
  const nearbyMatches = React.useMemo(() => {
    return profiles.filter(p => {
      if (filters.gender !== 'All' && p.gender !== filters.gender) return false;
      // Filter nearby cities or regional matches (Delhi NCR, Bengaluru, Mumbai, or NRI)
      return p.city || p.mapArea;
    });
  }, [profiles, filters.gender]);

  // Scroll handler for Today's Matches list
  const handleTodayScroll = () => {
    const el = todayScrollRef.current;
    if (!el || todayMatches.length === 0) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const scrollPercent = scrollLeft / (scrollWidth - clientWidth || 1);
    const itemWidth = 320; // approximate card width + gap
    const estimatedIndex = Math.min(
      todayMatches.length,
      Math.max(1, Math.ceil((scrollLeft + clientWidth * 0.5) / itemWidth))
    );

    setTodayViewedCount(estimatedIndex);

    // Detect if user completed scrolling the entire list
    if (scrollLeft + clientWidth >= scrollWidth - 25) {
      setIsTodayCompleted(true);
      setTodayViewedCount(todayMatches.length);
    }
  };

  // Scroll handler for Nearby Matches list
  const handleNearbyScroll = () => {
    const el = nearbyScrollRef.current;
    if (!el || nearbyMatches.length === 0) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const itemWidth = 320;
    const estimatedIndex = Math.min(
      nearbyMatches.length,
      Math.max(1, Math.ceil((scrollLeft + clientWidth * 0.5) / itemWidth))
    );

    setNearbyViewedCount(estimatedIndex);

    // Detect if user completed scrolling the entire list
    if (scrollLeft + clientWidth >= scrollWidth - 25) {
      setIsNearbyCompleted(true);
      setNearbyViewedCount(nearbyMatches.length);
    }
  };

  // Smooth scroll buttons helpers
  const scrollLeft = (ref) => {
    if (ref.current) ref.current.scrollBy({ left: -340, behavior: 'smooth' });
  };
  const scrollRight = (ref) => {
    if (ref.current) ref.current.scrollBy({ left: 340, behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '2px solid #EAE3D9', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', padding: '24px', marginBottom: '32px' }}>
      
      {/* Top Title & Tab Switcher Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #EAE3D9' }}>
        
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFBEB', color: '#7A0026', border: '1px solid #FEF3C7', padding: '4px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 800, marginBottom: '6px' }}>
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> AI PREFERENCE & GEOGRAPHIC MATCH STREAM
          </div>
          <h3 style={{ fontFamily: 'Cinzel', fontSize: '22px', fontWeight: 800, color: '#7A0026', margin: 0 }}>
            Curated Match Feeds ({filters.gender === 'Bride' ? '👰 Brides' : (filters.gender === 'Groom' ? '🤵 Grooms' : 'Profiles')})
          </h3>
        </div>

        {/* Tab Selection Switcher */}
        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#FAF7F2', padding: '4px', borderRadius: '50px', border: '1px solid #EAE3D9' }}>
          <button
            onClick={() => setActiveSectionTab('today')}
            style={{
              padding: '6px 16px',
              borderRadius: '50px',
              fontSize: '12px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeSectionTab === 'today' ? '#7A0026' : 'transparent',
              color: activeSectionTab === 'today' ? '#FFFFFF' : '#665D65',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Target className="w-3.5 h-3.5 text-[#D4AF37]" />
            Today's Matches ({todayMatches.length})
          </button>

          <button
            onClick={() => setActiveSectionTab('nearby')}
            style={{
              padding: '6px 16px',
              borderRadius: '50px',
              fontSize: '12px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeSectionTab === 'nearby' ? '#7A0026' : 'transparent',
              color: activeSectionTab === 'nearby' ? '#FFFFFF' : '#665D65',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            Nearby Matches ({nearbyMatches.length})
          </button>

          <button
            onClick={() => setActiveSectionTab('both')}
            style={{
              padding: '6px 16px',
              borderRadius: '50px',
              fontSize: '12px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeSectionTab === 'both' ? '#1F191D' : 'transparent',
              color: activeSectionTab === 'both' ? '#FFFFFF' : '#665D65'
            }}
          >
            View Both Lists
          </button>
        </div>

      </div>

      {/* SECTION 1: TODAY'S PREFERENCE MATCHES CAROUSEL */}
      {(activeSectionTab === 'today' || activeSectionTab === 'both') && (
        <div style={{ marginBottom: activeSectionTab === 'both' ? '32px' : 0 }}>
          
          {/* Today Header & Dynamic Scroll Counter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ backgroundColor: '#7A0026', color: '#FFFFFF', padding: '6px', borderRadius: '10px' }}>
                <Target className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div>
                <h4 style={{ fontFamily: 'Cinzel', fontSize: '17px', fontWeight: 800, color: '#7A0026', margin: 0 }}>
                  Today's Top Preference Matches
                </h4>
                <p style={{ fontSize: '11px', color: '#665D65', margin: 0 }}>
                  Fresh high-compatibility profiles based on your lifestyle, horoscope, and education preferences
                </p>
              </div>
            </div>

            {/* Dynamic Scroll Completion Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                backgroundColor: isTodayCompleted ? '#D1FAE5' : '#FEF3C7',
                color: isTodayCompleted ? '#065F46' : '#92400E',
                border: `1px solid ${isTodayCompleted ? '#A7F3D0' : '#FDE68A'}`,
                padding: '5px 14px',
                borderRadius: '50px',
                fontSize: '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {isTodayCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                    🎉 Completed Scroll ({todayMatches.length} / {todayMatches.length} Viewed)
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-[#D97706]" />
                    Viewed {todayViewedCount} of {todayMatches.length} Today's Matches
                  </>
                )}
              </div>

              {/* Scroll Nav Buttons */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => scrollLeft(todayScrollRef)}
                  style={{ backgroundColor: '#FAF7F2', border: '1px solid #EAE3D9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <ChevronLeft className="w-4 h-4 text-[#7A0026]" />
                </button>
                <button
                  onClick={() => scrollRight(todayScrollRef)}
                  style={{ backgroundColor: '#FAF7F2', border: '1px solid #EAE3D9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <ChevronRight className="w-4 h-4 text-[#7A0026]" />
                </button>
              </div>
            </div>

          </div>

          {/* Today Scrollable List */}
          <div
            ref={todayScrollRef}
            onScroll={handleTodayScroll}
            style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              paddingBottom: '12px',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'thin'
            }}
          >
            {todayMatches.map((profile) => {
              const status = interestMap[profile.id];
              return (
                <div
                  key={profile.id}
                  style={{
                    minWidth: '310px',
                    maxWidth: '310px',
                    backgroundColor: '#FAF7F2',
                    borderRadius: '20px',
                    border: '1.5px solid #EAE3D9',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    flexShrink: 0
                  }}
                >
                  <div>
                    {/* Photo + Overlay */}
                    <div style={{ position: 'relative', height: '160px' }}>
                      <img src={profile.photo} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#7A0026', color: '#D4AF37', fontSize: '10px', fontWeight: 900, padding: '3px 10px', borderRadius: '50px', border: '1px solid #D4AF37' }}>
                        🎯 {profile.matchScore}% PREFERENCE MATCH
                      </div>
                      <div style={{ position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(0,0,0,0.75)', color: '#FFFFFF', fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '50px' }}>
                        {profile.city}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '14px' }}>
                      <h5
                        onClick={() => onSelectProfile(profile)}
                        style={{ fontFamily: 'Cinzel', fontSize: '16px', fontWeight: 800, color: '#7A0026', margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        {profile.name} ↗
                      </h5>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: '#665D65', marginTop: '2px', marginBottom: '8px' }}>
                        {profile.age} Yrs • {profile.height} • {profile.religion}
                      </p>

                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#374151', backgroundColor: '#FFFFFF', padding: '8px', borderRadius: '10px', border: '1px solid #EAE3D9', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <GraduationCap className="w-3 h-3 text-[#7A0026]" />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.education}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Briefcase className="w-3 h-3 text-[#7A0026]" />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.occupation}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ padding: '10px 14px', backgroundColor: '#FFFFFF', borderTop: '1px solid #EAE3D9', display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => onSelectProfile(profile)}
                      style={{ flex: 1, backgroundColor: '#FAF7F2', border: '1px solid #7A0026', color: '#7A0026', padding: '6px 0', borderRadius: '50px', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Full Profile
                    </button>
                    <button
                      onClick={() => onExpressInterest(profile.id)}
                      className="btn-ruby"
                      style={{
                        flex: 1.2,
                        fontSize: '10px',
                        padding: '6px 0',
                        background: status === 'accepted' ? '#059669' : (status === 'declined' ? '#DC2626' : (status === 'sent' ? '#0D9488' : undefined))
                      }}
                    >
                      {status === 'accepted' ? '✅ Accepted' : (status === 'sent' ? '❤️ Sent' : '❤️ Express Interest')}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* SECTION 2: NEARBY MATCHES CAROUSEL */}
      {(activeSectionTab === 'nearby' || activeSectionTab === 'both') && (
        <div>
          
          {/* Nearby Header & Dynamic Scroll Counter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ backgroundColor: '#0284C7', color: '#FFFFFF', padding: '6px', borderRadius: '10px' }}>
                <MapPin className="w-4 h-4 text-[#FFFFFF]" />
              </div>
              <div>
                <h4 style={{ fontFamily: 'Cinzel', fontSize: '17px', fontWeight: 800, color: '#7A0026', margin: 0 }}>
                  Nearby Location Matches
                </h4>
                <p style={{ fontSize: '11px', color: '#665D65', margin: 0 }}>
                  Profiles residing in your city or surrounding geographic distance radius
                </p>
              </div>
            </div>

            {/* Dynamic Scroll Completion Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                backgroundColor: isNearbyCompleted ? '#D1FAE5' : '#E0F2FE',
                color: isNearbyCompleted ? '#065F46' : '#0369A1',
                border: `1px solid ${isNearbyCompleted ? '#A7F3D0' : '#BAE6FD'}`,
                padding: '5px 14px',
                borderRadius: '50px',
                fontSize: '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {isNearbyCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                    🎉 Completed Scroll ({nearbyMatches.length} / {nearbyMatches.length} Explored)
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-[#0284C7]" />
                    Explored {nearbyViewedCount} of {nearbyMatches.length} Nearby Matches
                  </>
                )}
              </div>

              {/* Scroll Nav Buttons */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => scrollLeft(nearbyScrollRef)}
                  style={{ backgroundColor: '#FAF7F2', border: '1px solid #EAE3D9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <ChevronLeft className="w-4 h-4 text-[#7A0026]" />
                </button>
                <button
                  onClick={() => scrollRight(nearbyScrollRef)}
                  style={{ backgroundColor: '#FAF7F2', border: '1px solid #EAE3D9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <ChevronRight className="w-4 h-4 text-[#7A0026]" />
                </button>
              </div>
            </div>

          </div>

          {/* Nearby Scrollable List */}
          <div
            ref={nearbyScrollRef}
            onScroll={handleNearbyScroll}
            style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              paddingBottom: '12px',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'thin'
            }}
          >
            {nearbyMatches.map((profile) => {
              const status = interestMap[profile.id];
              return (
                <div
                  key={profile.id}
                  style={{
                    minWidth: '310px',
                    maxWidth: '310px',
                    backgroundColor: '#FAF7F2',
                    borderRadius: '20px',
                    border: '1.5px solid #BAE6FD',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 15px rgba(2,132,199,0.06)',
                    flexShrink: 0
                  }}
                >
                  <div>
                    {/* Photo + Overlay */}
                    <div style={{ position: 'relative', height: '160px' }}>
                      <img src={profile.photo} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#0284C7', color: '#FFFFFF', fontSize: '10px', fontWeight: 900, padding: '3px 10px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin className="w-3 h-3 text-white" /> {profile.city}, {profile.state}
                      </div>
                      {profile.visaStatus && (
                        <div style={{ position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(0,0,0,0.8)', color: '#34D399', fontSize: '9px', fontWeight: 800, padding: '3px 8px', borderRadius: '50px' }}>
                          {profile.visaStatus}
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '14px' }}>
                      <h5
                        onClick={() => onSelectProfile(profile)}
                        style={{ fontFamily: 'Cinzel', fontSize: '16px', fontWeight: 800, color: '#7A0026', margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        {profile.name} ↗
                      </h5>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: '#665D65', marginTop: '2px', marginBottom: '8px' }}>
                        {profile.age} Yrs • {profile.height} • {profile.religion} ({profile.caste})
                      </p>

                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#374151', backgroundColor: '#FFFFFF', padding: '8px', borderRadius: '10px', border: '1px solid #BAE6FD', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Briefcase className="w-3 h-3 text-[#0284C7]" />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.occupation} ({profile.income})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Globe className="w-3 h-3 text-[#0284C7]" />
                          <span>Area: {profile.mapArea || profile.city}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ padding: '10px 14px', backgroundColor: '#FFFFFF', borderTop: '1px solid #BAE6FD', display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => onSelectProfile(profile)}
                      style={{ flex: 1, backgroundColor: '#FAF7F2', border: '1px solid #0284C7', color: '#0284C7', padding: '6px 0', borderRadius: '50px', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Full Profile
                    </button>
                    <button
                      onClick={() => onExpressInterest(profile.id)}
                      className="btn-ruby"
                      style={{
                        flex: 1.2,
                        fontSize: '10px',
                        padding: '6px 0',
                        background: status === 'accepted' ? '#059669' : (status === 'declined' ? '#DC2626' : (status === 'sent' ? '#0D9488' : undefined))
                      }}
                    >
                      {status === 'accepted' ? '✅ Accepted' : (status === 'sent' ? '❤️ Sent' : '❤️ Express Interest')}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
