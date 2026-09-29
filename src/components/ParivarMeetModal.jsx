import React, { useState } from 'react';
import { X, Calendar, Clock, Users, Video, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ParivarMeetModal({ profile, onClose, onScheduleConfirm }) {
  const [meetingDate, setMeetingDate] = useState('2026-10-04'); // Next Sunday
  const [timeSlot, setTimeSlot] = useState('5:00 PM IST (Morning USA)');
  const [attendees, setAttendees] = useState({
    parents: true,
    candidate: true,
    siblings: true
  });
  const [note, setNote] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);

  if (!profile) return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    setIsScheduled(true);
    setTimeout(() => {
      onScheduleConfirm(`Parivar Meet Video Call scheduled with ${profile.name}'s family!`);
      onClose();
    }, 1800);
  };

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-content-wrapper" style={{ maxWidth: '580px' }}>
        
        {/* Header */}
        <div className="modal-header-banner">
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
            <X className="w-5 h-5" />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#D4AF37', color: '#000000', display: 'flex', alignItems: 'center', justify: 'center' }}>
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#F4E8C1', letterSpacing: '1px' }}>
                Family-to-Family Video Meeting
              </span>
              <h3 style={{ fontFamily: 'Cinzel', fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Parivar Meet Scheduler
              </h3>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        {isScheduled ? (
          <div style={{ padding: '40px 30px', textStyle: 'center', textAlign: 'center' }}>
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-3" />
            <h3 style={{ fontFamily: 'Cinzel', fontSize: '22px', fontWeight: 800, color: '#7A0026' }}>
              Parivar Meet Invitation Sent!
            </h3>
            <p style={{ fontSize: '13px', color: '#665D65', marginTop: '6px' }}>
              An invitation has been sent to <strong>{profile.name}'s family</strong> for <strong>{meetingDate} at {timeSlot}</strong>.
            </p>
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', fontSize: '11px', color: '#065F46', fontWeight: 700 }}>
              🔒 Encrypted room link generated. Direct phone numbers remain 100% hidden until both families accept.
            </div>
          </div>
        ) : (
          <form onSubmit={handleConfirm} style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Candidate Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1px solid #EAE3D9' }}>
              <img src={profile.photo} alt={profile.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #D4AF37' }} />
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#7A0026', margin: 0 }}>
                  Meet {profile.name} & Family
                </h4>
                <p style={{ fontSize: '11px', color: '#665D65', margin: 0 }}>
                  Father: {profile.family?.father || 'Family Head'} ({profile.city})
                </p>
              </div>
            </div>

            {/* Step 1: Select Meeting Date */}
            <div>
              <label className="field-label" style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar className="w-4 h-4 text-[#7A0026]" /> Select Preferred Meeting Date
              </label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="custom-input"
              />
            </div>

            {/* Step 2: Time Slot */}
            <div>
              <label className="field-label" style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock className="w-4 h-4 text-[#7A0026]" /> Select Preferred Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="custom-select"
              >
                <option value="11:00 AM IST (Morning Slot)">11:00 AM IST (Sunday Morning Slot)</option>
                <option value="5:00 PM IST (Evening / USA Morning)">5:00 PM IST (Sunday Evening / USA Morning)</option>
                <option value="8:00 PM IST (Night Slot)">8:00 PM IST (Sunday Night Slot)</option>
              </select>
            </div>

            {/* Step 3: Attending Members */}
            <div>
              <label className="field-label" style={{ marginBottom: '8px', display: 'block' }}>
                Attending Family Members from Your Side
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', fontWeight: 700 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: '#FAF7F2', borderRadius: '10px', border: '1px solid #EAE3D9', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={attendees.parents}
                    onChange={(e) => setAttendees({ ...attendees, parents: e.target.checked })}
                    style={{ accentColor: '#7A0026' }}
                  />
                  Parents (Father & Mother)
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: '#FAF7F2', borderRadius: '10px', border: '1px solid #EAE3D9', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={attendees.candidate}
                    onChange={(e) => setAttendees({ ...attendees, candidate: e.target.checked })}
                    style={{ accentColor: '#7A0026' }}
                  />
                  Bride / Groom Candidate
                </label>
              </div>
            </div>

            {/* Step 4: Personal Message */}
            <div>
              <label className="field-label" style={{ marginBottom: '6px', display: 'block' }}>
                Introductory Note for {profile.name}'s Family (Optional)
              </label>
              <textarea
                rows="2"
                placeholder="e.g. We would love to introduce our family and discuss potential alignment..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="custom-input"
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-ruby" style={{ marginTop: '10px', fontSize: '13px', padding: '12px 0' }}>
              <Video className="w-4 h-4 text-[#D4AF37]" /> Send Parivar Meet Invitation
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
