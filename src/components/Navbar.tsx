import React from 'react';
import { Sparkles, Moon, BookOpen, Mic, LayoutDashboard, ShoppingBag, ShieldCheck, Plus, User, LogOut } from 'lucide-react';
import { ChildProfile, UserAccount } from '../types';

interface NavbarProps {
  activeTab: 'create' | 'library' | 'read' | 'audiobook' | 'voice_clone' | 'dashboard' | 'marketplace' | 'privacy';
  setActiveTab: (tab: 'create' | 'library' | 'read' | 'audiobook' | 'voice_clone' | 'dashboard' | 'marketplace' | 'privacy') => void;
  childProfiles: ChildProfile[];
  activeChild: ChildProfile;
  setActiveChild: (child: ChildProfile) => void;
  onOpenAddChild: () => void;
  hasVoiceProfile: boolean;
  userAccount: UserAccount | null;
  onOpenAuth: () => void;
  onGoToLandingPage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  childProfiles,
  activeChild,
  setActiveChild,
  onOpenAddChild,
  hasVoiceProfile,
  userAccount,
  onOpenAuth,
  onGoToLandingPage,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070514]/80 backdrop-blur-xl border-b border-white/10 text-indigo-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand logo & title */}
        <div className="flex items-center justify-between">
          <div 
            onClick={onGoToLandingPage}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0a071e] rounded-[14px] flex items-center justify-center">
                <Moon className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-purple-200 to-indigo-100 bg-clip-text text-transparent">
                DreamWeaver
              </span>
              <p className="text-[10px] text-amber-300/90 tracking-wide font-medium">Bedtime Emotional Stories</p>
            </div>
          </div>

          {/* Child Selector & Account Dropdown Mobile view */}
          <div className="md:hidden flex items-center gap-2">
            <select
              value={activeChild.id}
              onChange={(e) => {
                const found = childProfiles.find(c => c.id === e.target.value);
                if (found) setActiveChild(found);
              }}
              className="bg-white/5 text-indigo-100 text-xs px-2.5 py-1.5 rounded-xl border border-white/10 font-medium focus:outline-none focus:border-amber-400"
            >
              {childProfiles.map(c => (
                <option key={c.id} value={c.id} className="bg-[#0c0926] text-indigo-100">
                  {c.name} ({c.age}y)
                </option>
              ))}
            </select>
            <button
              onClick={onOpenAuth}
              className="p-1.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center overflow-x-auto no-scrollbar gap-1.5 text-xs font-medium py-1">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap transition-all ${
              activeTab === 'create'
                ? 'bg-amber-400/20 text-yellow-200 border border-amber-400/40 font-semibold shadow-inner shadow-amber-500/10'
                : 'text-indigo-200/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Create Story</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap transition-all ${
              activeTab === 'library' || activeTab === 'read' || activeTab === 'audiobook'
                ? 'bg-indigo-500/25 text-indigo-200 border border-indigo-400/40 font-semibold shadow-inner shadow-indigo-500/10'
                : 'text-indigo-200/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
            <span>Story Library</span>
          </button>

          <button
            onClick={() => setActiveTab('voice_clone')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap transition-all relative ${
              activeTab === 'voice_clone'
                ? 'bg-purple-500/25 text-purple-200 border border-purple-400/40 font-semibold shadow-inner shadow-purple-500/10'
                : 'text-indigo-200/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-purple-300" />
            <span>Parent Voice</span>
            {hasVoiceProfile && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap transition-all ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/40 font-semibold shadow-inner shadow-cyan-500/10'
                : 'text-indigo-200/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-cyan-300" />
            <span>Parent Tools</span>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap transition-all ${
              activeTab === 'marketplace'
                ? 'bg-amber-500/25 text-amber-200 border border-amber-400/40 font-semibold shadow-inner shadow-amber-500/10'
                : 'text-indigo-200/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
            <span>Print Books</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap transition-all ${
              activeTab === 'privacy'
                ? 'bg-white/15 text-indigo-100 border border-white/20 font-semibold'
                : 'text-indigo-200/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
            <span>Privacy & COPPA</span>
          </button>
        </nav>

        {/* Desktop Child Profile Switcher & Parent Account */}
        <div className="hidden md:flex items-center gap-2">
          {/* Active Child Pill */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1 px-3">
            {activeChild.aiAnimationAvatarUrl ? (
              <img
                src={activeChild.aiAnimationAvatarUrl}
                alt={activeChild.name}
                className="w-6 h-6 rounded-full object-cover border border-amber-400"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-xs">
                {activeChild.name.charAt(0)}
              </div>
            )}
            <select
              value={activeChild.id}
              onChange={(e) => {
                const found = childProfiles.find(c => c.id === e.target.value);
                if (found) setActiveChild(found);
              }}
              className="bg-transparent text-indigo-100 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {childProfiles.map(c => (
                <option key={c.id} value={c.id} className="bg-[#0c0926] text-indigo-100">
                  {c.name} (Age {c.age})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenAddChild}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/15 text-amber-300 text-xs px-3 py-2 rounded-2xl border border-white/10 font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Child</span>
          </button>

          {/* Account Profile Pill */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400/15 to-purple-500/15 hover:bg-white/10 text-amber-300 text-xs px-3.5 py-2 rounded-2xl border border-amber-400/30 font-medium transition-all"
          >
            <User className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {userAccount
                ? userAccount.parentBName
                  ? `${userAccount.parentAName} & ${userAccount.parentBName}`
                  : userAccount.parentAName
                : 'Sign Up / In'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
