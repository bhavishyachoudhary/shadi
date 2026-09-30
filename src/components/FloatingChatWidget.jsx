import React, { useMemo, useState } from 'react';
import { ArrowLeft, Calendar, Lock, Maximize2, MessageCircle, Minimize2, Minus, Search, Send, X } from 'lucide-react';

const idsEqual = (left, right) => String(left) === String(right);

export default function FloatingChatWidget({
  activeProfile,
  profiles = [],
  interestMap = {},
  onClose,
  onOpenParivarMeet,
}) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [view, setView] = useState(activeProfile ? 'chat' : 'list');
  const [activeChatId, setActiveChatId] = useState(activeProfile?.id ? String(activeProfile.id) : null);
  const [searchQuery, setSearchQuery] = useState('');

  const acceptedIds = useMemo(() => new Set(
    Object.entries(interestMap)
      .filter(([, status]) => status === 'accepted')
      .map(([id]) => String(id))
  ), [interestMap]);

  const chatContacts = useMemo(() => profiles.filter(
    profile => acceptedIds.has(String(profile.id))
  ), [acceptedIds, profiles]);

  const filteredContacts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return chatContacts;
    return chatContacts.filter(profile => profile.name.toLowerCase().includes(query));
  }, [chatContacts, searchQuery]);

  const activeChatProfile = chatContacts.find(profile => idsEqual(profile.id, activeChatId)) || null;

  const openChat = (profileId) => {
    const normalizedId = String(profileId);
    if (!acceptedIds.has(normalizedId)) return;
    setActiveChatId(normalizedId);
    setView('chat');
  };

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => setIsMinimized(false)}
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
          backgroundColor: '#7A0026', color: '#FFFFFF', padding: '10px 20px',
          borderRadius: 50, border: '2px solid #D4AF37',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer'
        }}
      >
        <MessageCircle size={20} style={{ color: '#D4AF37' }} />
        <span style={{ fontSize: 13, fontWeight: 800 }}>Accepted Messages</span>
        <span style={{ background: '#D4AF37', color: '#1F191D', minWidth: 20, padding: '1px 6px', borderRadius: 20, fontSize: 10, fontWeight: 900 }}>{chatContacts.length}</span>
        <Maximize2 size={14} style={{ color: '#D4AF37' }} />
      </button>
    );
  }

  const widgetStyle = {
    position: 'fixed',
    bottom: isMaximized ? 0 : 20,
    right: isMaximized ? 0 : 20,
    width: isMaximized ? '100vw' : view === 'chat' ? 420 : 350,
    height: isMaximized ? '100vh' : 560,
    maxWidth: isMaximized ? '100vw' : '96vw',
    maxHeight: isMaximized ? '100vh' : '90vh',
    backgroundColor: '#FFFFFF',
    borderRadius: isMaximized ? 0 : 20,
    border: isMaximized ? 'none' : '2px solid #7A0026',
    boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const headerButtonStyle = {
    backgroundColor: 'rgba(255,255,255,0.12)',
    border: 'none',
    color: '#F4E8C1',
    cursor: 'pointer',
    padding: 5,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const renderHeader = () => (
    <div style={{ background: 'linear-gradient(135deg, #7A0026 0%, #A01040 100%)', color: '#FFFFFF', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #D4AF37', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        {view === 'chat' && (
          <button type="button" onClick={() => setView('list')} aria-label="Back to accepted connections" style={{ ...headerButtonStyle, background: 'transparent' }}>
            <ArrowLeft size={18} />
          </button>
        )}
        {activeChatProfile && view === 'chat' ? (
          <>
            <img src={activeChatProfile.photo} alt="" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4AF37' }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'Cinzel', fontSize: 14, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeChatProfile.name}</div>
              <div style={{ fontSize: 10, color: '#A7F3D0', fontWeight: 700 }}>✓ Accepted connection</div>
            </div>
          </>
        ) : (
          <>
            <MessageCircle size={20} style={{ color: '#D4AF37' }} />
            <div>
              <div style={{ fontFamily: 'Cinzel', fontSize: 14, fontWeight: 800 }}>Bandhan Messages</div>
              <div style={{ fontSize: 10, color: '#F4E8C1' }}>{chatContacts.length} accepted connection{chatContacts.length === 1 ? '' : 's'}</div>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button type="button" onClick={() => setIsMinimized(true)} style={headerButtonStyle} aria-label="Minimize messages"><Minus size={14} /></button>
        <button type="button" onClick={() => setIsMaximized(value => !value)} style={headerButtonStyle} aria-label={isMaximized ? 'Restore messages' : 'Maximize messages'}>
          {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
        <button type="button" onClick={onClose} style={{ ...headerButtonStyle, backgroundColor: 'rgba(239,68,68,0.3)' }} aria-label="Close messages"><X size={14} /></button>
      </div>
    </div>
  );

  const renderList = () => (
    <>
      <div style={{ padding: '10px 14px', backgroundColor: '#FAF7F2', borderBottom: '1px solid #EAE3D9' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} aria-hidden="true" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            type="search"
            aria-label="Search accepted connections"
            placeholder="Search accepted connections"
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            style={{ width: '100%', padding: '9px 10px 9px 30px', borderRadius: 10, border: '1px solid #EAE3D9', fontSize: 12, backgroundColor: '#FFFFFF', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredContacts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '42px 20px', color: '#6B7280' }}>
            <Lock size={30} style={{ margin: '0 auto 10px', color: '#D4AF37' }} />
            <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>No accepted conversations</p>
            <p style={{ fontSize: 11, margin: 0 }}>Chat unlocks only after the recipient accepts an interest request.</p>
          </div>
        ) : filteredContacts.map(profile => (
          <button
            type="button"
            key={profile.id}
            onClick={() => openChat(profile.id)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer', background: 'transparent', border: 'none', borderBottom: '1px solid #F3F4F6', textAlign: 'left' }}
          >
            <img src={profile.photo} alt="" style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', border: '2px solid #EAE3D9' }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.name}</div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#059669', marginTop: 3 }}>✓ Accepted connection</div>
            </div>
          </button>
        ))}
      </div>
    </>
  );

  const renderConversation = () => {
    if (!activeChatProfile) return renderList();

    return (
      <>
        <div style={{ flex: 1, padding: 20, background: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: 320, textAlign: 'center', background: '#FFFFFF', border: '1px solid #EAE3D9', borderRadius: 18, padding: 22, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <Lock size={28} style={{ color: '#059669', margin: '0 auto 10px' }} />
            <h3 style={{ fontFamily: 'Cinzel', fontSize: 16, color: '#7A0026', margin: '0 0 8px' }}>Connection accepted</h3>
            <p style={{ fontSize: 12, lineHeight: 1.55, color: '#4B5563', margin: 0 }}>
              This conversation is authorized. Persistent real-time delivery is being connected to the Bandhan message service; no simulated messages or replies are shown.
            </p>
            {onOpenParivarMeet && (
              <button type="button" onClick={() => onOpenParivarMeet(activeChatProfile)} className="btn-gold" style={{ marginTop: 16, fontSize: 11, padding: '8px 14px' }}>
                <Calendar size={14} /> Schedule Parivar Meet
              </button>
            )}
          </div>
        </div>

        <div style={{ padding: '10px 12px', background: '#FFFFFF', borderTop: '1px solid #EAE3D9', display: 'flex', gap: 8 }}>
          <input disabled value="" placeholder="Real-time messaging will be enabled by the conversation API" style={{ flex: 1, minWidth: 0, background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 12, padding: '10px 12px', fontSize: 11, color: '#6B7280' }} />
          <button type="button" disabled aria-label="Send message unavailable" style={{ border: 'none', borderRadius: 12, padding: '0 14px', background: '#D1D5DB', color: '#6B7280' }}><Send size={15} /></button>
        </div>
      </>
    );
  };

  return (
    <div style={widgetStyle} role="dialog" aria-label="Accepted conversations">
      {renderHeader()}
      {view === 'chat' ? renderConversation() : renderList()}
    </div>
  );
}
