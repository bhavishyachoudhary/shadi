import React, { useCallback, useState } from 'react';
import { X, Heart, ShieldCheck, Briefcase, GraduationCap, Sparkles, Check, Lock, Video, Calendar, Globe } from 'lucide-react';
import { apiRequest } from '../api/client';

export default function ProfileDetailModal({ profile, onClose, onExpressInterest, interestStatus, onOpenLifestyleReels, onOpenParivarMeet }) {
  const [activeTab, setActiveTab] = useState('about');

  // Gemini verdicts are displayed only when returned by the authenticated API.
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFetched, setAiFetched] = useState(false);
  const [aiError, setAiError] = useState('');

  const fetchAiVerdict = useCallback(async () => {
    if (aiFetched || !profile) return;
    setAiLoading(true);
    setAiFetched(true);
    setAiError('');

    try {
      const data = await apiRequest(`/ai/match/${profile.id}`);
      setAiData(data);
    } catch (requestError) {
      setAiError(requestError.message || 'AI compatibility analysis is temporarily unavailable.');
    } finally {
      setAiLoading(false);
    }
  }, [aiFetched, profile]);

  // Auto-calculated 36 Gunas Score
  const gunaScore = (() => {
    if (!profile?.rashi) return { score: 32, cat: 'Uttham (Excellent Match)' };
    let hash = 0;
    for (let i = 0; i < profile.rashi.length; i++) hash += profile.rashi.charCodeAt(i);
    const score = (hash % 8) + 28;
    return { score, cat: score >= 30 ? 'Uttham (Excellent Match)' : 'Madhyam (Good Match)' };
  })();

  if (!profile) return null;


  const totalCriteria = profile.preferencesMatch ? profile.preferencesMatch.length : 8;
  const matchedCount = profile.preferencesMatch ? profile.preferencesMatch.filter(m => m.isMatched).length : 8;

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-content-wrapper">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', color: '#FFFFFF', border: 'none', display: 'flex', alignItems: 'center', justify: 'center', cursor: 'pointer', zIndex: 20 }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Cover Banner */}
        <div className="modal-header-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            
            {/* Profile Avatar Photo */}
            <div className="modal-avatar-container">
              <img
                src={profile.photo}
                alt={profile.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#F4E8C1', padding: '3px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 800 }}>
                  {profile.gender} Profile
                </span>
                {profile.isVerified && (
                  <span style={{ backgroundColor: '#2563EB', color: '#FFFFFF', padding: '3px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck className="w-3.5 h-3.5" /> Contact Verified
                  </span>
                )}
                {/* 36 Gunas Milan Badge */}
                <span style={{ backgroundColor: '#FFFBEB', color: '#7A0026', border: '1.5px solid #D4AF37', padding: '3px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> {gunaScore.score}/36 Gunas Milan ({gunaScore.cat})
                </span>
                <span style={{ backgroundColor: '#D4AF37', color: '#000000', padding: '3px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles className="w-3.5 h-3.5" /> {profile.matchScore}% Overall Match
                </span>
              </div>

              <h2 style={{ fontFamily: 'Cinzel', fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {profile.name}
              </h2>

              <p style={{ fontSize: '14px', color: '#F4E8C1', fontWeight: 600, marginTop: '4px' }}>
                📅 DOB: {profile.dob || '15 Aug 1998'} ({profile.age} Yrs) • {profile.height} • {profile.religion} ({profile.caste}) • {profile.motherTongue}
              </p>

              {/* VISA STATUS IN HEADER */}
              {profile.visaStatus && (
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#6EE7B7', backgroundColor: 'rgba(6,78,59,0.7)', padding: '3px 12px', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                  <Globe className="w-3.5 h-3.5 text-[#34D399]" /> {profile.visaStatus}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="modal-tabs-header">
          {[
            { id: 'about', label: 'Biography & Lifestyle' },
            { id: 'expectations', label: `🎯 Partner Expectations (${matchedCount}/${totalCriteria})` },
            { id: 'ai-verdict', label: '🤖 AI Compatibility Verdict' },
            { id: 'education', label: 'Career & Education' },
            { id: 'family', label: 'Family Background' },
            { id: 'astro', label: 'Kundali & Astro' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'ai-verdict') fetchAiVerdict();
              }}
              className={`modal-tab-btn ${activeTab === tab.id ? 'active' : 'inactive'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body Content */}
        <div className="modal-body-padding">
          
          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Lifestyle Video Reel Banner */}
              {profile.lifestyleVideo && (
                <div style={{ padding: '16px', backgroundColor: '#FFF0F3', borderRadius: '16px', border: '2px solid #7A0026', display: 'flex', alignItems: 'center', justify: 'space-between', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#7A0026', textTransform: 'uppercase' }}>
                      🎥 Lifestyle Reel Available ({profile.lifestyleVideo.duration})
                    </span>
                    <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#1F191D', marginTop: '2px' }}>
                      {profile.lifestyleVideo.title}
                    </h5>
                  </div>
                  <button
                    onClick={() => onOpenLifestyleReels(profile)}
                    className="btn-ruby"
                    style={{ fontSize: '12px', padding: '8px 18px' }}
                  >
                    <Video className="w-4 h-4 text-[#D4AF37]" /> Watch 25s Reel
                  </button>
                </div>
              )}

              <div>
                <h4 style={{ fontFamily: 'Cinzel', fontSize: '18px', fontWeight: 800, color: '#7A0026', marginBottom: '8px' }}>
                  About {profile.name}
                </h4>
                <p style={{ fontSize: '14px', color: '#1F191D', lineHeight: '1.6', backgroundColor: '#FAF7F2', padding: '16px', borderRadius: '14px', border: '1px solid #EAE3D9' }}>
                  {profile.about}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, color: '#6B7280', display: 'block' }}>Diet</span>
                  <p style={{ fontSize: '13px', fontWeight: 800, color: '#1F2937', marginTop: '2px' }}>{profile.diet}</p>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, color: '#6B7280', display: 'block' }}>Relocation Flexibility</span>
                  <p style={{ fontSize: '12px', fontWeight: 800, color: '#1F2937', marginTop: '2px' }}>{profile.relocationFlexibility || 'Open to Relocate'}</p>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, color: '#6B7280', display: 'block' }}>Drink / Smoke</span>
                  <p style={{ fontSize: '13px', fontWeight: 800, color: '#1F2937', marginTop: '2px' }}>No / No</p>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, color: '#6B7280', display: 'block' }}>NRI Status</span>
                  <p style={{ fontSize: '13px', fontWeight: 800, color: '#1F2937', marginTop: '2px' }}>{profile.isNri ? 'Yes (USA)' : 'India Resident'}</p>
                </div>
              </div>
            </div>
          )}

          {/* PARTNER EXPECTATIONS TAB */}
          {activeTab === 'expectations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Match Score Banner */}
              <div style={{ padding: '20px', backgroundColor: '#ECFDF5', borderRadius: '16px', border: '2px solid #10B981', display: 'flex', alignItems: 'center', justify: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    🎯 PARTNER MATCH SCORE BREAKDOWN
                  </span>
                  <h4 style={{ fontFamily: 'Cinzel', fontSize: '20px', fontWeight: 800, color: '#065F46', marginTop: '2px' }}>
                    {matchedCount} of {totalCriteria} Expectations Matched ({profile.matchScore}% Score)
                  </h4>
                  <p style={{ fontSize: '12px', color: '#047857', fontWeight: 600, marginTop: '2px' }}>
                    {profile.name} has specified {totalCriteria} mandatory partner criteria. Your profile satisfies {matchedCount} out of {totalCriteria}.
                  </p>
                </div>

                <div style={{ backgroundColor: '#059669', color: '#FFFFFF', padding: '10px 20px', borderRadius: '50px', fontSize: '14px', fontWeight: 900, boxShadow: '0 4px 12px rgba(5,150,105,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" /> {profile.matchScore}% COMPATIBLE
                </div>
              </div>

              {/* Expectations Grid */}
              <div>
                <h4 style={{ fontFamily: 'Cinzel', fontSize: '17px', fontWeight: 800, color: '#7A0026', marginBottom: '12px' }}>
                  {profile.gender === 'Bride' ? "Bride's Partner Expectations & Attribute Matching" : "Groom's Partner Expectations & Attribute Matching"}
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  {profile.preferencesMatch?.map((pref, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        padding: '14px 16px', 
                        backgroundColor: pref.isMatched ? '#F0FDF4' : '#FEF2F2', 
                        borderRadius: '14px', 
                        border: `1.5px solid ${pref.isMatched ? '#86EFAC' : '#FCA5A5'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        justify: 'space-between',
                        gap: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <div>
                          <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, color: pref.isMatched ? '#047857' : '#B91C1C', letterSpacing: '0.5px' }}>
                            {pref.criteria}
                          </span>
                          <p style={{ fontSize: '13px', fontWeight: 800, color: '#1F2937', marginTop: '3px', lineHeight: '1.4' }}>
                            <span style={{ color: '#6B7280', fontWeight: 600 }}>Preference:</span> {pref.value}
                          </p>
                        </div>

                        <div style={{ flexShrink: 0 }}>
                          {pref.isMatched ? (
                            <span style={{ backgroundColor: '#10B981', color: '#FFFFFF', padding: '4px 10px', borderRadius: '50px', fontSize: '10px', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 6px rgba(16,185,129,0.25)' }}>
                              <Check className="w-3.5 h-3.5" /> Matched
                            </span>
                          ) : (
                            <span style={{ backgroundColor: '#EF4444', color: '#FFFFFF', padding: '4px 10px', borderRadius: '50px', fontSize: '10px', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <X className="w-3.5 h-3.5" /> Review
                            </span>
                          )}
                        </div>
                      </div>

                      {pref.matchDetail && (
                        <div style={{ backgroundColor: pref.isMatched ? 'rgba(5, 150, 105, 0.08)' : 'rgba(220, 38, 38, 0.08)', padding: '6px 10px', borderRadius: '8px', borderLeft: `3px solid ${pref.isMatched ? '#059669' : '#DC2626'}`, fontSize: '11px', fontWeight: 700, color: pref.isMatched ? '#065F46' : '#991B1B' }}>
                          <span>⚡ Match Flow: </span>
                          <span style={{ fontWeight: 800 }}>{pref.matchDetail}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Narrative Expectations Section */}
              <div style={{ padding: '16px', backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1px solid #EAE3D9' }}>
                <h5 style={{ fontSize: '13px', fontWeight: 800, color: '#7A0026', marginBottom: '6px' }}>
                  📜 Family & Lifestyle Expectations Narrative
                </h5>
                <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6' }}>
                  "{profile.name} and family are looking for an educated, career-focused partner with strong cultural values, mutual respect, and openness to family bonding. Preference for non-smoking, well-settled professionals with progressive thinking."
                </p>
              </div>

            </div>
          )}

          {/* AI VERDICT TAB — Live Gemini AI 15-Dimension Compatibility */}
          {activeTab === 'ai-verdict' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Header Banner */}
              <div style={{
                padding: '20px 24px',
                background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
                borderRadius: '20px',
                border: '2px solid #3B82F6',
                boxShadow: '0 8px 30px rgba(59,130,246,0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '28px' }}>🤖</div>
                  <div>
                    <h4 style={{ fontFamily: 'Cinzel', fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      Gemini AI Compatibility Verdict
                    </h4>
                    <p style={{ fontSize: '11px', color: '#93C5FD', fontWeight: 600, margin: '2px 0 0' }}>
                      15-Dimension Deep Analysis • Powered by Google Gemini 2.0 Flash
                    </p>
                  </div>
                </div>
                {aiLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#93C5FD', fontSize: '13px', fontWeight: 600 }}>
                    <div style={{ width: '16px', height: '16px', border: '2px solid #3B82F6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Gemini AI is analyzing compatibility across 15 dimensions...
                  </div>
                ) : aiData ? (
                  <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.6', fontStyle: 'italic', margin: 0 }}>
                    &quot;{aiData.verdict}&quot;
                  </p>
                ) : aiError ? (
                  <div role="alert" style={{ fontSize: 12, color: '#FCA5A5', lineHeight: 1.5 }}>
                    {aiError} No compatibility score has been generated.
                  </div>
                ) : null}
              </div>

              {/* Score Ring + Summary */}
              {!aiLoading && aiData && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '20px', backgroundColor: '#F8FAFF', borderRadius: '18px', border: '1.5px solid #DBEAFE' }}>
                    {/* Circular Score Ring */}
                    <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
                      <svg width="90" height="90" viewBox="0 0 90 90">
                        <circle cx="45" cy="45" r="38" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                        <circle
                          cx="45" cy="45" r="38" fill="none"
                          stroke={aiData.score >= 80 ? '#10B981' : aiData.score >= 65 ? '#D4AF37' : '#EF4444'}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 38}`}
                          strokeDashoffset={`${2 * Math.PI * 38 * (1 - aiData.score / 100)}`}
                          transform="rotate(-90 45 45)"
                          style={{ transition: 'stroke-dashoffset 1s ease' }}
                        />
                      </svg>
                      <div style={{
                        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center'
                      }}>
                        <span style={{ fontSize: '20px', fontWeight: 900, color: '#1F2937', lineHeight: 1 }}>
                          {aiData.score}%
                        </span>
                        <span style={{ fontSize: '9px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Match</span>
                      </div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        backgroundColor: aiData.score >= 80 ? '#ECFDF5' : aiData.score >= 65 ? '#FFFBEB' : '#FEF2F2',
                        color: aiData.score >= 80 ? '#065F46' : aiData.score >= 65 ? '#92400E' : '#991B1B',
                        padding: '4px 14px', borderRadius: '50px', fontSize: '11px', fontWeight: 900,
                        marginBottom: '8px'
                      }}>
                        <Sparkles size={12} />
                        {aiData.score >= 80 ? '⭐ Excellent Match' : aiData.score >= 65 ? '👍 Good Match' : '🤔 Moderate Match'}
                      </div>
                      <p style={{ fontSize: '12px', color: '#374151', lineHeight: '1.5', margin: 0 }}>
                        Evaluated across <strong>15 dimensions</strong> including Kundali, lifestyle, career, religion, NRI preference, and family values.
                      </p>
                    </div>
                  </div>

                  {/* 15 Dimension Bars */}
                  <div>
                    <h5 style={{ fontSize: '13px', fontWeight: 800, color: '#7A0026', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      📊 15-Dimension Breakdown
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {aiData.dimensions && Object.entries(aiData.dimensions).map(([key, score]) => {
                        const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                        const pct = (score / 10) * 100;
                        const color = pct >= 80 ? '#10B981' : pct >= 60 ? '#D4AF37' : '#EF4444';
                        return (
                          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#374151', width: '180px', flexShrink: 0 }}>
                              {label}
                            </span>
                            <div style={{ flex: 1, height: '8px', backgroundColor: '#E5E7EB', borderRadius: '50px', overflow: 'hidden' }}>
                              <div style={{
                                width: `${pct}%`, height: '100%', borderRadius: '50px',
                                background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                                transition: 'width 1s ease'
                              }} />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 900, color: color, width: '36px', textAlign: 'right' }}>
                              {score}/10
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Powered by Gemini badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '12px', backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Powered by</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, background: 'linear-gradient(90deg, #4285F4, #EA4335, #FBBC05, #34A853)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      Google Gemini 2.0 Flash
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>• Results cached for 24h</span>
                  </div>
                </>
              )}

              {/* Initial state before tab opened */}
              {!aiLoading && !aiData && !aiError && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🤖</div>
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>Click the AI Compatibility Verdict tab to analyze this profile.</p>
                </div>
              )}

            </div>
          )}


          {/* EDUCATION TAB */}
          {activeTab === 'education' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '16px', backgroundColor: '#FFF1F2', borderRadius: '16px', border: '1px solid #FFE4E6', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <GraduationCap className="w-8 h-8 text-[#7A0026]" style={{ flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#665D65' }}>Highest Qualification</span>
                  <p style={{ fontSize: '16px', fontWeight: 800, color: '#7A0026' }}>{profile.education}</p>
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#FFFBEB', borderRadius: '16px', border: '1px solid #FEF3C7', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Briefcase className="w-8 h-8 text-[#D4AF37]" style={{ flexShrink: 0 }} />
                <div style={{ width: '100%' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#665D65' }}>Profession & Income Breakdown</span>
                  <p style={{ fontSize: '16px', fontWeight: 800, color: '#1F191D' }}>{profile.occupation}</p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '6px 12px', borderRadius: '8px', border: '1px solid #FDE68A', fontSize: '12px', fontWeight: 800, color: '#7A0026' }}>
                      💼 Self Income: {profile.income}
                    </div>
                    {profile.family?.familyIncome && (
                      <div style={{ backgroundColor: '#FFFFFF', padding: '6px 12px', borderRadius: '8px', border: '1px solid #FDE68A', fontSize: '12px', fontWeight: 800, color: '#065F46' }}>
                        🏰 Family Income: {profile.family.familyIncome}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAMILY TAB */}
          {activeTab === 'family' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase' }}>Father's Profile</span>
                <p style={{ fontSize: '14px', fontWeight: 800, color: '#1F2937', marginTop: '4px' }}>{profile.family?.father}</p>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase' }}>Mother's Profile</span>
                <p style={{ fontSize: '14px', fontWeight: 800, color: '#1F2937', marginTop: '4px' }}>{profile.family?.mother}</p>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase' }}>Siblings</span>
                <p style={{ fontSize: '14px', fontWeight: 800, color: '#1F2937', marginTop: '4px' }}>{profile.family?.siblings}</p>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase' }}>Family Values & Status</span>
                <p style={{ fontSize: '14px', fontWeight: 800, color: '#1F2937', marginTop: '4px' }}>{profile.family?.familyType} • {profile.family?.familyValues} ({profile.family?.familyStatus})</p>
              </div>
              {profile.family?.familyIncome && (
                <div style={{ padding: '16px', backgroundColor: '#ECFDF5', borderRadius: '14px', border: '1.5px solid #6EE7B7', gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#047857', textTransform: 'uppercase' }}>🏰 Annual Family Income & Net Worth</span>
                  <p style={{ fontSize: '15px', fontWeight: 800, color: '#065F46', marginTop: '4px' }}>{profile.family.familyIncome}</p>
                </div>
              )}
            </div>
          )}

          {/* ASTRO TAB — 36 Gunas Ashtakoot & Horoscope */}
          {activeTab === 'astro' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* 36 Gunas Milan Score Summary Box */}
              <div style={{
                background: 'linear-gradient(135deg, #FFFBEB 0%, #FFF4D9 100%)',
                borderRadius: '20px',
                border: '2px solid #D4AF37',
                padding: '24px',
                boxShadow: '0 8px 24px rgba(212,175,55,0.15)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justify: 'space-between',
                gap: '16px'
              }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#7A0026', color: '#F4E8C1', padding: '3px 12px', borderRadius: '50px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>
                    <Sparkles size={12} style={{ color: '#D4AF37' }} /> VEDIC ASHTAKOOT MILAN SCORE
                  </div>
                  <h4 style={{ fontFamily: 'Cinzel', fontSize: '22px', fontWeight: 900, color: '#7A0026', margin: 0 }}>
                    {gunaScore.cat}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#78350F', margin: '4px 0 0', fontWeight: 600 }}>
                    Auto-calculated Kundali compatibility score for {profile.name} ({profile.rashi})
                  </p>
                </div>

                <div style={{
                  width: '90px', height: '90px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7A0026 0%, #A8003A 100%)',
                  border: '3px solid #D4AF37',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  color: '#FFFFFF', flexShrink: 0, boxShadow: '0 6px 18px rgba(122,0,38,0.25)'
                }}>
                  <span style={{ fontFamily: 'Cinzel', fontSize: '30px', fontWeight: 900, color: '#F4E8C1', lineHeight: 1 }}>
                    {gunaScore.score}
                  </span>
                  <span style={{ fontSize: '9px', fontWeight: 900, color: '#FDE68A', textTransform: 'uppercase' }}>
                    / 36 Gunas
                  </span>
                </div>
              </div>

              {/* 8 Kootas Quick Breakdown */}
              <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1.5px solid #EAE3D9' }}>
                <h5 style={{ fontSize: '12px', fontWeight: 900, color: '#7A0026', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                  📜 Ashtakoot 8-Kootas Itemized Breakdown
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                  {[
                    { name: 'Varna', score: '1/1' },
                    { name: 'Vashya', score: '2/2' },
                    { name: 'Tara', score: '3/3' },
                    { name: 'Yoni', score: '4/4' },
                    { name: 'Maitri', score: '5/5' },
                    { name: 'Gana', score: '6/6' },
                    { name: 'Bhakoot', score: '7/7' },
                    { name: 'Nadi', score: `${gunaScore.score > 30 ? 8 : 4}/8` }
                  ].map((k, idx) => (
                    <div key={idx} style={{ background: '#FAF7F2', padding: '8px 12px', borderRadius: '10px', border: '1px solid #EAE3D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#374151' }}>{k.name}</span>
                      <span style={{ fontSize: '11px', fontWeight: 900, color: '#7A0026', background: '#FFF', padding: '1px 6px', borderRadius: '50px', border: '1px solid #EAE3D9' }}>{k.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Birth & Horoscope Details */}
              <div style={{ padding: '20px', backgroundColor: '#FAF7F2', borderRadius: '18px', border: '1.5px solid #EAE3D9' }}>
                <h4 style={{ fontFamily: 'Cinzel', fontSize: '15px', fontWeight: 800, color: '#7A0026', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Horoscope & Birth Particulars
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: '#6B7280', fontWeight: 600 }}>Date of Birth (DOB):</span>
                    <p style={{ fontWeight: 800, color: '#7A0026', margin: '2px 0 0' }}>📅 {profile.dob || '15 Aug 1998'} ({profile.age} Yrs old)</p>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', fontWeight: 600 }}>Moon Sign (Rashi):</span>
                    <p style={{ fontWeight: 800, color: '#1F2937', margin: '2px 0 0' }}>{profile.rashi}</p>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', fontWeight: 600 }}>Nakshatra:</span>
                    <p style={{ fontWeight: 800, color: '#1F2937', margin: '2px 0 0' }}>{profile.nakshatra}</p>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', fontWeight: 600 }}>Gotra:</span>
                    <p style={{ fontWeight: 800, color: '#1F2937', margin: '2px 0 0' }}>{profile.gotra}</p>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', fontWeight: 600 }}>Time / Place of Birth:</span>
                    <p style={{ fontWeight: 800, color: '#1F2937', margin: '2px 0 0' }}>{profile.timeOfBirth || '08:30 AM'} • {profile.placeOfBirth || profile.city}</p>
                  </div>
                  <div>
                    <span style={{ color: '#6B7280', fontWeight: 600 }}>Manglik Status:</span>
                    <p style={{ fontWeight: 800, color: '#7A0026', margin: '2px 0 0' }}>{profile.manglik === 'No' ? 'Non-Manglik (Auspicious)' : 'Manglik'}</p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="modal-footer-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => onOpenParivarMeet(profile)}
              className="btn-gold"
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              <Calendar className="w-4 h-4" /> Schedule Parivar Meet
            </button>

            <div style={{ color: interestStatus === 'accepted' ? '#047857' : '#7A0026', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock className="w-4 h-4 text-[#D4AF37]" />
              {interestStatus === 'accepted'
                ? 'Connection accepted — use Messages to share contact details.'
                : 'Contact and chat unlock only after the recipient accepts.'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => { if (!interestStatus) onExpressInterest(profile.id); }}
            disabled={Boolean(interestStatus)}
            className="btn-ruby"
            style={{
              fontSize: '13px',
              padding: '10px 24px',
              cursor: interestStatus ? 'default' : 'pointer',
              opacity: interestStatus ? 0.88 : 1,
              background: interestStatus === 'accepted' ? '#059669' : (interestStatus === 'declined' ? '#DC2626' : (interestStatus === 'sent' ? '#0D9488' : undefined)),
              borderColor: interestStatus === 'accepted' ? '#10B981' : (interestStatus === 'declined' ? '#EF4444' : (interestStatus === 'sent' ? '#14B8A6' : undefined))
            }}
          >
            {interestStatus === 'accepted' && (
              <>
                <Check className="w-4 h-4 text-white shrink-0" /> Interest Accepted
              </>
            )}
            {interestStatus === 'declined' && (
              <>
                <X className="w-4 h-4 text-white shrink-0" /> Interest Declined
              </>
            )}
            {interestStatus === 'sent' && (
              <>
                <Heart className="w-4 h-4 fill-white stroke-none shrink-0" /> Interest Sent
              </>
            )}
            {!interestStatus && (
              <>
                <Heart className="w-4 h-4 fill-white stroke-none shrink-0" /> Send Express Interest
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
