import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, User, Camera, Upload, Plus, Trash2, Check, Lock, Mail, Phone, Globe, Heart, ArrowRight } from 'lucide-react';
import { UserAccount, ChildFormEntry } from '../types';
import { generateChildlikeAIAvatar } from '../utils/aiAvatar';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  initialMode?: 'signin' | 'signup';
}

const COUNTRY_CODES = [
  { code: '+1', country: 'US / Canada' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+233', country: 'Ghana' },
  { code: '+91', country: 'India' },
  { code: '+27', country: 'South Africa' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+61', country: 'Australia' },
  { code: '+81', country: 'Japan' },
  { code: '+55', country: 'Brazil' },
  { code: '+234', country: 'Nigeria' },
  { code: '+971', country: 'UAE' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'signup',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Sign in state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign up state
  const [parentAName, setParentAName] = useState('');
  const [parentBName, setParentBName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Autodetect country code on mount based on timezone
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz.includes('Accra') || tz.includes('Ghana')) setCountryCode('+233');
      else if (tz.includes('London') || tz.includes('United_Kingdom') || tz.includes('Europe/London')) setCountryCode('+44');
      else if (tz.includes('Calcutta') || tz.includes('Kolkata') || tz.includes('Asia/Kolkata')) setCountryCode('+91');
      else if (tz.includes('Johannesburg')) setCountryCode('+27');
      else if (tz.includes('Lagos')) setCountryCode('+234');
      else if (tz.includes('Sydney') || tz.includes('Australia')) setCountryCode('+61');
      else if (tz.includes('Tokyo')) setCountryCode('+81');
      else if (tz.includes('Dubai')) setCountryCode('+971');
      else if (tz.includes('Berlin') || tz.includes('Europe/Berlin')) setCountryCode('+49');
      else if (tz.includes('Paris') || tz.includes('Europe/Paris')) setCountryCode('+33');
      else if (tz.includes('Sao_Paulo')) setCountryCode('+55');
      else setCountryCode('+1');
    } catch {
      setCountryCode('+1');
    }
  }, []);

  // Kids state
  const [kids, setKids] = useState<ChildFormEntry[]>([
    {
      id: `kid_1`,
      name: '',
      age: 5,
      gender: 'girl',
      isStarringInStories: true,
    },
  ]);

  // Camera & Image state
  const [activeCameraKidId, setActiveCameraKidId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [generatingAvatarId, setGeneratingAvatarId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Add child entry via + button
  const handleAddKid = () => {
    const newKid: ChildFormEntry = {
      id: `kid_${Date.now()}_${kids.length + 1}`,
      name: '',
      age: 4 + (kids.length % 5),
      gender: kids.length % 2 === 0 ? 'girl' : 'boy',
      isStarringInStories: true,
    };
    setKids(prev => [...prev, newKid]);
  };

  const handleRemoveKid = (id: string) => {
    if (kids.length <= 1) return;
    setKids(prev => prev.filter(k => k.id !== id));
  };

  const updateKid = (id: string, updates: Partial<ChildFormEntry>) => {
    setKids(prev => prev.map(k => (k.id === id ? { ...k, ...updates } : k)));
  };

  // Web Camera integration
  const startCamera = async (kidId: string) => {
    try {
      setActiveCameraKidId(kidId);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access denied or unavailable. You can upload a photo file instead.');
      setActiveCameraKidId(null);
    }
  };

  const capturePhoto = async (kidId: string) => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, 300, 300);
      const rawDataUrl = canvas.toDataURL('image/png');
      stopCamera();
      
      // Auto-generate AI childlike animated avatar
      const kid = kids.find(k => k.id === kidId);
      setGeneratingAvatarId(kidId);
      const aiAvatar = await generateChildlikeAIAvatar(rawDataUrl, kid?.name || 'Explorer');
      setGeneratingAvatarId(null);

      updateKid(kidId, {
        photoUrl: rawDataUrl,
        aiAnimationAvatarUrl: aiAvatar,
      });
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    setCameraStream(null);
    setActiveCameraKidId(null);
  };

  const handleFileUpload = (kidId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawDataUrl = event.target?.result as string;
      const kid = kids.find(k => k.id === kidId);
      setGeneratingAvatarId(kidId);
      const aiAvatar = await generateChildlikeAIAvatar(rawDataUrl, kid?.name || 'Explorer');
      setGeneratingAvatarId(null);

      updateKid(kidId, {
        photoUrl: rawDataUrl,
        aiAnimationAvatarUrl: aiAvatar,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateDefaultAvatar = async (kidId: string) => {
    const kid = kids.find(k => k.id === kidId);
    if (!kid) return;
    setGeneratingAvatarId(kidId);
    // Use SVG canvas placeholder
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = 300;
    sampleCanvas.height = 300;
    const ctx = sampleCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(0, 0, 300, 300);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 80px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(kid.name.charAt(0).toUpperCase() || '✨', 150, 180);
    }
    const aiAvatar = await generateChildlikeAIAvatar(sampleCanvas.toDataURL('image/png'), kid.name || 'Hero');
    setGeneratingAvatarId(null);
    updateKid(kidId, { aiAnimationAvatarUrl: aiAvatar });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!parentAName.trim() || !email.trim() || !password) {
      alert('Please fill in Parent A Name, Email, and Password.');
      return;
    }

    const validKids = kids.filter(k => k.name.trim().length > 0);
    if (validKids.length === 0) {
      alert("Please add at least one child's name.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create Firebase Auth user
      const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const uid = userCred.user.uid;

      const newUser: UserAccount = {
        id: uid,
        parentAName: parentAName.trim(),
        parentBName: parentBName.trim() || undefined,
        email: email.trim(),
        countryCode,
        phoneNumber: phoneNumber.trim(),
        numberOfKids: validKids.length,
        kids: validKids,
        createdAt: new Date().toISOString(),
      };

      // 2. Persist profile to Firestore
      try {
        await setDoc(doc(db, 'users', uid), newUser);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
      }

      onLoginSuccess(newUser);
      onClose();
    } catch (err: any) {
      console.error('Sign up error:', err);
      setAuthError(err.message || 'Failed to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!signInEmail.trim() || !signInPassword) {
      alert('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, signInEmail.trim(), signInPassword);
      const uid = userCred.user.uid;

      // Retrieve user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        onLoginSuccess(userDoc.data() as UserAccount);
      } else {
        const fallbackUser: UserAccount = {
          id: uid,
          parentAName: signInEmail.split('@')[0] || 'Parent',
          email: signInEmail.trim(),
          countryCode: '+1',
          phoneNumber: '',
          numberOfKids: 1,
          kids: [{ id: `kid_${Date.now()}`, name: 'Explorer', age: 5, isStarringInStories: true }],
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', uid), fallbackUser);
        onLoginSuccess(fallbackUser);
      }
      onClose();
    } catch (err: any) {
      console.error('Sign in error:', err);
      setAuthError(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      const uid = userCred.user.uid;

      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        onLoginSuccess(userDoc.data() as UserAccount);
      } else {
        const newUser: UserAccount = {
          id: uid,
          parentAName: userCred.user.displayName || 'Parent',
          email: userCred.user.email || '',
          countryCode: '+1',
          phoneNumber: '',
          numberOfKids: 1,
          kids: [{ id: `kid_${Date.now()}`, name: 'Little Hero', age: 5, isStarringInStories: true }],
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', uid), newUser);
        onLoginSuccess(newUser);
      }
      onClose();
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setAuthError(err.message || 'Google Sign-In failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = () => {
    const demoUser: UserAccount = {
      id: 'user_demo_101',
      parentAName: 'Sarah',
      parentBName: 'David',
      email: signInEmail || 'sarah.david@family.com',
      countryCode: '+1',
      phoneNumber: '555-0199',
      numberOfKids: 2,
      kids: [
        {
          id: 'kid_zula',
          name: 'Zula',
          age: 5,
          gender: 'girl',
          isStarringInStories: true,
        },
        {
          id: 'kid_leo',
          name: 'Leo',
          age: 7,
          gender: 'boy',
          isStarringInStories: true,
        },
      ],
      createdAt: new Date().toISOString(),
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070514]/90 backdrop-blur-xl animate-fade-in text-indigo-50 overflow-y-auto">
      <div className="bg-[#0e0b29] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col my-6 max-h-[92vh]">
        {/* Header Tabs */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-[#070514]/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-indigo-500 to-purple-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#0a071e] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
            </div>
            <span className="font-serif font-bold text-sm text-indigo-100 hidden sm:inline">DreamWeaver</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-indigo-200/70 hover:text-white'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-indigo-200/70 hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-indigo-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold text-center">
              {authError}
            </div>
          )}

          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4 max-w-md mx-auto py-2">
              <div className="text-center space-y-1 mb-4">
                <h4 className="font-serif text-xl font-bold text-indigo-100">Welcome Back to DreamWeaver</h4>
                <p className="text-xs text-indigo-200/70">Sign in to access your parent voice profiles and saved bedtime stories.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-indigo-200 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-300" /> Parent Email Address
                </label>
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="parents@family.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-indigo-300/40 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-indigo-200 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-300" /> Password
                </label>
                <input
                  type="password"
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-indigo-300/40 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:from-amber-300 hover:to-amber-400 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Signing in...' : 'Sign In with Firebase Auth'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Continue with Google Account</span>
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-indigo-300/60 uppercase tracking-wider">or instant demo access</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  className="w-full py-2.5 rounded-xl border border-indigo-400/30 bg-indigo-500/10 text-indigo-200 font-semibold text-xs hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>One-Click Demo Sign In (Parent A & B + 2 Kids)</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Parent A & Parent B Names */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <User className="w-4 h-4 text-amber-300" />
                  <h4 className="font-serif text-sm font-bold text-indigo-100">Parents Information</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-indigo-200/90 mb-1">
                      Parent A Name <span className="text-amber-300">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={parentAName}
                      onChange={(e) => setParentAName(e.target.value)}
                      placeholder="e.g. Mom / Sarah"
                      className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-indigo-300/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-indigo-200/90 mb-1">
                      Parent B Name <span className="text-indigo-400/60">(Co-Parent / Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={parentBName}
                      onChange={(e) => setParentBName(e.target.value)}
                      placeholder="e.g. Dad / David"
                      className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-indigo-300/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Email & Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-indigo-200/90 mb-1">
                      Email Address <span className="text-amber-300">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="family@example.com"
                      className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-indigo-300/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-indigo-200/90 mb-1">
                      Create Password <span className="text-amber-300">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-indigo-300/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Phone & Country Code */}
                <div>
                  <label className="block text-xs font-medium text-indigo-200/90 mb-1">
                    Country Code & Phone Number <span className="text-amber-300">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-slate-950/80 border border-white/10 text-amber-300 text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-amber-400 shrink-0"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-[#0e0b29] text-white">
                          {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="(555) 000-0199"
                      className="flex-1 bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-indigo-300/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Kids Registration Section */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-amber-300" />
                    <h4 className="font-serif text-sm font-bold text-indigo-100">
                      Children ({kids.length}) & AI Animated Avatars
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddKid}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold hover:bg-amber-400/30 transition-all shadow-sm"
                    title="Add another child"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Child</span>
                  </button>
                </div>

                {/* Web Camera preview if active */}
                {activeCameraKidId && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-amber-400/50 text-center space-y-3">
                    <p className="text-xs font-bold text-amber-300">Smile for the AI Childlike Animation Camera!</p>
                    <video ref={videoRef} autoPlay playsInline className="w-64 h-64 object-cover rounded-2xl mx-auto border-2 border-amber-400/60 shadow-lg" />
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => capturePhoto(activeCameraKidId)}
                        className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-300"
                      >
                        Snap & Generate AI Animation
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-4 py-2 bg-white/10 text-indigo-200 rounded-xl text-xs hover:bg-white/20"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* List of Kids */}
                <div className="space-y-4">
                  {kids.map((kid, index) => (
                    <div
                      key={kid.id}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300">Child #{index + 1}</span>
                        {kids.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveKid(kid.id)}
                            className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Remove child"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-indigo-200/80 mb-1">Child's Name</label>
                          <input
                            type="text"
                            required
                            value={kid.name}
                            onChange={(e) => updateKid(kid.id, { name: e.target.value })}
                            placeholder="e.g. Zula"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-indigo-200/80 mb-1">Age (Years)</label>
                          <input
                            type="number"
                            min={1}
                            max={12}
                            value={kid.age}
                            onChange={(e) => updateKid(kid.id, { age: Number(e.target.value) })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      {/* Checkbox for starring in story */}
                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={kid.isStarringInStories ?? true}
                          onChange={(e) => updateKid(kid.id, { isStarringInStories: e.target.checked })}
                          className="w-4 h-4 rounded text-amber-400 accent-amber-400 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-xs text-indigo-200/90 font-medium">
                          Star {kid.name || 'Child'} as main hero in AI animated bedtime stories
                        </span>
                      </label>

                      {/* Photo upload & AI childlike animation preview */}
                      <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          {kid.aiAnimationAvatarUrl ? (
                            <img
                              src={kid.aiAnimationAvatarUrl}
                              alt="AI Child Animation"
                              className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-dashed border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                              <Sparkles className="w-5 h-5 animate-pulse" />
                            </div>
                          )}

                          <div className="space-y-0.5 text-left flex-1 min-w-0">
                            <span className="text-[11px] font-bold text-amber-200 block truncate">
                              {kid.aiAnimationAvatarUrl ? '✨ AI Avatar Ready' : 'Take Photo or Upload'}
                            </span>
                            <p className="text-[10px] text-indigo-300/70 leading-tight">
                              Turns child into an animated fairytale hero.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-start sm:justify-end">
                          <button
                            type="button"
                            onClick={() => startCamera(kid.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-white/10 text-indigo-100 hover:bg-white/20 text-[11px] font-semibold flex items-center gap-1 border border-white/10 whitespace-nowrap"
                          >
                            <Camera className="w-3.5 h-3.5 text-amber-300" />
                            <span>Camera</span>
                          </button>

                          <label className="px-2.5 py-1.5 rounded-xl bg-white/10 text-indigo-100 hover:bg-white/20 text-[11px] font-semibold flex items-center gap-1 border border-white/10 cursor-pointer whitespace-nowrap">
                            <Upload className="w-3.5 h-3.5 text-indigo-300" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(kid.id, e)}
                            />
                          </label>

                          {!kid.aiAnimationAvatarUrl && (
                            <button
                              type="button"
                              onClick={() => handleGenerateDefaultAvatar(kid.id)}
                              disabled={generatingAvatarId === kid.id}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 text-[11px] font-semibold flex items-center gap-1 border border-amber-400/30 whitespace-nowrap"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{generatingAvatarId === kid.id ? 'Magic...' : 'AI Magic'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Plus Sign Button to add another kid */}
                  <button
                    type="button"
                    onClick={handleAddKid}
                    className="w-full py-3 rounded-2xl border-2 border-dashed border-amber-400/40 bg-amber-400/5 hover:bg-amber-400/10 text-amber-300 font-bold text-xs transition-all flex items-center justify-center gap-2 group"
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="w-4 h-4 text-amber-300" />
                    </div>
                    <span>Click + to add another child</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 font-bold text-xs hover:brightness-110 shadow-xl flex items-center justify-center gap-2 tracking-wide"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Family Account & Start Animated Stories</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
