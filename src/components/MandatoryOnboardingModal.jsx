import React, { useState } from 'react';
import { ShieldCheck, Heart, Sparkles, Lock, ArrowRight, CheckCircle2, User, Globe, MapPin, Briefcase, GraduationCap, Users, BookOpen, Calendar, Award, Compass } from 'lucide-react';

export default function MandatoryOnboardingModal({ currentUser, onCompleteOnboarding }) {
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    gender: currentUser?.gender || '',
    dob: currentUser?.dob || '1998-08-15',
    age: currentUser?.age || '26',
    community: currentUser?.community || 'Hindi',
    religion: currentUser?.religion || 'Hindu',
    caste: currentUser?.caste || 'Brahmin - Gaur',
    gotra: currentUser?.gotra || 'Kashyap',
    city: currentUser?.city || 'Bengaluru',
    rashi: currentUser?.rashi || 'Tula (Libra)',
    education: currentUser?.education || 'B.Tech / Masters',
    occupation: currentUser?.occupation || 'Software Professional',
    about: currentUser?.about || 'Warm-hearted, family-oriented professional looking for a compatible lifetime partner.'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Shaadi.com Inspired Lists
  const communitiesList = [
    'Hindi', 'Punjabi', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 'Gujarati',
    'Malayalam', 'Kannada', 'Odia', 'Marwari', 'Sindhi', 'Assamese', 'Kashmiri',
    'Konkani', 'Urdu', 'Parsi', 'English', 'Others'
  ];

  const castesList = [
    'Brahmin - Gaur', 'Brahmin - Saraswat', 'Brahmin - Kanyakubj', 'Brahmin - Iyer',
    'Brahmin - Iyengar', 'Brahmin - Anavil', 'Brahmin - Sanadhya', 'Brahmin - Deshastha',
    'Rajput / Kshatriya', 'Rajput - Chauhan', 'Rajput - Rathore', 'Rajput - Parmar',
    'Agarwal / Vaishya', 'Gupta', 'Maheshwari', 'Oswal', 'Khandelwal', 'Bania',
    'Khatri', 'Arora', 'Kayastha', 'Maratha', 'Jat / Jatt Sikh', 'Yadav / Ahir',
    'Reddy', 'Kamma', 'Nair', 'Ezhava', 'Lingayat', 'Mudaliar', 'Pillai',
    'Sunni Syed', 'Sunni Sheikh', 'Sunni Pathan', 'Shia Syed',
    'Jatt Sikh', 'Ramgharia Sikh', 'Saini',
    'Jain - Digambar', 'Jain - Shwetambar',
    'Caste No Bar / Open to All', 'Other Caste'
  ];

  const gotrasList = [
    'Kashyap', 'Vashishtha', 'Bharadwaj', 'Garg', 'Gautam', 'Shandilya',
    'Kaushik', 'Atri', 'Agastya', 'Parashar', 'Vatsa', 'Harita', 'Viswamitra',
    'Jamadagni', 'Angirasa', 'Sandilya', 'Kaundinya', 'Srivatsa', 'Mudgala',
    'Don\'t Know / Not Applicable'
  ];

  const rashis = [
    'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
    'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchika (Scorpio)',
    'Dhanu (Sagittarius)', 'Makar (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
  ];

  const set = (key, val) => {
    setError('');
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  // Dynamic progress calculation as user fills inputs
  const calculateProgress = () => {
    const fields = [
      { key: 'gender', weight: 15 },
      { key: 'fullName', weight: 15 },
      { key: 'dob', weight: 15 },
      { key: 'community', weight: 10 },
      { key: 'religion', weight: 10 },
      { key: 'caste', weight: 10 },
      { key: 'gotra', weight: 5 },
      { key: 'city', weight: 5 },
      { key: 'rashi', weight: 5 },
      { key: 'education', weight: 5 },
      { key: 'occupation', weight: 5 },
    ];
    let currentScore = 0;
    fields.forEach(f => {
      if (formData[f.key] && formData[f.key].toString().trim() !== '') {
        currentScore += f.weight;
      }
    });
    return Math.min(100, Math.max(0, currentScore));
  };

  const completionPct = calculateProgress();

  const handleDobChange = (e) => {
    const dobVal = e.target.value;
    set('dob', dobVal);
    if (dobVal) {
      const birthYear = new Date(dobVal).getFullYear();
      const currentYear = new Date().getFullYear();
      const calculatedAge = Math.max(18, currentYear - birthYear);
      set('age', calculatedAge.toString());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || formData.fullName.length < 3) {
      setError('Please enter your full name (at least 3 characters).');
      return;
    }
    if (!formData.gender) {
      setError('Please select whether you are creating a Bride or Groom profile.');
      return;
    }
    if (!formData.dob) {
      setError('Please select your Date of Birth (DOB).');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onCompleteOnboarding({
        ...formData,
        profileComplete: true,
        profileCompleteness: completionPct,
        isLocked: true,
        lockedFields: ['fullName', 'gender', 'dob'],
        isVerified: true,
        userUniqueId: `BANDHAN_${Math.floor(100000 + Math.random() * 900000)}`
      });
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(15, 7, 12, 0.88)', backdropFilter: 'blur(12px)',
      padding: '20px 16px', overflowY: 'auto'
    }}>
      <div style={{
        background: '#FFFFFF', borderRadius: '28px', width: '100%', maxWidth: '640px',
        border: '2px solid #D4AF37', boxShadow: '0 30px 90px rgba(0,0,0,0.6)',
        overflow: 'hidden', margin: 'auto', animation: 'float-up 0.4s ease'
      }}>

        {/* Header - Luxury Maroon & Gold Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #58001B 0%, #7A0026 50%, #A8003A 100%)',
          padding: '28px 32px 24px', color: '#FFFFFF', position: 'relative',
          borderBottom: '2px solid #D4AF37'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212,175,55,0.22)', border: '1px solid #D4AF37', padding: '4px 14px', borderRadius: '50px', fontSize: '11px', fontWeight: 900, color: '#F4E8C1', letterSpacing: '1px', textTransform: 'uppercase' }}>
              <Sparkles size={13} style={{ color: '#D4AF37' }} /> STEP 2: COMPLETE YOUR PROFILE
            </div>
            <span style={{ fontSize: '11px', color: '#F4E8C1', fontWeight: 700 }}>
              Official Bandhan Matrimony Registration
            </span>
          </div>

          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '26px', fontWeight: 900, color: '#FFFFFF', margin: '10px 0 4px', letterSpacing: '0.3px' }}>
            Mandatory Identity & Matrimony Details
          </h2>

          <p style={{ fontSize: '12px', color: '#F4E8C1', margin: 0, fontWeight: 500, lineHeight: '1.4' }}>
            Select your community, caste & gotra to enable verified Ashtakoot 36 Gunas matching.
          </p>

          {/* 📊 DYNAMIC PROGRESS BAR ACCORDING TO USER INPUT */}
          <div style={{
            marginTop: '20px',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(212, 175, 55, 0.6)',
            borderRadius: '16px',
            padding: '14px 18px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 900, color: '#F4E8C1', display: 'inline-flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <Sparkles size={14} style={{ color: '#D4AF37' }} /> Profile Completion Progress
              </span>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#58001B', background: '#D4AF37', padding: '3px 14px', borderRadius: '50px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                {completionPct}% Complete
              </span>
            </div>

            {/* Glowing animated progress line */}
            <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '50px', overflow: 'hidden', padding: '1px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{
                width: `${completionPct}%`,
                height: '100%',
                background: completionPct === 100
                  ? 'linear-gradient(90deg, #10B981 0%, #34D399 100%)'
                  : 'linear-gradient(90deg, #F4E8C1 0%, #D4AF37 50%, #F59E0B 100%)',
                borderRadius: '50px',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 0 10px rgba(212, 175, 55, 0.6)'
              }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#F4E8C1', fontWeight: 700, marginTop: '6px' }}>
              <span>{completionPct === 100 ? '🎉 Profile 100% Complete!' : 'Fill details below to boost completion score'}</span>
              <span>{completionPct}/100 Pts</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 32px 32px', background: '#FFFDF9' }}>

          {/* Mandatory Security Warning Box */}
          <div style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FFF4D9 100%)',
            border: '1.5px solid #D4AF37', borderRadius: '16px',
            padding: '12px 16px', marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '12px',
            boxShadow: '0 4px 12px rgba(212,175,55,0.1)'
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#7A0026', color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Lock size={18} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#7A0026' }}>
                🔒 Shaadi Verified Identity & Non-Editable Guarantee
              </div>
              <div style={{ fontSize: '11px', color: '#78350F', fontWeight: 600, marginTop: '2px' }}>
                <strong>Full Name</strong>, <strong>Gender</strong>, and <strong>DOB</strong> lock permanently after registration to prevent fake profiles.
              </div>
            </div>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1.5px solid #FCA5A5', color: '#991B1B', padding: '12px 16px', borderRadius: '14px', fontSize: '12px', fontWeight: 800, marginBottom: '20px' }}>
              ⚠️ {error}
            </div>
          )}

          {/* SECTION 1: MANDATORY IDENTITY & GENDER */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 900, color: '#7A0026', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              <User size={15} style={{ color: '#D4AF37' }} /> 1. Mandatory Gender Selection *
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <button
                type="button"
                onClick={() => set('gender', 'Bride')}
                style={{
                  padding: '16px 14px', borderRadius: '18px', border: '2px solid',
                  borderColor: formData.gender === 'Bride' ? '#EC4899' : '#E5E7EB',
                  background: formData.gender === 'Bride' ? '#FDF2F8' : '#FFFFFF',
                  cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                  boxShadow: formData.gender === 'Bride' ? '0 6px 20px rgba(236,72,153,0.2)' : '0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ fontSize: '30px', marginBottom: '4px' }}>👰</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: formData.gender === 'Bride' ? '#9D174D' : '#1F2937' }}>
                  I am a Bride
                </div>
                <div style={{ fontSize: '10px', color: formData.gender === 'Bride' ? '#BE185D' : '#6B7280', fontWeight: 700, marginTop: '2px' }}>
                  Shows Groom Feed
                </div>
              </button>

              <button
                type="button"
                onClick={() => set('gender', 'Groom')}
                style={{
                  padding: '16px 14px', borderRadius: '18px', border: '2px solid',
                  borderColor: formData.gender === 'Groom' ? '#3B82F6' : '#E5E7EB',
                  background: formData.gender === 'Groom' ? '#EFF6FF' : '#FFFFFF',
                  cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                  boxShadow: formData.gender === 'Groom' ? '0 6px 20px rgba(59,130,246,0.2)' : '0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ fontSize: '30px', marginBottom: '4px' }}>🤵</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: formData.gender === 'Groom' ? '#1E40AF' : '#1F2937' }}>
                  I am a Groom
                </div>
                <div style={{ fontSize: '10px', color: formData.gender === 'Groom' ? '#1D4ED8' : '#6B7280', fontWeight: 700, marginTop: '2px' }}>
                  Shows Bride Feed
                </div>
              </button>
            </div>
          </div>

          {/* Full Name & Date of Birth */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>
                📝 Full Name (Non-Editable) *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={e => set('fullName', e.target.value)}
                placeholder="e.g. Rohan Verma"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>
                📅 Date of Birth (DOB) *
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={handleDobChange}
                style={inputStyle}
                required
              />
              {formData.dob && (
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#065F46', backgroundColor: '#ECFDF5', border: '1px solid #6EE7B7', padding: '3px 10px', borderRadius: '8px', marginTop: '5px', display: 'inline-block' }}>
                  🎂 Calculated Age: <strong>{formData.age} Yrs</strong>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: COMMUNITY, SHAADI CASTE & GOTRA LISTS */}
          <div style={{
            background: '#FFFFFF', border: '1.5px solid #EAE3D9', borderRadius: '20px',
            padding: '18px 20px', marginBottom: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 900, color: '#7A0026', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>
              <Users size={15} style={{ color: '#D4AF37' }} /> 2. Community, Caste & Gotra (Shaadi.com Standard)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              {/* Community List Dropdown */}
              <div>
                <label style={labelStyle}>🌐 Community / Mother Tongue *</label>
                <select
                  value={formData.community}
                  onChange={e => set('community', e.target.value)}
                  style={selectStyle}
                >
                  {communitiesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Religion Dropdown */}
              <div>
                <label style={labelStyle}>🕉️ Religion *</label>
                <select
                  value={formData.religion}
                  onChange={e => set('religion', e.target.value)}
                  style={selectStyle}
                >
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Christian">Christian</option>
                  <option value="Jain">Jain</option>
                  <option value="Buddhist">Buddhist</option>
                  <option value="Parsi">Parsi</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
              {/* Shaadi.com Caste List Dropdown */}
              <div>
                <label style={labelStyle}>🏰 Caste / Sub-Community (Shaadi.com List) *</label>
                <select
                  value={formData.caste}
                  onChange={e => set('caste', e.target.value)}
                  style={selectStyle}
                >
                  {castesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Shaadi.com Gotra List Dropdown */}
              <div>
                <label style={labelStyle}>📿 Gotra *</label>
                <select
                  value={formData.gotra}
                  onChange={e => set('gotra', e.target.value)}
                  style={selectStyle}
                >
                  {gotrasList.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: LOCATION & ASTROLOGY */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '28px' }}>
            <div>
              <label style={labelStyle}>📍 City / Location</label>
              <select value={formData.city} onChange={e => set('city', e.target.value)} style={selectStyle}>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="New Delhi">New Delhi / NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Pune">Pune</option>
                <option value="San Jose (NRI)">San Jose (NRI USA)</option>
                <option value="London (NRI)">London (NRI UK)</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>✨ Moon Sign (Rashi)</label>
              <select value={formData.rashi} onChange={e => set('rashi', e.target.value)} style={selectStyle}>
                {rashis.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '16px', borderRadius: '18px',
              background: 'linear-gradient(135deg, #7A0026 0%, #A8003A 100%)',
              color: '#FFFFFF', border: '1px solid #D4AF37', cursor: 'pointer',
              fontSize: '16px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: '0 8px 26px rgba(122,0,38,0.4)', transition: 'all 0.2s ease',
              letterSpacing: '0.3px'
            }}
          >
            {loading ? 'Securing Account Identity...' : <>✅ Save Particulars & Enter Verified Dashboard <ArrowRight size={20} style={{ color: '#D4AF37' }} /></>}
          </button>
        </form>

      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: '11px',
  fontWeight: 900,
  color: '#7A0026',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  display: 'block',
  marginBottom: '6px'
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '14px',
  border: '1.5px solid #E2D9CC',
  background: '#FAF7F2',
  fontSize: '13px',
  fontWeight: 700,
  color: '#1F2937',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all 0.2s'
};

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'auto'
};
