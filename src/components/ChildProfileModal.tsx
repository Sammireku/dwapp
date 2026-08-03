import React, { useState, useRef } from 'react';
import { X, Sparkles, User, Heart, BookOpen, Check, Camera, Upload } from 'lucide-react';
import { ChildProfile, ReadingLevel } from '../types';
import { generateChildlikeAIAvatar } from '../utils/aiAvatar';

interface ChildProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (child: ChildProfile) => void;
  existingChild?: ChildProfile | null;
}

export const ChildProfileModal: React.FC<ChildProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingChild,
}) => {
  const [name, setName] = useState(existingChild?.name || '');
  const [age, setAge] = useState(existingChild?.age || 5);
  const [gender, setGender] = useState(existingChild?.gender || 'girl');
  const [traitsInput, setTraitsInput] = useState(existingChild?.traits.join(', ') || 'Curious, Big imagination, Gentle');
  const [charactersInput, setCharactersInput] = useState(existingChild?.favoriteCharacters.join(', ') || 'Pip the Starlight Fox, Captain Barnaby');
  const [settingsInput, setSettingsInput] = useState(existingChild?.favoriteSettings.join(', ') || 'Pine Forest, Starlight Treehouse');
  const [readingLevel, setReadingLevel] = useState<ReadingLevel>(existingChild?.readingLevel || 'early');

  const [photoUrl, setPhotoUrl] = useState(existingChild?.photoUrl || '');
  const [aiAnimationAvatarUrl, setAiAnimationAvatarUrl] = useState(existingChild?.aiAnimationAvatarUrl || '');
  const [isStarring, setIsStarring] = useState(existingChild?.isStarringInStories ?? true);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  if (!isOpen) return null;

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access denied or unavailable. You can upload a photo instead.');
      setIsCameraActive(false);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, 300, 300);
      const rawDataUrl = canvas.toDataURL('image/png');
      stopCamera();

      setPhotoUrl(rawDataUrl);
      setIsGenerating(true);
      const aiAvatar = await generateChildlikeAIAvatar(rawDataUrl, name || 'Hero');
      setIsGenerating(false);
      setAiAnimationAvatarUrl(aiAvatar);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    setCameraStream(null);
    setIsCameraActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawDataUrl = event.target?.result as string;
      setPhotoUrl(rawDataUrl);
      setIsGenerating(true);
      const aiAvatar = await generateChildlikeAIAvatar(rawDataUrl, name || 'Hero');
      setIsGenerating(false);
      setAiAnimationAvatarUrl(aiAvatar);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProfile: ChildProfile = {
      id: existingChild?.id || `child_${Date.now()}`,
      name: name.trim(),
      age: Number(age),
      gender,
      traits: traitsInput.split(',').map(s => s.trim()).filter(Boolean),
      favoriteCharacters: charactersInput.split(',').map(s => s.trim()).filter(Boolean),
      favoriteSettings: settingsInput.split(',').map(s => s.trim()).filter(Boolean),
      readingLevel,
      coveredThemes: existingChild?.coveredThemes || [],
      avatarSeed: name.toLowerCase(),
      createdAt: existingChild?.createdAt || new Date().toISOString(),
      photoUrl,
      aiAnimationAvatarUrl,
      isStarringInStories: isStarring,
    };

    onSave(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070514]/85 backdrop-blur-md animate-fade-in text-indigo-50">
      <div className="bg-[#0e0b29] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#070514]/60">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif text-lg font-bold text-indigo-100">
              {existingChild ? `Edit ${existingChild.name}'s Profile` : 'New Child Profile'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-indigo-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-medium overflow-y-auto">
          {/* AI Child Animation Photo Box */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> AI Childlike Animation Portrait
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isStarring}
                  onChange={(e) => setIsStarring(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-amber-400 accent-amber-400"
                />
                <span className="text-[11px] text-indigo-200">Star in stories</span>
              </label>
            </div>

            {isCameraActive ? (
              <div className="text-center space-y-2">
                <video ref={videoRef} autoPlay playsInline className="w-48 h-48 object-cover rounded-2xl mx-auto border-2 border-amber-400 shadow-md" />
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-3 py-1.5 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
                  >
                    Take Photo
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-3 py-1.5 bg-white/10 text-indigo-200 rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {aiAnimationAvatarUrl ? (
                  <img
                    src={aiAnimationAvatarUrl}
                    alt="AI Childlike Animation"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-dashed border-amber-400/40 flex items-center justify-center text-amber-300">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <p className="text-[11px] text-indigo-200/80">
                    {isGenerating ? 'Generating AI fairytale animation...' : 'Take or upload a picture of your child to build an AI animated hero avatar.'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-3 py-1.5 rounded-xl bg-white/10 text-indigo-100 hover:bg-white/20 text-xs font-semibold flex items-center gap-1 border border-white/10 whitespace-nowrap"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-300" />
                      <span>Camera</span>
                    </button>
                    <label className="px-3 py-1.5 rounded-xl bg-white/10 text-indigo-100 hover:bg-white/20 text-xs font-semibold flex items-center gap-1 border border-white/10 cursor-pointer whitespace-nowrap">
                      <Upload className="w-3.5 h-3.5 text-indigo-300" />
                      <span>Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-indigo-200 mb-1">Child's Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Zula"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-indigo-300/40 focus:outline-none focus:border-amber-400 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-indigo-200 mb-1">Age (Years)</label>
              <input
                type="number"
                min={2}
                max={12}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-indigo-200 mb-1">Reading Level</label>
              <select
                value={readingLevel}
                onChange={(e) => setReadingLevel(e.target.value as ReadingLevel)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400 text-xs"
              >
                <option value="early" className="bg-[#0e0b29]">Early Reader (2-5 yrs)</option>
                <option value="intermediate" className="bg-[#0e0b29]">Growing Reader (6-8 yrs)</option>
                <option value="fluent" className="bg-[#0e0b29]">Fluent Reader (9-12 yrs)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-indigo-200 mb-1">Personality Traits (comma separated)</label>
            <input
              type="text"
              value={traitsInput}
              onChange={(e) => setTraitsInput(e.target.value)}
              placeholder="Curious, Sensitive, Loves animals"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-indigo-300/40 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-indigo-200 mb-1">Favorite Characters or Animals</label>
            <input
              type="text"
              value={charactersInput}
              onChange={(e) => setCharactersInput(e.target.value)}
              placeholder="Pip the Fox, Rocket Dog, Owls"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-indigo-300/40 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-indigo-200 mb-1">Favorite Story Settings</label>
            <input
              type="text"
              value={settingsInput}
              onChange={(e) => setSettingsInput(e.target.value)}
              placeholder="Whispering Forest, Treehouse, Space"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-indigo-300/40 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 text-indigo-200 hover:bg-white/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold hover:from-amber-300 hover:to-amber-400 shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Child Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
