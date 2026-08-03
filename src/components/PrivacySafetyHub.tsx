import React, { useState } from 'react';
import { ShieldCheck, Lock, Trash2, CheckCircle2, AlertTriangle, FileText, Sparkles } from 'lucide-react';
import { VoiceProfile } from '../types';

interface PrivacySafetyHubProps {
  voiceProfile: VoiceProfile;
  onDeleteVoiceProfile: () => void;
  onPurgeAllData: () => void;
}

export const PrivacySafetyHub: React.FC<PrivacySafetyHubProps> = ({
  voiceProfile,
  onDeleteVoiceProfile,
  onPurgeAllData,
}) => {
  const [purgedMessage, setPurgedMessage] = useState<string | null>(null);

  const handleVoiceDelete = () => {
    if (confirm('Are you sure you want to permanently delete your parent voice profile? This action is immediate and irreversible.')) {
      onDeleteVoiceProfile();
      setPurgedMessage('Parent voice profile deleted immediately and wiped from storage.');
    }
  };

  const handleAllDataPurge = () => {
    if (confirm('Are you sure you want to purge all child profiles, saved stories, and local preferences?')) {
      onPurgeAllData();
      setPurgedMessage('All child data and generated stories purged.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-slate-100 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>COPPA & GDPR-K Children's Privacy Shield</span>
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-100">
          Privacy, Security & Biometric Voice Safeguards
        </h1>
        <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
          At DreamWeaver, children's emotional safety and data privacy are foundational. We never sell data, run advertisements, or use children's information for public model training.
        </p>
      </div>

      {purgedMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>{purgedMessage}</span>
        </div>
      )}

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
            <Lock className="w-4 h-4 text-purple-400" />
            <span>Biometric Voice Isolation</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Your recorded voice is encrypted at rest and scoped strictly inside the story narration pipeline for your own linked children.
          </p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
            <li>Zero open-text synthesis (cannot type arbitrary text to synthesize).</li>
            <li>No audio export or API access outside DreamWeaver.</li>
            <li>Immediate 1-tap deletion guarantee.</li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Content Safety & AI Moderation</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Every story generation prompt passes through age-appropriate safety filters to prevent frightening themes, violence, or inappropriate topics.
          </p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
            <li>Parent-guided scariness limits.</li>
            <li>Therapeutic validation without medical claims.</li>
            <li>Gentle parent escalation advice for serious topics.</li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Child Data Minimization (COPPA)</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            We collect only first names, age range, and favorite interests to personalize bedtime stories. No full birthdates, precise location, or school info required.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>No Ads & No Data Resale</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            DreamWeaver is strictly subscription and book marketplace funded. We never run third-party advertising or sell user profiles to data brokers.
          </p>
        </div>
      </div>

      {/* Immediate Data Management & Purge */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-serif text-base font-bold text-slate-100 flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-rose-400" />
          <span>Immediate Data Deletion Controls</span>
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800 text-xs">
          <div>
            <span className="font-bold text-slate-200 block">Parent Voice Embedding Profile</span>
            <span className="text-[11px] text-slate-400">
              {voiceProfile.status === 'enrolled' ? `Active for ${voiceProfile.parentName}` : 'No voice profile currently enrolled'}
            </span>
          </div>

          <button
            onClick={handleVoiceDelete}
            disabled={voiceProfile.status !== 'enrolled'}
            className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 font-bold disabled:opacity-40"
          >
            Delete Voice Profile
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800 text-xs">
          <div>
            <span className="font-bold text-slate-200 block">Purge All Saved Stories & Child Data</span>
            <span className="text-[11px] text-slate-400">Completely clears local history and resets application state.</span>
          </div>

          <button
            onClick={handleAllDataPurge}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
          >
            Reset All Application Data
          </button>
        </div>
      </div>
    </div>
  );
};
