import React from 'react';
import { X, Crown, Check, Sparkles, ShieldCheck } from 'lucide-react';

export default function MembershipPlans({ onClose, onSelectPlan }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border-2 border-[#D4AF37] shadow-2xl relative overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Banner */}
        <div className="ruby-gradient text-white p-8 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full mb-3">
            <Crown className="w-4 h-4" /> Bandhan VIP Membership
          </div>

          <h2 className="font-heading text-3xl font-bold">
            Accelerate Your Match Finding by 10x
          </h2>
          <p className="text-xs text-rose-100 max-w-xl mx-auto mt-2">
            Unlock direct contact numbers, unlimited messages, personalized relationship manager, and top search boost placement.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* FREE PLAN */}
          <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D9] flex flex-col justify-between">
            <div>
              <h4 className="font-heading text-lg font-bold text-gray-800">Basic Free</h4>
              <div className="my-3">
                <span className="font-heading text-3xl font-bold text-gray-900">₹0</span>
                <span className="text-xs text-gray-500"> / Forever</span>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-600 mt-4">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Create Bride/Groom Profile</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Browse All Profiles & Filters</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> 36 Gunas Kundali Matching</li>
                <li className="flex items-center gap-2 opacity-40"><X className="w-4 h-4 text-gray-400" /> Direct Phone Number Views</li>
                <li className="flex items-center gap-2 opacity-40"><X className="w-4 h-4 text-gray-400" /> Unlimited Direct Chat</li>
              </ul>
            </div>
            <button onClick={() => onSelectPlan('Free')} className="btn-outline-ruby text-xs py-2.5 w-full mt-6">
              Current Plan
            </button>
          </div>

          {/* GOLD VIP PLAN */}
          <div className="p-6 bg-rose-50/50 rounded-2xl border-2 border-[#7A0026] relative flex flex-col justify-between shadow-lg">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7A0026] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Most Popular
            </span>
            <div>
              <h4 className="font-heading text-lg font-bold text-[#7A0026] flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#D4AF37]" /> Gold VIP
              </h4>
              <div className="my-3">
                <span className="font-heading text-3xl font-bold text-[#7A0026]">₹2,499</span>
                <span className="text-xs text-gray-500"> / 3 Months</span>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-700 mt-4">
                <li className="flex items-center gap-2 font-semibold"><Check className="w-4 h-4 text-emerald-600" /> Everything in Basic</li>
                <li className="flex items-center gap-2 font-semibold"><Check className="w-4 h-4 text-emerald-600" /> 30 Direct Contact Phone Unlocks</li>
                <li className="flex items-center gap-2 font-semibold"><Check className="w-4 h-4 text-emerald-600" /> Unlimited Personalized Chat</li>
                <li className="flex items-center gap-2 font-semibold"><Check className="w-4 h-4 text-emerald-600" /> Profile Boost in Search Results</li>
                <li className="flex items-center gap-2 font-semibold"><Check className="w-4 h-4 text-emerald-600" /> Blue Verified Badge Priority</li>
              </ul>
            </div>
            <button onClick={() => onSelectPlan('Gold VIP')} className="btn-ruby text-xs py-2.5 w-full mt-6">
              Subscribe Gold VIP
            </button>
          </div>

          {/* DIAMOND NRI PLAN */}
          <div className="p-6 bg-amber-50/60 rounded-2xl border-2 border-[#D4AF37] flex flex-col justify-between shadow-md">
            <div>
              <h4 className="font-heading text-lg font-bold text-[#B38700] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Diamond NRI
              </h4>
              <div className="my-3">
                <span className="font-heading text-3xl font-bold text-gray-900">₹4,999</span>
                <span className="text-xs text-gray-500"> / 6 Months</span>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-700 mt-4">
                <li className="flex items-center gap-2 font-semibold"><Check className="w-4 h-4 text-emerald-600" /> Unlimited Direct Phone Unlocks</li>
                <li className="flex items-center gap-2 font-semibold"><Check className="w-4 h-4 text-emerald-600" /> Dedicated Relationship Manager</li>
                <li className="flex items-center gap-2 font-semibold"><Check className="w-4 h-4 text-emerald-600" /> NRI Special Profile Placement</li>
                <li className="flex items-center gap-2 font-semibold"><Check className="w-4 h-4 text-emerald-600" /> Full Kundali Horoscope Report</li>
              </ul>
            </div>
            <button onClick={() => onSelectPlan('Diamond NRI')} className="btn-gold text-xs py-2.5 w-full mt-6">
              Subscribe Diamond
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
