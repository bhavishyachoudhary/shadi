import React from 'react';
import { RotateCcw, ShieldCheck, Crown, Filter, Sparkles, MapPin, Users, BookOpen } from 'lucide-react';

export default function SearchFilters({ filters, setFilters, onReset }) {
  const communitiesList = [
    'All', 'Hindi', 'Punjabi', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 'Gujarati',
    'Malayalam', 'Kannada', 'Odia', 'Marwari', 'Sindhi', 'Assamese', 'Kashmiri', 'Urdu'
  ];

  const castesList = [
    'All', 'Brahmin - Gaur', 'Brahmin - Saraswat', 'Brahmin - Kanyakubj', 'Brahmin - Iyer',
    'Rajput / Kshatriya', 'Agarwal / Vaishya', 'Gupta', 'Maheshwari', 'Khatri', 'Arora',
    'Kayastha', 'Maratha', 'Jat / Jatt Sikh', 'Yadav / Ahir', 'Reddy', 'Nair',
    'Sunni Syed', 'Jain - Digambar', 'Caste No Bar / Open to All'
  ];

  const gotrasList = [
    'All', 'Kashyap', 'Vashishtha', 'Bharadwaj', 'Garg', 'Gautam', 'Shandilya',
    'Kaushik', 'Atri', 'Agastya', 'Parashar', 'Viswamitra'
  ];

  return (
    <div className="sidebar-filter-card">
      
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Crown className="w-5 h-5 text-[#D4AF37]" />
          Refine Shaadi Matches
        </div>

        <button onClick={onReset} className="sidebar-reset-btn">
          <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
          Reset
        </button>
      </div>

      <div>
        
        {/* Verified Profiles Box */}
        <div className="filter-section" style={{ padding: '12px', backgroundColor: '#EBF5FF', borderRadius: '14px', border: '1px solid #B3D8FF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#0066CC', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck className="w-4 h-4 text-[#0066CC]" /> Verified Profiles Only
          </span>
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0066CC' }}
          />
        </div>

        {/* Looking For - Locked to Account Identity */}
        <div className="filter-section">
          <label className="field-label" style={{ marginBottom: '6px', display: 'block' }}>Target Feed</label>
          <div style={{ backgroundColor: '#7A0026', color: '#FFFFFF', padding: '10px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #D4AF37' }}>
            <span>{filters.gender === 'Bride' ? '👰 Bride Profiles Only' : '🤵 Groom Profiles Only'}</span>
            <span style={{ fontSize: '10px', backgroundColor: 'rgba(212,175,55,0.3)', color: '#F4E8C1', padding: '2px 8px', borderRadius: '50px' }}>
              🔒 Account
            </span>
          </div>
        </div>

        {/* Community / Mother Tongue Filter */}
        <div className="filter-section">
          <label className="field-label" style={{ marginBottom: '6px', display: 'block' }}>🌐 Community / Mother Tongue</label>
          <select
            value={filters.motherTongue || 'All'}
            onChange={(e) => setFilters({ ...filters, motherTongue: e.target.value })}
            className="custom-select"
          >
            {communitiesList.map(c => (
              <option key={c} value={c}>{c === 'All' ? '🌐 All Communities' : c}</option>
            ))}
          </select>
        </div>

        {/* Religion Filter */}
        <div className="filter-section">
          <label className="field-label" style={{ marginBottom: '6px', display: 'block' }}>🕉️ Religion</label>
          <select
            value={filters.religion || 'All'}
            onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
            className="custom-select"
          >
            <option value="All">🕉️ All Religions</option>
            <option value="Hindu">Hindu</option>
            <option value="Muslim">Muslim</option>
            <option value="Sikh">Sikh</option>
            <option value="Christian">Christian</option>
            <option value="Jain">Jain</option>
            <option value="Buddhist">Buddhist</option>
          </select>
        </div>

        {/* Shaadi.com Caste Filter */}
        <div className="filter-section">
          <label className="field-label" style={{ marginBottom: '6px', display: 'block' }}>🏰 Caste (Shaadi.com List)</label>
          <select
            value={filters.caste || 'All'}
            onChange={(e) => setFilters({ ...filters, caste: e.target.value })}
            className="custom-select"
          >
            {castesList.map(c => (
              <option key={c} value={c}>{c === 'All' ? '🏰 All Castes' : c}</option>
            ))}
          </select>
        </div>

        {/* Gotra Filter */}
        <div className="filter-section">
          <label className="field-label" style={{ marginBottom: '6px', display: 'block' }}>📿 Gotra</label>
          <select
            value={filters.gotra || 'All'}
            onChange={(e) => setFilters({ ...filters, gotra: e.target.value })}
            className="custom-select"
          >
            {gotrasList.map(g => (
              <option key={g} value={g}>{g === 'All' ? '📿 All Gotras' : g}</option>
            ))}
          </select>
        </div>

        {/* Location Multi-Select & Distance Radius Section */}
        <div className="filter-section" style={{ background: '#FFFDF6', padding: '14px', borderRadius: '16px', border: '1.5px solid #D4AF37', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label className="field-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={13} style={{ color: '#D4AF37' }} /> Multi-City Radius Engine
            </label>
            <span style={{ fontSize: '11px', fontWeight: 900, color: '#7A0026', backgroundColor: '#F4E8C1', padding: '2px 10px', borderRadius: '50px', border: '1px solid #D4AF37' }}>
              {filters.radiusKm >= 3000 ? 'Unlimited' : `${filters.radiusKm || 100} km Radius`}
            </span>
          </div>

          <label style={{ fontSize: '10px', fontWeight: 800, color: '#665D65', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
            Select Target Cities (Multi-Select):
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
            {[
              { id: 'Bengaluru', label: 'Bengaluru' },
              { id: 'Mumbai', label: 'Mumbai' },
              { id: 'Delhi', label: 'Delhi NCR' },
              { id: 'Hyderabad', label: 'Hyderabad' },
              { id: 'Pune', label: 'Pune' },
              { id: 'NRI_USA', label: 'USA NRI' },
              { id: 'All', label: 'All India' }
            ].map(city => {
              const currentKeys = filters.selectedCityKeys || ['Bengaluru', 'Mumbai'];
              const isChecked = currentKeys.includes(city.id);
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => {
                    let updated = [...currentKeys];
                    if (city.id === 'All') updated = ['All'];
                    else {
                      updated = updated.filter(k => k !== 'All');
                      if (updated.includes(city.id)) {
                        if (updated.length > 1) updated = updated.filter(k => k !== city.id);
                      } else {
                        updated.push(city.id);
                      }
                    }
                    setFilters({ ...filters, selectedCityKeys: updated });
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '50px',
                    fontSize: '10px',
                    fontWeight: 800,
                    border: '1px solid',
                    borderColor: isChecked ? '#7A0026' : '#E2D9CC',
                    background: isChecked ? '#7A0026' : '#FFFFFF',
                    color: isChecked ? '#FFFFFF' : '#374151',
                    cursor: 'pointer'
                  }}
                >
                  {isChecked ? '✓ ' : '+ '}{city.label}
                </button>
              );
            })}
          </div>

          <label style={{ fontSize: '10px', fontWeight: 800, color: '#665D65', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Proximity Radius Range:
          </label>
          <input
            type="range"
            min="15"
            max="1000"
            step="15"
            value={filters.radiusKm || 100}
            onChange={(e) => setFilters({ ...filters, radiusKm: parseInt(e.target.value) })}
            style={{ width: '100%', accentColor: '#7A0026', cursor: 'pointer' }}
          />
        </div>

        {/* Maximum Age */}
        <div className="filter-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label className="field-label">Maximum Age</label>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#7A0026', backgroundColor: '#FFF0F3', padding: '2px 10px', borderRadius: '50px', border: '1px solid #FFCCD5' }}>
              Up to {filters.maxAge} Yrs
            </span>
          </div>
          <input
            type="range"
            min="21"
            max="45"
            value={filters.maxAge}
            onChange={(e) => setFilters({ ...filters, maxAge: parseInt(e.target.value) })}
            style={{ width: '100%', accentColor: '#7A0026', cursor: 'pointer' }}
          />
        </div>

        {/* Minimum Income */}
        <div className="filter-section">
          <label className="field-label" style={{ marginBottom: '6px', display: 'block' }}>Minimum Income</label>
          <select
            value={filters.minIncome}
            onChange={(e) => setFilters({ ...filters, minIncome: e.target.value })}
            className="custom-select"
          >
            <option value="All">💼 Doesn't Matter</option>
            <option value="15">₹15+ Lakhs per annum</option>
            <option value="25">₹25+ Lakhs per annum</option>
            <option value="40">₹40+ Lakhs per annum</option>
            <option value="80">₹80L+ / NRI ($100k+)</option>
          </select>
        </div>

        {/* Manglik Preference */}
        <div className="filter-section">
          <label className="field-label" style={{ marginBottom: '6px', display: 'block' }}>Manglik Preference</label>
          <select
            value={filters.manglik}
            onChange={(e) => setFilters({ ...filters, manglik: e.target.value })}
            className="custom-select"
          >
            <option value="All">✨ All (Manglik & Non-Manglik)</option>
            <option value="No">Non-Manglik Only</option>
            <option value="Anshik">Anshik Manglik</option>
            <option value="Yes">Manglik Only</option>
          </select>
        </div>

        {/* Diet */}
        <div className="filter-section">
          <label className="field-label" style={{ marginBottom: '6px', display: 'block' }}>Diet Habits</label>
          <select
            value={filters.diet}
            onChange={(e) => setFilters({ ...filters, diet: e.target.value })}
            className="custom-select"
          >
            <option value="All">🥗 All Diets</option>
            <option value="Vegetarian">Pure Vegetarian</option>
            <option value="Eggetarian">Eggetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
          </select>
        </div>

      </div>
    </div>
  );
}

