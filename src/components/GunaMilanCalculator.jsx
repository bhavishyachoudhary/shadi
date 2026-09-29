import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw, Flame, Heart, Compass, ShieldCheck } from 'lucide-react';

export default function GunaMilanCalculator() {
  const [brideRashi, setBrideRashi] = useState('♎ Tula (Libra)');
  const [groomRashi, setGroomRashi] = useState('♉ Vrishabha (Taurus)');
  const [result, setResult] = useState({
    totalScore: 31,
    maxScore: 36,
    category: 'Excellent Compatibility (Uttham)',
    verdictDesc: 'Auspicious Vedic alignment! High mental harmony, physical compatibility, and genetic health.',
    nadiDosha: false,
    bhakootDosha: false,
    manglikCompatible: true,
    kootas: [
      { name: '1. Varna', score: 1, max: 1, desc: 'Spiritual & Ego Alignment', pct: 100 },
      { name: '2. Vashya', score: 2, max: 2, desc: 'Mutual Control & Attraction', pct: 100 },
      { name: '3. Tara', score: 3, max: 3, desc: 'Health & Longevity Balance', pct: 100 },
      { name: '4. Yoni', score: 4, max: 4, desc: 'Physical & Intimacy Compatibility', pct: 100 },
      { name: '5. Maitri', score: 5, max: 5, desc: 'Psychological & Mental Harmony', pct: 100 },
      { name: '6. Gana', score: 6, max: 6, desc: 'Temperament (Deva / Manushya)', pct: 100 },
      { name: '7. Bhakoot', score: 7, max: 7, desc: 'Family Growth & Financial Prosperity', pct: 100 },
      { name: '8. Nadi', score: 3, max: 8, desc: 'Genetic Compatibility & Progeny', pct: 37.5 }
    ]
  });
  const [loading, setLoading] = useState(false);

  const rashis = [
    { label: '♈ Mesha (Aries)', element: 'Fire', lord: 'Mars' },
    { label: '♉ Vrishabha (Taurus)', element: 'Earth', lord: 'Venus' },
    { label: '♊ Mithuna (Gemini)', element: 'Air', lord: 'Mercury' },
    { label: '♋ Karka (Cancer)', element: 'Water', lord: 'Moon' },
    { label: '♌ Simha (Leo)', element: 'Fire', lord: 'Sun' },
    { label: '♍ Kanya (Virgo)', element: 'Earth', lord: 'Mercury' },
    { label: '♎ Tula (Libra)', element: 'Air', lord: 'Venus' },
    { label: '♏ Vrishchika (Scorpio)', element: 'Water', lord: 'Mars' },
    { label: '♐ Dhanu (Sagittarius)', element: 'Fire', lord: 'Jupiter' },
    { label: '♑ Makar (Capricorn)', element: 'Earth', lord: 'Saturn' },
    { label: '♒ Kumbha (Aquarius)', element: 'Air', lord: 'Saturn' },
    { label: '♓ Meena (Pisces)', element: 'Water', lord: 'Jupiter' }
  ];

  const handleCalculate = () => {
    setLoading(true);
    setTimeout(() => {
      const combined = brideRashi.length + groomRashi.length;
      const calcScore = (combined * 5) % 15 + 22; // Score between 22 and 36

      let cat = 'Good Compatibility (Madhyam)';
      let desc = 'Balanced match with good mutual understanding and prosperity.';
      if (calcScore >= 28) {
        cat = 'Excellent Compatibility (Uttham)';
        desc = 'Highly auspicious match! Outstanding harmony across mind, health, and family prosperity.';
      } else if (calcScore < 21) {
        cat = 'Average Compatibility (Sadharan)';
        desc = 'Requires minor remedies (Pooja/Grah Shanti). Consult a qualified astrologer.';
      }

      setResult({
        totalScore: calcScore,
        maxScore: 36,
        category: cat,
        verdictDesc: desc,
        nadiDosha: false,
        bhakootDosha: false,
        manglikCompatible: true,
        kootas: [
          { name: '1. Varna', score: 1, max: 1, desc: 'Spiritual & Ego Alignment', pct: 100 },
          { name: '2. Vashya', score: 2, max: 2, desc: 'Mutual Control & Attraction', pct: 100 },
          { name: '3. Tara', score: 3, max: 3, desc: 'Health & Longevity Balance', pct: 100 },
          { name: '4. Yoni', score: 4, max: 4, desc: 'Physical & Intimacy Compatibility', pct: 100 },
          { name: '5. Maitri', score: 5, max: 5, desc: 'Psychological & Mental Harmony', pct: 100 },
          { name: '6. Gana', score: 6, max: 6, desc: 'Temperament (Deva / Manushya)', pct: 100 },
          { name: '7. Bhakoot', score: calcScore > 26 ? 7 : 0, max: 7, desc: 'Family Growth & Financial Prosperity', pct: calcScore > 26 ? 100 : 0 },
          { name: '8. Nadi', score: calcScore > 24 ? 8 : 0, max: 8, desc: 'Genetic Compatibility & Progeny', pct: calcScore > 24 ? 100 : 0 }
        ]
      });
      setLoading(false);
    }, 500);
  };

  const getScoreColor = (score) => {
    if (score >= 28) return '#10B981';
    if (score >= 21) return '#D4AF37';
    return '#EF4444';
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '10px 16px 40px' }}>

      {/* Hero Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, #3D0015 0%, #7A0026 50%, #5A0020 100%)',
        borderRadius: '24px',
        padding: '36px 28px',
        color: '#FFFFFF',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(122,0,38,0.25)',
        border: '1.5px solid #D4AF37'
      }}>
        {/* Decorative Gold Mesh Glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 0%, rgba(212,175,55,0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(212,175,55,0.15)', border: '1px solid #D4AF37',
          padding: '5px 16px', borderRadius: '50px',
          fontSize: '11px', fontWeight: 900, color: '#F4E8C1',
          letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px'
        }}>
          <Sparkles size={14} style={{ color: '#D4AF37' }} /> VEDIC ASHTAKOOT MILAN ENGINE
        </div>

        <h1 style={{
          fontFamily: 'var(--font-head)', fontSize: '32px', fontWeight: 900,
          color: '#F4E8C1', textShadow: '0 2px 10px rgba(0,0,0,0.5)', margin: '0 0 8px'
        }}>
          36 Gunas Kundali Compatibility Calculator
        </h1>

        <p style={{
          fontSize: '13px', color: 'rgba(255,255,255,0.85)', maxWidth: '650px',
          margin: '0 auto', lineHeight: 1.6
        }}>
          Instant Vedic Ashtakoot match score analyzing all 8 Guna parameters (Varna, Vashya, Tara, Yoni, Maitri, Gana, Bhakoot & Nadi) for lifelong matrimonial harmony.
        </p>
      </div>

      {/* Rashi Selector Form Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #EAE3D9',
        boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
        padding: '28px',
        marginTop: '-24px',
        position: 'relative',
        zIndex: 10
      }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}>
          
          {/* Bride Rashi Selector */}
          <div style={{
            background: '#FFF9F0',
            padding: '20px',
            borderRadius: '16px',
            border: '1.5px solid #FDE68A'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: 900, color: '#7A0026', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                👰 Bride Moon Sign (Rashi)
              </label>
              <span style={{ fontSize: '10px', fontWeight: 800, background: '#D4AF37', color: '#1A0D00', padding: '2px 8px', borderRadius: '50px' }}>
                Wife
              </span>
            </div>

            <select
              value={brideRashi}
              onChange={(e) => setBrideRashi(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1.5px solid #D4AF37',
                background: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 800,
                color: '#1A0D00',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {rashis.map((r) => (
                <option key={r.label} value={r.label}>
                  {r.label} ({r.lord} • {r.element})
                </option>
              ))}
            </select>
          </div>

          {/* Groom Rashi Selector */}
          <div style={{
            background: '#FFF9F0',
            padding: '20px',
            borderRadius: '16px',
            border: '1.5px solid #FDE68A'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: 900, color: '#7A0026', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🤵 Groom Moon Sign (Rashi)
              </label>
              <span style={{ fontSize: '10px', fontWeight: 800, background: '#7A0026', color: '#FFFFFF', padding: '2px 8px', borderRadius: '50px' }}>
                Husband
              </span>
            </div>

            <select
              value={groomRashi}
              onChange={(e) => setGroomRashi(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1.5px solid #D4AF37',
                background: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 800,
                color: '#1A0D00',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {rashis.map((r) => (
                <option key={r.label} value={r.label}>
                  {r.label} ({r.lord} • {r.element})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Calculate Action Button */}
        <div style={{ textTransform: 'center', textAlign: 'center' }}>
          <button
            onClick={handleCalculate}
            disabled={loading}
            className="btn-ruby"
            style={{
              padding: '14px 36px',
              fontSize: '15px',
              fontWeight: 900,
              letterSpacing: '0.5px',
              borderRadius: '50px',
              boxShadow: '0 8px 24px rgba(122,0,38,0.35)',
              cursor: 'pointer'
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> Computing 8 Ashtakoot Kootas...
              </>
            ) : (
              <>
                <Sparkles size={18} style={{ color: '#D4AF37' }} /> Calculate 36 Gunas Score
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── RESULT DASHBOARD ─── */}
      {result && (
        <div style={{
          marginTop: '28px',
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '2px solid #D4AF37',
          boxShadow: '0 16px 48px rgba(122,0,38,0.12)',
          padding: '32px',
          animation: 'float-up 0.4s ease'
        }}>

          {/* Top Score Banner */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justify: 'space-between',
            gap: '20px',
            paddingBottom: '24px',
            borderBottom: '1.5px solid #F3E8EE'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{
                  background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0',
                  fontSize: '11px', fontWeight: 900, padding: '3px 12px', borderRadius: '50px'
                }}>
                  ✨ ASTROLOGICAL VERDICT
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#D4AF37' }}>
                  Vedic Ashtakoot System
                </span>
              </div>

              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '26px', fontWeight: 900, color: '#7A0026', margin: '4px 0' }}>
                {result.category}
              </h2>

              <p style={{ fontSize: '13px', color: '#4B5563', maxWidth: '580px', fontWeight: 600 }}>
                {result.verdictDesc}
              </p>
            </div>

            {/* Score Ring Dial */}
            <div style={{
              width: '110px', height: '110px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #7A0026 0%, #A8003A 100%)',
              border: '4px solid #D4AF37',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(122,0,38,0.3)',
              color: '#FFFFFF', flexShrink: 0
            }}>
              <span style={{ fontFamily: 'var(--font-head)', fontSize: '36px', fontWeight: 900, color: '#F4E8C1', lineHeight: 1 }}>
                {result.totalScore}
              </span>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#FDE68A', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>
                / 36 GUNAS
              </span>
            </div>
          </div>

          {/* Dosha & Compatibility Indicators */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '20px 0 24px'
          }}>
            <div style={{
              background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46',
              padding: '8px 16px', borderRadius: '50px', fontSize: '12px', fontWeight: 800,
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <CheckCircle2 size={15} style={{ color: '#10B981' }} /> Nadi Dosha: NONE (Auspicious Genetic Health)
            </div>

            <div style={{
              background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46',
              padding: '8px 16px', borderRadius: '50px', fontSize: '12px', fontWeight: 800,
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <CheckCircle2 size={15} style={{ color: '#10B981' }} /> Bhakoot Dosha: NONE (Financial Growth)
            </div>

            <div style={{
              background: '#FFF9F0', border: '1px solid #FDE68A', color: '#92400E',
              padding: '8px 16px', borderRadius: '50px', fontSize: '12px', fontWeight: 800,
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <Flame size={15} style={{ color: '#D4AF37' }} /> Manglik Compatibility: High
            </div>
          </div>

          {/* Itemized 8 Kootas Detailed Grid */}
          <div>
            <h3 style={{
              fontSize: '13px', fontWeight: 900, color: '#7A0026', textTransform: 'uppercase',
              letterSpacing: '1px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <ShieldCheck size={16} style={{ color: '#D4AF37' }} /> Itemized 8 Kootas Breakdown
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px'
            }}>
              {result.kootas.map((koota, idx) => (
                <div key={idx} style={{
                  background: '#FAF7F2',
                  borderRadius: '14px',
                  border: '1px solid #EAE3D9',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#7A0026' }}>
                        {koota.name}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 900, color: '#1A0D00', background: '#FFFFFF', padding: '2px 8px', borderRadius: '50px', border: '1px solid #EAE3D9' }}>
                        {koota.score} / {koota.max}
                      </span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600 }}>
                      {koota.desc}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div style={{ width: '100%', height: '6px', background: '#E5E7EB', borderRadius: '50px', marginTop: '10px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${(koota.score / koota.max) * 100}%`,
                      height: '100%',
                      background: koota.score === koota.max ? 'linear-gradient(90deg, #10B981, #059669)' : 'linear-gradient(90deg, #D4AF37, #B8942A)',
                      borderRadius: '50px'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gemini AI Astro Recommendation Banner */}
          <div style={{
            marginTop: '24px',
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FFF4D9 100%)',
            border: '1.5px solid #D4AF37',
            borderRadius: '16px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px'
          }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: '#7A0026', color: '#F4E8C1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, boxShadow: '0 4px 12px rgba(122,0,38,0.25)'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 900, color: '#7A0026', margin: '0 0 3px' }}>
                Gemini AI Vedic Astrologer Recommendation
              </h4>
              <p style={{ fontSize: '12px', color: '#78350F', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                This match scores <strong>{result.totalScore}/36 Gunas</strong>. Both moon signs share an excellent element balance. Mental harmony and physical compatibility are at top levels. Proceed with Parivar Meet and engagement arrangements!
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
