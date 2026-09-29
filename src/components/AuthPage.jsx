import React, { useState } from 'react';
import { X, Phone, Loader2, ShieldCheck, Heart, RefreshCw } from 'lucide-react';

const GOOGLE_ICON = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function AuthPage({ onClose, onAuthSuccess }) {
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  // === OTP countdown timer ===
  const startCountdown = () => {
    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown(p => {
        if (p <= 1) { clearInterval(interval); return 0; }
        return p - 1;
      });
    }, 1000);
  };

  const handleSendOTP = () => {
    if (!mobile || mobile.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      startCountdown();
    }, 600);
  };

  const handleOtpChange = (index, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otpValue];
    newOtp[index] = val.slice(-1);
    setOtpValue(newOtp);
    if (val && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpValue[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleVerifyOTP = () => {
    const code = otpValue.join('');
    if (code.length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuthSuccess({
        name: 'Groom User',
        mobile: mobile,
        gender: 'Groom', // Default fallback gender; user customizes profile later
        loginMethod: 'mobile',
        profileComplete: false,
        isVerified: true,
      });
    }, 800);
  };

  const handleGoogleAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuthSuccess({
        name: 'Rohan Verma',
        email: 'rohan.verma@gmail.com',
        gender: 'Groom', // Default fallback gender; user customizes profile later
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
        loginMethod: 'google',
        profileComplete: false,
        isVerified: true,
      });
    }, 600);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      padding: '16px', overflowY: 'auto'
    }}>
      <div style={{
        background: '#FFFFFF', borderRadius: '28px', width: '100%', maxWidth: '420px',
        border: '2px solid rgba(212,175,55,0.4)', boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        overflow: 'hidden', position: 'relative', margin: 'auto'
      }}>

        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #7A0026 0%, #C0185E 100%)',
          padding: '28px 24px 22px', color: '#FFFFFF', position: 'relative', textAlign: 'center'
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
          }}>
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Heart size={20} style={{ fill: '#fff', stroke: 'none' }} />
            </div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '20px', fontWeight: 900, letterSpacing: '1px' }}>
              BANDHAN <span style={{ color: '#D4AF37' }}>Shaadi</span>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#F4E8C1', margin: 0, fontWeight: 600 }}>
            Sign In / Sign Up to Bandhan Matrimony
          </p>
        </div>

        {/* Single Page Modal Body */}
        <div style={{ padding: '24px' }}>

          {/* 1. Google One-Click Sign In */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            style={{
              width: '100%', padding: '13px', borderRadius: '14px',
              border: '1.5px solid #D1D5DB', background: '#FFFFFF', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              fontSize: '14px', fontWeight: 800, color: '#1F2937',
              boxShadow: '0 3px 12px rgba(0,0,0,0.06)', transition: 'all 0.2s',
              marginBottom: '18px'
            }}
          >
            {loading && !otpSent ? (
              <Loader2 size={18} className="animate-spin text-[#7A0026]" />
            ) : (
              <>
                <GOOGLE_ICON /> Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '11px', fontWeight: 800, marginBottom: '18px', letterSpacing: '0.5px' }}>
            ── OR SIGN IN WITH MOBILE ──
          </div>

          {/* 2. Mobile OTP Flow */}
          {!otpSent ? (
            <div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#665D65', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                  Mobile Number
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{
                    padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB',
                    background: '#FAFAFA', fontSize: '13px', fontWeight: 800, color: '#374151',
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit mobile number"
                    style={{
                      flex: 1, padding: '12px 14px', borderRadius: '12px',
                      border: '1.5px solid #E5E7EB', background: '#FAFAFA',
                      fontSize: '14px', fontWeight: 800, color: '#1F2937', outline: 'none'
                    }}
                    maxLength={10}
                  />
                </div>
              </div>

              <button
                onClick={handleSendOTP}
                disabled={mobile.length < 10 || loading}
                style={{
                  width: '100%', padding: '13px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #7A0026 0%, #C0185E 100%)',
                  color: '#FFFFFF', border: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 6px 20px rgba(122,0,38,0.3)',
                  opacity: (mobile.length < 10 || loading) ? 0.6 : 1
                }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><Phone size={16} /> Send OTP Verification Code</>}
              </button>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', color: '#374151', fontWeight: 700, margin: 0 }}>
                  Enter 6-digit OTP sent to <strong>+91 {mobile}</strong>
                </p>
                <button onClick={() => setOtpSent(false)} style={{ background: 'none', border: 'none', color: '#7A0026', fontSize: '11px', fontWeight: 800, cursor: 'pointer', marginTop: '4px' }}>
                  ✏️ Edit Number
                </button>
              </div>

              {/* 6 Digit OTP Inputs */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
                {otpValue.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(e, i)}
                    style={{
                      width: '42px', height: '50px', borderRadius: '12px',
                      border: `2px solid ${digit ? '#7A0026' : '#E5E7EB'}`,
                      textAlign: 'center', fontSize: '20px', fontWeight: 900,
                      color: '#7A0026', background: digit ? '#FDF2F2' : '#FAFAFA',
                      outline: 'none', transition: 'all 0.2s'
                    }}
                  />
                ))}
              </div>

              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                {countdown > 0 ? (
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Resend OTP in {countdown}s</span>
                ) : (
                  <button onClick={() => { handleSendOTP(); setOtpValue(['','','','','','']); }} style={{
                    background: 'none', border: 'none', cursor: 'pointer', color: '#7A0026', fontWeight: 800, fontSize: '12px',
                    display: 'inline-flex', alignItems: 'center', gap: '4px'
                  }}>
                    <RefreshCw size={12} /> Resend OTP Code
                  </button>
                )}
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={otpValue.join('').length < 6 || loading}
                style={{
                  width: '100%', padding: '13px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#FFFFFF', border: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 6px 20px rgba(5,150,105,0.3)',
                  opacity: (otpValue.join('').length < 6 || loading) ? 0.6 : 1
                }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <>✅ Verify OTP & Sign In</>}
              </button>
            </div>
          )}

          {/* Security & Privacy Footer */}
          <div style={{
            marginTop: '22px', paddingTop: '16px', borderTop: '1px solid #F3F4F6',
            textAlign: 'center', fontSize: '11px', color: '#9CA3AF', lineHeight: '1.5'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#059669', fontWeight: 700, marginBottom: '4px' }}>
              <ShieldCheck size={14} /> 256-Bit Encrypted • 100% Privacy Protected
            </div>
            By continuing, you agree to Bandhan Shaadi's Terms & Privacy Policy.
          </div>

        </div>

      </div>
    </div>
  );
}
