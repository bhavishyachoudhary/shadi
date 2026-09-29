import React, { useState } from 'react';
import { X, Play, Heart, ShieldCheck, Calendar, Check, Volume2, VolumeX } from 'lucide-react';

export default function LifestyleReelsModal({ profile, onClose, onExpressInterest, isInterested, interestStatus, onOpenParivarMeet }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!profile || !profile.lifestyleVideo) return null;

  const caption = profile.lifestyleVideo.caption || '';
  const isLongCaption = caption.length > 45;
  const displayCaption = (!isExpanded && isLongCaption) ? `${caption.slice(0, 45)}...` : caption;

  return (
    <div className="modal-backdrop-overlay">
      
      {/* 9:16 Smartphone Reel Modal Container */}
      <div 
        style={{
          width: '380px',
          maxWidth: '92vw',
          height: '660px',
          maxHeight: '90vh',
          backgroundColor: '#000000',
          borderRadius: '32px',
          border: '2px solid rgba(212, 175, 55, 0.5)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(122, 0, 38, 0.35)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        
        {/* Full Video / Thumbnail Background */}
        <div 
          onClick={() => setIsPlaying(!isPlaying)}
          style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
        >
          <img
            src={profile.lifestyleVideo.thumbnail || profile.photo}
            alt={profile.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isPlaying ? 1 : 0.85, transition: 'opacity 0.3s ease' }}
          />
        </div>

        {/* TOP FLOATING HEADER (Minimalist Clean Close Button Top Right) */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)' }}>
          
          {/* Clean Close Button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}
            title="Close Reel"
          >
            <X style={{ width: '26px', height: '26px', color: '#FFFFFF', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.9))' }} />
          </button>
        </div>

        {/* CENTER FLOATING PLAY INDICATOR (Only when paused) */}
        {!isPlaying && (
          <div 
            onClick={() => setIsPlaying(true)}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 25,
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(12px)',
              border: '2px solid #D4AF37',
              color: '#FFFFFF',
              boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}
          >
            <Play style={{ width: '28px', height: '28px', color: '#D4AF37', marginLeft: '3px' }} />
          </div>
        )}

        {/* RIGHT SIDEBAR CONTROL STACK (Frameless Clean Floating Icons) */}
        <div style={{ position: 'absolute', right: '16px', bottom: '24px', zIndex: 35, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          
          {/* 1. Heart (Express Interest) Icon with Multi-State Colors */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <button
              type="button"
              onClick={() => onExpressInterest(profile.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}
              title="Cycle Interest Status"
            >
              {interestStatus === 'accepted' && (
                <Check style={{ width: '32px', height: '32px', color: '#10B981', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }} />
              )}
              {interestStatus === 'declined' && (
                <X style={{ width: '32px', height: '32px', color: '#EF4444', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }} />
              )}
              {interestStatus === 'sent' && (
                <Heart style={{ width: '30px', height: '30px', fill: '#34D399', stroke: 'none', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }} />
              )}
              {!interestStatus && (
                <Heart style={{ width: '30px', height: '30px', fill: '#FFFFFF', stroke: 'none', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }} />
              )}
            </button>
            <span style={{ fontSize: '10px', fontWeight: 800, color: interestStatus === 'accepted' ? '#34D399' : (interestStatus === 'declined' ? '#F87171' : (interestStatus === 'sent' ? '#34D399' : '#FFFFFF')), textShadow: '0 2px 6px rgba(0,0,0,0.9)', textAlign: 'center' }}>
              {interestStatus === 'accepted' ? 'Accepted' : (interestStatus === 'declined' ? 'Declined' : (interestStatus === 'sent' ? 'Sent' : 'Interest'))}
            </span>
          </div>

          {/* 2. Parivar Meet Video Call Icon */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenParivarMeet(profile);
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}
              title="Schedule Parivar Meet"
            >
              <Calendar style={{ width: '28px', height: '28px', color: '#D4AF37', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }} />
            </button>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#F4E8C1', textShadow: '0 2px 6px rgba(0,0,0,0.9)', textAlign: 'center' }}>
              Parivar
            </span>
          </div>

          {/* 3. Audio Icon (Mute / Unmute) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isMuted ? (
                <VolumeX style={{ width: '28px', height: '28px', color: '#F87171', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }} />
              ) : (
                <Volume2 style={{ width: '28px', height: '28px', color: '#D4AF37', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }} />
              )}
            </button>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#EAE3D9', textShadow: '0 2px 6px rgba(0,0,0,0.9)', textAlign: 'center' }}>
              {isMuted ? 'Muted' : 'Audio'}
            </span>
          </div>

        </div>

        {/* BOTTOM PANEL OVERLAY */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20, padding: '30px 80px 20px 16px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.75) 65%, transparent 100%)', pointerEvents: 'auto' }}>
          
          {/* User Profile Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src={profile.photo} 
              alt={profile.name} 
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4AF37', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }} 
            />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.9)', margin: 0, whiteSpace: 'nowrap' }}>
                  {profile.name}
                </h4>
                {profile.isVerified && <ShieldCheck className="w-4 h-4 text-[#38BDF8] shrink-0" />}
              </div>
              <p style={{ fontSize: '11px', color: '#F4E8C1', margin: '2px 0 0 0', fontWeight: 600 }}>
                {profile.occupation} • {profile.city}
              </p>
            </div>
          </div>

          {/* Weekend Routine Title */}
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.9)', marginTop: '2px' }}>
            🎬 {profile.lifestyleVideo.title}
          </div>

          {/* Description Caption with Read More Link */}
          <div style={{ fontSize: '12px', color: '#EAE3D9', lineHeight: '1.45', textShadow: '0 2px 4px rgba(0,0,0,0.9)', margin: 0 }}>
            <span>"{displayCaption}"</span>
            {isLongCaption && (
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#D4AF37',
                  fontWeight: 800,
                  fontSize: '11px',
                  cursor: 'pointer',
                  marginLeft: '6px',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                {isExpanded ? 'Show less' : 'Read more...'}
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
