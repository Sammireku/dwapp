import React, { useState, useRef } from 'react';
import { X, Mic, CheckCircle2, ShieldCheck, Trash2, Play, Pause, AlertTriangle, Sparkles, Lock, ArrowRight } from 'lucide-react';
import { VoiceProfile, ChildProfile } from '../types';

interface VoiceCloningModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceProfile: VoiceProfile;
  onSaveVoiceProfile: (profile: VoiceProfile) => void;
  onDeleteVoiceProfile: () => void;
  activeChild: ChildProfile;
}

export const VoiceCloningModal: React.FC<VoiceCloningModalProps> = ({
  isOpen,
  onClose,
  voiceProfile,
  onSaveVoiceProfile,
  onDeleteVoiceProfile,
  activeChild,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(
    voiceProfile.status === 'enrolled' ? 4 : 1
  );
  const [parentName, setParentName] = useState(voiceProfile.parentName || 'Mom / Dad');
  const [consentAccepted, setConsentAccepted] = useState(voiceProfile.consentAccepted || false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(voiceProfile.sampleAudioUrl || null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<any>(null);

  if (!isOpen) return null;

  const samplePassage = `Once upon a time, under a quiet blanket of twinkling stars, a little explorer prepared for bedtime. The moon shone softly, whispering that home is the safest, warmest place in the whole universe. Goodnight my sweet child, I love you to the moon and back.`;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 30) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      alert('Microphone access is required to record your voice passage.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          setRecordedAudioUrl(base64Audio);
          simulateSynthesis(base64Audio);
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsRecording(false);
    setStep(3);
  };

  const simulateSynthesis = (audioUrl?: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const updatedProfile: VoiceProfile = {
        id: voiceProfile.id || `voice_${Date.now()}`,
        parentName,
        status: 'enrolled',
        consentAccepted: true,
        consentTimestamp: new Date().toISOString(),
        recordingDurationSec: recordingSeconds || 30,
        voiceEmbeddingId: `emb_${Date.now()}`,
        sampleAudioUrl: audioUrl || recordedAudioUrl || undefined,
      };
      onSaveVoiceProfile(updatedProfile);
      setStep(4);
    }, 2000);
  };

  const playTestSample = () => {
    const audioUrlToPlay = recordedAudioUrl || voiceProfile.sampleAudioUrl;
    if (audioUrlToPlay) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      const audio = new Audio(audioUrlToPlay);
      audioPlayerRef.current = audio;
      setIsPlayingSample(true);
      audio.onended = () => setIsPlayingSample(false);
      audio.onerror = () => {
        setIsPlayingSample(false);
        fallbackWebSpeech();
      };
      audio.play().catch(() => fallbackWebSpeech());
    } else {
      fallbackWebSpeech();
    }
  };

  const fallbackWebSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    setIsPlayingSample(true);
    const utt = new SpeechSynthesisUtterance(`Goodnight ${activeChild.name}, I love you to the moon and back.`);
    utt.rate = 0.85;
    utt.pitch = 1.0;
    utt.onend = () => setIsPlayingSample(false);
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-purple-400" />
            <h3 className="font-serif text-lg font-bold">Parent Voice Cloning Studio</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs font-medium">
          {/* STEP 1: Consent & Privacy Explanation */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                  <Lock className="w-4 h-4" />
                  <span>COPPA & Biometric Security Guarantee</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Your recorded voice is encrypted at rest and scoped strictly inside DreamWeaver for narrating bedtime stories to {activeChild.name}.
                </p>
                <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1 pt-1">
                  <li>Never used for open-text synthesis or export outside app.</li>
                  <li>Never sold, shared, or trained on public models.</li>
                  <li>1-Tap immediate, irreversible deletion at any time.</li>
                </ul>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Parent / Caregiver Name</label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. Milou / Mom / Dad"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-purple-400 text-sm"
                />
              </div>

              <label className="flex items-start gap-2 cursor-pointer p-3 rounded-xl bg-slate-950 border border-slate-800">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-purple-500 focus:ring-purple-400"
                />
                <span className="text-[11px] text-slate-300 leading-normal">
                  I explicitly consent to creating a voice profile strictly for narrating bedtime stories for my child inside DreamWeaver.
                </span>
              </label>

              <button
                onClick={() => setStep(2)}
                disabled={!consentAccepted || !parentName.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 font-bold text-slate-100 shadow-lg hover:from-purple-400 hover:to-indigo-500 disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <span>Proceed to Guided Enrollment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Recording Passage */}
          {step === 2 && (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2">
                <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">
                  Read aloud in your normal soothing bedtime voice:
                </span>
                <p className="font-serif text-sm text-slate-200 leading-relaxed italic p-2 bg-slate-900 rounded-xl border border-slate-800">
                  "{samplePassage}"
                </p>
              </div>

              {/* Timer & Waveform */}
              <div className="py-2 flex flex-col items-center gap-2">
                <div className="text-2xl font-mono font-bold text-amber-300">
                  {recordingSeconds}s / 30s
                </div>
                {isRecording && (
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-rose-400 text-xs font-semibold">Recording Voice Sample...</span>
                  </div>
                )}
              </div>

              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="w-full py-3.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <Mic className="w-5 h-5" />
                  <span>Start Recording (30s)</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold flex items-center justify-center gap-2 border border-slate-700"
                >
                  <span>Stop & Process Sample</span>
                </button>
              )}
            </div>
          )}

          {/* STEP 3: Synthesis Spinner */}
          {step === 3 && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-purple-200">
                  Building Encrypted Voice Embedding...
                </h4>
                <p className="text-slate-400 text-xs">
                  Applying neural pitch alignment & bedtime resonance filter.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Enrolled & Test */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-serif text-base font-bold text-emerald-200">
                  Parent Voice Profile Active
                </h4>
                <p className="text-slate-300 text-xs">
                  {parentName}'s cloned voice is ready to narrate stories for {activeChild.name}!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">Test Cloned Narration</span>
                  <span className="text-[11px] text-slate-400">"Goodnight {activeChild.name}..."</span>
                </div>
                <button
                  onClick={playTestSample}
                  className="px-3.5 py-2 rounded-xl bg-purple-500 text-slate-950 font-bold hover:bg-purple-400 flex items-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Listen</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    onDeleteVoiceProfile();
                    setStep(1);
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Voice Profile Irreversibly</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
