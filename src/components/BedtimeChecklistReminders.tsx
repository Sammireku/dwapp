import React, { useState } from 'react';
import { CheckCircle2, Circle, Sparkles, Bell, Volume2, ShieldCheck, Clock, Download, Play, Trophy, Moon, Heart, User, Vibrate } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChildProfile, RoutineStep } from '../types';

interface BedtimeChecklistRemindersProps {
  activeChild: ChildProfile;
  onOpenStoryWizard?: () => void;
}

const INITIAL_STEPS: RoutineStep[] = [
  { id: 'step_1', icon: '🧸', title: 'Pick up and pack toys', subtitle: 'Tuck all toys into their cozy bedtime bins', isCompleted: false },
  { id: 'step_2', icon: '💡', title: 'Dim lights', subtitle: 'Turn off big bright lamps and switch to warm nightlights', isCompleted: false },
  { id: 'step_3', icon: '🪥', title: 'Brush teeth', subtitle: 'Brush away sugar bugs for 2 full minutes', isCompleted: false },
  { id: 'step_4', icon: '🥛', title: 'Drink water', subtitle: 'Take a last refreshing bedtime sip', isCompleted: false },
  { id: 'step_5', icon: '🛁', title: 'Bath / shower', subtitle: 'Wash away daytime dust with warm bubbles', isCompleted: false },
  { id: 'step_6', icon: '👔', title: 'Pyjamas', subtitle: 'Put on softest cozy pajamas', isCompleted: false },
  { id: 'step_7', icon: '🚽', title: 'Potty time', subtitle: 'One last trip to the bathroom before bed', isCompleted: false },
  { id: 'step_8', icon: '📖', title: 'Book read time', subtitle: 'Listen to your personalized DreamWeaver story', isCompleted: false },
  { id: 'step_9', icon: '🚪', title: 'Lights out & doors close', subtitle: 'Safe, quiet, and snug under warm blankets', isCompleted: false },
  { id: 'step_10', icon: '😴', title: 'Sleep', subtitle: 'Close eyes and drift into starlight dreams', isCompleted: false },
];

export const BedtimeChecklistReminders: React.FC<BedtimeChecklistRemindersProps> = ({
  activeChild,
  onOpenStoryWizard,
}) => {
  const [steps, setSteps] = useState<RoutineStep[]>(INITIAL_STEPS);
  const [reminderTime, setReminderTime] = useState('19:45');
  const [selectedSound, setSelectedSound] = useState<'lullaby' | 'rain' | 'singing_bowl' | 'silent'>('lullaby');
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [isReminderActive, setIsReminderActive] = useState(true);

  // Caregiver Offline Timer
  const [caregiverTimerMins, setCaregiverTimerMins] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerRemainingSec, setTimerRemainingSec] = useState(1800);

  const completedCount = steps.filter((s) => s.isCompleted).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const toggleStep = (id: string) => {
    setSteps((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, isCompleted: !s.isCompleted } : s));
      const newlyCompletedCount = updated.filter((s) => s.isCompleted).length;

      if (newlyCompletedCount === steps.length) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
      return updated;
    });
  };

  const resetChecklist = () => {
    setSteps(INITIAL_STEPS.map((s) => ({ ...s, isCompleted: false })));
  };

  const playTestSound = () => {
    if ('vibrate' in navigator && vibrationEnabled) {
      navigator.vibrate([200, 100, 200]);
    }

    if (!('speechSynthesis' in window)) return;
    const soundMsg = new SpeechSynthesisUtterance(
      `Bedtime reminder chime for ${activeChild.name}! Time for step ${completedCount + 1}: ${
        steps[completedCount]?.title || 'bedtime'
      }.`
    );
    soundMsg.rate = 0.9;
    window.speechSynthesis.speak(soundMsg);
  };

  const downloadPrintableChecklist = () => {
    const content = `===========================================\n` +
      `  DREAMWEAVER BEDTIME ROUTINE CHECKLIST  \n` +
      `  Child: ${activeChild.name} (${activeChild.age} yrs)\n` +
      `===========================================\n\n` +
      steps.map((s, i) => `[  ] Step ${i + 1}: ${s.icon} ${s.title}\n      (${s.subtitle})`).join('\n\n') +
      `\n\n⭐ Target Bedtime: ${reminderTime}\n` +
      `🏆 Reward: 1 Bedtime Star per completed night!`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DreamWeaver_Bedtime_Checklist_${activeChild.name}.txt`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-slate-100 space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border border-amber-800/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>10-Step Pediatric Bedtime Routine</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-100 mb-2">
            {activeChild.name}'s Bedtime Routine & Reminder Hub
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Eliminate bedtime battles with an interactive 10-step bedtime routine, sound/vibration alerts, caregiver timers, and printable star charts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive 10-Step Checklist */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            {/* Progress Bar & Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-lg font-bold text-amber-300 flex items-center gap-2">
                    <Moon className="w-5 h-5 text-amber-400" />
                    <span>Bedtime Checklist Progress</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    {completedCount} of {steps.length} steps completed tonight
                  </p>
                </div>
                <button
                  onClick={resetChecklist}
                  className="text-xs text-slate-400 hover:text-amber-300 underline"
                >
                  Reset Checklist
                </button>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-slate-950 rounded-full h-4 p-0.5 border border-slate-800 relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 via-amber-300 to-purple-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {completedCount === steps.length && (
                <div className="p-4 rounded-2xl bg-amber-400/20 border border-amber-400/50 text-amber-200 text-xs font-bold text-center flex items-center justify-center gap-2 animate-bounce">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>Hooray! All 10 bedtime routine steps completed! Time for starlight sleep! 🌟</span>
                </div>
              )}
            </div>

            {/* Steps List */}
            <div className="space-y-2.5">
              {steps.map((step, index) => {
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      step.isCompleted
                        ? 'bg-amber-400/10 border-amber-400/50 opacity-90'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="text-2xl flex-shrink-0">{step.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider">
                            Step {index + 1}
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              step.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                            }`}
                          >
                            {step.title}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{step.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 pl-3">
                      {step.isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-amber-400 fill-amber-400/20" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-600 hover:text-amber-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Reminders, Caregiver Offline Timer & Printable */}
        <div className="lg:col-span-4 space-y-6">
          {/* Bedtime Sound & Vibration Reminders */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-serif text-base font-bold text-slate-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Bedtime Notification & Sound</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Bedtime Alarm</label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Chime Sound Effect</label>
                <select
                  value={selectedSound}
                  onChange={(e) => setSelectedSound(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="lullaby">🎵 Soft Lullaby Chime</option>
                  <option value="rain">🌧️ Gentle Night Rain</option>
                  <option value="singing_bowl">🧘 Sleeping Bowl Chime</option>
                  <option value="silent">🔕 Silent Vibration Only</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="flex items-center gap-2 text-slate-300">
                  <Vibrate className="w-4 h-4 text-amber-400" />
                  <span>Device Vibration</span>
                </span>
                <input
                  type="checkbox"
                  checked={vibrationEnabled}
                  onChange={(e) => setVibrationEnabled(e.target.checked)}
                  className="w-4 h-4 accent-amber-400"
                />
              </div>

              <button
                onClick={playTestSound}
                className="w-full py-2.5 rounded-xl bg-amber-400/20 text-amber-300 font-bold hover:bg-amber-400/30 border border-amber-400/40 transition-all flex items-center justify-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                <span>Test Alarm & Vibration</span>
              </button>
            </div>
          </div>

          {/* Caregiver & Nanny Offline Sleep Timer */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-serif text-base font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Caregiver / Nanny Offline Timer</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Set a timer for babysitters or when traveling offline. Stories auto-play at bedtime and fade off gently.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Auto-off Sleep Timer</label>
                <select
                  value={caregiverTimerMins}
                  onChange={(e) => setCaregiverTimerMins(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-indigo-400"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes (Recommended)</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>

              <button
                onClick={() => alert(`Offline Bedtime Timer set for ${caregiverTimerMins} minutes!`)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>Activate Caregiver Bedtime Timer</span>
              </button>
            </div>
          </div>

          {/* Download Printable Star Chart */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900/40 to-slate-900 border border-purple-500/30 text-center space-y-3">
            <h4 className="font-serif text-sm font-bold text-purple-200">
              Printable Physical Routine Chart
            </h4>
            <p className="text-xs text-slate-300">
              Download a ready-to-print bedtime routine checklist to stick on {activeChild.name}'s bedroom door!
            </p>
            <button
              onClick={downloadPrintableChecklist}
              className="w-full py-2.5 rounded-xl bg-slate-950 border border-purple-400/40 text-purple-300 font-bold hover:bg-slate-800 text-xs flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span>Download Printable Checklist</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
