import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageCircle, Minimize2, Maximize2, Minus, X, Send, Image,
  Paperclip, MapPin, Video, PhoneCall, Check, CheckCheck, Mic,
  MicOff, VideoOff, PhoneOff, ArrowLeft, Search, MoreVertical
} from 'lucide-react';

// ─────────────────────────────────────────────
// Initial per-contact chat histories
// ─────────────────────────────────────────────
const INITIAL_CHAT_HISTORIES = {
  101: [
    { id: 1, sender: 'them', text: 'Namaste! I reviewed your matrimony profile and family details.', time: '10:15 AM', status: 'read' },
    { id: 2, sender: 'me', text: 'Hello Ananya! Thank you. I found your AI Engineer career at Microsoft very impressive.', time: '10:18 AM', status: 'read' },
    { id: 3, sender: 'them', text: 'Would it be good to schedule a family video conversation this Sunday?', time: '10:22 AM', status: 'read' },
    { id: 4, sender: 'me', text: 'Yes, absolutely! Sunday 5 PM works great for my family.', time: '10:25 AM', status: 'delivered' },
  ],
  105: [
    { id: 1, sender: 'them', text: 'Hello! I came across your profile and felt a genuine connection.', time: 'Yesterday', status: 'read' },
    { id: 2, sender: 'me', text: 'Hi Saniya! Nice to hear from you. Your profile is very impressive.', time: 'Yesterday', status: 'read' },
    { id: 3, sender: 'them', text: 'Thank you! Would love to connect with your family soon 🙏', time: '09:40 AM', status: 'read' },
  ],
  108: [
    { id: 1, sender: 'them', text: 'Namaste ji! I saw your profile through Bandhan Matrimony.', time: 'Mon', status: 'read' },
    { id: 2, sender: 'me', text: 'Hello! Yes, I came across yours too. Very nice profile.', time: 'Mon', status: 'read' },
  ],
};

// Unread counts per contact (initially)
const INITIAL_UNREAD = { 101: 0, 105: 3, 108: 2 };

// Online status per contact
const ONLINE_STATUS = {
  101: true,
  105: false,
  108: true,
};

// ─────────────────────────────────────────────
// Helper: render WhatsApp-style tick marks
// ─────────────────────────────────────────────
const Ticks = ({ status }) => {
  if (status === 'sent')      return <Check size={12} style={{ color: '#9CA3AF' }} title="Sent" />;
  if (status === 'delivered') return <CheckCheck size={12} style={{ color: '#9CA3AF' }} title="Delivered" />;
  if (status === 'read')      return <CheckCheck size={12} style={{ color: '#0284C7' }} title="Read" />;
  return null;
};

// ─────────────────────────────────────────────
// Auto-reply pool per contact
// ─────────────────────────────────────────────
const AUTO_REPLIES = {
  101: [
    'Thank you for sharing! I have informed my parents as well. 🙏',
    'We would love to schedule a family call soon!',
    'Your profile is very impressive, my family was delighted.',
  ],
  105: [
    'That sounds wonderful! Looking forward to connecting.',
    'My parents are also very interested. Let us set a date!',
  ],
  108: [
    'Ji bilkul! Hum baat karte hain apne parivar se.',
    'Thank you for the quick response. Very kind of you.',
  ],
};

export default function FloatingChatWidget({ activeProfile, profiles = [], interestMap = {}, onClose, onOpenParivarMeet }) {
  const [isMinimized, setIsMinimized]   = useState(false);
  const [isMaximized, setIsMaximized]   = useState(false);
  const [activeCallType, setActiveCallType] = useState(null);
  const [isMuted, setIsMuted]           = useState(false);
  const [view, setView]                 = useState('list'); // 'list' | 'chat'
  const [activeChatId, setActiveChatId] = useState(null);
  const [searchQuery, setSearchQuery]   = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [attachment, setAttachment]     = useState(null);

  // Per-contact chat histories
  const [chatHistories, setChatHistories] = useState(INITIAL_CHAT_HISTORIES);
  const [unreadCounts, setUnreadCounts]   = useState(INITIAL_UNREAD);
  const [replyIndexes, setReplyIndexes]   = useState({ 101: 0, 105: 0, 108: 0 });

  const messagesEndRef = useRef(null);

  // Build accepted chat contacts list from profiles + interestMap
  const acceptedIds = Object.entries(interestMap)
    .filter(([, status]) => status === 'accepted')
    .map(([id]) => Number(id));

  // Merge accepted profiles with initial demo contacts
  const demoChatIds = [101, 105, 108];
  const allChatIds  = [...new Set([...acceptedIds, ...demoChatIds])];

  const chatContacts = allChatIds
    .map(id => profiles.find(p => p.id === id))
    .filter(Boolean);

  // Determine active profile object
  const activeChatProfile = chatContacts.find(p => p.id === activeChatId)
    || (activeProfile && chatContacts.find(p => p.id === activeProfile.id))
    || chatContacts[0];

  // Total unread badge count (for minimized bar)
  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistories, activeChatId]);

  // If activeProfile prop given, go directly to that chat
  useEffect(() => {
    if (activeProfile?.id) {
      setActiveChatId(activeProfile.id);
      setView('chat');
    }
  }, [activeProfile]);

  // ── Open a chat contact ──────────────────────
  const openChat = (profileId) => {
    setActiveChatId(profileId);
    setView('chat');
    // Mark as read when opened
    setUnreadCounts(prev => ({ ...prev, [profileId]: 0 }));
    // Mark last message as read in history
    setChatHistories(prev => {
      const msgs = prev[profileId] || [];
      return {
        ...prev,
        [profileId]: msgs.map(m => m.sender === 'me' ? { ...m, status: 'read' } : m)
      };
    });
  };

  // ── Send Message ─────────────────────────────
  const handleSendMessage = useCallback((e) => {
    e.preventDefault();
    if (!inputMessage.trim() && !attachment) return;
    if (!activeChatId) return;

    const msgId  = Date.now();
    const time   = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: msgId, sender: 'me',
      text: inputMessage.trim(),
      attachment: attachment || undefined,
      time, status: 'sent'
    };

    setChatHistories(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg]
    }));
    setInputMessage('');
    setAttachment(null);

    // Tick progression: sent → delivered → read + auto-reply
    setTimeout(() => {
      setChatHistories(prev => ({
        ...prev,
        [activeChatId]: (prev[activeChatId] || []).map(m => m.id === msgId ? { ...m, status: 'delivered' } : m)
      }));
    }, 1000);

    setTimeout(() => {
      setChatHistories(prev => ({
        ...prev,
        [activeChatId]: (prev[activeChatId] || []).map(m => m.id === msgId ? { ...m, status: 'read' } : m)
      }));

      // Auto-reply
      const replies = AUTO_REPLIES[activeChatId] || ['Thank you for the message!'];
      setReplyIndexes(prev => {
        const idx = (prev[activeChatId] || 0) % replies.length;
        const replyText = replies[idx];
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setChatHistories(h => ({
          ...h,
          [activeChatId]: [...(h[activeChatId] || []), {
            id: Date.now() + 3, sender: 'them',
            text: replyText, time: replyTime, status: 'read'
          }]
        }));
        return { ...prev, [activeChatId]: idx + 1 };
      });
    }, 2500);
  }, [inputMessage, attachment, activeChatId]);

  // ── Attach helpers ───────────────────────────
  const handleAttachPhoto    = () => setAttachment({ type: 'image', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=500&q=80', label: 'Family_Photo.jpg' });
  const handleAttachFile     = () => setAttachment({ type: 'file', label: 'BioData_Kundali.pdf', size: '2.4 MB' });
  const handleAttachLocation = () => setAttachment({ type: 'location', address: 'Indiranagar, Bengaluru', mapPin: '📍 Live Location' });

  // ── Last message helper ──────────────────────
  const getLastMsg = (id) => {
    const hist = chatHistories[id] || [];
    return hist[hist.length - 1] || null;
  };

  // ── Filter by search ─────────────────────────
  const filteredContacts = chatContacts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ══════════════════════════════════════════════
  //  MINIMIZED BAR
  // ══════════════════════════════════════════════
  if (isMinimized) {
    return (
      <div
        onClick={() => setIsMinimized(false)}
        style={{
          position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999,
          backgroundColor: '#7A0026', color: '#FFFFFF', padding: '10px 20px',
          borderRadius: '50px', border: '2px solid #D4AF37',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'
        }}
      >
        <div style={{ position: 'relative' }}>
          <MessageCircle size={20} style={{ color: '#D4AF37' }} />
          {totalUnread > 0 && (
            <span style={{
              position: 'absolute', top: '-6px', right: '-6px',
              backgroundColor: '#EF4444', color: '#FFFFFF',
              fontSize: '9px', fontWeight: 900, width: '16px', height: '16px',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1.5px solid #7A0026'
            }}>{totalUnread}</span>
          )}
        </div>
        <span style={{ fontSize: '13px', fontWeight: 800 }}>
          💬 Bandhan Live Chat
        </span>
        {totalUnread > 0 && (
          <span style={{ backgroundColor: '#EF4444', color: '#fff', padding: '2px 8px', borderRadius: '50px', fontSize: '10px', fontWeight: 900 }}>
            {totalUnread} New
          </span>
        )}
        <Maximize2 size={14} style={{ color: '#D4AF37' }} />
      </div>
    );
  }

  // ══════════════════════════════════════════════
  //  WIDGET CONTAINER
  // ══════════════════════════════════════════════
  const widgetStyle = {
    position: 'fixed',
    bottom: isMaximized ? '0' : '20px',
    right: isMaximized ? '0' : '20px',
    width: isMaximized ? '100vw' : (view === 'chat' ? '420px' : '340px'),
    height: isMaximized ? '100vh' : '580px',
    maxWidth: isMaximized ? '100vw' : '96vw',
    maxHeight: isMaximized ? '100vh' : '90vh',
    backgroundColor: '#FFFFFF',
    borderRadius: isMaximized ? '0' : '20px',
    border: isMaximized ? 'none' : '2px solid #7A0026',
    boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'all 0.25s ease'
  };

  // ══════════════════════════════════════════════
  //  HEADER (shared by both views)
  // ══════════════════════════════════════════════
  const renderHeader = () => {
    if (view === 'list') {
      return (
        <div style={{ background: 'linear-gradient(135deg, #7A0026 0%, #A01040 100%)', color: '#FFFFFF', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={18} style={{ color: '#D4AF37' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'Cinzel', fontSize: '14px', fontWeight: 800 }}>Bandhan Live Chat</div>
              <div style={{ fontSize: '10px', color: '#F4E8C1' }}>
                {chatContacts.length} accepted connections • {chatContacts.filter(p => ONLINE_STATUS[p.id]).length} Online
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button onClick={() => setIsMinimized(true)} style={hdrBtnStyle} title="Minimize">
              <Minus size={14} />
            </button>
            <button onClick={() => setIsMaximized(p => !p)} style={hdrBtnStyle} title={isMaximized ? 'Restore' : 'Maximize'}>
              {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button onClick={onClose} style={{ ...hdrBtnStyle, backgroundColor: 'rgba(239,68,68,0.3)' }} title="Close">
              <X size={14} />
            </button>
          </div>
        </div>
      );
    }

    // Chat view header
    const prof = activeChatProfile;
    const isOnline = ONLINE_STATUS[prof?.id] ?? false;
    return (
      <div style={{ background: 'linear-gradient(135deg, #7A0026 0%, #A01040 100%)', color: '#FFFFFF', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #D4AF37', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => { setView('list'); setActiveCallType(null); }} style={{ background: 'none', border: 'none', color: '#F4E8C1', cursor: 'pointer', padding: '2px 4px 2px 0' }}>
            <ArrowLeft size={18} />
          </button>
          <div style={{ position: 'relative' }}>
            <img src={prof?.photo} alt={prof?.name}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4AF37' }} />
            <span style={{
              position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px',
              backgroundColor: isOnline ? '#10B981' : '#9CA3AF',
              borderRadius: '50%', border: '2px solid #7A0026'
            }} />
          </div>
          <div>
            <div style={{ fontFamily: 'Cinzel', fontSize: '14px', fontWeight: 800 }}>{prof?.name}</div>
            <div style={{ fontSize: '10px', color: isOnline ? '#6EE7B7' : '#F4E8C1', fontWeight: 700 }}>
              {isOnline ? '● Online Now' : '○ Last seen recently'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button onClick={() => setActiveCallType('audio')} style={hdrBtnStyle} title="Audio Call"><PhoneCall size={14} style={{ color: '#D4AF37' }} /></button>
          <button onClick={() => setActiveCallType('video')} style={hdrBtnStyle} title="Video Call"><Video size={14} style={{ color: '#D4AF37' }} /></button>
          <button onClick={() => setIsMinimized(true)} style={hdrBtnStyle} title="Minimize"><Minus size={14} /></button>
          <button onClick={() => setIsMaximized(p => !p)} style={hdrBtnStyle} title={isMaximized ? 'Restore' : 'Maximize'}>
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button onClick={onClose} style={{ ...hdrBtnStyle, backgroundColor: 'rgba(239,68,68,0.3)' }} title="Close"><X size={14} /></button>
        </div>
      </div>
    );
  };

  // ══════════════════════════════════════════════
  //  CHAT LIST VIEW
  // ══════════════════════════════════════════════
  const renderChatList = () => (
    <>
      {/* Search Bar */}
      <div style={{ padding: '10px 14px', backgroundColor: '#FAF7F2', borderBottom: '1px solid #EAE3D9', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px 10px 8px 28px', borderRadius: '10px', border: '1px solid #EAE3D9', fontSize: '12px', backgroundColor: '#FFFFFF', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>
      </div>

      {/* Contacts List */}
      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
        {filteredContacts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF' }}>
            <MessageCircle size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
            <p style={{ fontSize: '13px', fontWeight: 600 }}>No accepted connections yet.</p>
            <p style={{ fontSize: '11px', marginTop: '4px' }}>Accept an interest to start chatting!</p>
          </div>
        ) : filteredContacts.map((prof, idx) => {
          const lastMsg = getLastMsg(prof.id);
          const unread  = unreadCounts[prof.id] || 0;
          const isOnline = ONLINE_STATUS[prof.id] ?? false;
          const isActive = activeChatId === prof.id;

          return (
            <div
              key={prof.id}
              onClick={() => openChat(prof.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', cursor: 'pointer',
                backgroundColor: isActive ? '#FFF0F3' : 'transparent',
                borderBottom: '1px solid #F3F4F6',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#FAF7F2'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {/* Avatar with online dot */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img src={prof.photo} alt={prof.name}
                  style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${isActive ? '#7A0026' : '#EAE3D9'}` }} />
                <span style={{
                  position: 'absolute', bottom: '1px', right: '1px',
                  width: '11px', height: '11px', borderRadius: '50%',
                  backgroundColor: isOnline ? '#10B981' : '#9CA3AF',
                  border: '2px solid #FFFFFF'
                }} />
              </div>

              {/* Name + Last Message */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: unread > 0 ? 900 : 700, color: '#1F2937', truncate: true, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                    {prof.name}
                  </span>
                  <span style={{ fontSize: '10px', color: unread > 0 ? '#7A0026' : '#9CA3AF', fontWeight: unread > 0 ? 800 : 500, flexShrink: 0 }}>
                    {lastMsg?.time || ''}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                  {/* Last message preview */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: 0 }}>
                    {lastMsg?.sender === 'me' && <Ticks status={lastMsg.status} />}
                    <span style={{
                      fontSize: '11px', fontWeight: unread > 0 ? 700 : 500,
                      color: unread > 0 ? '#374151' : '#9CA3AF',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {lastMsg?.sender === 'me' ? 'You: ' : ''}{lastMsg?.attachment ? '📎 Attachment' : (lastMsg?.text || 'Say hello!')}
                    </span>
                  </div>

                  {/* Unread count badge */}
                  {unread > 0 && (
                    <span style={{
                      backgroundColor: '#7A0026', color: '#FFFFFF',
                      fontSize: '10px', fontWeight: 900, minWidth: '18px', height: '18px',
                      borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '0 5px', marginLeft: '8px', flexShrink: 0
                    }}>
                      {unread}
                    </span>
                  )}
                </div>

                {/* Accepted connection badge */}
                <div style={{ marginTop: '3px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#059669', backgroundColor: '#ECFDF5', padding: '1px 6px', borderRadius: '50px' }}>
                    ✓ Accepted Connection
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  // ══════════════════════════════════════════════
  //  ACTIVE CHAT VIEW
  // ══════════════════════════════════════════════
  const renderChat = () => {
    const messages = chatHistories[activeChatId] || [];
    const prof = activeChatProfile;

    return (
      <>
        {/* Call Overlay */}
        {activeCallType && (
          <div style={{ backgroundColor: '#1F191D', color: '#FFFFFF', padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flexShrink: 0, borderBottom: '2px solid #D4AF37' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={prof?.photo} alt={prof?.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4AF37' }} />
              <div>
                <h5 style={{ margin: 0, fontSize: '13px', fontWeight: 800 }}>
                  {activeCallType === 'video' ? '📹 Video Call' : '📞 Voice Call'}
                </h5>
                <p style={{ margin: 0, fontSize: '11px', color: '#34D399' }}>Ringing... {prof?.name}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setIsMuted(p => !p)} style={{ background: isMuted ? '#EF4444' : '#374151', color: '#fff', padding: '5px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {isMuted ? <MicOff size={12} /> : <Mic size={12} />} {isMuted ? 'Unmute' : 'Mute'}
              </button>
              <button onClick={() => setActiveCallType(null)} style={{ background: '#DC2626', color: '#fff', padding: '5px 14px', borderRadius: '50px', fontSize: '11px', fontWeight: 900, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <PhoneOff size={12} /> End
              </button>
            </div>
          </div>
        )}

        {/* Messages Body */}
        <div style={{ flex: 1, padding: '14px', backgroundColor: '#FAF7F2', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Encryption notice */}
          <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7', padding: '6px 12px', borderRadius: '10px', fontSize: '10px', color: '#92400E', textAlign: 'center', fontWeight: 700 }}>
            🔒 End-to-End Encrypted Matrimony Chat • Verified Profiles Only
          </div>

          {messages.map(msg => (
            <div key={msg.id} style={{ maxWidth: '82%', alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start', display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                padding: '9px 13px', borderRadius: '16px', fontSize: '12px', fontWeight: 600,
                backgroundColor: msg.sender === 'me' ? '#7A0026' : '#FFFFFF',
                color: msg.sender === 'me' ? '#FFFFFF' : '#1F191D',
                border: msg.sender === 'me' ? 'none' : '1px solid #EAE3D9',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)', lineHeight: '1.4'
              }}>
                {msg.text && <div>{msg.text}</div>}
                {msg.attachment && (
                  <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                    {msg.attachment.type === 'image' && (
                      <div>
                        <img src={msg.attachment.url} alt="Attachment" style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '4px' }} />
                        <span style={{ fontSize: '10px', opacity: 0.9 }}>🖼️ {msg.attachment.label}</span>
                      </div>
                    )}
                    {msg.attachment.type === 'file' && (
                      <div style={{ background: 'rgba(0,0,0,0.15)', padding: '5px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>
                        📄 {msg.attachment.label} ({msg.attachment.size})
                      </div>
                    )}
                    {msg.attachment.type === 'location' && (
                      <div style={{ background: 'rgba(0,0,0,0.15)', padding: '5px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>
                        {msg.attachment.mapPin}<div style={{ fontSize: '10px', opacity: 0.85 }}>{msg.attachment.address}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Time + Ticks */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px', fontSize: '10px', color: '#9CA3AF' }}>
                <span>{msg.time}</span>
                {msg.sender === 'me' && <Ticks status={msg.status} />}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Attachment Preview */}
        {attachment && (
          <div style={{ backgroundColor: '#FFFBEB', padding: '6px 12px', borderTop: '1px solid #FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#92400E', flexShrink: 0 }}>
            <span><strong>Attached:</strong> {attachment.type === 'image' ? '📸 Photo' : attachment.type === 'file' ? '📄 Document' : '📍 Location'} — {attachment.label || attachment.address}</span>
            <button onClick={() => setAttachment(null)} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontWeight: 900 }}>✕</button>
          </div>
        )}

        {/* Attach Toolbar */}
        <div style={{ backgroundColor: '#FAF7F2', padding: '5px 12px', borderTop: '1px solid #EAE3D9', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#665D65' }}>Attach:</span>
          <button onClick={handleAttachPhoto} style={attachBtnStyle('#7A0026')}><Image size={10} /> Photo</button>
          <button onClick={handleAttachFile}  style={attachBtnStyle('#0284C7')}><Paperclip size={10} /> Document</button>
          <button onClick={handleAttachLocation} style={attachBtnStyle('#059669')}><MapPin size={10} /> Location</button>
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} style={{ padding: '9px 12px', backgroundColor: '#FFFFFF', borderTop: '1px solid #EAE3D9', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          <input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            style={{ flex: 1, backgroundColor: '#FAF7F2', border: '1px solid #EAE3D9', borderRadius: '12px', padding: '9px 14px', fontSize: '12px', fontWeight: 600, outline: 'none' }}
          />
          <button type="submit" className="btn-ruby" style={{ fontSize: '11px', padding: '9px 16px', flexShrink: 0 }}>
            <Send size={13} /> Send
          </button>
        </form>
      </>
    );
  };

  // ══════════════════════════════════════════════
  //  MAIN RENDER
  // ══════════════════════════════════════════════
  return (
    <div style={widgetStyle}>
      {renderHeader()}
      {view === 'list' ? renderChatList() : renderChat()}
    </div>
  );
}

// ── Shared style helpers ─────────────────────
const hdrBtnStyle = {
  backgroundColor: 'rgba(255,255,255,0.12)', border: 'none', color: '#F4E8C1',
  cursor: 'pointer', padding: '5px', borderRadius: '6px', display: 'flex',
  alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s'
};

const attachBtnStyle = (color) => ({
  backgroundColor: '#FFFFFF', border: `1px solid #EAE3D9`, borderRadius: '50px',
  padding: '3px 8px', fontSize: '10px', fontWeight: 800, color, cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: '3px'
});
