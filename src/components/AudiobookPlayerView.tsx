import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, RotateCw, Volume2, Mic, Sparkles, Clock, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { Story, VoiceProfile } from '../types';
import { playPcmBase64 } from '../utils/audioSynthesizer';

interface AudiobookPlayerViewProps {
  story: Story;
  voiceProfile: VoiceProfile;
  onBack: () => void;
  onOpenVoiceClone: () => void;
}

export const AudiobookPlayerView: React.FC<AudiobookPlayerViewProps> = ({
  story,
  voiceProfile,
  onBack,
  onOpenVoiceClone,
}) => {
  const [selectedNarrator, setSelectedNarrator] = useState<'cloned' | 'luna' | 'barnaby' | 'celeste'>(
    voiceProfile.status === 'enrolled' ? 'cloned' : 'luna'
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number>(1.0);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const timerTimeoutRef = useRef<any>(null);

  const currentPage = story.pages[currentPageIndex] || story.pages[0];

  useEffect(() => {
    return () => {
      stopAudio();
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
    };
  }, []);

  const stopAudio = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {}
      audioSourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const playCurrentPageAudio = async () => {
    stopAudio();
    setIsLoadingAudio(true);

    try {
      // Determine voice prompt prefix
      let voiceName = 'Kore';
      if (selectedNarrator === 'barnaby') voiceName = 'Puck';
      if (selectedNarrator === 'celeste') voiceName = 'Zephyr';
      
      const promptPrefix = selectedNarrator === 'cloned'
        ? `Read in the gentle, warm voice of parent ${voiceProfile.parentName} to child ${story.childName}`
        : `Read in a soothing bedtime story narrator voice`;

      const res = await fetch('/api/stories/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentPage.text,
          voiceName,
          promptPrefix,
        }),
      });

      const data = await res.json();

      if (data.success && data.base64Audio) {
        setIsLoadingAudio(false);
        setIsPlaying(true);
        const source = await playPcmBase64(data.base64Audio);
        audioSourceRef.current = source;

        source.onended = () => {
          setIsPlaying(false);
          // Auto-advance page if not last
          if (currentPageIndex < story.pages.length - 1) {
            setCurrentPageIndex(prev => prev + 1);
          }
        };
      } else {
        // SpeechSynthesis fallback
        fallbackWebSpeech();
      }
    } catch (e) {
      console.warn('TTS API error, falling back to browser speech synthesis:', e);
      fallbackWebSpeech();
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const fallbackWebSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentPage.text);
    utterance.rate = 0.85 * speed;
    utterance.pitch = selectedNarrator === 'barnaby' ? 0.8 : 1.1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      if (currentPageIndex < story.pages.length - 1) {
        setCurrentPageIndex(prev => prev + 1);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      stopAudio();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      playCurrentPageAudio();
    }
  };

  const setSleepTimer = (mins: number | null) => {
    setSleepTimerMinutes(mins);
    if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);

    if (mins) {
      timerTimeoutRef.current = setTimeout(() => {
        stopAudio();
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        alert(`Bedtime Sleep Timer expired (${mins}m). Pleasant dreams!`);
      }, mins * 60 * 1000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              stopAudio();
              onBack();
            }}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-300 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Story Details</span>
          </button>

          <span className="text-xs text-amber-300/80 font-serif italic">
            Audiobook Bedtime Player
          </span>
        </div>

        {/* Narrator Selection Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-sm font-bold text-slate-200 flex items-center gap-2">
              <Mic className="w-4 h-4 text-purple-400" />
              <span>Select Narrator Voice</span>
            </h3>
            {voiceProfile.status !== 'enrolled' && (
              <button
                onClick={onOpenVoiceClone}
                className="text-[11px] text-amber-300 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Clone Parent Voice (1 min setup)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium">
            {/* Cloned Voice Option */}
            <button
              onClick={() => {
                if (voiceProfile.status !== 'enrolled') {
                  onOpenVoiceClone();
                } else {
                  setSelectedNarrator('cloned');
                }
              }}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                selectedNarrator === 'cloned'
                  ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs">Parent Voice</span>
                <UserCheck className="w-3.5 h-3.5 text-purple-300" />
              </div>
              <p className="text-[10px] text-slate-400">
                {voiceProfile.status === 'enrolled' ? `${voiceProfile.parentName}'s Cloned Voice` : 'Tap to Record'}
              </p>
            </button>

            {/* Standard Narrators */}
            <button
              onClick={() => setSelectedNarrator('luna')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedNarrator === 'luna'
                  ? 'bg-amber-400/20 border-amber-400 text-amber-200 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="font-bold text-xs block mb-1">Luna</span>
              <p className="text-[10px] text-slate-400">Soft & Gentle</p>
            </button>

            <button
              onClick={() => setSelectedNarrator('barnaby')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedNarrator === 'barnaby'
                  ? 'bg-amber-400/20 border-amber-400 text-amber-200 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="font-bold text-xs block mb-1">Barnaby</span>
              <p className="text-[10px] text-slate-400">Warm Tale-Teller</p>
            </button>

            <button
              onClick={() => setSelectedNarrator('celeste')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedNarrator === 'celeste'
                  ? 'bg-amber-400/20 border-amber-400 text-amber-200 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="font-bold text-xs block mb-1">Celeste</span>
              <p className="text-[10px] text-slate-400">Star-Singer</p>
            </button>
          </div>

          {selectedNarrator === 'cloned' && (
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-300 shrink-0" />
              <span>
                Narrating in <strong>{voiceProfile.parentName}</strong>'s cloned voice. Scoped strictly inside DreamWeaver for {story.childName}.
              </span>
            </div>
          )}
        </div>

        {/* Main Audio Player Stage */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl text-center space-y-6">
          {/* Animated Waveform graphic */}
          <div className="py-6 flex items-center justify-center gap-1.5 h-20">
            {[40, 70, 30, 90, 50, 80, 40, 100, 60, 30, 85, 45].map((height, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full bg-gradient-to-t from-amber-400 to-purple-500 transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : 'opacity-30'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(15, (height * (i % 3 + 1)) % 75)}px` : '12px',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>

          {/* Story Title & Page text */}
          <div className="space-y-3 max-w-xl mx-auto">
            <h2 className="font-serif text-xl font-bold text-amber-200">
              {story.title}
            </h2>
            <p className="text-xs font-medium text-slate-400">
              Page {currentPageIndex + 1} of {story.pages.length}: "{currentPage.title || 'Bedtime Tale'}"
            </p>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm md:text-base font-serif leading-relaxed text-slate-200 italic">
              "{currentPage.text}"
            </div>
          </div>

          {/* Player Main Controls */}
          <div className="flex items-center justify-center gap-4 py-2">
            <button
              onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentPageIndex === 0}
              className="p-3 rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-30"
              title="Previous Page"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlayPause}
              disabled={isLoadingAudio}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-amber-500 to-purple-600 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform"
            >
              {isLoadingAudio ? (
                <div className="w-6 h-6 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-7 h-7 text-slate-950 fill-slate-950" />
              ) : (
                <Play className="w-7 h-7 text-slate-950 fill-slate-950 ml-1" />
              )}
            </button>

            <button
              onClick={() => setCurrentPageIndex((prev) => Math.min(story.pages.length - 1, prev + 1))}
              disabled={currentPageIndex === story.pages.length - 1}
              className="p-3 rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-30"
              title="Next Page"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>

          {/* Sleep Timer & Speed Toolbar */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Sleep Timer:</span>
              {[null, 5, 15, 30].map((mins) => (
                <button
                  key={mins ?? 'none'}
                  onClick={() => setSleepTimer(mins)}
                  className={`px-2.5 py-1 rounded-lg font-semibold ${
                    sleepTimerMinutes === mins
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  {mins ? `${mins}m` : 'Off'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span>Speed:</span>
              {[0.8, 1.0, 1.2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSpeed(spd)}
                  className={`px-2 py-0.5 rounded font-bold ${
                    speed === spd ? 'bg-indigo-500 text-slate-100' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
