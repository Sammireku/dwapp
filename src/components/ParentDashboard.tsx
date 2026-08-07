import React, { useState } from 'react';
import { LayoutDashboard, Calendar, Users, ShieldAlert, FileText, PieChart as PieIcon, Plus, Check, Copy, Sparkles, Clock, Share2 } from 'lucide-react';
import { ChildProfile, Story, ScheduledStory, Caregiver, EmotionalTheme } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { CoveredThemesVisualization } from './CoveredThemesVisualization';

interface ParentDashboardProps {
  activeChild: ChildProfile;
  stories: Story[];
  onOpenStoryWizard: () => void;
  onOpenReadView: (story: Story) => void;
  onOpenStoryWizardWithTheme?: (theme: EmotionalTheme) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  activeChild,
  stories,
  onOpenStoryWizard,
  onOpenReadView,
  onOpenStoryWizardWithTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'scheduler' | 'coparenting' | 'export'>('analytics');
  const [copiedSyncCode, setCopiedSyncCode] = useState(false);

  // Scheduled Stories state
  const [scheduledQueue, setScheduledQueue] = useState<ScheduledStory[]>([
    {
      id: 'sch_1',
      childId: activeChild.id,
      storyTitle: 'Zula and the Little Star That Wasn’t Scared of the Dark',
      themeLabel: 'Fear of Sleeping Alone & The Dark',
      scheduledDate: '2026-08-03',
      narratorType: 'cloned_voice',
      parentNote: 'Parent business trip to Frankfurt - scheduled cloned voice audiobook arrival',
      status: 'queued',
    },
    {
      id: 'sch_2',
      childId: activeChild.id,
      storyTitle: 'Pip and the Great Treehouse Turn-Taking Game',
      themeLabel: 'Sharing & Taking Turns',
      scheduledDate: '2026-08-04',
      narratorType: 'luna',
      parentNote: 'Playdate planned with Maya in afternoon',
      status: 'queued',
    }
  ]);

  // Caregivers
  const [caregivers, setCaregivers] = useState<Caregiver[]>([
    { id: 'cg_1', name: 'Milou', role: 'Mom', avatar: 'M', isSynced: true, lastActive: '2 mins ago' },
    { id: 'cg_2', name: 'Sam', role: 'Dad', avatar: 'S', isSynced: true, lastActive: 'Active now' },
    { id: 'cg_3', name: 'Dr. Aris', role: 'Therapist', avatar: 'A', isSynced: false, lastActive: 'Invited' },
  ]);

  // Theme analytics processing
  const themeCounts: Record<string, number> = {};
  activeChild.coveredThemes.forEach((t) => {
    themeCounts[t.themeLabel] = (themeCounts[t.themeLabel] || 0) + 1;
  });

  const pieData = Object.entries(themeCounts).map(([name, value]) => ({ name, value }));
  if (pieData.length === 0) {
    pieData.push({ name: 'Fear of Dark', value: 3 }, { name: 'Resilience', value: 2 }, { name: 'Sharing', value: 1 });
  }

  const COLORS = ['#f59e0b', '#818cf8', '#34d399', '#f43f5e', '#a855f7'];

  const copySyncCode = () => {
    navigator.clipboard.writeText(`DREAM-${activeChild.name.toUpperCase()}-772`);
    setCopiedSyncCode(true);
    setTimeout(() => setCopiedSyncCode(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-slate-100 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span>Parent & Educator Dashboard</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-100">
            {activeChild.name}'s Bedtime Emotional Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track covered emotional themes, queue stories for travel nights, and sync with co-parents or counselors.
          </p>
        </div>

        <button
          onClick={onOpenStoryWizard}
          className="px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 shadow-md flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Custom Theme Story</span>
        </button>
      </div>

      {/* Dashboard Sub-Tabs */}
      <div className="flex items-center border-b border-slate-800 text-xs font-semibold gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'analytics', label: 'Theme Coverage Analytics', icon: PieIcon },
          { id: 'scheduler', label: 'Nightly Queue & Travel Scheduler', icon: Calendar },
          { id: 'coparenting', label: 'Co-Parent & Caregiver Sync', icon: Users },
          { id: 'export', label: 'Educator / Therapist Summary', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-amber-400 text-amber-300 bg-amber-400/5 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Analytics & Theme Progress Ring */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <CoveredThemesVisualization
            activeChild={activeChild}
            onSelectThemeForStory={(theme) => {
              if (onOpenStoryWizardWithTheme) {
                onOpenStoryWizardWithTheme(theme);
              } else {
                onOpenStoryWizard();
              }
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-serif text-base font-bold text-slate-100 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-amber-400" />
                <span>Theme Frequency Distribution</span>
              </h3>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-medium justify-center">
                {pieData.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-slate-300">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-serif text-base font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Parenting Insights for {activeChild.name}</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-amber-300 block">Nighttime Comfort Peak:</span>
                  <p className="text-slate-300 leading-normal">
                    {activeChild.name} responds best to stories featuring allegorical animal companions (e.g. Pip the Fox) when processing bedtime fears.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-emerald-300 block">Recommended Next Focus:</span>
                  <p className="text-slate-300 leading-normal">
                    Try starting a bedtime tale on <strong>Starting School / New Class Routine</strong> to gently reinforce confidence for upcoming school days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Scheduler */}
      {activeTab === 'scheduler' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-slate-100">
                Weekly Bedtime Story Queue & Travel Schedule
              </h3>
              <p className="text-xs text-slate-400">
                Schedule audiobooks narrated in your cloned voice to "arrive" on nights you are traveling or working late.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {scheduledQueue.map((sch) => (
              <div key={sch.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">
                      {sch.scheduledDate}
                    </span>
                    <span className="font-bold text-slate-100">{sch.storyTitle}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] italic">{sch.parentNote}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-[11px]">
                    Cloned Parent Voice
                  </span>
                  <button className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Co-Parenting */}
      {activeTab === 'coparenting' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-slate-100">
                Shared Profile & Caregiver Sync
              </h3>
              <p className="text-xs text-slate-400">
                Keep both parents and grandparents in sync on what's been read and which themes have been addressed.
              </p>
            </div>

            <button
              onClick={copySyncCode}
              className="px-3.5 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 text-xs font-bold flex items-center gap-1.5"
            >
              <Copy className="w-4 h-4" />
              <span>{copiedSyncCode ? 'Copied Code!' : 'Copy Sync Code'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {caregivers.map((cg) => (
              <div key={cg.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 font-bold text-base flex items-center justify-center border border-amber-400/30">
                  {cg.avatar}
                </div>
                <div>
                  <span className="font-bold text-slate-100 block">{cg.name} ({cg.role})</span>
                  <span className="text-[11px] text-emerald-400 font-medium">{cg.lastActive}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Counselor Export */}
      {activeTab === 'export' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-serif text-base font-bold text-slate-100">
            Child Counselor & Educator Progress Notes
          </h3>
          <p className="text-xs text-slate-400">
            Generate a concise bibliotherapy narrative summary for {activeChild.name}'s school counselor or child psychologist.
          </p>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 leading-relaxed">
            <div className="text-amber-300 font-bold">[DREAMWEAVER THERAPEUTIC SUMMARY FOR {activeChild.name.toUpperCase()}]</div>
            <div>• Age: {activeChild.age} | Reading Level: {activeChild.readingLevel}</div>
            <div>• Covered Themes: {activeChild.coveredThemes.map(t => t.themeLabel).join(', ')}</div>
            <div>• Story Resonance: Highly responsive to gentle reframing of nighttime shadows and peer sharing.</div>
            <div>• Parent Note: Bedtime sleep latency reduced by ~15 mins using story routines.</div>
          </div>
        </div>
      )}
    </div>
  );
};
