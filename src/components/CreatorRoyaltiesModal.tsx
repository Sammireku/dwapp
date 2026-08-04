import React, { useState } from 'react';
import { ShoppingBag, Sparkles, DollarSign, Download, Heart, BookOpen, Share2, Award, Plus, Check } from 'lucide-react';
import { Story, PublishedStory } from '../types';

interface CreatorRoyaltiesModalProps {
  stories: Story[];
  onClose?: () => void;
}

const INITIAL_PUBLISHED_STORIES: PublishedStory[] = [
  {
    id: 'pub_1',
    storyId: 's1',
    title: 'The Starlight Fox & The Calm Forest',
    authorParentName: 'Mom Sarah & Dad James',
    childAgeGroup: '3–5 years',
    category: 'Fear of Dark',
    downloadsCount: 142,
    likesCount: 89,
    royaltyEarnedDollars: 42.50,
    coverImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    summary: 'A peaceful starlight story helping young kids feel safe when nighttime shadows visit.',
    price: 3.99,
    publishedAt: '2026-07-20',
  },
  {
    id: 'pub_2',
    storyId: 's2',
    title: 'Barnaby Bear’s Gentle Breath',
    authorParentName: 'Parent Alex',
    childAgeGroup: '0–3 years',
    category: 'Bedtime Routine',
    downloadsCount: 215,
    likesCount: 134,
    royaltyEarnedDollars: 68.00,
    coverImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    summary: 'Soft rhythmic story guiding toddlers through slow belly breaths and sleepy toes.',
    price: 2.99,
    publishedAt: '2026-07-12',
  },
];

export const CreatorRoyaltiesModal: React.FC<CreatorRoyaltiesModalProps> = ({ stories }) => {
  const [publishedStories, setPublishedStories] = useState<PublishedStory[]>(INITIAL_PUBLISHED_STORIES);
  const [selectedStoryToPublish, setSelectedStoryToPublish] = useState<string>(stories[0]?.id || '');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [priceInput, setPriceInput] = useState('3.99');

  const totalRoyalties = publishedStories.reduce((acc, s) => acc + s.royaltyEarnedDollars, 0).toFixed(2);
  const totalDownloads = publishedStories.reduce((acc, s) => acc + s.downloadsCount, 0);

  const handlePublishStory = (e: React.FormEvent) => {
    e.preventDefault();
    const storyToPublish = stories.find(s => s.id === selectedStoryToPublish);
    if (!storyToPublish) return;

    const newPub: PublishedStory = {
      id: `pub_${Date.now()}`,
      storyId: storyToPublish.id,
      title: storyToPublish.title,
      authorParentName: 'Family Creator',
      childAgeGroup: `${storyToPublish.targetAge} years`,
      category: storyToPublish.themeLabel,
      downloadsCount: 0,
      likesCount: 0,
      royaltyEarnedDollars: 0,
      coverImageUrl: storyToPublish.coverImageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      summary: storyToPublish.summary,
      price: Number(priceInput) || 3.99,
      publishedAt: new Date().toISOString().split('T')[0],
    };

    setPublishedStories([newPub, ...publishedStories]);
    setIsPublishModalOpen(false);
    alert(`🎉 "${storyToPublish.title}" published to DreamWeaver Community Store! You will earn royalties on every download!`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-slate-100 space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-purple-950 border border-amber-800/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>Parent Creator Marketplace & Royalties</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-100 mb-2">
            Publish Custom Stories & Earn Community Royalties
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Share your child’s favorite AI-generated bedtime stories with thousands of parents worldwide. Earn 70% royalties or redeem earnings for free physical hardcover prints!
          </p>
        </div>
      </div>

      {/* Royalties Stat Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Total Creator Royalties</span>
            <span className="text-xl font-serif font-bold text-amber-300">${totalRoyalties}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center text-purple-400 font-bold">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Total Community Downloads</span>
            <span className="text-xl font-serif font-bold text-slate-100">{totalDownloads} Downloads</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-center">
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:from-amber-300 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Story to Store</span>
          </button>
        </div>
      </div>

      {/* Published Stories List */}
      <div className="space-y-4">
        <h2 className="font-serif text-lg font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>Your Published Community Books</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publishedStories.map((story) => (
            <div key={story.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex gap-4">
              <img src={story.coverImageUrl} alt={story.title} className="w-24 h-32 object-cover rounded-xl border border-white/10 flex-shrink-0" />
              <div className="space-y-2 text-xs flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-400/10 text-amber-300 text-[10px] font-bold">
                      ${story.price} USD
                    </span>
                    <span className="text-[10px] text-slate-400">{story.publishedAt}</span>
                  </div>
                  <h3 className="font-serif text-sm font-bold text-slate-100 mt-1">{story.title}</h3>
                  <p className="text-slate-400 text-[11px] line-clamp-2 mt-1">{story.summary}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <span>📥 {story.downloadsCount} Downloads</span>
                  <span>❤️ {story.likesCount} Likes</span>
                  <span className="text-emerald-400 font-bold">+${story.royaltyEarnedDollars.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publish Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-amber-400/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-amber-300">Publish Generated Story</h3>
              <button onClick={() => setIsPublishModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handlePublishStory} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Select Story to Publish</label>
                <select
                  value={selectedStoryToPublish}
                  onChange={(e) => setSelectedStoryToPublish(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                >
                  {stories.map(s => (
                    <option key={s.id} value={s.id}>{s.title} ({s.childName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">List Price ($ USD)</label>
                <select
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                >
                  <option value="0">Free Community Gift ($0.00)</option>
                  <option value="2.99">$2.99 USD</option>
                  <option value="3.99">$3.99 USD (Recommended)</option>
                  <option value="4.99">$4.99 USD</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-[11px] text-amber-200">
                💡 You earn 70% royalties on all purchases. Royalty payouts can be transferred to PayPal or redeemed for free physical hardcover books!
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-all"
              >
                Confirm & Publish to Community Store
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
