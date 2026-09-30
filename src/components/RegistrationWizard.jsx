import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Upload, ArrowRight, ArrowLeft } from 'lucide-react';

export default function RegistrationWizard({ onClose, onRegisterSuccess }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    profileCreatedBy: 'Self',
    gender: 'Bride',
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    height: '165',
    religion: 'Hindu',
    caste: 'Brahmin',
    motherTongue: 'Hindi',
    education: 'B.Tech / MBA',
    occupation: 'Software Engineer',
    annualIncome: '₹15 - 20 Lakhs',
    city: 'Bengaluru',
    rashi: 'Tula',
    manglik: 'No',
    about: ''
  });

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else {
      onRegisterSuccess(formData);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border-2 border-[#D4AF37]/50 shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="ruby-gradient text-white p-6 sm:p-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#F4E8C1] uppercase tracking-widest">
              Step {step} of 5
            </span>
            <h3 className="font-heading text-2xl font-bold">
              Create Bride / Groom Profile
            </h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1.5">
          <div
            className="bg-[#D4AF37] h-1.5 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Wizard Form Steps */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* STEP 1: Basic Account */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="font-heading text-lg font-bold text-[#7A0026]">1. Basic Details & Account Owner</h4>
              
              <div>
                <label className="block text-xs font-bold text-[#665D65] uppercase mb-2">This Profile is for</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Self', 'Parent', 'Sibling', 'Relative', 'Friend'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, profileCreatedBy: opt })}
                      className={`p-2.5 text-xs font-bold rounded-xl border ${
                        formData.profileCreatedBy === opt
                          ? 'bg-[#7A0026] text-white border-[#7A0026]'
                          : 'bg-[#FAF7F2] text-gray-700 border-[#EAE3D9]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#665D65] uppercase mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-4 py-3 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#665D65] uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="ananya@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-4 py-3 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#665D65] uppercase mb-2">Mobile Number (OTP Verification)</label>
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-4 py-3 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Physical & Cultural Background */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="font-heading text-lg font-bold text-[#7A0026]">2. Gender & Cultural Identity</h4>

              <div>
                <label className="block text-xs font-bold text-[#665D65] uppercase mb-2">Gender</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Bride', 'Groom'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`p-3 text-xs font-bold rounded-xl border ${
                        formData.gender === g
                          ? 'bg-[#7A0026] text-white border-[#7A0026]'
                          : 'bg-[#FAF7F2] text-gray-700 border-[#EAE3D9]'
                      }`}
                    >
                      {g === 'Bride' ? '👰 Female (Bride)' : '🤵 Male (Groom)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#665D65] uppercase mb-2">Religion</label>
                  <select
                    value={formData.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-4 py-3 text-xs font-semibold"
                  >
                    <option value="Hindu">Hindu</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Christian">Christian</option>
                    <option value="Jain">Jain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#665D65] uppercase mb-2">Caste / Community</label>
                  <input
                    type="text"
                    placeholder="e.g. Brahmin / Kshatriya / Khatri"
                    value={formData.caste}
                    onChange={(e) => setFormData({ ...formData, caste: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-4 py-3 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Education & Career */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="font-heading text-lg font-bold text-[#7A0026]">3. Education & Profession</h4>

              <div>
                <label className="block text-xs font-bold text-[#665D65] uppercase mb-2">Highest Degree</label>
                <input
                  type="text"
                  placeholder="e.g. M.Tech / MBA / MD / CA"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-4 py-3 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#665D65] uppercase mb-2">Occupation / Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-4 py-3 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#665D65] uppercase mb-2">Annual Package (INR)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹25 - 30 Lakhs"
                    value={formData.annualIncome}
                    onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-4 py-3 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Kundali & Bio */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="font-heading text-lg font-bold text-[#7A0026]">4. Kundali & Personal Bio</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#665D65] uppercase mb-2">Rashi (Moon Sign)</label>
                  <select
                    value={formData.rashi}
                    onChange={(e) => setFormData({ ...formData, rashi: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-4 py-3 text-xs font-semibold"
                  >
                    <option value="Tula">Tula (Libra)</option>
                    <option value="Vrishabha">Vrishabha (Taurus)</option>
                    <option value="Simha">Simha (Leo)</option>
                    <option value="Mithuna">Mithuna (Gemini)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#665D65] uppercase mb-2">Manglik Status</label>
                  <select
                    value={formData.manglik}
                    onChange={(e) => setFormData({ ...formData, manglik: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-4 py-3 text-xs font-semibold"
                  >
                    <option value="No">Non-Manglik</option>
                    <option value="Anshik">Anshik Manglik</option>
                    <option value="Yes">Manglik</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#665D65] uppercase mb-2">About Yourself & Partner Preferences</label>
                <textarea
                  rows="3"
                  placeholder="Share a short introduction about your lifestyle and expectations..."
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl p-4 text-xs font-semibold"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Photos & Verification */}
          {step === 5 && (
            <div className="space-y-4 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="font-heading text-xl font-bold text-[#7A0026]">5. Profile Photo</h4>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Add a recent profile photo. Verification badges appear only after the relevant check is completed.
              </p>

              <div className="p-6 border-2 border-dashed border-[#D4AF37] rounded-2xl bg-amber-50/50">
                <Upload className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-800">Upload Recent High Resolution Photo</p>
                <p className="text-[10px] text-gray-500 mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div className="p-6 bg-[#FAF7F2] border-t border-[#EAE3D9] flex justify-between items-center">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="btn-outline-ruby text-xs py-2.5 px-5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          <button
            onClick={handleNext}
            className="btn-ruby text-xs py-2.5 px-6"
          >
            {step === 5 ? (
              <>
                <CheckCircle className="w-4 h-4 text-white" /> Complete Registration
              </>
            ) : (
              <>
                Continue <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
