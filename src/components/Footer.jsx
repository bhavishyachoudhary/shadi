import React from 'react';
import { Heart, ShieldCheck, Lock, Server } from 'lucide-react';

export default function Footer({ onOpenVIP }) {
  return (
    <footer style={{ backgroundColor: '#1A0A10', color: '#D1D5DB', paddingTop: '60px', paddingBottom: '40px', borderTop: '4px solid #D4AF37', marginTop: '60px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Top Trust Features Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', paddingBottom: '40px', borderBottom: '1px solid #2D1A24', textStyle: 'left' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck className="w-8 h-8 text-[#0066CC]" style={{ flexShrink: 0 }} />
            <div>
              <h5 style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Contact Verification
              </h5>
              <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                Email and mobile verification status
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Lock className="w-8 h-8 text-[#D4AF37]" style={{ flexShrink: 0 }} />
            <div>
              <h5 style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Consent-Based Connections
              </h5>
              <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                Chat opens only after acceptance
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Heart className="w-8 h-8 text-rose-500" style={{ flexShrink: 0 }} />
            <div>
              <h5 style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                36 Gunas Vedic Milan
              </h5>
              <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                Deep horoscope compatibility matching
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Server className="w-8 h-8 text-emerald-400" style={{ flexShrink: 0 }} />
            <div>
              <h5 style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Node API Architecture
              </h5>
              <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                Designed for Node.js and MySQL deployment
              </p>
            </div>
          </div>

        </div>

        {/* Footer Navigation Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', margin: '40px 0', fontSize: '12px' }}>
          <div>
            <h5 style={{ fontFamily: 'Cinzel', fontSize: '14px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
              Explore Matches
            </h5>
            <ul style={{ listStyle: 'none', spaceY: '8px', color: '#9CA3AF', lineHeight: '2' }}>
              <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Hindu Matrimony</a></li>
              <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Muslim Matrimony</a></li>
              <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Sikh Matrimony</a></li>
              <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Jain Matrimony</a></li>
              <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>NRI Brides & Grooms</a></li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontFamily: 'Cinzel', fontSize: '14px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
              Popular Cities
            </h5>
            <ul style={{ listStyle: 'none', spaceY: '8px', color: '#9CA3AF', lineHeight: '2' }}>
              <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Matrimony in Bengaluru</a></li>
              <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Matrimony in Delhi NCR</a></li>
              <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Matrimony in Mumbai</a></li>
              <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Matrimony in Hyderabad</a></li>
              <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Matrimony in USA / UK</a></li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontFamily: 'Cinzel', fontSize: '14px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
              Services & Tools
            </h5>
            <ul style={{ listStyle: 'none', spaceY: '8px', color: '#9CA3AF', lineHeight: '2' }}>
              <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>36 Gunas Horoscope Calculator</a></li>
              <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Profile Verification Status</a></li>
              <li><button onClick={onOpenVIP} style={{ background: 'none', border: 'none', color: '#D4AF37', fontWeight: 800, cursor: 'pointer', padding: 0 }}>VIP Gold Membership</button></li>
              <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Success Marriage Stories</a></li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontFamily: 'Cinzel', fontSize: '14px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
              Customer Support
            </h5>
            <p style={{ color: '#9CA3AF', lineHeight: '1.6', marginBottom: '12px' }}>
              Toll-Free Helpdesk: 1800-200-BANDHAN
              <br />
              Email: support@bandhanmatrimony.com
            </p>
            <span style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: 'rgba(6, 78, 59, 0.8)', color: '#6EE7B7', fontWeight: 800, borderRadius: '50px', fontSize: '10px' }}>
              Deployment configuration in progress
            </span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{ paddingTop: '24px', borderTop: '1px solid #2D1A24', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#6B7280' }}>
          <p>© 2026 Bandhan Matrimony. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Terms of Use</a>
            <a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Security Controls</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
