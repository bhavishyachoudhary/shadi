import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, Tooltip, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin, ShieldCheck, Sparkles, Heart,
  X, Video, Calendar, Target,
  Crown, RefreshCw, MessageCircle, Star, Search,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowLeft,
  Minimize2, Maximize2, Crosshair, Eye, Filter
} from 'lucide-react';
import { getMinDistanceToCenters } from '../utils/distance';
import { mockLocations } from '../data/mockLocations';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const hasCoordinates = value => value
  && value.lat !== null
  && value.lat !== undefined
  && value.lng !== null
  && value.lng !== undefined
  && Number.isFinite(Number(value.lat))
  && Number.isFinite(Number(value.lng));

// ── Photo pin: circular profile picture inside a pin shape ──
function buildPinIcon(color, border, photoUrl, isSelected, isOnline, isViewed) {
  const size = isSelected ? 62 : 50;
  const halfSize = size / 2;
  const pinR = halfSize - 5;
  const stemTop = halfSize + pinR + 1;
  const stemBot = size + 13;
  const dotCY  = size + 17;
  const svgH   = size + 21;

  // Pulse ring for selected
  const pulse = isSelected
    ? `<circle cx="${halfSize}" cy="${halfSize}" r="${pinR + 3}" fill="none" stroke="${border}" stroke-width="2.5" opacity="0.55">
        <animate attributeName="r" from="${pinR + 3}" to="${pinR + 14}" dur="1.4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from="0.55" to="0" dur="1.4s" repeatCount="indefinite"/>
       </circle>`
    : '';

  // Soft gold dashed ring for previously-viewed (non-selected) pins
  const viewedRing = (!isSelected && isViewed)
    ? `<circle cx="${halfSize}" cy="${halfSize}" r="${pinR + 6}" fill="none" stroke="#D4AF37" stroke-width="2" stroke-dasharray="4 3" opacity="0.85"/>`
    : '';

  // Clip the photo to the circle
  const clipId = `clip-${isSelected ? 's' : 'n'}-${isOnline ? '1' : '0'}`;
  const filterId = `sh-${isSelected ? 's' : 'n'}`;

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${svgH}" viewBox="0 0 ${size} ${svgH}">`,
    '<defs>',
    `  <filter id="${filterId}" x="-35%" y="-25%" width="170%" height="170%">`,
    `    <feDropShadow dx="0" dy="${isSelected ? 6 : 3}" stdDeviation="${isSelected ? 7 : 4}" flood-color="rgba(0,0,0,${isSelected ? 0.65 : 0.45})"/>`,
    '  </filter>',
    // Clip exactly to the inner photo circle (same radius as the border stroke inner edge)
    `  <clipPath id="${clipId}">`,
    `    <circle cx="${halfSize}" cy="${halfSize}" r="${pinR - 1.5}"/>`,
    '  </clipPath>',
    '</defs>',
    pulse,
    viewedRing,
    // pin body — drawn first as the border ring
    `<circle cx="${halfSize}" cy="${halfSize}" r="${pinR}" fill="${color}" stroke="${border}" stroke-width="${isSelected ? 4 : 3}" filter="url(#${filterId})"/>`,
    // photo fills the pin completely — clip keeps it inside the border
    photoUrl
      ? `<image href="${photoUrl}" x="0" y="0" width="${size}" height="${size}" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>`
      : `<text x="${halfSize}" y="${halfSize + 7}" text-anchor="middle" font-size="${isSelected ? 22 : 18}" font-family="system-ui">👤</text>`,
    // online dot — top-right
    isOnline ? `<circle cx="${size - 5}" cy="8" r="6" fill="#10B981" stroke="#fff" stroke-width="2"/>` : '',
    // selected: add a subtle bright inner ring highlight instead of crown (keeps the face clean)
    isSelected ? `<circle cx="${halfSize}" cy="${halfSize}" r="${pinR - 1.5}" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="2"/>` : '',
    // stem
    `<line x1="${halfSize}" y1="${stemTop}" x2="${halfSize}" y2="${stemBot}" stroke="${border}" stroke-width="${isSelected ? 4 : 3}" stroke-linecap="round"/>`,
    `<circle cx="${halfSize}" cy="${dotCY}" r="4" fill="${border}"/>`,
    '</svg>'
  ].join('\n');

  return L.divIcon({
    className: '',
    html: svg,
    iconSize:    [size, svgH],
    iconAnchor:  [halfSize, svgH],
    popupAnchor: [0, -svgH],
  });
}

// Notify Leaflet when the container resizes so tiles repaint correctly
function MapResizer({ trigger }) {
  const map = useMap();
  useEffect(() => {
    // Wait for the CSS transition to finish (250 ms) before invalidating
    const id = setTimeout(() => map.invalidateSize({ animate: false }), 280);
    return () => clearTimeout(id);
  }, [trigger, map]);
  return null;
}

// Helper: FlyTo or soft pan
function MapController({ flyTarget, hoverTarget }) {
  const map = useMap();
  useEffect(() => {
    if (hasCoordinates(flyTarget)) {
      map.flyTo([flyTarget.lat, flyTarget.lng], flyTarget.zoom || 8, { duration: 1.2, easeLinearity: 0.35 });
    }
  }, [flyTarget, map]);

  // Soft pan to hovered sidebar card — no zoom change, just re-center smoothly
  useEffect(() => {
    if (hasCoordinates(hoverTarget)) {
      map.panTo([hoverTarget.lat, hoverTarget.lng], { animate: true, duration: 0.5 });
    }
  }, [hoverTarget, map]);

  return null;
}

// Development catalog; the global Places service replaces this in the live-data phase.
const CITIES_DATABASE = [
  ...mockLocations,
  { id: 'All', label: 'All Locations', state: 'Worldwide', country: 'Worldwide', countryCode: 'ALL', emoji: '🌍', lat: 22.0, lng: 79.0 },
];

const RADIUS_PRESETS = [
  { label: '25 km',    val: 25 },
  { label: '50 km',    val: 50 },
  { label: '100 km',   val: 100 },
  { label: '250 km',   val: 250 },
  { label: '500 km',   val: 500 },
  { label: '🌍 All',   val: 5000 },
];

function pinStyle(profile, interestMap, selectedId, hoveredId) {
  const status    = interestMap[profile.id];
  const isOnline  = Boolean(profile.activeStatus?.includes('Online') || profile.isOnline);
  const isSelected = String(selectedId) === String(profile.id);
  const isHovered  = !isSelected && hoveredId && String(hoveredId) === String(profile.id);
  const photoUrl   = (profile.photoPrivacy === 'Public' || status === 'accepted')
    ? (profile.photo || null)
    : null;

  let color  = '#FFFFFF';
  let border = '#7A0026';

  if (!profile.isInRadius)        { color = '#FEF3C7'; border = '#D97706'; }
  if (status === 'accepted')      { color = '#D1FAE5'; border = '#10B981'; }
  else if (status === 'declined') { color = '#FEE2E2'; border = '#EF4444'; }
  else if (status === 'sent')     { color = '#CCFBF1'; border = '#14B8A6'; }

  if (isSelected) { border = '#7A0026'; color = '#FFF0F3'; }
  // Hover: vivid gold glow, keeps photo but swaps ring to deep gold
  if (isHovered)  { border = '#C79A2E'; color = '#FFFAE8'; }

  return { color, border, photoUrl, isSelected, isHovered, isOnline };
}

// ═══════════════════════════════════════════════════════════
export default function MapView({
  profiles = [],
  onExpressInterest,
  interestMap = {},
  onSelectProfile,
  onOpenLifestyleReels,
  onOpenParivarMeet,
  onOpenGallery,
  currentUser = null,
  showAllProfiles = false
}) {
  const [myLocation,     setMyLocation]     = useState({ lat: 12.9716, lng: 77.5946, city: 'Bengaluru' });
  const [showUpdateLoc,  setShowUpdateLoc]  = useState(false);
  const [pendingCity,    setPendingCity]    = useState('Sirsa');
  
  // Dynamic Selected Cities list (can hold string IDs or city objects)
  const [selectedCities, setSelectedCities] = useState([
    CITIES_DATABASE.find(c => c.id === 'Bengaluru'),
    CITIES_DATABASE.find(c => c.id === 'Delhi')
  ]);

  const [radiusKm,       setRadiusKm]       = useState(250);
  const [showOuter,      setShowOuter]      = useState(true);
  const [selectedProfile,setSelectedProfile] = useState(null);
  // Keep a Set of every profile id that has been opened — persists while the map is mounted
  const [viewedIds, setViewedIds] = useState(() => new Set());
  const [showFilters,    setShowFilters]    = useState(true);
  const [flyTarget,      setFlyTarget]      = useState(null);
  const [hoverTarget,    setHoverTarget]    = useState(null); // sidebar card hover → map pan + tooltip
  const [hoverPinId,     setHoverPinId]     = useState(null); // direct map pin mouseover
  const markerRefs = React.useRef({});  // profileId → Leaflet Marker instance
  const [mapType,        setMapType]        = useState('satellite');

  // Search input state for city search
  const [citySearch,     setCitySearch]     = useState('');
  const [isSearchOpen,   setIsSearchOpen]   = useState(false);

  // Feature 5: Parent location search mode ('work' | 'parent')
  const [searchMode, setSearchMode] = useState('work');

  // When a sidebar card is hovered, open that marker's tooltip on the map
  React.useEffect(() => {
    if (!hoverTarget) {
      // close any open tooltip driven by hover
      Object.values(markerRefs.current).forEach(marker => {
        try { marker.closeTooltip(); } catch { /* marker may not be mounted */ }
      });
      return;
    }
    const marker = markerRefs.current[String(hoverTarget.id)];
    if (marker) {
      try { marker.openTooltip(); } catch { /* marker may not be mounted */ }
    }
  }, [hoverTarget]);

  // Sidebar layout: 'collapsed' | 'normal' | 'expanded'
  const [sidebarState,   setSidebarState]   = useState('normal');
  const sidebarColumn = sidebarState === 'collapsed'
    ? '46px'
    : sidebarState === 'expanded'
      ? 'min(640px, 48vw)'
      : '365px';

  // Open a profile in the sidebar and record it as viewed
  const openProfile = (p) => {
    if (!p) return;
    setSelectedProfile(p);
    setViewedIds(prev => {
      if (prev.has(String(p.id))) return prev;
      const next = new Set(prev);
      next.add(String(p.id));
      return next;
    });
    if (hasCoordinates(p)) setFlyTarget({ lat: p.lat, lng: p.lng, zoom: 11 });
  };


  const genderTab = useMemo(() => {
    if (showAllProfiles) return 'All';
    const g = currentUser?.gender || 'Groom';
    return g === 'Groom' ? 'Bride' : 'Groom';
  }, [currentUser, showAllProfiles]);

  /* ── Compute distance + radius for EACH profile ── */
  /* Feature 5: when searchMode === 'parent', use parentLocation coords instead of work coords */
  const profilesWithDist = profiles.map(p => {
    const useLat = (searchMode === 'parent' && p.parentLocation?.lat) ? p.parentLocation.lat : p.lat;
    const useLng = (searchMode === 'parent' && p.parentLocation?.lng) ? p.parentLocation.lng : p.lng;
    const { minDistance, nearestCenterName } = getMinDistanceToCenters(useLat, useLng, selectedCities);
    const hasAll = selectedCities.some(c => (typeof c === 'object' ? c.id : c) === 'All');
    const isInRadius = hasAll || radiusKm >= 3000 || minDistance <= radiusKm;
    return { ...p, minDistance, nearestCenterName, isInRadius, _searchLat: useLat, _searchLng: useLng };
  });


  /* Filter by gender tab AND showOuter */
  const displayed = profilesWithDist.filter(p => {
    if (genderTab !== 'All' && p.gender !== genderTab) return false;
    if (!showOuter && !p.isInRadius) return false;
    return true;
  });

  const inCnt  = displayed.filter(p =>  p.isInRadius).length;
  const outCnt = displayed.filter(p => !p.isInRadius).length;

  // City Search matching suggestions
  const suggestions = useMemo(() => {
    if (!citySearch.trim()) return [];
    const q = citySearch.toLowerCase();
    return CITIES_DATABASE.filter(c =>
      c.label.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  }, [citySearch]);

  // Select a city from search
  const handleSelectCityFromSearch = (cityObj) => {
    setCitySearch('');
    setIsSearchOpen(false);

    setSelectedCities(prev => {
      const filtered = prev.filter(c => (typeof c === 'object' ? c.id : c) !== 'All');
      const exists = filtered.some(c => (typeof c === 'object' ? c.id : c) === cityObj.id);
      if (exists) return filtered;
      return [...filtered, cityObj];
    });

    setFlyTarget({ lat: cityObj.lat, lng: cityObj.lng, zoom: 10 });
  };

  // Remove selected city pill
  const handleRemoveCity = (cityIdToRemove) => {
    setSelectedCities(prev => {
      const upd = prev.filter(c => (typeof c === 'object' ? c.id : c) !== cityIdToRemove);
      if (upd.length === 0) return [CITIES_DATABASE.find(x => x.id === 'All') || 'All'];
      return upd;
    });
  };

  // Quick Preset Add City (e.g. Sirsa, Haryana)
  const handleQuickAddCity = (cityId) => {
    const cObj = CITIES_DATABASE.find(x => x.id === cityId);
    if (cObj) handleSelectCityFromSearch(cObj);
  };

  const handleUpdateLoc = () => {
    const c = CITIES_DATABASE.find(x => x.id === pendingCity);
    if (c) {
      setMyLocation({ lat: c.lat, lng: c.lng, city: c.label });
      setFlyTarget({ lat: c.lat, lng: c.lng, zoom: 10 });
    }
    setShowUpdateLoc(false);
  };

  /* ── Shared style tokens ── */
  const PA = { background: 'rgba(212,175,55,0.22)', border: '1.5px solid #D4AF37', color: '#D4AF37' };
  const PI = { background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' };
  const PANEL = {
    background: 'linear-gradient(160deg, rgba(8,14,26,0.96) 0%, rgba(15,23,38,0.98) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1.5px solid rgba(212,175,55,0.45)',
    borderRadius: '18px',
    boxShadow: '0 16px 40px rgba(0,0,0,0.75)'
  };
  const LBL = { fontSize: '10px', fontWeight: 900, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.8px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#090E1A', height: 'calc(100vh - 70px)', overflow: 'hidden' }}>

      {/* ══ BODY ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: `1fr ${sidebarColumn}`, flex: 1, height: '100%', transition: 'grid-template-columns 0.25s ease' }}>

        {/* ── MAP SIDE ── */}
        <div style={{ position: 'relative', height: '100%' }}>

          {/* ► Floating Range Indicator Badge (Top Right) */}
          <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 1200, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(8,15,26,0.92)', backdropFilter: 'blur(16px)', border: '1.5px solid rgba(212,175,55,0.45)', borderRadius: 50, padding: '7px 16px', boxShadow: '0 8px 28px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 900, color: '#10B981' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
              🎯 {inCnt} In-Range
            </div>
            {outCnt > 0 && (
              <>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>|</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 900, color: '#F59E0B' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 10px #F59E0B' }} />
                  🔒 {outCnt} Out-Range
                </div>
              </>
            )}
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>|</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>{displayed.length} Total</span>
          </div>

          {/* ► Modern Left Glassmorphic Filter Panel */}
          <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 1200, width: 320, ...PANEL, overflow: 'visible' }}>
            <div onClick={() => setShowFilters(!showFilters)} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: showFilters?'1px solid rgba(212,175,55,0.2)':'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Filter size={15} style={{ color: '#D4AF37' }}/>
                <span style={{ ...LBL, fontSize: 11 }}>Partner Location & Filter Controls</span>
              </div>
              {showFilters ? <ChevronUp size={15} style={{ color: '#D4AF37' }}/> : <ChevronDown size={15} style={{ color: '#D4AF37' }}/>}
            </div>

            {showFilters && (
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 'calc(100vh - 170px)', overflowY: 'auto' }}>
                
                {/* 1. CITY SEARCH INPUT BOX (Search Any City like Sirsa, Haryana) */}
                <div>
                  <div style={{ ...LBL, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Search size={11} /> Search & Add Any City (e.g. Sirsa, Haryana)
                  </div>
                  
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: 'rgba(255,255,255,0.07)',
                      border: isSearchOpen ? '1.5px solid #D4AF37' : '1px solid rgba(212,175,55,0.3)',
                      borderRadius: 12,
                      padding: '8px 12px',
                      boxShadow: isSearchOpen ? '0 0 12px rgba(212,175,55,0.3)' : 'none',
                      transition: 'all 0.2s'
                    }}>
                      <Search size={14} style={{ color: '#D4AF37', flexShrink: 0 }} />
                      <input
                        type="text"
                        placeholder="Type city name (e.g. Sirsa, Hisar, Jaipur)..."
                        value={citySearch}
                        onChange={e => {
                          setCitySearch(e.target.value);
                          setIsSearchOpen(true);
                        }}
                        onFocus={() => setIsSearchOpen(true)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: '#FFF',
                          fontSize: 12,
                          fontWeight: 700,
                          width: '100%'
                        }}
                      />
                      {citySearch && (
                        <X size={14} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }} onClick={() => setCitySearch('')} />
                      )}
                    </div>

                    {/* Auto-complete Dropdown */}
                    {isSearchOpen && suggestions.length > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '108%',
                        left: 0,
                        right: 0,
                        zIndex: 1400,
                        background: '#0B1322',
                        border: '1.5px solid #D4AF37',
                        borderRadius: 12,
                        maxHeight: 200,
                        overflowY: 'auto',
                        boxShadow: '0 14px 36px rgba(0,0,0,0.85)'
                      }}>
                        {suggestions.map(c => (
                          <div
                            key={c.id}
                            onClick={() => handleSelectCityFromSearch(c)}
                            style={{
                              padding: '9px 13px',
                              fontSize: 12,
                              fontWeight: 700,
                              color: '#FFF',
                              cursor: 'pointer',
                              borderBottom: '1px solid rgba(255,255,255,0.06)',
                              display: 'flex',
                              alignItems: 'center',
                              justify: 'space-between',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.22)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {c.emoji} {c.label}
                            </span>
                            <span style={{ fontSize: 9, fontWeight: 900, color: '#D4AF37', background: 'rgba(212,175,55,0.15)', padding: '2px 7px', borderRadius: 50 }}>
                              {c.state}{c.country !== 'India' ? `, ${c.country}` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. ACTIVE SELECTED CITIES CHIPS */}
                <div>
                  <div style={{ ...LBL, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MapPin size={11} /> Active Location Centers ({selectedCities.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selectedCities.map(cityItem => {
                      const cObj = typeof cityItem === 'object'
                        ? cityItem
                        : CITIES_DATABASE.find(x => x.id === cityItem) || { id: cityItem, label: cityItem, emoji: '📍' };
                      
                      return (
                        <div
                          key={cObj.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            background: 'linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(122,0,38,0.25) 100%)',
                            border: '1.5px solid #D4AF37',
                            color: '#FFF',
                            padding: '4px 10px',
                            borderRadius: 50,
                            fontSize: 11,
                            fontWeight: 800,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                          }}
                        >
                          <span>{cObj.emoji || '📍'} {cObj.label}</span>
                          {selectedCities.length > 1 && (
                            <X
                              size={12}
                              onClick={(e) => { e.stopPropagation(); handleRemoveCity(cObj.id); }}
                              style={{ cursor: 'pointer', color: '#D4AF37', marginLeft: 2 }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. QUICK REGION PRESETS (Haryana, Punjab, Delhi NCR, etc.) */}
                <div>
                  <div style={{ ...LBL, marginBottom: 6 }}>Quick Region Presets</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {[
                      { id: 'Sirsa', label: '🌾 Sirsa (Haryana)' },
                      { id: 'Hisar', label: '🌾 Hisar' },
                      { id: 'Gurugram', label: '🏢 Gurugram' },
                      { id: 'Chandigarh', label: '🌳 Chandigarh' },
                      { id: 'Delhi', label: '🏛️ Delhi NCR' },
                      { id: 'Jaipur', label: '🕌 Jaipur' },
                    ].map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => handleQuickAddCity(preset.id)}
                        style={{
                          padding: '4px 9px',
                          borderRadius: 50,
                          fontSize: 10,
                          fontWeight: 800,
                          border: '1px solid rgba(212,175,55,0.3)',
                          background: 'rgba(255,255,255,0.05)',
                          color: 'rgba(255,255,255,0.8)',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. MAP MODE CONTROLS */}
                <div style={{ borderTop: '1px solid rgba(212,175,55,0.15)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <div style={{ ...LBL, marginBottom: 5 }}>Map View Style</div>
                    <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.06)', padding: 3, borderRadius: 50, border: '1px solid rgba(212,175,55,0.25)' }}>
                      {[{id:'satellite',l:'🛰️ Satellite View'},{id:'street',l:'🗺️ Street Map'}].map(t => (
                        <button key={t.id} onClick={() => setMapType(t.id)} style={{ flex: 1, padding: '5px 0', borderRadius: 50, fontSize: 10, fontWeight: 800, border: 'none', cursor: 'pointer', background: mapType===t.id?'#D4AF37':'transparent', color: mapType===t.id?'#090E1A':'rgba(255,255,255,0.7)', transition: 'all 0.15s' }}>
                          {t.l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. RADIUS SLIDER */}
                <div style={{ borderTop: '1px solid rgba(212,175,55,0.15)', paddingTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                    <span style={{ ...LBL, display: 'flex', alignItems: 'center', gap: 4 }}><Target size={11}/>Search Radius</span>
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#090E1A', background: '#D4AF37', padding: '2px 10px', borderRadius: 50 }}>{radiusKm>=3000?'🌍 All India':radiusKm+' km'}</span>
                  </div>
                  <input type="range" min="10" max="1000" step="10" value={Math.min(radiusKm,1000)} onChange={e=>setRadiusKm(+e.target.value)} style={{ width:'100%', accentColor:'#D4AF37', cursor:'pointer', height: 4 }}/>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:7 }}>
                    {RADIUS_PRESETS.map(p=>(
                      <button key={p.val} onClick={()=>setRadiusKm(p.val)} style={{ padding:'3px 8px', borderRadius:50, fontSize:9, fontWeight:800, cursor:'pointer', ...(radiusKm===p.val?PA:PI) }}>{p.label}</button>
                    ))}
                  </div>
                </div>

                {/* 6. SHOW OUTER TOGGLE */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderTop: '1px solid rgba(212,175,55,0.15)', paddingTop: 10 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.7)' }}>Show Out-of-Radius Profiles</span>
                  <button onClick={()=>setShowOuter(!showOuter)} style={{ background:showOuter?'#D4AF37':'rgba(255,255,255,0.1)', color:showOuter?'#090E1A':'#FFF', border:'none', borderRadius:50, padding:'4px 12px', fontSize:10, fontWeight:900, cursor:'pointer' }}>{showOuter?'👁️ ON':'🚫 OFF'}</button>
                </div>

                {/* Feature 5: PARENT LOCATION SEARCH TOGGLE */}
                <div style={{ borderTop: '1px solid rgba(212,175,55,0.15)', paddingTop: 10 }}>
                  <div style={{ ...LBL, marginBottom: 7, display:'flex', alignItems:'center', gap:4 }}>
                    🏠 Search Mode — Work or Parent Home?
                  </div>
                  <div style={{ display:'flex', gap: 4, background:'rgba(255,255,255,0.05)', padding: 3, borderRadius: 50, border:'1px solid rgba(212,175,55,0.25)' }}>
                    {[
                      { id: 'work',   label: '💼 Work City' },
                      { id: 'parent', label: '🏠 Parent Home' },
                    ].map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setSearchMode(mode.id)}
                        style={{
                          flex: 1, padding: '5px 0', borderRadius: 50, fontSize: 10, fontWeight: 800,
                          border: 'none', cursor: 'pointer',
                          background: searchMode === mode.id ? '#D4AF37' : 'transparent',
                          color: searchMode === mode.id ? '#090E1A' : 'rgba(255,255,255,0.7)',
                          transition: 'all 0.15s'
                        }}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                  {searchMode === 'parent' && (
                    <div style={{ marginTop: 6, fontSize: 9, color: 'rgba(212,175,55,0.8)', fontWeight: 700, textAlign:'center' }}>
                      Distances calculated from family hometown 🏡
                    </div>
                  )}
                </div>


                {/* 7. MY PROFILE LOCATION */}
                <div style={{ borderTop:'1px solid rgba(212,175,55,0.18)', paddingTop:10 }}>
                  <div style={{ ...LBL, marginBottom:5, display:'flex', alignItems:'center', gap:4 }}><Crosshair size={11}/>My Profile Location</div>
                  {showUpdateLoc ? (
                    <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                      <select value={pendingCity} onChange={e=>setPendingCity(e.target.value)} style={{ width:'100%', padding:'6px 9px', borderRadius:9, fontSize:11, border:'1px solid rgba(212,175,55,0.5)', background:'rgba(255,255,255,0.07)', color:'#FFF', cursor:'pointer' }}>
                        {CITIES_DATABASE.filter(c=>c.id!=='All').map(c=><option key={c.id} value={c.id} style={{ background:'#090E1A' }}>{c.emoji} {c.label} ({c.state}{c.country !== 'India' ? `, ${c.country}` : ''})</option>)}
                      </select>
                      <div style={{ display:'flex', gap:5 }}>
                        <button onClick={handleUpdateLoc} style={{ flex:1, padding:6, borderRadius:8, fontSize:10, fontWeight:900, background:'#D4AF37', color:'#090E1A', border:'none', cursor:'pointer' }}>✓ Save</button>
                        <button onClick={()=>setShowUpdateLoc(false)} style={{ padding:'6px 9px', borderRadius:8, fontSize:10, background:'rgba(255,255,255,0.1)', color:'#FFF', border:'none', cursor:'pointer' }}>✕</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:11, color:'rgba(255,255,255,0.85)', fontWeight:700 }}>📍 {myLocation.city}</span>
                      <button onClick={()=>setShowUpdateLoc(true)} style={{ padding:'4px 11px', borderRadius:50, fontSize:10, fontWeight:800, background:'rgba(212,175,55,0.16)', color:'#D4AF37', border:'1px solid rgba(212,175,55,0.45)', cursor:'pointer', display:'flex', alignItems:'center', gap:3 }}>
                        <RefreshCw size={9}/>Update
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* ► Color Legend */}
          <div style={{ position:'absolute', bottom:14, left:14, zIndex:1200, ...PANEL, padding:'9px 13px' }}>
            <div style={{ ...LBL, marginBottom:7 }}>Pin Legend</div>
            {[
              { c:'#D1FAE5', b:'#10B981', l:'💚 Accepted / Talked' },
              { c:'#CCFBF1', b:'#14B8A6', l:'💌 Interest Sent' },
              { c:'#FEE2E2', b:'#EF4444', l:'❌ Declined' },
              { c:'#FFFFFF', b:'#7A0026', l:'👰/🤵 In-Radius' },
              { c:'#FEF3C7', b:'#D97706', l:'🔒 Out-of-Radius (Plan)' },
              { c:'#DBEAFE', b:'#1D4ED8', l:'🏠 My Location' },
            ].map((item,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                <div style={{ width:14, height:14, borderRadius:'50%', background:item.c, border:'2px solid '+item.b, flexShrink:0 }}/>
                <span style={{ fontSize:10, color:'rgba(255,255,255,0.8)', fontWeight:600 }}>{item.l}</span>
              </div>
            ))}
          </div>

          {/* ═══ LEAFLET MAP ═══ */}
          <MapContainer
            center={[22.0, 79.0]}
            zoom={5}
            minZoom={3}
            maxZoom={18}
            style={{ width:'100%', height:'100%', minHeight:720 }}
            zoomControl={false}
            attributionControl={true}
          >
            <ZoomControl position="bottomright"/>
            <MapController flyTarget={flyTarget} hoverTarget={hoverTarget} mapType={mapType}/>
            <MapResizer trigger={sidebarState} />

            {/* Tile Layers */}
            {mapType==='satellite' ? (
              <>
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={18}
                  attribution="© Esri Satellite"
                />
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={18}
                  opacity={0.9}
                />
              </>
            ) : (
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
                attribution="© OpenStreetMap"
              />
            )}

            {/* My Location */}
            <Marker position={[myLocation.lat, myLocation.lng]} icon={buildPinIcon('#DBEAFE','#1D4ED8','🏠',false,true)}>
              <Popup>
                <div style={{ fontFamily:'system-ui', fontSize:13, fontWeight:700, color:'#1E3A5F', padding:2 }}>
                  🏠 My Profile Location<br/>
                  <span style={{ fontWeight:500, fontSize:12, color:'#374151' }}>{myLocation.city}</span>
                </div>
              </Popup>
            </Marker>

            {/* Radius Circles — one per selected city */}
            {radiusKm < 3000 && selectedCities.map((cityItem, idx) => {
              const c = typeof cityItem === 'object'
                ? cityItem
                : CITIES_DATABASE.find(x => x.id === cityItem);
              if (!c || c.id === 'All' || !hasCoordinates(c)) return null;
              return (
                <Circle
                  key={'rc-' + (c.id || idx)}
                  center={[c.lat, c.lng]}
                  radius={radiusKm * 1000}
                  pathOptions={{
                    color: '#D4AF37',
                    weight: 2,
                    dashArray: '8 5',
                    fillColor: '#D4AF37',
                    fillOpacity: 0.04,
                    opacity: 0.8
                  }}
                />
              );
            })}

            {/* Profile Pins */}
            {displayed.map(p => {
              if (!hasCoordinates(p)) return null;
              const { color, border, photoUrl, isSelected, isHovered: isPinHovered, isOnline } = pinStyle(p, interestMap, selectedProfile?.id, hoverPinId);
              const isViewed = viewedIds.has(String(p.id)) && !isSelected;
              const mc = p.preferencesMatch ? p.preferencesMatch.filter(m=>m.isMatched).length : '-';
              const tc = p.preferencesMatch ? p.preferencesMatch.length : '-';
              // Hovered from sidebar card OR from direct map pin mouseover
              const isSidebarHovered = hoverTarget && String(hoverTarget.id) === String(p.id);
              const isAnyHover = isPinHovered || Boolean(isSidebarHovered);
              return (
                <Marker
                  key={'pin-' + p.id}
                  position={[p.lat, p.lng]}
                  icon={buildPinIcon(color, border, photoUrl, isSelected || isAnyHover, isOnline, isViewed)}
                  keyboard={true}
                  ref={el => { if (el) markerRefs.current[String(p.id)] = el; }}
                  eventHandlers={{
                    click: () => {
                      openProfile(p);
                    },
                    mouseover: (event) => {
                      setHoverPinId(String(p.id));
                      event.target.openTooltip();
                      if (isViewed) openProfile(p);
                    },
                    mouseout: (event) => {
                      setHoverPinId(null);
                      if (!isSidebarHovered) event.target.closeTooltip();
                    },
                    focus: (event) => event.target.openTooltip(),
                    blur: (event) => event.target.closeTooltip(),
                  }}
                >
                  <Tooltip
                    direction="top"
                    offset={[0, isSelected || isAnyHover ? -68 : -56]}
                    opacity={1}
                    className="profile-hover-tooltip"
                  >
                    {(() => {
                      const photoAllowed = p.photoPrivacy === 'Public' || interestMap[p.id] === 'accepted';
                      return (
                        <div style={{ width: 224 }}>
                          <div style={{ position: 'relative', height: 116, overflow: 'hidden' }}>
                            <img
                              src={p.photo}
                              alt=""
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', background: '#F2EAE0', filter: photoAllowed ? 'none' : 'blur(9px)', transform: photoAllowed ? 'none' : 'scale(1.08)' }}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,14,26,0.92) 0%, rgba(9,14,26,0.15) 60%, transparent 100%)' }} />
                            <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
                              <span style={{ fontSize: 9, fontWeight: 900, color: '#FFF', background: 'rgba(122,0,38,0.92)', border: '1px solid #D4AF37', padding: '2px 8px', borderRadius: 50 }}>
                                {p.gender === 'Bride' ? '👰 Bride' : '🤵 Groom'}
                              </span>
                              {isOnline && (
                                <span style={{ fontSize: 9, fontWeight: 800, color: '#065F46', background: '#D1FAE5', padding: '2px 7px', borderRadius: 50 }}>● Online</span>
                              )}
                            </div>
                            {!photoAllowed && (
                              <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 9, fontWeight: 800, color: '#FDE68A', background: 'rgba(0,0,0,0.6)', padding: '2px 7px', borderRadius: 50 }}>🔒 Photo protected</div>
                            )}
                            <div style={{ position: 'absolute', bottom: 6, left: 8, right: 8 }}>
                              <div style={{ fontSize: 13, fontWeight: 800, color: '#FFF', textShadow: '0 1px 3px rgba(0,0,0,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                              <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{p.age} yrs • {p.city}{p.country && p.country !== 'India' ? `, ${p.country}` : ''}</div>
                            </div>
                          </div>
                          <div style={{ padding: '8px 10px', background: '#FFFFFF' }}>
                            <div style={{ fontSize: 10, color: '#374151', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🎓 {p.education}</div>
                            <div style={{ fontSize: 10, color: '#374151', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>💼 {p.occupation}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 7 }}>
                              <span style={{ fontSize: 10, fontWeight: 900, color: '#7A0026' }}>⭐ {p.matchScore}% match</span>
                              <span style={{ fontSize: 9, fontWeight: 900, color: p.isInRadius ? '#065F46' : '#92400E', background: p.isInRadius ? '#D1FAE5' : '#FEF3C7', padding: '2px 8px', borderRadius: 50 }}>
                                {p.isInRadius ? `🎯 ${p.minDistance} km` : `🔒 ${p.minDistance} km`}
                              </span>
                            </div>
                            <div style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 700, textAlign: 'center', marginTop: 7 }}>Click pin for full profile</div>
                          </div>
                        </div>
                      );
                    })()}
                  </Tooltip>
                  <Popup maxWidth={265} closeButton={true}>
                    <div style={{ fontFamily:'system-ui', padding:2, minWidth:230 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                        <img src={p.photo} alt={p.name} style={{ width:52, height:52, borderRadius:'50%', objectFit:'cover', border:'2.5px solid '+border, background:'#F2EAE0', flexShrink:0 }}/>
                        <div>
                          <div style={{ fontSize:14, fontWeight:800, color:'#1F191D', marginBottom:2 }}>{p.name}</div>
                          <div style={{ fontSize:11, color:'#665D65', fontWeight:600 }}>{p.age}y • {p.city}, {p.state}</div>
                          <div style={{ fontSize:10, fontWeight:800, color:'#7A0026', marginTop:2 }}>⭐ {p.matchScore}% Match</div>
                        </div>
                      </div>
                      <div style={{ fontSize:11, color:'#374151', marginBottom:3, fontWeight:600 }}>🎓 {p.education}</div>
                      <div style={{ fontSize:11, color:'#374151', marginBottom:8, fontWeight:600 }}>💼 {p.occupation}</div>
                      <div style={{ display:'flex', gap:6, marginBottom:10 }}>
                        <span style={{ fontSize:10, fontWeight:900, color:p.isInRadius?'#065F46':'#92400E', background:p.isInRadius?'#D1FAE5':'#FEF3C7', padding:'3px 8px', borderRadius:'50px' }}>
                          {p.isInRadius?('🎯 '+p.minDistance+' km away'):('🔒 '+p.minDistance+' km — Plan')}
                        </span>
                      </div>
                      <button
                        onClick={()=>onSelectProfile(p)}
                        style={{ width:'100%', padding:'8px 0', borderRadius:9, fontSize:11, fontWeight:800, background:'linear-gradient(135deg,#58001B,#7A0026)', color:'#D4AF37', border:'1px solid #D4AF37', cursor:'pointer' }}
                      >
                        View Full Bio ({mc}/{tc} Match) →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* ── SIDEBAR ── */}
        <div style={{ background:'linear-gradient(180deg,#FFFFFF 0%,#FBF6EE 100%)', borderLeft:'1px solid #EADFCB', display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
          {sidebarState === 'collapsed' ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, paddingTop:14 }}>
              <button
                type="button"
                onClick={()=>setSidebarState('normal')}
                title="Expand panel"
                aria-label="Expand profiles panel"
                style={{ width:32, height:32, borderRadius:9, border:'1px solid #D4AF37', background:'#FBF3DF', color:'#7A0026', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
              >
                <ChevronLeft size={16}/>
              </button>
              <div style={{ writingMode:'vertical-rl', transform:'rotate(180deg)', fontSize:10, fontWeight:900, letterSpacing:'1px', color:'#7A0026', textTransform:'uppercase' }}>
                {selectedProfile ? 'Profile' : `${displayed.length} Matches`}
              </div>
            </div>
          ) : (
            <>
              {/* Sidebar toolbar */}
              <div style={{ flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', borderBottom:'1px solid #EADFCB', background:'linear-gradient(90deg,#FFFFFF,#FBF3E7)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
                  {selectedProfile && (
                    <button
                      type="button"
                      onClick={()=>setSelectedProfile(null)}
                      title="Back to matches"
                      aria-label="Back to matches"
                      style={{ width:28, height:28, borderRadius:8, border:'1px solid #E5DAC7', background:'#FFFFFF', color:'#7A0026', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}
                    >
                      <ArrowLeft size={15}/>
                    </button>
                  )}
                  <span style={{ fontFamily:'Cinzel,serif', fontSize:13, fontWeight:900, color:'#7A0026', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {selectedProfile ? selectedProfile.name : `${displayed.length} Matches`}
                  </span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                  <button
                    type="button"
                    onClick={()=>setSidebarState(s => s === 'expanded' ? 'normal' : 'expanded')}
                    title={sidebarState === 'expanded' ? 'Shrink panel' : 'Widen panel'}
                    aria-label={sidebarState === 'expanded' ? 'Shrink panel' : 'Widen panel'}
                    style={{ width:28, height:28, borderRadius:8, border:'1px solid #D4AF37', background:'#FBF3DF', color:'#7A0026', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
                  >
                    {sidebarState === 'expanded' ? <Minimize2 size={14}/> : <Maximize2 size={14}/>}
                  </button>
                  <button
                    type="button"
                    onClick={()=>setSidebarState('collapsed')}
                    title="Collapse panel"
                    aria-label="Collapse profiles panel"
                    style={{ width:28, height:28, borderRadius:8, border:'1px solid #E5DAC7', background:'#FFFFFF', color:'#7A0026', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
                  >
                    <ChevronRight size={16}/>
                  </button>
                </div>
              </div>

              {/* Scrollable panel body */}
              <div className="sidebar-scroll" style={{ flex:1, minHeight:0, overflowY:'auto' }}>
                {selectedProfile ? (
                  <ProfileDetailPanel
                    profile={selectedProfile}
                    interestMap={interestMap}
                    wide={sidebarState === 'expanded'}
                    onExpressInterest={onExpressInterest}
                    onSelectProfile={onSelectProfile}
                    onOpenLifestyleReels={onOpenLifestyleReels}
                    onOpenParivarMeet={onOpenParivarMeet}
                    onOpenGallery={onOpenGallery}
                    radiusKm={radiusKm}
                    onClose={()=>setSelectedProfile(null)}
                  />
                ) : (
                  <ProfileListPanel
                    profiles={displayed}
                    interestMap={interestMap}
                    selectedId={selectedProfile?.id}
                    viewedIds={viewedIds}
                    onExpressInterest={onExpressInterest}
                    onSelect={openProfile}
                    onHoverProfile={p => {
                      setHoverTarget(p || null);
                    }}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Profile List (no pin selected) ── */
function ProfileListPanel({ profiles, interestMap, selectedId, viewedIds = new Set(), onExpressInterest, onSelect, onHoverProfile }) {
  const sorted = [...profiles].sort((a,b)=>{
    if (a.isInRadius!==b.isInRadius) return a.isInRadius?-1:1;
    return a.minDistance-b.minDistance;
  });

  const STATUS = {
    accepted: { c:'#10B981', l:'💚 Accepted' },
    sent:     { c:'#14B8A6', l:'💌 Sent' },
    declined: { c:'#EF4444', l:'❌ Declined' },
  };

  const heartConfig = status => {
    if (status === 'accepted') return { fill: '#10B981', stroke: '#10B981', bg: '#E7F8F0', border: '#A7E8CE', title: 'Interest accepted' };
    if (status === 'sent') return { fill: '#F43F5E', stroke: '#F43F5E', bg: '#FDECEF', border: '#F7B9C4', title: 'Interest sent' };
    if (status === 'declined') return { fill: 'none', stroke: '#9CA3AF', bg: '#F3F4F6', border: '#E5E7EB', title: 'Interest declined' };
    return { fill: 'none', stroke: '#C79A2E', bg: '#FBF3DF', border: '#E4C97A', title: 'Express interest' };
  };

  const inRangeCount = sorted.filter(p => p.isInRadius).length;

  return (
    <div style={{ padding:14, display:'flex', flexDirection:'column', gap:10 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingBottom:11, borderBottom:'1px solid #EADFCB' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <Sparkles size={14} style={{ color:'#D4AF37' }}/>
            <span style={{ fontFamily:'Cinzel,serif', fontSize:15, fontWeight:900, color:'#7A0026' }}>{sorted.length} Matches</span>
          </div>
          <div style={{ fontSize:10, color:'#8A7F73', fontWeight:600, marginTop:3 }}>Tap a card for the full profile</div>
        </div>
        <span className="chip" style={{ color:'#059669', background:'#E7F8F0', border:'1px solid #A7E8CE' }}>
          🎯 {inRangeCount} in range
        </span>
      </div>

      {sorted.length===0 && (
        <div style={{ textAlign:'center', padding:'44px 16px', color:'#8A7F73' }}>
          <Search size={26} style={{ opacity:0.5, marginBottom:8 }}/>
          <div style={{ fontSize:12, fontWeight:700, color:'#5B5049' }}>No profiles match your filters</div>
          <div style={{ fontSize:11, marginTop:4 }}>Try widening the radius or adding cities.</div>
        </div>
      )}

      {sorted.map(p=>{
        const s = interestMap[p.id];
        const st = STATUS[s];
        const heart = heartConfig(s);
        const pct = Math.max(0, Math.min(100, p.matchScore || 0));
        const ringColor = pct >= 85 ? '#10B981' : pct >= 70 ? '#D4AF37' : '#F59E0B';
        const isActive  = String(selectedId) === String(p.id);
        const wasViewed = !isActive && viewedIds.has(String(p.id));
        return (
          <div
            key={p.id}
            className={[
              'match-card',
              p.isInRadius ? '' : 'match-card--out',
              isActive  ? 'match-card--active'  : '',
              wasViewed ? 'match-card--viewed'  : '',
            ].filter(Boolean).join(' ')}
            onClick={()=>onSelect(p)}
            role="button"
            tabIndex={0}
            onKeyDown={e=>{ if (e.key==='Enter' || e.key===' ') { e.preventDefault(); onSelect(p); } }}
            onMouseEnter={()=>onHoverProfile?.(p)}
            onMouseLeave={()=>onHoverProfile?.(null)}
            title="Open full profile"
          >
            <div className="match-ring">
              <img
                className="match-ring__img"
                src={p.photo}
                alt={p.name}
                style={{
                  outline: `3px solid ${ringColor}`,
                  outlineOffset: '2px',
                }}
              />
              <span className="match-ring__gender">{p.gender==='Bride'?'👰':'🤵'}</span>
              <span className="match-ring__score">{pct}%</span>
            </div>

            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:13, fontWeight:800, color:'#1F191D', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</span>
                {p.isVerified && <ShieldCheck size={13} style={{ color:'#2563EB', flexShrink:0 }}/>}
              </div>
              {wasViewed && (
                <span style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:9, fontWeight:800, color:'#C79A2E', background:'#FBF3DF', border:'1px solid #E4C97A', padding:'1px 7px', borderRadius:50, marginTop:2 }}>
                  👁 Viewed
                </span>
              )}
              <div style={{ fontSize:10.5, color:'#6B7280', fontWeight:600, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {p.age} yrs • {p.city}{p.country && p.country !== 'India' ? `, ${p.country}` : ''}
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginTop:7 }}>
                <span className="chip" style={{ color:p.isInRadius?'#059669':'#B45309', background:p.isInRadius?'#E7F8F0':'#FDF3E2' }}>
                  {p.isInRadius?'📍':'🔒'} {p.minDistance} km
                </span>
                {p.religion && (
                  <span className="chip" style={{ color:'#6B5E50', background:'#F2EADD' }}>{p.religion}</span>
                )}
                {st && <span className="chip" style={{ color:st.c, background:'#F2EADD' }}>{st.l}</span>}
              </div>
            </div>

            <button
              type="button"
              className="heart-btn"
              title={heart.title}
              aria-label={heart.title}
              disabled={Boolean(s)}
              onClick={(e)=>{ e.stopPropagation(); if (!s) onExpressInterest?.(p.id); }}
              style={{ background: heart.bg, border:'1.5px solid '+heart.border }}
            >
              <Heart size={17} fill={heart.fill} stroke={heart.stroke} strokeWidth={2.2} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ── Profile Detail (pin selected) ── */
function ProfileDetailPanel({
  profile, interestMap, onExpressInterest,
  onSelectProfile, onOpenLifestyleReels, onOpenParivarMeet, onOpenGallery, radiusKm, onClose, wide = false
}) {
  const openGallery = onOpenGallery || onSelectProfile;
  const photoCount = (profile.photos && profile.photos.length) ? profile.photos.length : 1;
  const hasReel = Boolean(profile.lifestyleVideo);
  const status = interestMap[profile.id];
  const mc = profile.preferencesMatch?.filter(m=>m.isMatched).length ?? 8;
  const tc = profile.preferencesMatch?.length ?? 8;
  const isBride = profile.gender==='Bride';
  const isOnline = Boolean(profile.activeStatus?.includes('Online') || profile.isOnline);
  const hasTalked = status==='accepted';

  const btnCfg = status==='accepted'
    ? { bg:'#059669', cl:'#FFF', bc:'#10B981' }
    : status==='declined'
    ? { bg:'#DC2626', cl:'#FFF', bc:'#EF4444' }
    : status==='sent'
    ? { bg:'#0D9488', cl:'#FFF', bc:'#14B8A6' }
    : { bg:'linear-gradient(135deg,#7A0026,#C0185E)', cl:'#FFF', bc:'#7A0026' };

  return (
    <div style={{ display:'flex', flexDirection:'column' }}>
      {/* Photo header — the only element that opens the full-screen modal */}
      <div
        role="button"
        tabIndex={0}
        title="View photos & reel"
        aria-label={`Open ${profile.name} photos and reel`}
        className="detail-hero"
        style={{ position:'relative', height: wide ? 280 : 236, flexShrink:0, overflow:'hidden', cursor:'pointer' }}
        onClick={()=>openGallery(profile)}
        onKeyDown={e=>{ if (e.key==='Enter' || e.key===' ') { e.preventDefault(); openGallery(profile); } }}
      >
        <img src={profile.photo} alt={profile.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', background:'#F2EAE0' }}/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(9,14,26,0.97) 0%,rgba(9,14,26,0.45) 42%,rgba(9,14,26,0.05) 100%)' }}/>

        {/* Top row */}
        <div style={{ position:'absolute', top:10, left:10, right:10, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span className="chip" style={{ color:'#F4E8C1', background:'rgba(122,0,38,0.85)', border:'1px solid #D4AF37', fontSize:10, padding:'3px 10px' }}>
            {isBride?'👰 Bride':'🤵 Groom'}
          </span>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span className="chip" style={{ color:isOnline?'#6EE7B7':'#D1D5DB', background:'rgba(0,0,0,0.55)', border:'1px solid rgba(255,255,255,0.2)', fontSize:10, padding:'3px 9px' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:isOnline?'#34D399':'#9CA3AF', display:'inline-block' }}/>{isOnline?'Online':'Away'}
            </span>
            <button onClick={e=>{e.stopPropagation();onClose();}} title="Back to list" aria-label="Back to list" style={{ width:28, height:28, borderRadius:'50%', background:'rgba(0,0,0,0.6)', color:'#FFF', border:'1px solid rgba(255,255,255,0.2)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><X size={14}/></button>
          </div>
        </div>

        {/* Gallery hint */}
        <div className="detail-hero__hint" style={{ position:'absolute', top:'42%', left:'50%', transform:'translate(-50%,-50%)', display:'flex', alignItems:'center', gap:5, background:'rgba(0,0,0,0.55)', color:'#FDE68A', fontSize:10, fontWeight:800, padding:'5px 12px', borderRadius:'50px', border:'1px solid rgba(212,175,55,0.5)' }}>
          <Eye size={11}/> View {photoCount} photo{photoCount>1?'s':''}{hasReel?' + reel':''}
        </div>
        {/* Media count badge */}
        <div style={{ position:'absolute', top:46, left:10, display:'flex', gap:6 }}>
          <span className="chip" style={{ color:'#FFF', background:'rgba(0,0,0,0.55)', border:'1px solid rgba(255,255,255,0.25)', fontSize:9, padding:'2px 8px' }}>📷 {photoCount}</span>
          {hasReel && <span className="chip" style={{ color:'#FCA5A5', background:'rgba(0,0,0,0.55)', border:'1px solid rgba(239,68,68,0.5)', fontSize:9, padding:'2px 8px' }}>🎬 Reel</span>}
        </div>

        {/* Identity */}
        <div style={{ position:'absolute', left:14, right:14, bottom:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <h3 style={{ fontFamily:'Cinzel,serif', fontSize:20, fontWeight:900, color:'#FFF', margin:0, textShadow:'0 2px 8px rgba(0,0,0,0.6)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{profile.name}</h3>
            {profile.isVerified && <ShieldCheck size={16} style={{ color:'#60A5FA', flexShrink:0 }}/>}
          </div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.82)', fontWeight:600, marginTop:2 }}>
            {profile.age} yrs • {profile.height} • {profile.religion}{profile.caste ? ` (${profile.caste})` : ''}
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:8 }}>
            <span className="chip" style={{ color:'#1F191D', background:'#D4AF37', fontSize:10, padding:'3px 10px' }}>
              <Star size={10} fill="#1F191D" stroke="none"/> {profile.matchScore}% • {mc}/{tc}
            </span>
            {hasTalked && (
              <span className="chip" style={{ color:'#FFF', background:'rgba(16,185,129,0.92)', border:'1px solid #34D399', fontSize:10, padding:'3px 10px' }}>
                <MessageCircle size={10}/> Connected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:14, display:'flex', flexDirection:'column', gap:11 }}>
        {/* Quick trait chips */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {profile.motherTongue && <span className="chip" style={{ color:'#5B4D43', background:'#F2EDE4', fontSize:10, padding:'3px 10px' }}>🗣️ {profile.motherTongue}</span>}
          {profile.diet && <span className="chip" style={{ color:'#5B4D43', background:'#F2EDE4', fontSize:10, padding:'3px 10px' }}>🍽️ {profile.diet}</span>}
          {profile.manglik && <span className="chip" style={{ color:'#5B4D43', background:'#F2EDE4', fontSize:10, padding:'3px 10px' }}>✨ Manglik: {profile.manglik}</span>}
          {profile.isNri && <span className="chip" style={{ color:'#1D4ED8', background:'#EFF6FF', fontSize:10, padding:'3px 10px' }}>✈️ NRI</span>}
        </div>

        {/* Radius badge */}
        {profile.isInRadius ? (
          <div style={{ fontSize:11, fontWeight:800, color:'#059669', background:'#E7F8F0', padding:'8px 13px', borderRadius:12, border:'1px solid #A7E8CE', display:'flex', alignItems:'center', gap:6 }}>
            <MapPin size={12} style={{ color:'#059669' }}/> {profile.minDistance} km from {profile.nearestCenterName}
          </div>
        ) : (
          <div style={{ background:'#FFF8ED', border:'1px solid #F9D98A', padding:'9px 13px', borderRadius:12 }}>
            <div style={{ fontSize:11, fontWeight:800, color:'#B45309', display:'flex', alignItems:'center', gap:5, marginBottom:2 }}><Crown size={12} style={{ color:'#B45309' }}/> {profile.minDistance} km away — out of range</div>
            <div style={{ fontSize:10, color:'#92400E', fontWeight:600 }}>Outside your {radiusKm} km radius</div>
          </div>
        )}

        {/* Interest heart + actions */}
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          <button
            onClick={()=>{ if (!status) onExpressInterest(profile.id); }}
            disabled={Boolean(status)}
            style={{ width:'100%', padding:10, borderRadius:'50px', fontSize:12, fontWeight:900, border:'1.5px solid '+btnCfg.bc, cursor: status ? 'default' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7, transition:'all 0.18s', background:btnCfg.bg, color:btnCfg.cl }}
          >
            {status==='accepted'&&<><Heart size={15} fill="#FFFFFF" stroke="none"/>Interest Accepted</>}
            {status==='declined'&&<><Heart size={15} fill="none" stroke="#FFFFFF" strokeWidth={2.4}/>Interest Declined</>}
            {status==='sent'&&<><Heart size={15} fill="#FFFFFF" stroke="none"/>Interest Sent</>}
            {!status&&<><Heart size={15} fill="#D4AF37" stroke="none"/>Express Interest</>}
          </button>
          <div style={{ display:'grid', gridTemplateColumns: profile.lifestyleVideo ? '1fr 1fr' : '1fr', gap:7 }}>
            <button onClick={()=>onOpenParivarMeet(profile)} style={{ padding:8, borderRadius:'50px', fontSize:11, fontWeight:800, background:'#FFFFFF', color:'#7A0026', border:'1px solid #EADFCB', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:4, boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}><Calendar size={12}/>Parivar Meet</button>
            {profile.lifestyleVideo && (
              <button onClick={()=>onOpenLifestyleReels(profile)} style={{ padding:8, borderRadius:'50px', fontSize:11, fontWeight:800, background:'#FFF0F3', color:'#7A0026', border:'1.5px solid #F9A8C0', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                <Video size={12} style={{ color:'#EF4444' }}/> Reel
              </button>
            )}
          </div>
        </div>

        {/* Full detail sections — two columns when the panel is widened */}
        <div style={{ display:'grid', gridTemplateColumns: wide ? '1fr 1fr' : '1fr', gap:11, alignItems:'start' }}>
        {/* About */}
        {profile.about && (
          <SidebarSection title="About">
            <p style={{ fontSize:11, lineHeight:1.7, color:'#4B5563', fontWeight:600, margin:0 }}>{profile.about}</p>
          </SidebarSection>
        )}

        {/* Career & Education */}
        <SidebarSection title="Career & Education">
          <SidebarRow label="Education" value={profile.education} />
          <SidebarRow label="Occupation" value={profile.occupation} />
          <SidebarRow label="Income" value={profile.income} />
          {profile.relocationFlexibility && <SidebarRow label="Relocation" value={profile.relocationFlexibility} />}
        </SidebarSection>

        {/* Family */}
        {profile.family && (
          <SidebarSection title="Family Background">
            {profile.family.father && <SidebarRow label="Father" value={profile.family.father} />}
            {profile.family.mother && <SidebarRow label="Mother" value={profile.family.mother} />}
            {profile.family.siblings && <SidebarRow label="Siblings" value={profile.family.siblings} />}
            {profile.family.familyType && <SidebarRow label="Family Type" value={profile.family.familyType} />}
            {profile.family.familyIncome && <SidebarRow label="Family Income" value={profile.family.familyIncome} />}
            {profile.family.hometown && <SidebarRow label="Hometown" value={profile.family.hometown} />}
          </SidebarSection>
        )}

        {/* Kundali & Astro */}
        <SidebarSection title="Kundali & Astro">
          <SidebarRow label="Rashi" value={profile.rashi || 'N/A'} />
          <SidebarRow label="Nakshatra" value={profile.nakshatra || 'N/A'} />
          <SidebarRow label="Gotra" value={profile.gotra || 'N/A'} />
          <SidebarRow label="Manglik" value={profile.manglik || 'N/A'} />
          {profile.timeOfBirth && <SidebarRow label="Birth Time" value={profile.timeOfBirth} />}
          {profile.placeOfBirth && <SidebarRow label="Birth Place" value={profile.placeOfBirth} />}
        </SidebarSection>

        {/* Preference match — full list */}
        {profile.preferencesMatch && profile.preferencesMatch.length>0 && (
          <SidebarSection title={`Preference Match (${mc}/${tc})`}>
            {profile.preferencesMatch.map((pref,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, fontSize:10, fontWeight:700, marginBottom:6 }}>
                <span style={{ color:'#5B5049', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{pref.criteria}</span>
                <span style={{ color:pref.isMatched?'#059669':'#DC2626', background:pref.isMatched?'#E7F8F0':'#FEE2E2', padding:'2px 8px', borderRadius:'50px', fontWeight:900, flexShrink:0 }}>
                  {pref.isMatched?'✓ Match':'✗ Miss'}
                </span>
              </div>
            ))}
          </SidebarSection>
        )}
        </div>
      </div>
    </div>
  );
}

/* ── Sidebar full-profile helpers ── */
function SidebarSection({ title, children }) {
  return (
    <div className="detail-section">
      <div className="detail-section__title">{title}</div>
      {children}
    </div>
  );
}

function SidebarRow({ label, value }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, padding:'5px 0', borderBottom:'1px solid #EEE4D5' }}>
      <span style={{ fontSize:10, fontWeight:700, color:'#8A7F73', flexShrink:0, textTransform:'uppercase', letterSpacing:'0.3px' }}>{label}</span>
      <span style={{ fontSize:11.5, fontWeight:700, color:'#2D2018', textAlign:'right' }}>{value}</span>
    </div>
  );
}
