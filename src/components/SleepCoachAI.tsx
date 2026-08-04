import React, { useState } from 'react';
import { Bot, Sparkles, Send, Moon, Heart, Play, Volume2, ShieldCheck, RefreshCw, MessageSquare } from 'lucide-react';
import { ChildProfile, CoachMessage } from '../types';

interface SleepCoachAIProps {
  activeChild: ChildProfile;
  onOpenStoryWizardWithTheme?: (themeLabel: string, customDetails: string) => void;
}

export const SleepCoachAI: React.FC<SleepCoachAIProps> = ({
  activeChild,
  onOpenStoryWizardWithTheme,
}) => {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: 'msg_1',
      sender: 'coach',
      text: `Hello! I am Dr. Luna, your AI Pediatric Sleep Specialist & Bedtime Coach. I can help answer bedtime behavior questions for ${activeChild.name} (${activeChild.age} yrs), craft personalized sleep meditation scripts, or guide you through nighttime anxiety. What is on your mind tonight?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeMeditationScript, setActiveMeditationScript] = useState<string | null>(null);
  const [isPlayingMeditationAudio, setIsPlayingMeditationAudio] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: CoachMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsThinking(true);

    try {
      const responseText = await fetchCoachResponse(query, activeChild);
      const coachMsg: CoachMessage = {
        id: `coach_${Date.now()}`,
        sender: 'coach',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.error('Coach API error:', err);
      const fallbackMsg: CoachMessage = {
        id: `coach_err_${Date.now()}`,
        sender: 'coach',
        text: getFallbackCoachResponse(query, activeChild),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const generateGuidedMeditation = (scriptTitle: string) => {
    const script = `✨ Guided Bedtime Meditation: ${scriptTitle} for ${activeChild.name}\n\n` +
      `1. Deep Breathing on a Cloud: Lie down comfortably, close your eyes, and take a deep breath in through your nose like smelling a sweet bedtime blossom... 1, 2, 3... and blow out slowly like a warm summer breeze... 1, 2, 3.\n\n` +
      `2. Heavy Toes Relaxation: Imagine cozy golden warm starlight resting on your toes. Feel your toes grow warm, heavy, and so sleepy. Wiggle them one last time, and let them fall asleep...\n\n` +
      `3. Starlight Blanket: The starlight moves up to your knees, your belly, and your shoulders. Every breath out melts away any tiny worry from your day. You are safe, loved, and deeply protected.\n\n` +
      `4. Floating into Dreams: Picture a soft purple velvet cloud floating outside your window. Step gently onto it, snuggle into the fluffy cloud pillows, and let it carry you softly to the land of sweetest dreams. Goodnight ${activeChild.name}.`;

    setActiveMeditationScript(script);
  };

  const playMeditationVoice = () => {
    if (!activeMeditationScript || !('speechSynthesis' in window)) return;
    setIsPlayingMeditationAudio(true);
    const utterance = new SpeechSynthesisUtterance(activeMeditationScript);
    utterance.rate = 0.85; // Slow, soothing pace
    utterance.pitch = 0.95;
    utterance.onend = () => setIsPlayingMeditationAudio(false);
    utterance.onerror = () => setIsPlayingMeditationAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopMeditationVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingMeditationAudio(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 text-slate-100 space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/50 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-3">
            <Bot className="w-4 h-4 text-cyan-300" />
            <span>AI Pediatric Sleep Therapist & Meditation Assistant</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-100 mb-2">
            Meet Dr. Luna — Your AI Bedtime Sleep Coach
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Get immediate expert advice on bedtime resistance, room fear management, 3 AM wake-ups, or generate custom guided relaxation scripts for {activeChild.name}.
          </p>
        </div>
      </div>

      {/* Quick Topic Chips */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Quick Bedtime Strategy Prompts:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSendMessage(`${activeChild.name} is afraid of monsters in the dark room. How can I handle this tonight?`)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-purple-500/30 text-purple-200 text-xs font-medium hover:bg-purple-950/60 transition-all flex items-center gap-2"
          >
            <Moon className="w-3.5 h-3.5 text-purple-400" />
            <span>Fear of Dark / Monsters</span>
          </button>

          <button
            onClick={() => handleSendMessage(`${activeChild.name} wakes up at 3 AM and insists on coming into our bed. What sleep training technique works best?`)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-200 text-xs font-medium hover:bg-cyan-950/60 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>3 AM Night Awakenings</span>
          </button>

          <button
            onClick={() => generateGuidedMeditation('Starlight Cloud Journey')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400/20 to-purple-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold hover:from-amber-400/30 transition-all flex items-center gap-2 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate 5-Min Guided Meditation</span>
          </button>
        </div>
      </div>

      {/* Guided Meditation Script Display Box if Active */}
      {activeMeditationScript && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-amber-400/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-amber-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Guided Sleep Meditation Script</span>
            </h3>
            <div className="flex items-center gap-2">
              {isPlayingMeditationAudio ? (
                <button
                  onClick={stopMeditationVoice}
                  className="px-4 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>Stop Voice Narration</span>
                </button>
              ) : (
                <button
                  onClick={playMeditationVoice}
                  className="px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-300"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Read Meditation Aloud</span>
                </button>
              )}
              <button
                onClick={() => setActiveMeditationScript(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1"
              >
                Dismiss
              </button>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs md:text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans">
            {activeMeditationScript}
          </div>
        </div>
      )}

      {/* Chat Conversation Window */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col h-[520px]">
        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-purple-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? 'You' : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-amber-400/10 border border-amber-400/30 text-amber-100 rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className="text-[10px] text-slate-500 text-right font-medium">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-3 text-xs text-cyan-300">
              <div className="w-8 h-8 rounded-full bg-purple-600/50 flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-150" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-300" />
                <span className="text-slate-400 text-xs ml-2">Dr. Luna is formulating pediatric sleep advice...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Ask Dr. Luna about ${activeChild.name}'s bedtime habits or sleep routine...`}
            className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim() || isThinking}
            className="p-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 font-bold transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to call backend or fallback for Coach advice
async function fetchCoachResponse(query: string, child: ChildProfile): Promise<string> {
  try {
    const res = await fetch('/api/coach/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, childName: child.name, childAge: child.age }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.reply) return data.reply;
    }
  } catch (e) {
    // Client fallback handles seamless responses
  }
  return getFallbackCoachResponse(query, child);
}

function getFallbackCoachResponse(query: string, child: ChildProfile): string {
  const q = query.toLowerCase();
  if (q.includes('monster') || q.includes('dark') || q.includes('afraid') || q.includes('fear')) {
    return `🌙 Addressing Nighttime Fears for ${child.name} (${child.age} yrs):\n\n` +
      `1. Validate, Don't Dismiss: Say "I see you feel scared, and I am right here with you." Avoid saying "monsters aren't real" because to a ${child.age}-year-old imagination, the sensation is very real.\n\n` +
      `2. Give Agency: Use a "Bedtime Starlight Spray" (water with a drop of lavender) or generate a DreamWeaver story where ${child.name} makes friends with a silly, fluffy monster who loves bedtime lullabies.\n\n` +
      `3. Nightlight Anchor: Keep a warm red/amber nightlight on (avoid blue light).`;
  }

  if (q.includes('3 am') || q.includes('wakes up') || q.includes('middle of the night')) {
    return `⏰ Handling 3 AM Night Awakenings:\n\n` +
      `1. Silent Return: Walk ${child.name} back to bed with minimal eye contact and zero conversation beyond "It's bedtime now, you are safe."\n\n` +
      `2. Audio Anchor: Turn on your recorded Parent Voice audio story or soothing rain soundscape on low volume so ${child.name} feels your presence without needing you in the room.\n\n` +
      `3. Consistency: Stick to this routine for 4-5 consecutive nights to build permanent sleep independence.`;
  }

  return `✨ Clinical Sleep Strategy for ${child.name}:\n\n` +
    `For children aged ${child.age}, bedtime predictability is the single strongest factor in reducing cortisol and easing sleep transition.\n\n` +
    `• Step 1: Complete your 10-step Bedtime Routine Checklist 30-45 minutes before lights out.\n` +
    `• Step 2: Use a personalized DreamWeaver story featuring ${child.name}'s favorite characters to settle their nervous system.\n` +
    `• Step 3: Set up a parent-child Sleep Agreement with micro-rewards for staying in bed!`;
}
