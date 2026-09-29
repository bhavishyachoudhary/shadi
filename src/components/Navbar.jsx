import React, { useState } from 'react';
import { Heart, Sparkles, MessageCircle, Search, Eye, Bell, LogIn, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  activeCount, 
  visitorCount = 4, 
  unreadNotificationsCount = 4, 
  currentUser, 
  isLoggedIn, 
  onOpenMyProfile, 
  onOpenNotifications, 
  onOpenAuth, 
  onLogout 
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="app-navbar">
      <div className="nav-content-box">
        
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('search')} 
          className="logo-box"
        >
          <div className="logo-circle">
            <Heart className="w-5 h-5 fill-white stroke-none" />
          </div>
          <div className="logo-title">
            BANDHAN <span className="logo-gold">Shaadi</span>
          </div>
        </div>

        {/* Navigation Bar Links */}
        <nav className="nav-links-bar">
          <button
            onClick={() => setActiveTab('search')}
            className={`nav-link-item ${activeTab === 'search' ? 'active' : 'inactive'}`}
          >
            <Search className="w-4 h-4" />
            Find Matches
          </button>

          <button
            onClick={() => setActiveTab('visitors')}
            className={`nav-link-item ${activeTab === 'visitors' ? 'active' : 'inactive'}`}
          >
            <Eye className="w-4 h-4 text-[#0284C7]" />
            Visitors
            {visitorCount > 0 && (
              <span style={{ backgroundColor: '#0284C7', color: '#FFFFFF', padding: '2px 8px', borderRadius: '50px', fontSize: '10px', fontWeight: 800 }}>
                {visitorCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('guna-milan')}
            className={`nav-link-item ${activeTab === 'guna-milan' ? 'active' : 'inactive'}`}
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            36 Gunas Milan
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`nav-link-item ${activeTab === 'inbox' ? 'active' : 'inactive'}`}
          >
            <MessageCircle className="w-4 h-4" />
            Inbox
            {activeCount > 0 && (
              <span style={{ backgroundColor: '#D4AF37', color: '#000000', padding: '2px 8px', borderRadius: '50px', fontSize: '10px', fontWeight: 800 }}>
                {activeCount}
              </span>
            )}
          </button>
        </nav>

        {/* Essential Header Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Notifications Bell Icon */}
          <button
            onClick={onOpenNotifications}
            style={{ 
              position: 'relative', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: '#FAF7F2', 
              border: '1.5px solid #D4AF37', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-[#7A0026]" />
            {unreadNotificationsCount > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#EF4444', color: '#FFFFFF', fontSize: '9px', fontWeight: 900, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFFFFF' }}>
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {isLoggedIn ? (
            /* Logged-In User Profile Chip with Dropdown */
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowUserMenu(p => !p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                  padding: '4px 12px 4px 4px', borderRadius: '50px',
                  border: '1.5px solid #D4AF37', background: '#FFF9F0',
                  whiteSpace: 'nowrap', flexShrink: 0
                }}
                title="Account Menu"
              >
                <img
                  src={currentUser?.photo || (currentUser?.gender === 'Bride'
                    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
                  )}
                  alt={currentUser?.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4AF37', flexShrink: 0 }}
                />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#7A0026' }}>
                  {currentUser?.name || 'User'}
                </span>
                <ChevronDown size={14} style={{ color: '#7A0026' }} />
              </div>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: '#FFFFFF', borderRadius: '16px', minWidth: '180px',
                  border: '1.5px solid #EAE3D9', boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  zIndex: 9999, overflow: 'hidden'
                }}>
                  <button onClick={() => { onOpenMyProfile(); setShowUserMenu(false); }} style={menuItemStyle}>
                    <ShieldCheck size={14} style={{ color: '#7A0026' }} /> View My Profile
                  </button>
                  <div style={{ height: '1px', background: '#EAE3D9' }} />
                  <button onClick={() => { if(onLogout) onLogout(); setShowUserMenu(false); }} style={{ ...menuItemStyle, color: '#DC2626' }}>
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out — Clean Login / Sign Up Button */
            <button
              onClick={onOpenAuth}
              className="btn-ruby"
              style={{ fontSize: '13px', padding: '9px 20px' }}
            >
              <LogIn size={15} /> Login / Sign Up
            </button>
          )}

        </div>

      </div>
    </header>
  );
}

const menuItemStyle = {
  display: 'flex', alignItems: 'center', gap: '8px',
  width: '100%', padding: '11px 16px', background: 'none', border: 'none',
  cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#374151',
  textAlign: 'left'
};

