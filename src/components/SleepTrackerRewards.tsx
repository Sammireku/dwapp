import React, { useState } from 'react';
import { Calendar, Moon, Sun, Star, Trophy, Sparkles, TrendingUp, AlertTriangle, Plus, CheckCircle2, Award, HeartHandshake, Smile, RefreshCw, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import confetti from 'canvas-confetti';
import { ChildProfile, SleepLog, SleepAgreement } from '../types';

interface SleepTrackerRewardsProps {
  activeChild: ChildProfile;
}

const INITIAL_SLEEP_LOGS: SleepLog[] = [
  { id: 'log_1', childId: 'c1', date: '2026-07-28', bedtime: '20:15', wakeTime: '06:45', durationHours: 10.5, qualityRating: 5, nightAwakenings: 0, wokeUpMood: 'happy', bedtimeRoutineCompleted: true },
  { id: 'log_2', childId: 'c1', date: '2026-07-29', bedtime: '20:30', wakeTime: '06:30', durationHours: 10.0, qualityRating: 4, nightAwakenings: 1, wokeUpMood: 'refreshed', bedtimeRoutineCompleted: true },
  { id: 'log_3', childId: 'c1', date: '2026-07-30', bedtime: '21:15', wakeTime: '06:15', durationHours: 9.0, qualityRating: 3, nightAwakenings: 2, wokeUpMood: 'tired', bedtimeRoutineCompleted: false },
  { id: 'log_4', childId: 'c1', date: '2026-07-31', bedtime: '20:15', wakeTime: '07:00', durationHours: 10.75, qualityRating: 5, nightAwakenings: 0, wokeUpMood: 'happy', bedtimeRoutineCompleted: true },
  { id: 'log_5', childId: 'c1', date: '2026-08-01', bedtime: '20:00', wakeTime: '06:45', durationHours: 10.75, qualityRating: 5, nightAwakenings: 0, wokeUpMood: 'refreshed', bedtimeRoutineCompleted: true },
  { id: 'log_6', childId: 'c1', date: '2026-08-02', bedtime: '20:15', wakeTime: '07:00', durationHours: 10.75, qualityRating: 5, nightAwakenings: 0, wokeUpMood: 'happy', bedtimeRoutineCompleted: true },
];

const INITIAL_AGREEMENT: SleepAgreement = {
  id: 'ag_1',
  childId: 'c1',
  childName: 'Milou',
  targetBedtime: '8:15 PM',
  targetDurationDays: 5,
  currentStreakDays: 3,
  agreedReward: '🍦 Weekend Family Trip to the Science Center & Ice Cream!',
  agreedConsequence: '📱 No iPad games before dinner tomorrow',
  status: 'active',
  startDate: '2026-07-30',
  lastUpdated: new Date().toISOString(),
};

export const SleepTrackerRewards: React.FC<SleepTrackerRewardsProps> = ({ activeChild }) => {
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>(INITIAL_SLEEP_LOGS);
  const [agreement, setAgreement] = useState<SleepAgreement>({
    ...INITIAL_AGREEMENT,
    childName: activeChild.name,
  });

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [newBedtime, setNewBedtime] = useState('20:15');
  const [newWakeTime, setNewWakeTime] = useState('06:45');
  const [newQuality, setNewQuality] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [newAwakenings, setNewAwakenings] = useState(0);
  const [newMood, setNewMood] = useState<'happy' | 'refreshed' | 'fussy' | 'tired'>('happy');
  const [newRoutineDone, setNewRoutineDone] = useState(true);

  // Calculate Average Sleep Duration
  const avgDuration = (
    sleepLogs.reduce((acc, l) => acc + l.durationHours, 0) / (sleepLogs.length || 1)
  ).toFixed(1);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const durationHours = 10.5; // Calculated from bedtime to wake time

    const newLog: SleepLog = {
      id: `log_${Date.now()}`,
      childId: activeChild.id,
      date: new Date().toISOString().split('T')[0],
      bedtime: newBedtime,
      wakeTime: newWakeTime,
      durationHours,
      qualityRating: newQuality,
      nightAwakenings: newAwakenings,
      wokeUpMood: newMood,
      bedtimeRoutineCompleted: newRoutineDone,
    };

    setSleepLogs((prev) => [newLog, ...prev]);
    setIsLogModalOpen(false);

    // Update streak if routine done & quality high
    if (newRoutineDone && newQuality >= 4) {
      setAgreement((prev) => {
        const nextStreak = prev.currentStreakDays + 1;
        if (nextStreak >= prev.targetDurationDays) {
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
          return { ...prev, currentStreakDays: nextStreak, status: 'met' };
        }
        return { ...prev, currentStreakDays: nextStreak };
      });
    }
  };

  const handleRenegotiate = () => {
    const newTarget = prompt('Enter new streak target days (e.g., 7):', '7');
    const newReward = prompt('Enter new agreed reward:', '🎟️ Movie Night with Popcorn!');
    if (newTarget && newReward) {
      setAgreement((prev) => ({
        ...prev,
        targetDurationDays: Number(newTarget),
        agreedReward: newReward,
        currentStreakDays: 0,
        status: 'active',
      }));
    }
  };

  const chartData = sleepLogs.slice(0, 7).reverse().map((log) => ({
    date: log.date.slice(5),
    duration: log.durationHours,
    quality: log.qualityRating * 2, // Scale for visibility
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-slate-100 space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-800/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>Sleep Tracker & Parent-Child Agreement Engine</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-100 mb-2">
            {activeChild.name}'s Sleep Progress & Reward System
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Track nightly sleep duration, measure bedtime routine consistency, and manage mutual parent-child agreements with automated goal triggers.
          </p>
        </div>
      </div>

      {/* Top Stat Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 font-bold">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Avg Sleep Duration</span>
            <span className="text-lg font-serif font-bold text-slate-100">{avgDuration} hrs / night</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center text-purple-400 font-bold">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Bedtime Streak</span>
            <span className="text-lg font-serif font-bold text-amber-300">🔥 {agreement.currentStreakDays} Days</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center text-emerald-400 font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Routine Completion</span>
            <span className="text-lg font-serif font-bold text-emerald-300">83% Success</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-center">
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-300 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Log Last Night's Sleep</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Parent-Child Agreement & Reward Contract Box */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 border border-amber-400/40 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-amber-300 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-amber-400" />
                <span>Bedtime Reward & Consequence Agreement</span>
              </h2>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                agreement.status === 'met' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-400/20 text-amber-300'
              }`}>
                {agreement.status === 'met' ? '🎉 Goal Achieved!' : 'Active Agreement'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Parents and {activeChild.name} agreed on bedtime terms. Meeting the target streak triggers parent reminders to award the gift and renegotiate!
            </p>

            {/* Agreement Terms Details */}
            <div className="space-y-3 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Target Bedtime:</span>
                <span className="font-bold text-amber-300">{agreement.targetBedtime}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Target Streak Goal:</span>
                <span className="font-bold text-slate-100">{agreement.targetDurationDays} Consecutive Nights</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">🎁 Agreed Reward:</span>
                <span className="font-bold text-emerald-300 max-w-[220px] text-right">{agreement.agreedReward}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">⚠️ Agreed Consequence:</span>
                <span className="font-bold text-rose-300 max-w-[220px] text-right">{agreement.agreedConsequence}</span>
              </div>
            </div>

            {/* Goal Met Action Bar */}
            {agreement.status === 'met' ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 space-y-3">
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400 animate-bounce" />
                  <span>Congratulations! {activeChild.name} reached the {agreement.targetDurationDays}-day sleep target!</span>
                </div>
                <p className="text-xs text-slate-200">
                  Parent Reminder: Gift {activeChild.name} their agreed reward ({agreement.agreedReward}), then click below to renegotiate the next milestone!
                </p>
                <button
                  onClick={handleRenegotiate}
                  className="w-full py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs hover:bg-emerald-300 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Award Gift & Renegotiate Next Agreement</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleRenegotiate}
                className="w-full py-2.5 rounded-xl bg-slate-950 border border-amber-400/30 text-amber-300 font-semibold text-xs hover:bg-slate-800 transition-all"
              >
                Modify Agreement Terms
              </button>
            )}
          </div>

          {/* Sleep Analytics Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-serif text-base font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Weekly Sleep Duration Trend (Hours)</span>
            </h3>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 12]} />
                  <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="duration" fill="#34d399" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Sleep Logs Table */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-serif text-base font-bold text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Recent Sleep Log History</span>
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
              {sleepLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-bold text-slate-200">{log.date}</span>
                    <span className="text-amber-400 font-bold">{log.durationHours} hrs</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-300">
                      {[...Array(log.qualityRating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-slate-400">
                      Awakenings: <strong className="text-slate-200">{log.nightAwakenings}</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-900 pt-1.5">
                    <span>Bedtime: {log.bedtime} → Wake: {log.wakeTime}</span>
                    <span className="text-emerald-400 font-medium">
                      {log.bedtimeRoutineCompleted ? '✓ Routine Done' : '✕ Routine Missed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Log Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-emerald-300">Log Sleep Entry for {activeChild.name}</h3>
              <button onClick={() => setIsLogModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Bedtime & Wake Time</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={newBedtime}
                    onChange={(e) => setNewBedtime(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                  />
                  <input
                    type="time"
                    value={newWakeTime}
                    onChange={(e) => setNewWakeTime(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Sleep Quality Rating</label>
                <select
                  value={newQuality}
                  onChange={(e) => setNewQuality(Number(e.target.value) as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5 Stars - Peaceful All Night</option>
                  <option value={4}>⭐⭐⭐⭐ 4 Stars - Good Rest</option>
                  <option value={3}>⭐⭐⭐ 3 Stars - Average</option>
                  <option value={2}>⭐⭐ 2 Stars - Restless</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Completed 10-Step Bedtime Routine?</span>
                <input
                  type="checkbox"
                  checked={newRoutineDone}
                  onChange={(e) => setNewRoutineDone(e.target.checked)}
                  className="w-4 h-4 accent-emerald-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs hover:bg-emerald-300 transition-all"
              >
                Save Sleep Log & Update Streak
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
