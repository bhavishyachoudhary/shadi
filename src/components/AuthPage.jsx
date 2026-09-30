import React, { useEffect, useState } from 'react';
import { Heart, Loader2, Phone, RefreshCw, ShieldCheck, X } from 'lucide-react';
import { apiRequest, getApiUrl } from '../api/client';

const GOOGLE_ICON = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const EMPTY_OTP = ['', '', '', '', '', ''];
const DEMO_AUTH_ENABLED = import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEMO_AUTH === 'true';
const GOOGLE_AUTH_ENABLED = import.meta.env.VITE_ENABLE_GOOGLE_AUTH === 'true';

export default function AuthPage({ onClose, onAuthSuccess }) {
  const [gender, setGender] = useState('');
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState(EMPTY_OTP);
  const [countdown, setCountdown] = useState(0);
  const [loadingAction, setLoadingAction] = useState(null);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');

  useEffect(() => {
    if (countdown <= 0) return undefined;
    const timer = window.setTimeout(() => setCountdown(value => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  const handleSendOTP = async () => {
    if (mobile.length !== 10 || !gender || loadingAction) return;

    setError('');
    setDevOtp('');
    setLoadingAction('send-otp');
    try {
      const result = await apiRequest('/auth/send-otp', {
        method: 'POST',
        body: { mobile, gender },
        token: null,
      });
      setOtpSent(true);
      setOtpValue(EMPTY_OTP);
      setCountdown(30);
      if (import.meta.env.DEV && result.otp_dev) setDevOtp(result.otp_dev);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const nextOtp = [...otpValue];
    nextOtp[index] = value.slice(-1);
    setOtpValue(nextOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !otpValue[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otp = otpValue.join('');
    if (otp.length !== 6 || loadingAction) return;

    setError('');
    setLoadingAction('verify-otp');
    try {
      const result = await apiRequest('/auth/verify-otp', {
        method: 'POST',
        body: { mobile, otp },
        token: null,
      });
      onAuthSuccess({
        ...result.user,
        token: result.token,
        loginMethod: 'mobile',
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDemoAuth = async demoGender => {
    if (!DEMO_AUTH_ENABLED || loadingAction) return;

    setGender(demoGender);
    setError('');
    setLoadingAction(`demo-${demoGender.toLowerCase()}`);
    try {
      const result = await apiRequest('/auth/demo', {
        method: 'POST',
        body: { gender: demoGender },
        token: null,
      });
      onAuthSuccess({
        ...result.user,
        token: result.token,
        loginMethod: 'demo',
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGoogleAuth = () => {
    if (!GOOGLE_AUTH_ENABLED) return;
    if (!gender) {
      setError('Choose Bride or Groom before continuing with Google.');
      return;
    }
    setError('');
    setLoadingAction('google');
    window.location.assign(`${getApiUrl('/auth/google')}?gender=${encodeURIComponent(gender)}`);
  };

  const isBusy = Boolean(loadingAction);

  return (
    <div
      className="modal-backdrop-overlay"
      role="presentation"
      style={{ zIndex: 9999, padding: 16, overflowY: 'auto' }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
        style={{
          background: '#FFFFFF', borderRadius: 28, width: '100%', maxWidth: 430,
          border: '2px solid rgba(212,175,55,0.4)', boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
          overflow: 'hidden', position: 'relative', margin: 'auto'
        }}
      >
        <div style={{ background: 'linear-gradient(135deg, #7A0026 0%, #C0185E 100%)', padding: '28px 24px 22px', color: '#FFFFFF', position: 'relative', textAlign: 'center' }}>
          <button
            onClick={onClose}
            aria-label="Close sign in"
            style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={20} style={{ fill: '#fff', stroke: 'none' }} />
            </div>
            <h2 id="auth-dialog-title" style={{ fontFamily: 'Cinzel, serif', fontSize: 20, fontWeight: 900, letterSpacing: 1, margin: 0 }}>
              BANDHAN <span style={{ color: '#D4AF37' }}>Shaadi</span>
            </h2>
          </div>
          <p style={{ fontSize: 12, color: '#F4E8C1', margin: 0, fontWeight: 600 }}>Secure sign in or registration</p>
        </div>

        <div style={{ padding: 24 }}>
          <fieldset style={{ border: 0, padding: 0, margin: '0 0 18px' }}>
            <legend style={{ fontSize: 11, fontWeight: 800, color: '#665D65', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
              This profile is for
            </legend>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {['Bride', 'Groom'].map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => { setGender(option); setError(''); }}
                  aria-pressed={gender === option}
                  style={{
                    padding: 11, borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 800,
                    border: `1.5px solid ${gender === option ? '#7A0026' : '#E5E7EB'}`,
                    color: gender === option ? '#7A0026' : '#4B5563',
                    background: gender === option ? '#FFF0F3' : '#FAFAFA'
                  }}
                >
                  {option === 'Bride' ? '👰 Bride' : '🤵 Groom'}
                </button>
              ))}
            </div>
          </fieldset>

          {DEMO_AUTH_ENABLED && (
            <div style={{ marginBottom: 18, padding: 12, borderRadius: 14, border: '1px solid #FDE68A', background: '#FFFBEB' }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: '#92400E', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                Development demo — OAuth comes later
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {['Groom', 'Bride'].map(demoGender => (
                  <button
                    key={demoGender}
                    type="button"
                    onClick={() => handleDemoAuth(demoGender)}
                    disabled={isBusy}
                    style={{ padding: 10, borderRadius: 10, border: '1px solid #D4AF37', background: '#FFFFFF', color: '#7A0026', fontSize: 12, fontWeight: 900, cursor: isBusy ? 'wait' : 'pointer', opacity: isBusy ? 0.6 : 1 }}
                  >
                    {loadingAction === `demo-${demoGender.toLowerCase()}`
                      ? 'Signing in…'
                      : `Use demo ${demoGender}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isBusy || !GOOGLE_AUTH_ENABLED}
            style={{ width: '100%', padding: 13, borderRadius: 14, border: '1.5px solid #D1D5DB', background: '#FFFFFF', cursor: isBusy || !GOOGLE_AUTH_ENABLED ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 14, fontWeight: 800, color: '#1F2937', boxShadow: '0 3px 12px rgba(0,0,0,0.06)', marginBottom: 18, opacity: isBusy || !GOOGLE_AUTH_ENABLED ? 0.55 : 1 }}
          >
            {loadingAction === 'google'
              ? <Loader2 size={18} className="animate-spin" />
              : <><GOOGLE_ICON /> {GOOGLE_AUTH_ENABLED ? 'Continue with Google' : 'Google sign in — coming later'}</>}
          </button>

          <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 11, fontWeight: 800, marginBottom: 18, letterSpacing: 0.5 }}>── OR USE MOBILE OTP ──</div>

          {!otpSent ? (
            <div>
              <label htmlFor="auth-mobile" style={{ fontSize: 11, fontWeight: 800, color: '#665D65', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Mobile Number</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <div style={{ padding: '12px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', background: '#FAFAFA', fontSize: 13, fontWeight: 800, color: '#374151', display: 'flex', alignItems: 'center' }}>🇮🇳 +91</div>
                <input
                  id="auth-mobile"
                  type="tel"
                  value={mobile}
                  onChange={event => setMobile(event.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  autoComplete="tel-national"
                  inputMode="numeric"
                  style={{ flex: 1, minWidth: 0, padding: '12px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', background: '#FAFAFA', fontSize: 14, fontWeight: 800, color: '#1F2937', outline: 'none' }}
                />
              </div>
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={mobile.length !== 10 || !gender || isBusy}
                style={{ width: '100%', padding: 13, borderRadius: 14, background: 'linear-gradient(135deg, #7A0026 0%, #C0185E 100%)', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 6px 20px rgba(122,0,38,0.3)', opacity: mobile.length !== 10 || !gender || isBusy ? 0.55 : 1 }}
              >
                {loadingAction === 'send-otp' ? <Loader2 size={18} className="animate-spin" /> : <><Phone size={16} /> Send verification code</>}
              </button>
            </div>
          ) : (
            <div>
              <p style={{ textAlign: 'center', fontSize: 13, color: '#374151', fontWeight: 700, margin: '0 0 8px' }}>Enter the code sent to <strong>+91 {mobile}</strong></p>
              <button type="button" onClick={() => { setOtpSent(false); setOtpValue(EMPTY_OTP); setError(''); }} style={{ display: 'block', margin: '0 auto 14px', background: 'none', border: 'none', color: '#7A0026', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>Edit number</button>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 14 }}>
                {otpValue.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    aria-label={`Verification code digit ${index + 1}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={event => handleOtpChange(index, event.target.value)}
                    onKeyDown={event => handleOtpKeyDown(event, index)}
                    style={{ width: 42, height: 50, borderRadius: 12, border: `2px solid ${digit ? '#7A0026' : '#E5E7EB'}`, textAlign: 'center', fontSize: 20, fontWeight: 900, color: '#7A0026', background: digit ? '#FDF2F2' : '#FAFAFA', outline: 'none' }}
                  />
                ))}
              </div>

              {devOtp && <p style={{ padding: 8, borderRadius: 10, background: '#FFFBEB', color: '#92400E', textAlign: 'center', fontSize: 11, fontWeight: 700 }}>Development code: {devOtp}</p>}

              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                {countdown > 0 ? (
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>Resend available in {countdown}s</span>
                ) : (
                  <button type="button" onClick={handleSendOTP} disabled={isBusy} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A0026', fontWeight: 800, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <RefreshCw size={12} /> Resend code
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={otpValue.join('').length !== 6 || isBusy}
                style={{ width: '100%', padding: 13, borderRadius: 14, background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: otpValue.join('').length !== 6 || isBusy ? 0.55 : 1 }}
              >
                {loadingAction === 'verify-otp' ? <Loader2 size={18} className="animate-spin" /> : 'Verify and continue'}
              </button>
            </div>
          )}

          {error && <div role="alert" style={{ marginTop: 14, padding: '10px 12px', borderRadius: 12, background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: 12, fontWeight: 700 }}>{error}</div>}

          <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid #F3F4F6', textAlign: 'center', fontSize: 11, color: '#6B7280', lineHeight: 1.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#047857', fontWeight: 700, marginBottom: 4 }}>
              <ShieldCheck size={14} /> Server-verified sign in • Contact details stay private
            </div>
            By continuing, you agree to Bandhan Shaadi&apos;s Terms and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}
