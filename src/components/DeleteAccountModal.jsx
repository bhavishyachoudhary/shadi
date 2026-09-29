import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function DeleteAccountModal({ currentUser, onClose, onConfirmDelete }) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onConfirmDelete();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full border-2 border-red-500 shadow-2xl overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="bg-red-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold">Delete Account Permanently</h3>
              <p className="text-xs text-red-200">Account ID: {currentUser?.email || currentUser?.phone || 'registered-user'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 text-red-900 text-xs font-semibold leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong>Warning: This action is permanent and cannot be undone.</strong>
              <p className="mt-1 text-red-700">
                Deleting your <strong>{currentUser?.gender === 'Groom' ? 'Groom' : 'Bride'} Account ({currentUser?.name})</strong> will permanently erase all saved preferences, express interest logs, shortlist items, and profile visitor records.
              </p>
            </div>
          </div>

          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE3D9] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#665D65] font-bold">Account Name:</span>
              <span className="font-bold text-[#7A0026]">{currentUser?.name || 'Rohan Verma'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#665D65] font-bold">Account Role:</span>
              <span className="font-bold text-[#7A0026]">{currentUser?.gender === 'Groom' ? '🤵 Groom Profile' : '👰 Bride Profile'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#665D65] font-bold">Email / Mobile:</span>
              <span className="font-bold text-[#374151]">{currentUser?.email || '+91 9876543210'}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#665D65] uppercase mb-2">
              Type <span className="text-red-600">DELETE</span> to confirm permanent deletion:
            </label>
            <input
              type="text"
              placeholder="DELETE"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-red-300 rounded-xl px-4 py-3 text-xs font-bold uppercase focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-full text-xs font-bold transition-all"
            >
              Cancel Keep Account
            </button>
            <button
              disabled={confirmText.trim().toUpperCase() !== 'DELETE' || isDeleting}
              onClick={handleDelete}
              className={`flex-1 py-3 rounded-full text-xs font-bold text-white flex items-center justify-center gap-2 transition-all ${
                confirmText.trim().toUpperCase() === 'DELETE' && !isDeleting
                  ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30 cursor-pointer'
                  : 'bg-red-300 cursor-not-allowed'
              }`}
            >
              {isDeleting ? (
                <>Deleting Account...</>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" /> Delete Permanently
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
