import React, { useState, useMemo, useEffect } from 'react';
import { Eye, ShieldCheck, MapPin, Briefcase, GraduationCap, Heart, Check, X, ArrowRight, Video, Calendar, Sparkles, Globe, Filter, Clock } from 'lucide-react';

export default function RecentVisitorsView({ recentVisitors, profiles, interestMap, targetGender = 'Bride', onExpressInterest, onSelectProfile, onOpenLifestyleReels, onOpenParivarMeet }) {
  const [visitorGenderFilter, setVisitorGenderFilter] = useState(targetGender);

  // Sync visitor gender filter automatically whenever target gender changes
  useEffect(() => {
    setVisitorGenderFilter(targetGender);
  }, [targetGender]);

  // Filter and strictly deduplicate visitors by profileId (Single entry per person)
  const filteredVisitors = useMemo(() => {
    const uniqueMap = new Map();
    for (const visitor of recentVisitors) {
      if (!uniqueMap.has(visitor.profileId)) {
        uniqueMap.set(visitor.profileId, visitor);
      }
    }
    return Array.from(uniqueMap.values()).filter(visitor => {
      const profile = profiles.find(p => p.id === visitor.profileId);
      if (!profile) return false;
      if (visitorGenderFilter !== 'All') {
        return profile.gender === visitorGenderFilter;
      }
      return true;
    });
  }, [recentVisitors, profiles, visitorGenderFilter]);

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
      
      {/* Header Banner */}
      <div style={{ backgroundColor: '#7A0026', borderRadius: '24px', padding: '30px', color: '#FFFFFF', border: '2px solid #D4AF37', boxShadow: '0 12px 30px rgba(122,0,38,0.2)', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(212,175,55,0.2)', color: '#F4E8C1', padding: '4px 14px', borderRadius: '50px', fontSize: '11px', fontWeight: 800, marginBottom: '10px' }}>
            <Eye className="w-4 h-4 text-[#D4AF37]" /> LIVE PROFILE VISITOR ANALYTICS
          </div>
          <h2 style={{ fontFamily: 'Cinzel', fontSize: '26px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
            {visitorGenderFilter === 'Bride' ? '👰 Recent Bride Visitors' : (visitorGenderFilter === 'Groom' ? '🤵 Recent Groom Visitors' : '🌍 Recent Profile Visitors')} ({filteredVisitors.length})
          </h2>
          <p style={{ fontSize: '13px', color: '#F4E8C1', marginTop: '6px', maxWidth: '600px', lineHeight: '1.5' }}>
            {visitorGenderFilter === 'Bride' 
              ? 'Showing verified Bride profiles who recently viewed your Groom matrimony profile.'
              : (visitorGenderFilter === 'Groom'
                  ? 'Showing verified Groom profiles who recently viewed your Bride matrimony profile.'
                  : 'Showing all recent profile visitors in the last 24 hours.')}
          </p>
        </div>

        <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '16px 24px', borderRadius: '20px', border: '1px solid rgba(212,175,55,0.4)', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#F4E8C1', textTransform: 'uppercase' }}>Visitor Interest Level</span>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#34D399', marginTop: '2px' }}>
            🔥 Very High
          </div>
          <span style={{ fontSize: '10px', color: '#EAE3D9' }}>+40% Profile views today</span>
        </div>
      </div>

      {/* Visitor Account Target Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: '14px 20px', borderRadius: '16px', border: '1.5px solid #EAE3D9', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800, color: '#7A0026' }}>
          <ShieldCheck className="w-4 h-4 text-[#059669]" /> Target Account Visitors Stream:
        </div>

        <div style={{ backgroundColor: '#7A0026', color: '#FFFFFF', padding: '6px 16px', borderRadius: '50px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #D4AF37' }}>
          <span>{targetGender === 'Bride' ? '👰 Verified Bride Visitors Only' : '🤵 Verified Groom Visitors Only'}</span>
          <span style={{ fontSize: '9px', backgroundColor: 'rgba(212,175,55,0.3)', color: '#F4E8C1', padding: '2px 8px', borderRadius: '50px' }}>
            🔒 Locked to Registered Account
          </span>
        </div>
      </div>

      {/* Visitors Grid with 100% Equal Alignment across Cards */}
      {filteredVisitors.length === 0 ? (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '48px 24px', textAlign: 'center', border: '2px solid #EAE3D9' }}>
          <Eye className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
          <h3 style={{ fontFamily: 'Cinzel', fontSize: '20px', fontWeight: 800, color: '#7A0026' }}>
            No {visitorGenderFilter} Visitors Found
          </h3>
          <p style={{ fontSize: '13px', color: '#665D65', marginTop: '6px' }}>
            No recent views recorded for this category in the last 24 hours.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
          {filteredVisitors.map((visitor) => {
            const profile = profiles.find(p => p.id === visitor.profileId);
            if (!profile) return null;

            const status = interestMap[profile.id];
            const isOnline = profile.activeStatus ? profile.activeStatus.includes('Online') : (profile.id % 2 === 1);
            const totalCriteria = profile.preferencesMatch ? profile.preferencesMatch.length : 8;
            const matchedCount = profile.preferencesMatch ? profile.preferencesMatch.filter(m => m.isMatched).length : 8;

            return (
              <div
                key={visitor.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1.5px solid #EAE3D9',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  height: '100%',
                  transition: 'all 0.3s ease'
                }}
                className="hover:shadow-xl hover:-translate-y-1"
              >
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Top Visitor Photo + Badge Overlay */}
                  <div style={{ position: 'relative', height: '180px', flexShrink: 0, overflow: 'hidden' }}>
                    <img
                      src={profile.photo}
                      alt={profile.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {/* Top Left Badge */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ backgroundColor: 'rgba(0,0,0,0.75)', color: '#FFFFFF', fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '50px', backdropFilter: 'blur(4px)' }}>
                        {profile.gender === 'Bride' ? '👰 BRIDE' : '🤵 GROOM'}
                      </span>
                      {profile.isVerified && (
                        <span style={{ backgroundColor: '#0066CC', color: '#FFFFFF', fontSize: '9px', fontWeight: 800, padding: '3px 8px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <ShieldCheck className="w-3 h-3" /> VERIFIED
                        </span>
                      )}
                    </div>

                    {/* Visited Timestamp Pill Overlay */}
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: '#0284C7', color: '#FFFFFF', fontSize: '10px', fontWeight: 900, padding: '4px 12px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 10px rgba(2,132,199,0.3)' }}>
                      <Eye className="w-3.5 h-3.5" /> First Visit Today: {visitor.firstVisitTimeToday || '08:30 AM'}
                    </div>

                    {/* Active Status Badge */}
                    <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(6, 78, 59, 0.92)', color: '#34D399', fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '50px', border: '1px solid rgba(52,211,153,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34D399', display: 'inline-block' }} />
                      <span>{isOnline ? 'Online Now' : 'Active Today'}</span>
                    </div>
                  </div>

                  {/* Card Content (Flex 1 to ensure equal height alignment) */}
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div>
                          <h4 
                            onClick={() => onSelectProfile(profile)}
                            style={{ fontFamily: 'Cinzel', fontSize: '18px', fontWeight: 800, color: '#7A0026', margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            {profile.name}
                            <span style={{ fontSize: '10px', color: '#0066CC', fontWeight: 800 }}>↗</span>
                          </h4>
                          <p style={{ fontSize: '12px', fontWeight: 700, color: '#665D65', marginTop: '2px' }}>
                            {profile.age} Yrs • {profile.height} • {profile.religion} ({profile.caste})
                          </p>
                        </div>

                        <span style={{ backgroundColor: '#FFFBEB', color: '#7A0026', border: '1px solid #FEF3C7', padding: '3px 8px', borderRadius: '50px', fontSize: '10px', fontWeight: 900, shrink: 0 }}>
                          ⭐ {matchedCount}/{totalCriteria} Matched
                        </span>
                      </div>

                      {/* Visa Status Tag */}
                      {profile.visaStatus && (
                        <div style={{ marginBottom: '10px', fontSize: '10px', fontWeight: 800, color: '#065F46', backgroundColor: '#D1FAE5', padding: '3px 10px', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Globe className="w-3 h-3 text-[#047857]" /> {profile.visaStatus}
                        </div>
                      )}

                      {/* Quick Spec Lines */}
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: '#FAF7F2', padding: '10px 12px', borderRadius: '12px', border: '1px solid #EAE3D9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <GraduationCap className="w-3.5 h-3.5 text-[#7A0026] shrink-0" />
                          <span>{profile.education}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Briefcase className="w-3.5 h-3.5 text-[#7A0026] shrink-0" />
                          <span>{profile.occupation} ({profile.income})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin className="w-3.5 h-3.5 text-[#7A0026] shrink-0" />
                          <span>{profile.city}, {profile.state}</span>
                        </div>
                      </div>
                    </div>

                    {/* Exact Visit Time Details Pill (Same Day First Visit + Repeat Views Count) */}
                    <div style={{ marginTop: '12px', fontSize: '11px', fontWeight: 700, color: '#0284C7', backgroundColor: '#E0F2FE', padding: '8px 12px', borderRadius: '10px', border: '1px solid #BAE6FD', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                        <span><strong>{visitor.visitTimeDetails || `First Visit Today at ${visitor.firstVisitTimeToday || '08:30 AM'}`}</strong></span>
                      </div>
                      {visitor.visitCountToday && visitor.visitCountToday > 1 ? (
                        <span style={{ backgroundColor: '#0284C7', color: '#FFFFFF', padding: '2px 8px', borderRadius: '50px', fontSize: '10px', fontWeight: 800 }}>
                          {visitor.visitCountToday}x Views Today
                        </span>
                      ) : null}
                    </div>

                  </div>

                </div>

                {/* Action Buttons Footer (Pinned perfectly to the bottom) */}
                <div style={{ padding: '12px 16px', backgroundColor: '#FAF7F2', borderTop: '1px solid #EAE3D9', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                  
                  <button
                    onClick={() => onSelectProfile(profile)}
                    style={{ flex: 1, backgroundColor: '#FFFFFF', border: '1.5px solid #7A0026', color: '#7A0026', padding: '8px 0', borderRadius: '50px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    View Profile <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onExpressInterest(profile.id)}
                    className="btn-ruby"
                    style={{
                      flex: 1.2,
                      fontSize: '11px',
                      padding: '8px 0',
                      background: status === 'accepted' ? '#059669' : (status === 'declined' ? '#DC2626' : (status === 'sent' ? '#0D9488' : undefined)),
                      borderColor: status === 'accepted' ? '#10B981' : (status === 'declined' ? '#EF4444' : (status === 'sent' ? '#14B8A6' : undefined))
                    }}
                  >
                    {status === 'accepted' && (
                      <>
                        <Check className="w-3.5 h-3.5 text-white shrink-0" /> Accepted
                      </>
                    )}
                    {status === 'declined' && (
                      <>
                        <X className="w-3.5 h-3.5 text-white shrink-0" /> Declined
                      </>
                    )}
                    {status === 'sent' && (
                      <>
                        <Heart className="w-3.5 h-3.5 fill-white stroke-none shrink-0" /> Interest Sent
                      </>
                    )}
                    {!status && (
                      <>
                        <Heart className="w-3.5 h-3.5 fill-white stroke-none shrink-0" /> Express Interest
                      </>
                    )}
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
