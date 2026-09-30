import React, { useState } from 'react';
import { MessageCircle, Heart, Check, X, Send, Calendar, RotateCcw, ArrowRight, Sparkles, Lock } from 'lucide-react';

const idsEqual = (left, right) => String(left) === String(right);

export default function DashboardInbox({ receivedInterests = [], interestMap = {}, profiles = [], onAcceptInterest, onDeclineInterest, onExpressInterest, onOpenParivarMeet, onSelectProfile, onOpenLiveChat }) {
  const [activeTab, setActiveTab] = useState('accepted');

  // Object keys are strings by definition. Keep IDs as strings so real UUIDs remain valid.
  const acceptedProfileIds = Object.keys(interestMap).filter(id => interestMap[id] === 'accepted');
  const declinedProfileIds = Object.keys(interestMap).filter(id => interestMap[id] === 'declined');
  const sentProfileIds = Object.keys(interestMap).filter(id => interestMap[id] === 'sent');
  const getProfile = (profileId) => profiles.find(profile => idsEqual(profile.id, profileId));

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '2px solid #EAE3D9', boxShadow: '0 12px 35px rgba(0,0,0,0.06)', overflow: 'hidden', minHeight: '620px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      
      {/* Sidebar Navigation */}
      <div style={{ width: '290px', minWidth: '280px', backgroundColor: '#FAF7F2', borderRight: '2px solid #EAE3D9', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h3 style={{ fontFamily: 'Cinzel', fontSize: '18px', fontWeight: 800, color: '#7A0026', margin: 0, paddingBottom: '16px', borderBottom: '1.5px solid #EAE3D9', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Activity & Request Center
          </h3>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
            
            {/* Accepted Tab */}
            <button
              onClick={() => setActiveTab('accepted')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '14px',
                fontSize: '12px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'accepted' ? '#059669' : '#FFFFFF',
                color: activeTab === 'accepted' ? '#FFFFFF' : '#374151',
                boxShadow: activeTab === 'accepted' ? '0 4px 12px rgba(5,150,105,0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check className="w-4 h-4" /> Accepted Requests
              </span>
              <span style={{ backgroundColor: activeTab === 'accepted' ? '#FFFFFF' : '#059669', color: activeTab === 'accepted' ? '#059669' : '#FFFFFF', padding: '2px 8px', borderRadius: '50px', fontSize: '10px', fontWeight: 900 }}>
                {acceptedProfileIds.length}
              </span>
            </button>

            {/* Received Tab */}
            <button
              onClick={() => setActiveTab('received')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '14px',
                fontSize: '12px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'received' ? '#7A0026' : '#FFFFFF',
                color: activeTab === 'received' ? '#FFFFFF' : '#374151',
                boxShadow: activeTab === 'received' ? '0 4px 12px rgba(122,0,38,0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart className="w-4 h-4 fill-current" /> Received Requests
              </span>
              <span style={{ backgroundColor: activeTab === 'received' ? '#D4AF37' : '#7A0026', color: activeTab === 'received' ? '#000000' : '#FFFFFF', padding: '2px 8px', borderRadius: '50px', fontSize: '10px', fontWeight: 900 }}>
                {receivedInterests.length}
              </span>
            </button>

            {/* Declined Tab */}
            <button
              onClick={() => setActiveTab('declined')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '14px',
                fontSize: '12px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'declined' ? '#DC2626' : '#FFFFFF',
                color: activeTab === 'declined' ? '#FFFFFF' : '#374151',
                boxShadow: activeTab === 'declined' ? '0 4px 12px rgba(220,38,38,0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <X className="w-4 h-4" /> Declined / Rejected List
              </span>
              <span style={{ backgroundColor: activeTab === 'declined' ? '#FFFFFF' : '#DC2626', color: activeTab === 'declined' ? '#DC2626' : '#FFFFFF', padding: '2px 8px', borderRadius: '50px', fontSize: '10px', fontWeight: 900 }}>
                {declinedProfileIds.length}
              </span>
            </button>

            {/* Sent Tab */}
            <button
              onClick={() => setActiveTab('sent')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '14px',
                fontSize: '12px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'sent' ? '#0D9488' : '#FFFFFF',
                color: activeTab === 'sent' ? '#FFFFFF' : '#374151',
                boxShadow: activeTab === 'sent' ? '0 4px 12px rgba(13,148,136,0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send className="w-4 h-4" /> Sent Requests
              </span>
              <span style={{ backgroundColor: activeTab === 'sent' ? '#FFFFFF' : '#0D9488', color: activeTab === 'sent' ? '#0D9488' : '#FFFFFF', padding: '2px 8px', borderRadius: '50px', fontSize: '10px', fontWeight: 900 }}>
                {sentProfileIds.length}
              </span>
            </button>

            {/* Live Chat Tab */}
            <button
              onClick={() => setActiveTab('chat')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '14px',
                fontSize: '12px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'chat' ? '#7A0026' : '#FFFFFF',
                color: activeTab === 'chat' ? '#FFFFFF' : '#374151',
                boxShadow: activeTab === 'chat' ? '0 4px 12px rgba(122,0,38,0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageCircle className="w-4 h-4" /> Live Chat & Messages
              </span>
              <span style={{ backgroundColor: '#10B981', color: '#FFFFFF', padding: '2px 8px', borderRadius: '50px', fontSize: '10px', fontWeight: 900 }}>
                Active
              </span>
            </button>

          </nav>
        </div>

        <div style={{ backgroundColor: '#FEF3C7', padding: '12px', borderRadius: '14px', border: '1px solid #FDE68A', fontSize: '11px', color: '#92400E', marginTop: '20px', lineHeight: '1.4' }}>
          <Lock className="w-3.5 h-3.5 inline mr-1 text-[#D97706]" /> <strong>Private by default:</strong> Direct contact details are available only after both members accept the connection.
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '28px', backgroundColor: '#FFFFFF', overflowY: 'auto', minWidth: '320px' }}>
        
        {/* ACCEPTED REQUESTS TAB */}
        {activeTab === 'accepted' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', marginBottom: '20px', borderBottom: '1.5px solid #EAE3D9', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h4 style={{ fontFamily: 'Cinzel', fontSize: '20px', fontWeight: 800, color: '#059669', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check className="w-6 h-6 text-[#059669]" /> Accepted Interest Requests ({acceptedProfileIds.length})
                </h4>
                <p style={{ fontSize: '12px', color: '#665D65', marginTop: '4px', margin: 0 }}>
                  Mutually confirmed matrimonial interests. You can now chat, call family, or schedule Parivar Meet.
                </p>
              </div>

              <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontSize: '11px', fontWeight: 900, padding: '4px 12px', borderRadius: '50px', border: '1px solid #A7F3D0' }}>
                ✅ Accepted Connections
              </span>
            </div>

            {acceptedProfileIds.length === 0 ? (
              <div style={{ backgroundColor: '#FAF7F2', borderRadius: '16px', padding: '40px 20px', textAlign: 'center', border: '1.5px solid #EAE3D9' }}>
                <Check className="w-10 h-10 text-[#059669] mx-auto mb-2" />
                <p style={{ fontSize: '13px', color: '#665D65', margin: 0 }}>No accepted requests yet. Express interest on profile cards or map view to get started.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {acceptedProfileIds.map((id) => {
                  const profile = getProfile(id);
                  if (!profile) return null;

                  return (
                    <div
                      key={id}
                      style={{
                        backgroundColor: '#F0FDF4',
                        borderRadius: '20px',
                        border: '2px solid #A7F3D0',
                        padding: '20px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justify: 'space-between',
                        gap: '16px',
                        boxShadow: '0 4px 15px rgba(5,150,105,0.06)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '260px' }}>
                        <img
                          src={profile.photo}
                          alt={profile.name}
                          style={{ width: '72px', height: '72px', borderRadius: '16px', objectFit: 'cover', border: '2px solid #059669', shrink: 0 }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <h5 
                              onClick={() => onSelectProfile(profile)}
                              style={{ fontFamily: 'Cinzel', fontSize: '17px', fontWeight: 800, color: '#065F46', margin: 0, cursor: 'pointer' }}
                              className="hover:underline"
                            >
                              {profile.name} ↗
                            </h5>
                            <span style={{ backgroundColor: '#059669', color: '#FFFFFF', fontSize: '10px', fontWeight: 900, padding: '2px 10px', borderRadius: '50px' }}>
                              ✅ MUTUALLY ACCEPTED
                            </span>
                          </div>

                          <p style={{ fontSize: '12px', fontWeight: 700, color: '#374151', marginTop: '4px', margin: 0 }}>
                            {profile.age} Yrs • {profile.occupation} ({profile.city})
                          </p>

                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '6px', fontSize: '11px', fontWeight: 800, color: '#047857' }}>
                            <span>💼 Self Income: <strong>{profile.income}</strong></span>
                            <span>🏰 Family Income: <strong>{profile.family?.familyIncome || '₹50L+'}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => {
                            if (onOpenLiveChat) onOpenLiveChat(profile);
                            else setActiveTab('chat');
                          }}
                          className="btn-ruby"
                          style={{ fontSize: '11px', padding: '8px 16px', background: '#059669', borderColor: '#10B981' }}
                        >
                          <MessageCircle className="w-4 h-4" /> Live Chat Now
                        </button>

                        {onOpenParivarMeet && (
                          <button
                            onClick={() => onOpenParivarMeet(profile)}
                            className="btn-gold"
                            style={{ fontSize: '11px', padding: '8px 14px' }}
                          >
                            <Calendar className="w-4 h-4 text-[#7A0026]" /> Parivar Meet
                          </button>
                        )}

                        <button
                          onClick={() => onSelectProfile(profile)}
                          style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #059669', color: '#059669', borderRadius: '50px', padding: '8px 14px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                        >
                          Full Profile <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* DECLINED / REJECTED LIST TAB */}
        {activeTab === 'declined' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', marginBottom: '20px', borderBottom: '1.5px solid #EAE3D9', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h4 style={{ fontFamily: 'Cinzel', fontSize: '20px', fontWeight: 800, color: '#DC2626', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <X className="w-6 h-6 text-[#DC2626]" /> Declined / Rejected List ({declinedProfileIds.length})
                </h4>
                <p style={{ fontSize: '12px', color: '#665D65', marginTop: '4px', margin: 0 }}>
                  Profiles where interest was declined. You can reconsider or re-express interest at any time.
                </p>
              </div>

              <span style={{ backgroundColor: '#FEE2E2', color: '#991B1B', fontSize: '11px', fontWeight: 900, padding: '4px 12px', borderRadius: '50px', border: '1px solid #FCA5A5' }}>
                ❌ Declined Status
              </span>
            </div>

            {declinedProfileIds.length === 0 ? (
              <div style={{ backgroundColor: '#FAF7F2', borderRadius: '16px', padding: '40px 20px', textAlign: 'center', border: '1.5px solid #EAE3D9' }}>
                <p style={{ fontSize: '13px', color: '#665D65', margin: 0 }}>No profiles in your declined list.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {declinedProfileIds.map((id) => {
                  const profile = getProfile(id);
                  if (!profile) return null;

                  return (
                    <div
                      key={id}
                      style={{
                        backgroundColor: '#FEF2F2',
                        borderRadius: '20px',
                        border: '1.5px solid #FCA5A5',
                        padding: '18px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justify: 'space-between',
                        gap: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img
                          src={profile.photo}
                          alt={profile.name}
                          style={{ width: '60px', height: '60px', borderRadius: '14px', objectFit: 'cover', border: '1.5px solid #EF4444' }}
                        />
                        <div>
                          <h5 
                            onClick={() => onSelectProfile(profile)}
                            style={{ fontFamily: 'Cinzel', fontSize: '16px', fontWeight: 800, color: '#991B1B', margin: 0, cursor: 'pointer' }}
                          >
                            {profile.name}
                          </h5>
                          <p style={{ fontSize: '12px', color: '#4B5563', marginTop: '2px', margin: 0 }}>
                            {profile.age} Yrs • {profile.education} ({profile.city})
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onExpressInterest(profile.id)}
                        className="btn-ruby"
                        style={{ fontSize: '11px', padding: '8px 16px', background: '#7A0026' }}
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reconsider Interest
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* RECEIVED INTERESTS TAB */}
        {activeTab === 'received' && (
          <div>
            <div style={{ paddingBottom: '16px', marginBottom: '20px', borderBottom: '1.5px solid #EAE3D9' }}>
              <h4 style={{ fontFamily: 'Cinzel', fontSize: '20px', fontWeight: 800, color: '#7A0026', margin: 0 }}>
                Received Interest Requests ({receivedInterests.length})
              </h4>
              <p style={{ fontSize: '12px', color: '#665D65', marginTop: '4px', margin: 0 }}>
                Members who have expressed interest in connecting with your profile.
              </p>
            </div>

            {receivedInterests.length === 0 ? (
              <div style={{ backgroundColor: '#FAF7F2', borderRadius: '16px', padding: '40px 20px', textAlign: 'center', border: '1.5px solid #EAE3D9' }}>
                <p style={{ fontSize: '13px', color: '#665D65', margin: 0 }}>No pending interest requests received yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {receivedInterests.map((interest) => {
                  const senderProfile = getProfile(interest.senderId);
                  if (!senderProfile) return null;

                  return (
                    <div
                      key={interest.id}
                      style={{
                        backgroundColor: '#FAF7F2',
                        borderRadius: '20px',
                        border: '1.5px solid #EAE3D9',
                        padding: '18px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justify: 'space-between',
                        gap: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '240px' }}>
                        <img
                          src={senderProfile.photo}
                          alt={senderProfile.name}
                          style={{ width: '64px', height: '64px', borderRadius: '14px', objectFit: 'cover', border: '2px solid #D4AF37' }}
                        />
                        <div>
                          <h5 style={{ fontFamily: 'Cinzel', fontSize: '16px', fontWeight: 800, color: '#7A0026', margin: 0 }}>
                            {senderProfile.name}
                          </h5>
                          <p style={{ fontSize: '12px', color: '#4B5563', marginTop: '2px', margin: 0 }}>
                            {senderProfile.age} Yrs • {senderProfile.occupation} ({senderProfile.city})
                          </p>
                          <p style={{ fontSize: '11px', color: '#991B1B', fontStyle: 'italic', marginTop: '4px', margin: 0 }}>
                            "{interest.message}"
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => onDeclineInterest(interest.id)}
                          style={{ backgroundColor: '#E5E7EB', color: '#374151', border: 'none', borderRadius: '50px', padding: '8px 16px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                        >
                          <X className="w-3.5 h-3.5 inline mr-1" /> Decline
                        </button>

                        <button
                          onClick={() => onAcceptInterest(interest.id)}
                          className="btn-ruby"
                          style={{ fontSize: '11px', padding: '8px 16px' }}
                        >
                          <Check className="w-3.5 h-3.5 inline mr-1" /> Accept & Chat
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SENT INTERESTS TAB */}
        {activeTab === 'sent' && (
          <div>
            <div style={{ paddingBottom: '16px', marginBottom: '20px', borderBottom: '1.5px solid #EAE3D9' }}>
              <h4 style={{ fontFamily: 'Cinzel', fontSize: '20px', fontWeight: 800, color: '#0D9488', margin: 0 }}>
                Interests You Have Expressed ({sentProfileIds.length})
              </h4>
              <p style={{ fontSize: '12px', color: '#665D65', marginTop: '4px', margin: 0 }}>
                Profiles you have sent an express interest to.
              </p>
            </div>

            {sentProfileIds.length === 0 ? (
              <div style={{ backgroundColor: '#FAF7F2', borderRadius: '16px', padding: '40px 20px', textAlign: 'center', border: '1.5px solid #EAE3D9' }}>
                <p style={{ fontSize: '13px', color: '#665D65', margin: 0 }}>No sent requests active.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sentProfileIds.map((interestId) => {
                  const targetProfile = getProfile(interestId);
                  if (!targetProfile) return null;

                  return (
                    <div
                      key={interestId}
                      style={{
                        backgroundColor: '#F0FDFA',
                        borderRadius: '20px',
                        border: '1.5px solid #99F6E4',
                        padding: '18px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justify: 'space-between',
                        gap: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img
                          src={targetProfile.photo}
                          alt={targetProfile.name}
                          style={{ width: '60px', height: '60px', borderRadius: '14px', objectFit: 'cover', border: '1.5px solid #0D9488' }}
                        />
                        <div>
                          <h5 
                            onClick={() => onSelectProfile(targetProfile)}
                            style={{ fontFamily: 'Cinzel', fontSize: '16px', fontWeight: 800, color: '#0F766E', margin: 0, cursor: 'pointer' }}
                          >
                            {targetProfile.name}
                          </h5>
                          <p style={{ fontSize: '12px', color: '#115E59', marginTop: '2px', margin: 0 }}>
                            {targetProfile.age} Yrs • {targetProfile.education} ({targetProfile.city})
                          </p>
                        </div>
                      </div>

                      <span style={{ backgroundColor: '#99F6E4', color: '#115E59', padding: '4px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 900, border: '1px solid #5EEAD4' }}>
                        ❤️ Interest Sent (Awaiting Response)
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ACCEPTED-ONLY CHAT DIRECTORY */}
        {activeTab === 'chat' && (
          <div>
            <div style={{ paddingBottom: 16, marginBottom: 20, borderBottom: '1.5px solid #EAE3D9' }}>
              <h4 style={{ fontFamily: 'Cinzel', fontSize: 20, fontWeight: 800, color: '#7A0026', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MessageCircle className="w-5 h-5" /> Accepted Conversations
              </h4>
              <p style={{ fontSize: 12, color: '#665D65', margin: '4px 0 0' }}>
                A conversation is available only after an interest request has been accepted.
              </p>
            </div>

            {acceptedProfileIds.length === 0 ? (
              <div style={{ backgroundColor: '#FAF7F2', borderRadius: 16, padding: '40px 20px', textAlign: 'center', border: '1.5px solid #EAE3D9' }}>
                <Lock className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                <p style={{ fontSize: 13, color: '#665D65', margin: 0 }}>No accepted connections yet. Chat remains locked until a request is accepted.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {acceptedProfileIds.map(profileId => {
                  const profile = getProfile(profileId);
                  if (!profile) return null;

                  return (
                    <div key={profileId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: 16, borderRadius: 16, border: '1.5px solid #A7F3D0', background: '#F0FDF4', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={profile.photo} alt={profile.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #059669' }} />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: '#065F46' }}>{profile.name}</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#047857' }}>Accepted connection</div>
                        </div>
                      </div>
                      <button type="button" onClick={() => onOpenLiveChat?.(profile)} className="btn-ruby" style={{ fontSize: 11, padding: '8px 16px', background: '#059669', borderColor: '#10B981' }}>
                        <MessageCircle className="w-4 h-4" /> Open Conversation
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
