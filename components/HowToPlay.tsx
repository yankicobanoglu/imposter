import React from 'react';
import { X, Users, EyeOff, MessageCircle, AlertTriangle } from 'lucide-react';

export const HowToPlay: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
    <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/20 to-transparent pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h2 className="text-2xl font-bold text-white">How to Play</h2>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-400">
                <Users size={24} />
            </div>
            <div>
                <h3 className="font-bold text-white text-lg">1. Get Your Role</h3>
                <p className="text-slate-400 text-sm">Everyone sees the <strong>Secret Word</strong>, except for one person—the <strong>Imposter</strong>.</p>
            </div>
        </div>

        <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center shrink-0 text-purple-400">
                <MessageCircle size={24} />
            </div>
            <div>
                <h3 className="font-bold text-white text-lg">2. Describe It</h3>
                <p className="text-slate-400 text-sm">Go around and describe the word using one phrase. Be vague enough to hide from the Imposter, but specific enough to prove you know it.</p>
            </div>
        </div>

        <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                <EyeOff size={24} />
            </div>
            <div>
                <h3 className="font-bold text-white text-lg">3. Blend In</h3>
                <p className="text-slate-400 text-sm">If you are the Imposter, listen to the others and try to blend in with a fake description!</p>
            </div>
        </div>

        <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center shrink-0 text-rose-400">
                <AlertTriangle size={24} />
            </div>
            <div>
                <h3 className="font-bold text-white text-lg">4. Vote</h3>
                <p className="text-slate-400 text-sm">Discuss and vote on who you think the Imposter is. If the Imposter is caught, they get one chance to guess the word!</p>
            </div>
        </div>
      </div>
      
      <div className="mt-8">
        <button onClick={onClose} className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors">
            Got it!
        </button>
      </div>
    </div>
  </div>
);