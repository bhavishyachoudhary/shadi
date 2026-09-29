import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin, ShieldCheck, Sparkles, Heart, Briefcase, GraduationCap,
  X, Check, Video, Calendar, Globe, Sliders, Target,
  Crown, Layers, RefreshCw, MessageCircle, Star,
  ChevronDown, ChevronUp, Crosshair, Eye, Filter
} from 'lucide-react';
import { getMinDistanceToCenters } from '../utils/distance';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ── Animated pulse ring for selected pin ──
function buildPinIcon(color, border, emoji, isSelected, isOnline) {
  const size = isSelected ? 60 : 48;
  const halfSize = size / 2;
  const pulse = isSelected
    ? '<circle cx="' + halfSize + '" cy="' + halfSize + '" r="' + (halfSize - 2) + '" fill="none" stroke="' + border + '" stroke-width="2" opacity="0.5"><animate attributeName="r" from="' + (halfSize - 2) + '" to="' + (halfSize + 10) + '" dur="1.4s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.5" to="0" dur="1.4s" repeatCount="indefinite"/></circle>'
    : '';
  const emojiSize = isSelected ? 22 : 18;
  const emojiY = isSelected ? 39 : 31;
  const pinR = halfSize - 5;
  const stemTop = halfSize + pinR + 1;
  const stemBot = size + 12;
  const dotCY = size + 16;
  const svgH = size + 20;

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + svgH + '" viewBox="0 0 ' + size + ' ' + svgH + '">',
    '<defs><filter id="sh' + (isSelected ? 's' : 'n') + '" x="-30%" y="-20%" width="160%" height="160%">',
    '<feDropShadow dx="0" dy="' + (isSelected ? '6' : '3') + '" stdDeviation="' + (isSelected ? '6' : '3') + '" flood-color="rgba(0,0,0,' + (isSelected ? '0.6' : '0.4') + ')"/>',
    '</filter></defs>',
    pulse,
    '<circle cx="' + halfSize + '" cy="' + halfSize + '" r="' + pinR + '" fill="' + color + '" stroke="' + border + '" stroke-width="' + (isSelected ? '4' : '3') + '" filter="url(#sh' + (isSelected ? 's' : 'n') + ')"/>',
    isOnline ? '<circle cx="' + (size - 6) + '" cy="8" r="6" fill="#10B981" stroke="#fff" stroke-width="2"/>' : '',
    '<text x="' + halfSize + '" y="' + emojiY + '" text-anchor="middle" font-size="' + emojiSize + '" font-family="system-ui">' + emoji + '</text>',
    '<line x1="' + halfSize + '" y1="' + stemTop + '" x2="' + halfSize + '" y2="' + stemBot + '" stroke="' + border + '" stroke-width="' + (isSelected ? '4' : '3') + '" stroke-linecap="round"/>',
    '<circle cx="' + halfSize + '" cy="' + dotCY + '" r="4" fill="' + border + '"/>',
    '</svg>'
  ].join('');

  return L.divIcon({
    className: '',
    html: svg,
    iconSize: [size, svgH],
    iconAnchor: [halfSize, svgH],
    popupAnchor: [0, -(svgH)],
  });
}

// Helper: FlyTo on city/profile change
function MapController({ flyTarget, mapType }) {
  const map = useMap();
  useEffect(() => {
    if (flyTarget?.lat && flyTarget?.lng) {
      map.flyTo([flyTarget.lat, flyTarget.lng], flyTarget.zoom || 7, { duration: 1.2, easeLinearity: 0.35 });
    }
  }, [flyTarget]);
  return null;
}

const CITIES = [
  { id: 'Bengaluru', label: 'Bengaluru', emoji: '📍', lat: 12.9716, lng: 77.5946 },
  { id: 'Mumbai',    label: 'Mumbai',    emoji: '📍', lat: 19.0760, lng: 72.8777 },
  { id: 'Delhi',     label: 'Delhi NCR', emoji: '📍', lat: 28.6139, lng: 77.2090 },
  { id: 'Hyderabad', label: 'Hyderabad', emoji: '📍', lat: 17.3850, lng: 78.4867 },
  { id: 'Chennai',   label: 'Chennai',   emoji: '📍', lat: 13.0827, lng: 80.2707 },
  { id: 'Pune',      label: 'Pune',      emoji: '📍', lat: 18.5204, lng: 73.8567 },
  { id: 'NRI_USA',   label: 'USA NRI',   emoji: '✈️', lat: 37.3382, lng: -121.8863 },
  { id: 'All',       label: 'All India', emoji: '🌍', lat: 22.0,    lng: 79.0 },
];

const RADIUS_PRESETS = [
  { label: '25 km',    val: 25 },
  { label: '50 km',    val: 50 },
  { label: '100 km',   val: 100 },
  { label: '250 km',   val: 250 },
  { label: '500 km',   val: 500 },
  { label: '🌍 All',   val: 5000 },
];

function pinStyle(profile, interestMap, selectedId) {
  const status = interestMap[profile.id];
  const isOnline = profile.activeStatus ? profile.activeStatus.includes('Online') : (profile.id % 2 === 1);
  const isBride  = profile.gender === 'Bride';
  const isSelected = selectedId === profile.id;
  let color = '#FFFFFF', border = '#7A0026';
  let emoji = isBride ? '👰' : '🤵';
  if (!profile.isInRadius) { color = '#FEF3C7'; border = '#D97706'; }
  if (status === 'accepted') { color = '#D1FAE5'; border = '#10B981'; emoji = '💚'; }
  else if (status === 'declined') { color = '#FEE2E2'; border = '#EF4444'; emoji = '❌'; }
  else if (status === 'sent')     { color = '#CCFBF1'; border = '#14B8A6'; emoji = '💌'; }
  return { color, border, emoji, isSelected, isOnline };
}

// ═══════════════════════════════════════════════════════════
export default function MapView({
  profiles = [],
  onExpressInterest,
  interestMap = {},
  shortlistedIds = [],
  onToggleShortlist,
  onSelectProfile,
  onOpenLifestyleReels,
  onOpenParivarMeet,
  currentUser = null
}) {
  const [myLocation,     setMyLocation]     = useState({ lat: 12.9716, lng: 77.5946, city: 'Bengaluru' });
  const [showUpdateLoc,  setShowUpdateLoc]  = useState(false);
  const [pendingCity,    setPendingCity]    = useState('Bengaluru');
  const [selectedCities, setSelectedCities] = useState(['Bengaluru', 'Mumbai']);
  const [radiusKm,       setRadiusKm]       = useState(250);
  const [showOuter,      setShowOuter]      = useState(true);
  const [selectedProfile,setSelectedProfile] = useState(null);
  const [showFilters,    setShowFilters]    = useState(true);
  const [flyTarget,      setFlyTarget]      = useState(null);
  const [mapType,        setMapType]        = useState('satellite');

  /* ── Gender tab: show OPPOSITE of current user ── */
  const [genderTab, setGenderTab] = useState(() => {
    const g = currentUser?.gender || 'Groom';
    return g === 'Groom' ? 'Bride' : 'Groom';
  });

  /* ── Compute distance + radius for EACH profile ── */
  const profilesWithDist = profiles.map(p => {
    const { minDistance, nearestCenterName } = getMinDistanceToCenters(p.lat, p.lng, selectedCities);
    const isInRadius = selectedCities.includes('All') || radiusKm >= 3000 || minDistance <= radiusKm;
    return { ...p, minDistance, nearestCenterName, isInRadius };
  });

  /* Filter by gender tab AND showOuter */
  const displayed = profilesWithDist.filter(p => {
    if (genderTab !== 'All' && p.gender !== genderTab) return false;
    if (!showOuter && !p.isInRadius) return false;
    return true;
  });

  const inCnt  = displayed.filter(p =>  p.isInRadius).length;
  const outCnt = displayed.filter(p => !p.isInRadius).length;

  /* ── City toggle ── */
  const toggleCity = (key) => {
    if (key === 'All') {
      setSelectedCities(['All']);
      setFlyTarget({ lat: 22.0, lng: 79.0, zoom: 4 });
      return;
    }
    let upd = selectedCities.filter(k => k !== 'All');
    if (upd.includes(key)) {
      if (upd.length > 1) upd = upd.filter(k => k !== key);
    } else {
      upd.push(key);
      const c = CITIES.find(x => x.id === key);
      if (c) setFlyTarget({ lat: c.lat, lng: c.lng, zoom: 8 });
    }
    setSelectedCities(upd);
  };

  const handleUpdateLoc = () => {
    const c = CITIES.find(x => x.id === pendingCity);
    if (c && c.id !== 'All') {
      setMyLocation({ lat: c.lat, lng: c.lng, city: c.label });
      setFlyTarget({ lat: c.lat, lng: c.lng, zoom: 9 });
    }
    setShowUpdateLoc(false);
  };

  /* ── Shared style tokens ── */
  const PA = { background: 'rgba(212,175,55,0.22)', border: '1.5px solid #D4AF37', color: '#D4AF37' };
  const PI = { background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' };
  const PANEL = { background: 'rgba(8,15,26,0.97)', backdropFilter: 'blur(18px)', border: '1.5px solid rgba(212,175,55,0.5)', borderRadius: '16px', boxShadow: '0 10px 36px rgba(0,0,0,0.6)' };
  const LBL = { fontSize: '10px', fontWeight: 900, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.8px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#090E1A', height: 'calc(100vh - 70px)', overflow: 'hidden' }}>

      {/* ══ BODY ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 365px', flex: 1, height: '100%' }}>

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

          {/* ► Filter Panel */}
          <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 1200, width: 300, ...PANEL, overflow: 'hidden' }}>
            <div onClick={() => setShowFilters(!showFilters)} style={{ padding: '11px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: showFilters?'1px solid rgba(212,175,55,0.2)':'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Filter size={14} style={{ color: '#D4AF37' }}/><span style={LBL}>Partner Location Filters</span></div>
              {showFilters ? <ChevronUp size={14} style={{ color: '#D4AF37' }}/> : <ChevronDown size={14} style={{ color: '#D4AF37' }}/>}
            </div>
            {showFilters && (
              <div style={{ padding: '13px 14px', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>
                
                {/* Gender & Map Mode Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 10, borderBottom: '1px solid rgba(212,175,55,0.18)' }}>
                  <div>
                    <div style={{ ...LBL, marginBottom: 5 }}>Target Profiles</div>
                    <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.06)', padding: 3, borderRadius: 50, border: '1px solid rgba(212,175,55,0.25)' }}>
                      {['Bride','Groom','All'].map(g => (
                        <button key={g} onClick={() => setGenderTab(g)} style={{ flex: 1, padding: '5px 0', borderRadius: 50, fontSize: 10, fontWeight: 800, border: 'none', cursor: 'pointer', background: genderTab===g?'#D4AF37':'transparent', color: genderTab===g?'#090E1A':'rgba(255,255,255,0.7)', transition: 'all 0.15s' }}>
                          {g==='Bride'?'👰 Brides':g==='Groom'?'🤵 Grooms':'🌐 All'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ ...LBL, marginBottom: 5 }}>Map Base Style</div>
                    <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.06)', padding: 3, borderRadius: 50, border: '1px solid rgba(212,175,55,0.25)' }}>
                      {[{id:'satellite',l:'🛰️ Satellite'},{id:'street',l:'🗺️ Street'}].map(t => (
                        <button key={t.id} onClick={() => setMapType(t.id)} style={{ flex: 1, padding: '5px 0', borderRadius: 50, fontSize: 10, fontWeight: 800, border: 'none', cursor: 'pointer', background: mapType===t.id?'#D4AF37':'transparent', color: mapType===t.id?'#090E1A':'rgba(255,255,255,0.7)', transition: 'all 0.15s' }}>
                          {t.l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {/* City pills */}
                <div>
                  <div style={{ ...LBL, marginBottom: 7, display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10}/>Select Cities (multi)</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {CITIES.map(c => {
                      const on = selectedCities.includes(c.id);
                      return (
                        <button key={c.id} onClick={() => toggleCity(c.id)} style={{ padding: '4px 9px', borderRadius: '50px', fontSize: '9px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.14s', ...(on?PA:PI) }}>
                          {on?'✓ ':''}{c.emoji} {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Radius */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                    <span style={{ ...LBL, display: 'flex', alignItems: 'center', gap: 4 }}><Target size={10}/>Search Radius</span>
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#090E1A', background: '#D4AF37', padding: '2px 10px', borderRadius: '50px' }}>{radiusKm>=3000?'🌍 All India':radiusKm+' km'}</span>
                  </div>
                  <input type="range" min="10" max="1000" step="10" value={Math.min(radiusKm,1000)} onChange={e=>setRadiusKm(+e.target.value)} style={{ width:'100%', accentColor:'#D4AF37', cursor:'pointer', height: 4 }}/>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:7 }}>
                    {RADIUS_PRESETS.map(p=>(
                      <button key={p.val} onClick={()=>setRadiusKm(p.val)} style={{ padding:'3px 8px', borderRadius:'50px', fontSize:'9px', fontWeight:800, cursor:'pointer', ...(radiusKm===p.val?PA:PI) }}>{p.label}</button>
                    ))}
                  </div>
                </div>
                {/* Show outer toggle */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.68)' }}>Show out-of-radius</span>
                  <button onClick={()=>setShowOuter(!showOuter)} style={{ background:showOuter?'#D4AF37':'rgba(255,255,255,0.1)', color:showOuter?'#090E1A':'#FFF', border:'none', borderRadius:'50px', padding:'4px 12px', fontSize:10, fontWeight:900, cursor:'pointer' }}>{showOuter?'👁️ ON':'🚫 OFF'}</button>
                </div>
                {/* My Location */}
                <div style={{ borderTop:'1px solid rgba(212,175,55,0.18)', paddingTop:11 }}>
                  <div style={{ ...LBL, marginBottom:5, display:'flex', alignItems:'center', gap:4 }}><Crosshair size={10}/>My Profile Location</div>
                  {showUpdateLoc ? (
                    <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                      <select value={pendingCity} onChange={e=>setPendingCity(e.target.value)} style={{ width:'100%', padding:'6px 9px', borderRadius:9, fontSize:11, border:'1px solid rgba(212,175,55,0.5)', background:'rgba(255,255,255,0.07)', color:'#FFF', cursor:'pointer' }}>
                        {CITIES.filter(c=>c.id!=='All').map(c=><option key={c.id} value={c.id} style={{ background:'#090E1A' }}>{c.emoji} {c.label}</option>)}
                      </select>
                      <div style={{ display:'flex', gap:5 }}>
                        <button onClick={handleUpdateLoc} style={{ flex:1, padding:6, borderRadius:8, fontSize:10, fontWeight:900, background:'#D4AF37', color:'#090E1A', border:'none', cursor:'pointer' }}>✓ Save</button>
                        <button onClick={()=>setShowUpdateLoc(false)} style={{ padding:'6px 9px', borderRadius:8, fontSize:10, background:'rgba(255,255,255,0.1)', color:'#FFF', border:'none', cursor:'pointer' }}>✕</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:11, color:'rgba(255,255,255,0.8)', fontWeight:700 }}>📍 {myLocation.city}</span>
                      <button onClick={()=>setShowUpdateLoc(true)} style={{ padding:'4px 11px', borderRadius:'50px', fontSize:10, fontWeight:800, background:'rgba(212,175,55,0.16)', color:'#D4AF37', border:'1px solid rgba(212,175,55,0.45)', cursor:'pointer', display:'flex', alignItems:'center', gap:3 }}>
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
            <MapController flyTarget={flyTarget} mapType={mapType}/>

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
            {!selectedCities.includes('All') && radiusKm < 3000 && CITIES
              .filter(c => selectedCities.includes(c.id) && c.id !== 'All')
              .map(c => (
                <Circle
                  key={'rc-' + c.id}
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
              ))
            }

            {/* Profile Pins */}
            {displayed.map(p => {
              if (!p.lat || !p.lng) return null;
              const { color, border, emoji, isSelected, isOnline } = pinStyle(p, interestMap, selectedProfile?.id);
              const mc = p.preferencesMatch ? p.preferencesMatch.filter(m=>m.isMatched).length : '-';
              const tc = p.preferencesMatch ? p.preferencesMatch.length : '-';
              return (
                <Marker
                  key={'pin-' + p.id}
                  position={[p.lat, p.lng]}
                  icon={buildPinIcon(color, border, emoji, isSelected, isOnline)}
                  eventHandlers={{
                    click: () => {
                      setSelectedProfile(p);
                      setFlyTarget({ lat: p.lat, lng: p.lng, zoom: 11 });
                    }
                  }}
                >
                  <Popup maxWidth={265} closeButton={true}>
                    <div style={{ fontFamily:'system-ui', padding:2, minWidth:230 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                        <img src={p.photo} alt={p.name} style={{ width:52, height:52, borderRadius:'50%', objectFit:'cover', border:'2.5px solid '+border, flexShrink:0 }}/>
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
        <div style={{ background:'linear-gradient(180deg,#090E1A 0%,#142030 100%)', borderLeft:'1px solid rgba(212,175,55,0.15)', display:'flex', flexDirection:'column', overflowY:'auto', maxHeight: 820 }}>
          {selectedProfile ? (
            <ProfileDetailPanel
              profile={selectedProfile}
              interestMap={interestMap}
              onExpressInterest={onExpressInterest}
              onSelectProfile={onSelectProfile}
              onOpenLifestyleReels={onOpenLifestyleReels}
              onOpenParivarMeet={onOpenParivarMeet}
              radiusKm={radiusKm}
              onClose={()=>setSelectedProfile(null)}
            />
          ) : (
            <ProfileListPanel
              profiles={displayed}
              interestMap={interestMap}
              onSelect={p=>{
                setSelectedProfile(p);
                if (p.lat&&p.lng) setFlyTarget({ lat:p.lat, lng:p.lng, zoom:11 });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Profile List (no pin selected) ── */
function ProfileListPanel({ profiles, interestMap, onSelect }) {
  const sorted = [...profiles].sort((a,b)=>{
    if (a.isInRadius!==b.isInRadius) return a.isInRadius?-1:1;
    return a.minDistance-b.minDistance;
  });

  const STATUS = {
    accepted: { c:'#10B981', l:'💚 Accepted' },
    sent:     { c:'#14B8A6', l:'💌 Sent' },
    declined: { c:'#EF4444', l:'❌ Declined' },
  };

  return (
    <div style={{ padding:14, display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ paddingBottom:10, borderBottom:'1px solid rgba(212,175,55,0.18)', marginBottom:4 }}>
        <div style={{ fontSize:11, fontWeight:900, color:'#D4AF37', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:2 }}>
          {sorted.length} Profiles on Map
        </div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)' }}>Click a pin or select below</div>
      </div>
      {sorted.length===0 && (
        <div style={{ textAlign:'center', padding:'30px 0', color:'rgba(255,255,255,0.4)', fontSize:12 }}>
          No profiles match current filters.<br/>Try adjusting radius or cities.
        </div>
      )}
      {sorted.map(p=>{
        const s = interestMap[p.id];
        const st = STATUS[s];
        return (
          <div
            key={p.id}
            onClick={()=>onSelect(p)}
            style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 11px', borderRadius:13, border:'1.5px solid '+(p.isInRadius?'rgba(212,175,55,0.3)':'rgba(255,255,255,0.07)'), background:p.isInRadius?'rgba(212,175,55,0.07)':'rgba(255,255,255,0.03)', cursor:'pointer', transition:'all 0.18s' }}
          >
            <div style={{ position:'relative', flexShrink:0 }}>
              <img src={p.photo} alt={p.name} style={{ width:42, height:42, borderRadius:'50%', objectFit:'cover', border:'2px solid '+(p.isInRadius?'#D4AF37':'rgba(255,255,255,0.2)') }}/>
              <span style={{ position:'absolute', bottom:-2, right:-2, fontSize:10, background:'#090E1A', borderRadius:'50%', padding:1 }}>{p.gender==='Bride'?'👰':'🤵'}</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:800, color:'#FFF', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.5)', fontWeight:600 }}>{p.age}y • {p.city} • ⭐ {p.matchScore}%</div>
              {st && <div style={{ fontSize:10, fontWeight:800, color:st.c, marginTop:2 }}>{st.l}</div>}
            </div>
            <div style={{ fontSize:9, fontWeight:900, color:p.isInRadius?'#10B981':'#F59E0B', background:p.isInRadius?'rgba(16,185,129,0.13)':'rgba(245,158,11,0.13)', padding:'2px 7px', borderRadius:'50px', flexShrink:0, textAlign:'center' }}>
              {p.isInRadius?'📍 '+p.minDistance+'km':'🔒 '+p.minDistance+'km'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Profile Detail (pin selected) ── */
function ProfileDetailPanel({
  profile, interestMap, onExpressInterest,
  onSelectProfile, onOpenLifestyleReels, onOpenParivarMeet, radiusKm, onClose
}) {
  const status = interestMap[profile.id];
  const mc = profile.preferencesMatch?.filter(m=>m.isMatched).length ?? 8;
  const tc = profile.preferencesMatch?.length ?? 8;
  const isBride = profile.gender==='Bride';
  const isOnline = profile.activeStatus ? profile.activeStatus.includes('Online') : (profile.id%2===1);
  const hasTalked = status==='accepted';

  const btnCfg = status==='accepted'
    ? { bg:'#059669', cl:'#FFF', bc:'#10B981' }
    : status==='declined'
    ? { bg:'#DC2626', cl:'#FFF', bc:'#EF4444' }
    : status==='sent'
    ? { bg:'#0D9488', cl:'#FFF', bc:'#14B8A6' }
    : { bg:'linear-gradient(135deg,#58001B,#7A0026)', cl:'#D4AF37', bc:'#D4AF37' };

  return (
    <div style={{ display:'flex', flexDirection:'column' }}>
      {/* Photo */}
      <div style={{ position:'relative', height:200, flexShrink:0, overflow:'hidden', cursor:'pointer' }} onClick={()=>onSelectProfile(profile)}>
        <img src={profile.photo} alt={profile.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.9) 0%,rgba(0,0,0,0.15) 55%,transparent 100%)' }}/>
        <button onClick={e=>{e.stopPropagation();onClose();}} style={{ position:'absolute', top:9, right:9, width:27, height:27, borderRadius:'50%', background:'rgba(0,0,0,0.7)', color:'#FFF', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>✕</button>
        {hasTalked && (
          <div style={{ position:'absolute', top:9, left:'50%', transform:'translateX(-50%)', background:'rgba(16,185,129,0.96)', color:'#FFF', fontSize:9, fontWeight:900, padding:'3px 12px', borderRadius:'50px', border:'1.5px solid #34D399', display:'flex', alignItems:'center', gap:4, whiteSpace:'nowrap', boxShadow:'0 4px 14px rgba(16,185,129,0.45)' }}>
            <MessageCircle size={10}/> Both Connected Before ✓
          </div>
        )}
        <div style={{ position:'absolute', top:9, left:9, background:'rgba(0,0,0,0.74)', color:'#FFF', fontSize:9, fontWeight:800, padding:'2px 9px', borderRadius:'50px' }}>{isBride?'👰 BRIDE':'🤵 GROOM'}</div>
        <div style={{ position:'absolute', top:9, right:42, background:isOnline?'rgba(6,78,59,0.9)':'rgba(0,0,0,0.55)', color:isOnline?'#34D399':'#9CA3AF', fontSize:9, fontWeight:800, padding:'2px 9px', borderRadius:'50px', display:'flex', alignItems:'center', gap:3 }}>
          <span style={{ width:5, height:5, borderRadius:'50%', background:isOnline?'#34D399':'#9CA3AF', display:'inline-block' }}/>{isOnline?'Online':'Away'}
        </div>
        <div style={{ position:'absolute', bottom:9, left:9, background:'#7A0026', color:'#D4AF37', fontSize:10, fontWeight:900, padding:'3px 11px', borderRadius:'50px', border:'1px solid #D4AF37', display:'flex', alignItems:'center', gap:3 }}>
          <Star size={10} fill="#D4AF37" stroke="none"/> {profile.matchScore}% ({mc}/{tc})
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:14, display:'flex', flexDirection:'column', gap:11, overflowY:'auto' }}>
        {/* Name */}
        <div>
          <div onClick={()=>onSelectProfile(profile)} style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:7, marginBottom:3 }}>
            <h3 style={{ fontFamily:'Cinzel,serif', fontSize:17, fontWeight:900, color:'#FFF', margin:0 }}>{profile.name}</h3>
            {profile.isVerified && <ShieldCheck size={14} style={{ color:'#3B82F6', flexShrink:0 }}/>}
            <span style={{ fontSize:9, fontWeight:800, color:'#7A0026', background:'#FEF2F2', padding:'2px 7px', borderRadius:'50px', border:'1px solid #FECACA' }}>Full Bio ↗</span>
          </div>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.55)', fontWeight:600, margin:0 }}>{profile.age}y • {profile.height} • {profile.religion} ({profile.caste})</p>
        </div>

        {/* Radius badge */}
        {profile.isInRadius ? (
          <div style={{ fontSize:11, fontWeight:900, color:'#10B981', background:'rgba(16,185,129,0.1)', padding:'7px 13px', borderRadius:11, border:'1px solid rgba(16,185,129,0.28)', display:'flex', alignItems:'center', gap:5 }}>
            <MapPin size={11} style={{ color:'#10B981' }}/> 🎯 In-Radius — {profile.minDistance} km from {profile.nearestCenterName}
          </div>
        ) : (
          <div style={{ background:'rgba(245,158,11,0.09)', border:'1px solid rgba(245,158,11,0.3)', padding:'9px 13px', borderRadius:11 }}>
            <div style={{ fontSize:11, fontWeight:900, color:'#F59E0B', display:'flex', alignItems:'center', gap:4, marginBottom:3 }}><Crown size={11} style={{ color:'#F59E0B' }}/> Out of Radius — {profile.minDistance} km away</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.5)', fontWeight:700 }}>Outside your {radiusKm} km range • Pan-India Plan required</div>
          </div>
        )}

        {/* Details */}
        <div style={{ background:'rgba(255,255,255,0.05)', padding:'11px 13px', borderRadius:13, border:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', gap:7, fontSize:11, color:'rgba(255,255,255,0.8)', fontWeight:700 }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:6 }}><GraduationCap size={12} style={{ color:'#D4AF37', flexShrink:0, marginTop:1 }}/><span>{profile.education}</span></div>
          <div style={{ display:'flex', alignItems:'flex-start', gap:6 }}><Briefcase size={12} style={{ color:'#D4AF37', flexShrink:0, marginTop:1 }}/><span>{profile.occupation} • {profile.income}</span></div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}><MapPin size={12} style={{ color:'#D4AF37', flexShrink:0 }}/><span>{profile.mapArea||profile.city}, {profile.state}</span></div>
          {profile.visaStatus && <div style={{ display:'flex', alignItems:'center', gap:6 }}><Globe size={12} style={{ color:'#D4AF37', flexShrink:0 }}/><span>{profile.visaStatus}</span></div>}
          <div style={{ display:'flex', alignItems:'center', gap:6 }}><Sparkles size={12} style={{ color:'#D4AF37', flexShrink:0 }}/><span>Rashi: {profile.rashi} • Gotra: {profile.gotra||'N/A'}</span></div>
        </div>

        {/* Buttons */}
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          <button
            onClick={()=>onExpressInterest(profile.id)}
            style={{ width:'100%', padding:9, borderRadius:'50px', fontSize:12, fontWeight:900, border:'1.5px solid '+btnCfg.bc, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, transition:'all 0.18s', background:btnCfg.bg, color:btnCfg.cl }}
          >
            {status==='accepted'&&<><Check size={14}/>Interest Accepted</>}
            {status==='declined'&&<><X size={14}/>Interest Declined</>}
            {status==='sent'&&<><Heart size={14} fill="white" stroke="none"/>Interest Sent</>}
            {!status&&<><Heart size={14} fill="#D4AF37" stroke="none"/>Express Interest</>}
          </button>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
            <button onClick={()=>onSelectProfile(profile)} style={{ padding:8, borderRadius:'50px', fontSize:11, fontWeight:800, background:'rgba(212,175,55,0.14)', color:'#D4AF37', border:'1px solid rgba(212,175,55,0.38)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}><Eye size={12}/>Full Bio</button>
            <button onClick={()=>onOpenParivarMeet(profile)} style={{ padding:8, borderRadius:'50px', fontSize:11, fontWeight:800, background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.78)', border:'1px solid rgba(255,255,255,0.13)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}><Calendar size={12}/>Parivar</button>
          </div>
          {profile.lifestyleVideo && (
            <button onClick={()=>onOpenLifestyleReels(profile)} style={{ width:'100%', padding:8, borderRadius:'50px', fontSize:11, fontWeight:800, background:'rgba(0,0,0,0.35)', color:'#D4AF37', border:'1.5px solid #D4AF37', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
              <Video size={12} style={{ color:'#EF4444' }}/> Watch Lifestyle Reel ({profile.lifestyleVideo.duration})
            </button>
          )}
        </div>

        {/* Preference match */}
        {profile.preferencesMatch && profile.preferencesMatch.length>0 && (
          <div>
            <div style={{ fontSize:10, fontWeight:900, color:'#D4AF37', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:7 }}>Preference Match</div>
            {profile.preferencesMatch.slice(0,6).map((pref,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:10, fontWeight:700, marginBottom:5 }}>
                <span style={{ color:'rgba(255,255,255,0.55)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:148 }}>{pref.criteria}</span>
                <span style={{ color:pref.isMatched?'#10B981':'#EF4444', background:pref.isMatched?'rgba(16,185,129,0.13)':'rgba(239,68,68,0.13)', padding:'2px 7px', borderRadius:'50px', fontWeight:900, flexShrink:0 }}>
                  {pref.isMatched?'✓ Match':'✗ Miss'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
