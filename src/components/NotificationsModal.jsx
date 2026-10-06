import React from 'react';
import { Bell, Heart, Eye, CheckCircle2, Calendar, X, Sparkles, Check, Trash2, Star, ArrowRight } from 'lucide-react';

const TYPE_CONFIG = {
  accept:  { bg: '#D1FAE5', border: '#10B981', iconBg: '#059669', label: '✅ Interest Accepted'  },
  visitor: { bg: '#E0F2FE', border: '#0284C7', iconBg: '#0284C7', label: '👁️ Profile Visited'   },
  interest:{ bg: '#FFE4E6', border: '#F43F5E', iconBg: '#E11D48', label: '💌 Interest Received' },
  parivar: { bg: '#FEF3C7', border: '#D4AF37', iconBg: '#7A0026', label: '📅 Parivar Meet'      },
  match:   { bg: '#F3E8FF', border: '#9333EA', iconBg: '#7C3AED', label: '🎯 Top Match'          },
};

function NotifIcon({ type }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.interest;
  return (
    <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: cfg.bg, border: `1.5px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {type === 'accept'   && <CheckCircle2 size={18} color={cfg.iconBg} />}
      {type === 'visitor'  && <Eye          size={18} color={cfg.iconBg} />}
      {type === 'interest' && <Heart        size={18} color={cfg.iconBg} fill={cfg.iconBg} />}
      {type === 'parivar'  && <Calendar     size={18} color={cfg.iconBg} />}
      {type === 'match'    && <Star         size={18} color={cfg.iconBg} fill={cfg.iconBg} />}
    </div>
  );
}

export default function NotificationsModal({ notifications, profiles = [], onClose, onMarkAllRead, onSelectNotification, onClearNotification }) {
  const unreadCount = notifications.filter(n => !n.read).length;

  // Enrich each notification with profile data
  const enriched = notifications.map(n => {
    const prof = profiles.find(p => p.id === n.profileId);
    return { ...n, _prof: prof || null };
  });

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '2px solid #EAE3D9', boxShadow: '0 24px 64px rgba(0,0,0,0.3)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '92vh', animation: 'slideInRight 0.25s ease-out' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg,#7A0026,#58001B)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #D4AF37' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <Bell size={22} color="#D4AF37" />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: -5, right: -5, backgroundColor: '#EF4444', color: '#FFF', fontSize: 9, fontWeight: 900, width: 17, height: 17, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #7A0026' }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, fontWeight: 800, margin: 0, color: '#FFF' }}>Notifications</h3>
              <p style={{ fontSize: 11, color: '#F4E8C1', margin: 0 }}>{unreadCount} unread • Matches, visits & responses</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFF', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Controls */}
        <div style={{ padding: '10px 20px', backgroundColor: '#FAF7F2', borderBottom: '1px solid #EAE3D9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#665D65' }}>🔔 Live Alerts Center</span>
          {unreadCount > 0 && (
            <button onClick={onMarkAllRead} style={{ background: 'none', border: 'none', color: '#7A0026', fontWeight: 800, cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Check size={13} color="#059669" /> Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {enriched.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: '#9CA3AF' }}>
              <Bell size={40} color="#D1D5DB" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>No notifications yet</p>
              <p style={{ fontSize: 11, margin: '4px 0 0', color: '#9CA3AF' }}>Interest responses & visits will appear here</p>
            </div>
          ) : enriched.map(n => {
            const prof = n._prof;
            const typeCfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.interest;
            return (
              <div
                key={n.id}
                onClick={() => onSelectNotification(n)}
                style={{
                  padding: '13px 14px',
                  borderRadius: 18,
                  backgroundColor: n.read ? '#FFFFFF' : '#FFFBEB',
                  border: `1.5px solid ${n.read ? '#EAE3D9' : '#FDE68A'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  boxShadow: n.read ? 'none' : '0 2px 12px rgba(212,175,55,0.12)'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                {/* Profile photo or icon */}
                <div style={{ flexShrink: 0, position: 'relative' }}>
                  {prof?.photo ? (
                    <img
                      src={prof.photo}
                      alt={prof.name}
                      style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${typeCfg.border}` }}
                    />
                  ) : (
                    <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: typeCfg.bg, border: `2px solid ${typeCfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <NotifIcon type={n.type} />
                    </div>
                  )}
                  {/* Type badge overlay */}
                  <div style={{ position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: '50%', backgroundColor: typeCfg.iconBg, border: '2px solid #FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <NotifIcon type={n.type} />
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Type label + time */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 10, fontWeight: 900, color: typeCfg.iconBg, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {typeCfg.label}
                    </span>
                    <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>{n.time}</span>
                  </div>

                  {/* Profile name + subtitle */}
                  {prof && (
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#1F191D', marginBottom: 2 }}>
                      {prof.name}
                      {prof.age && <span style={{ fontWeight: 600, color: '#6B7280', fontSize: 11 }}> • {prof.age}y</span>}
                    </div>
                  )}

                  {prof && (
                    <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                      <span>{prof.occupation}</span>
                      {prof.city && <><span>•</span><span>📍 {prof.city}</span></>}
                      {prof.matchScore && (
                        <span style={{ background: '#7A0026', color: '#D4AF37', fontSize: 9, fontWeight: 900, padding: '1px 6px', borderRadius: 50 }}>
                          ⭐ {prof.matchScore}%
                        </span>
                      )}
                    </div>
                  )}

                  <p style={{ fontSize: 11, color: '#4B5563', margin: '0 0 6px', lineHeight: 1.4 }}>
                    {n.subtitle}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {!n.read && (
                      <span style={{ fontSize: 9, fontWeight: 900, color: '#D97706', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: 50 }}>
                        ● UNREAD
                      </span>
                    )}
                    {prof && (
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#7A0026', display: 'flex', alignItems: 'center', gap: 3, marginLeft: 'auto' }}>
                        View Profile <ArrowRight size={11} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={e => { e.stopPropagation(); onClearNotification(n.id); }}
                  style={{ background: 'none', border: 'none', color: '#D1D5DB', cursor: 'pointer', padding: '2px', flexShrink: 0, transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                  onMouseLeave={e => e.currentTarget.style.color = '#D1D5DB'}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px', backgroundColor: '#FAF7F2', borderTop: '1px solid #EAE3D9', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#665D65' }}>
          🔒 Bandhan Matrimony Alert Center • Realtime Updates
        </div>
      </div>
    </div>
  );
}
