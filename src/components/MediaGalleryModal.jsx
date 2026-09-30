import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, Play, ShieldCheck, X } from 'lucide-react';

export default function MediaGalleryModal({ profile, photoAllowed = true, onClose }) {
  const media = useMemo(() => {
    if (!profile) return [];
    const photoList = profile.photos && profile.photos.length ? profile.photos : [profile.photo];
    const images = photoList.filter(Boolean).map((url, i) => ({ type: 'image', url, key: `img-${i}` }));
    const reel = profile.lifestyleVideo
      ? [{ type: 'reel', key: 'reel', ...profile.lifestyleVideo }]
      : [];
    return [...images, ...reel];
  }, [profile]);

  const [index, setIndex] = useState(0);
  const safeIndex = media.length ? Math.min(index, media.length - 1) : 0;
  const current = media[safeIndex];

  const go = useCallback((dir) => {
    if (!media.length) return;
    setIndex(i => (i + dir + media.length) % media.length);
  }, [media.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  if (!profile || !current) return null;

  const imageCount = media.filter(m => m.type === 'image').length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${profile.name} media gallery`}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(6,9,16,0.92)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', padding: 16 }}
    >
      {/* Header */}
      <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#FFF', maxWidth: 960, width: '100%', margin: '0 auto', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: 16, fontWeight: 900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.name}</span>
          {profile.isVerified && <ShieldCheck size={15} style={{ color: '#60A5FA', flexShrink: 0 }} />}
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 700, flexShrink: 0 }}>
            {current.type === 'reel' ? '🎬 Reel' : `Photo ${safeIndex + 1} / ${imageCount}`}
          </span>
        </div>
        <button onClick={onClose} aria-label="Close gallery" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <X size={18} />
        </button>
      </div>

      {/* Stage */}
      <div onClick={e => e.stopPropagation()} style={{ flex: 1, minHeight: 0, maxWidth: 960, width: '100%', margin: '12px auto', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {media.length > 1 && (
          <button onClick={() => go(-1)} aria-label="Previous" style={navBtnStyle('left')}><ChevronLeft size={22} /></button>
        )}

        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 18, overflow: 'hidden', border: '1.5px solid rgba(212,175,55,0.4)', background: '#0B1322' }}>
          {current.type === 'reel' ? (
            !photoAllowed ? (
              <LockedNotice label="This reel is private until your interest is accepted." />
            ) : (
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
                <video
                  key={current.videoUrl}
                  src={current.videoUrl}
                  poster={current.thumbnail}
                  controls
                  playsInline
                  style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }}
                />
                {current.caption && (
                  <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, fontSize: 12, color: 'rgba(255,255,255,0.9)', background: 'rgba(0,0,0,0.5)', padding: '7px 12px', borderRadius: 10, pointerEvents: 'none' }}>
                    {current.title} — {current.caption}
                  </div>
                )}
              </div>
            )
          ) : (
            <img
              src={current.url}
              alt={`${profile.name} photo ${safeIndex + 1}`}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block', filter: photoAllowed ? 'none' : 'blur(20px)', transform: photoAllowed ? 'none' : 'scale(1.05)' }}
            />
          )}
          {!photoAllowed && current.type === 'image' && (
            <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', gap: 6, color: '#FDE68A', background: 'rgba(0,0,0,0.65)', padding: '8px 14px', borderRadius: 50, fontSize: 12, fontWeight: 800, border: '1px solid rgba(212,175,55,0.5)' }}>
              <Lock size={13} /> Photo protected until accepted
            </div>
          )}
        </div>

        {media.length > 1 && (
          <button onClick={() => go(1)} aria-label="Next" style={navBtnStyle('right')}><ChevronRight size={22} /></button>
        )}
      </div>

      {/* Thumbnails */}
      <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 960, width: '100%', margin: '0 auto', flexShrink: 0 }}>
        {media.map((m, i) => (
          <button
            key={m.key}
            onClick={() => setIndex(i)}
            aria-label={m.type === 'reel' ? 'Reel' : `Photo ${i + 1}`}
            style={{ position: 'relative', width: 56, height: 56, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', flexShrink: 0, padding: 0, background: '#0B1322', border: i === safeIndex ? '2px solid #D4AF37' : '2px solid rgba(255,255,255,0.15)', boxShadow: i === safeIndex ? '0 0 12px rgba(212,175,55,0.5)' : 'none' }}
          >
            <img src={m.type === 'reel' ? m.thumbnail : m.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: photoAllowed ? 'none' : 'blur(6px)' }} />
            {m.type === 'reel' && (
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)' }}>
                <Play size={16} fill="#FFF" stroke="none" />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function navBtnStyle(side) {
  return {
    position: 'absolute',
    [side]: 8,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
    width: 42,
    height: 42,
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.55)',
    color: '#FFF',
    border: '1px solid rgba(255,255,255,0.25)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
}

function LockedNotice({ label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.75)', padding: 40, textAlign: 'center' }}>
      <Lock size={30} style={{ color: '#D4AF37' }} />
      <p style={{ fontSize: 13, fontWeight: 700, margin: 0, maxWidth: 260 }}>{label}</p>
    </div>
  );
}
