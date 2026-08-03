import React from 'react';
import { Sparkles, Mic, BookOpen, ShieldCheck, Heart, Moon, Star, Play, ShoppingBag, Users, ArrowRight, Camera, CheckCircle2 } from 'lucide-react';
import { UserAccount } from '../types';

interface LandingPageProps {
  onOpenSignUp: () => void;
  onOpenSignIn: () => void;
  onGuestExplore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenSignUp,
  onOpenSignIn,
  onGuestExplore,
}) => {
  return (
    <div className="min-h-screen bg-[#070514] text-indigo-50 selection:bg-amber-400 selection:text-slate-950 font-sans relative overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative z-20 border-b border-white/10 bg-[#070514]/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0a071e] rounded-[14px] flex items-center justify-center">
                <Moon className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-purple-200 to-indigo-100 bg-clip-text text-transparent">
                DreamWeaver
              </span>
              <p className="text-[10px] text-amber-300/90 tracking-wider font-semibold">Bedtime Emotional Stories</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSignIn}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-200 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onOpenSignUp}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Parent Voice Cloning & AI Childlike Animations</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold max-w-4xl mx-auto leading-tight tracking-tight bg-gradient-to-b from-white via-indigo-100 to-indigo-300/80 bg-clip-text text-transparent">
          Personalized Bedtime Stories, <br />
          <span className="italic font-normal bg-gradient-to-r from-amber-300 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
            Narrated in Your Own Voice
          </span>
        </h1>

        <p className="text-sm sm:text-base text-indigo-200/80 max-w-2xl mx-auto leading-relaxed">
          DreamWeaver transforms your child into the star of bedtime fairytales. Upload photos to build AI childlike animations, record parent voices for soothing narrations, and help children navigate emotional growth.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onOpenSignUp}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 font-bold text-sm hover:brightness-110 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Sign Up Family Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onGuestExplore}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-indigo-100 font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-amber-300" />
            <span>Try App Demo Mode</span>
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
          {/* Feature 1: Parent Voice */}
          <div className="bg-[#0e0b29]/80 border border-white/10 rounded-3xl p-6 space-y-4 hover:border-amber-400/40 transition-all shadow-xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-indigo-100">Parent Voice Narration</h3>
            <p className="text-xs text-indigo-200/70 leading-relaxed">
              Record a short 30-second bedtime sample. Our AI model creates an acoustic voice profile for Parent A & Parent B to read stories aloud, comforting children even when you're away.
            </p>
          </div>

          {/* Feature 2: Childlike Animations */}
          <div className="bg-[#0e0b29]/80 border border-white/10 rounded-3xl p-6 space-y-4 hover:border-amber-400/40 transition-all shadow-xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-indigo-100">AI Childlike Animations</h3>
            <p className="text-xs text-indigo-200/70 leading-relaxed">
              Upload photos or snap pictures of your kids. AI generates fairytale animated avatars so your children see themselves as magical knights, space explorers, and dragon tamers!
            </p>
          </div>

          {/* Feature 3: Emotional Growth */}
          <div className="bg-[#0e0b29]/80 border border-white/10 rounded-3xl p-6 space-y-4 hover:border-amber-400/40 transition-all shadow-xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-indigo-100">Emotional Support Themes</h3>
            <p className="text-xs text-indigo-200/70 leading-relaxed">
              Overcome fear of the dark, school transitions, sharing toys, or sibling rivalries. Stories come with parental guided prompts and therapeutic discussion tools.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
