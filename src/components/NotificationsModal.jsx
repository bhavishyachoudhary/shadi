import React from 'react';
import { Bell, Heart, Eye, CheckCircle2, Calendar, X, Sparkles, Check, Trash2 } from 'lucide-react';

export default function NotificationsModal({ notifications, onClose, onMarkAllRead, onSelectNotification, onClearNotification }) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '2px solid #EAE3D9', boxShadow: '0 20px 50px rgba(0,0,0,0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh', animation: 'fadeIn 0.2s ease-out' }}>
        
        {/* Header Bar */}
        <div style={{ padding: '20px 24px', backgroundColor: '#7A0026', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #D4AF37' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <Bell className="w-6 h-6 text-[#D4AF37]" />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#EF4444', color: '#FFFFFF', fontSize: '9px', fontWeight: 900, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justify: 'center', border: '1.5px solid #7A0026' }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 style={{ fontFamily: 'Cinzel', fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                Notifications ({unreadCount} unread)
              </h3>
              <p style={{ fontSize: '11px', color: '#F4E8C1', margin: 0 }}>
                Stay updated on matches, visits & responses
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: 'none', display: 'flex', alignItems: 'center', justify: 'center', cursor: 'pointer' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div style={{ padding: '12px 20px', backgroundColor: '#FAF7F2', borderBottom: '1px solid #EAE3D9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
          <span style={{ fontWeight: 700, color: '#665D65' }}>Live Alerts Center</span>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              style={{ background: 'none', border: 'none', color: '#7A0026', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Check className="w-3.5 h-3.5 text-[#059669]" /> Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#665D65' }}>
              <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p style={{ fontSize: '13px', fontWeight: 700 }}>No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onSelectNotification(n)}
                style={{
                  padding: '14px',
                  borderRadius: '16px',
                  backgroundColor: n.read ? '#FFFFFF' : '#FFFBEB',
                  border: `1.5px solid ${n.read ? '#EAE3D9' : '#FDE68A'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  display: 'flex',
                  gap: '12px'
                }}
              >
                {/* Icon Column */}
                <div style={{ flexShrink: 0 }}>
                  {n.type === 'accept' && (
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#D1FAE5', border: '1px solid #10B981', display: 'flex', alignItems: 'center', justify: 'center', color: '#059669' }}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  {n.type === 'visitor' && (
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#E0F2FE', border: '1px solid #0284C7', display: 'flex', alignItems: 'center', justify: 'center', color: '#0284C7' }}>
                      <Eye className="w-5 h-5" />
                    </div>
                  )}
                  {n.type === 'interest' && (
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#FFE4E6', border: '1px solid #F43F5E', display: 'flex', alignItems: 'center', justify: 'center', color: '#E11D48' }}>
                      <Heart className="w-5 h-5 fill-current" />
                    </div>
                  )}
                  {n.type === 'parivar' && (
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#FEF3C7', border: '1px solid #D4AF37', display: 'flex', alignItems: 'center', justify: 'center', color: '#7A0026' }}>
                      <Calendar className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Text Content Column */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <h5 style={{ fontSize: '13px', fontWeight: 800, color: '#1F191D', margin: 0 }}>
                      {n.title}
                    </h5>
                    <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 600 }}>
                      {n.time}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: '#4B5563', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                    {n.subtitle}
                  </p>

                  {!n.read && (
                    <span style={{ marginTop: '6px', fontSize: '9px', fontWeight: 900, color: '#D97706', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '50px', display: 'inline-block' }}>
                      ● UNREAD
                    </span>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearNotification(n.id);
                  }}
                  style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px', alignSelf: 'flex-start' }}
                  title="Remove alert"
                >
                  <Trash2 className="w-4 h-4 hover:text-red-600" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px', backgroundColor: '#FAF7F2', borderTop: '1px solid #EAE3D9', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#665D65' }}>
          🔒 Bandhan Matrimony Alert Center • Realtime Updates
        </div>

      </div>
    </div>
  );
}
