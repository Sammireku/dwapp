import React, { useState } from 'react';
import { BookOpen, Sparkles, Clock, Tag, ChevronRight, Bookmark, CheckCircle2, UserCheck, Search, Filter } from 'lucide-react';
import { ResourceArticle } from '../types';
import { RESOURCE_ARTICLES } from '../data/resourceArticles';

export const SleepResourceBlog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<ResourceArticle | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const filteredArticles = RESOURCE_ARTICLES.filter(art => {
    const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-slate-100 space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/50 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-400/10 border border-purple-400/30 text-purple-300 text-xs font-semibold mb-3">
            <BookOpen className="w-4 h-4 text-purple-300" />
            <span>Pediatric Sleep & Development Research</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-100 mb-2">
            Pediatric Sleep Insights & Research Library
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Evidence-based research, sleep science articles, and behavioral advice written by pediatricians and child development experts to guide your family toward restful nights.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'bg-slate-950 text-indigo-200 hover:bg-slate-800'
            }`}
          >
            All Articles ({RESOURCE_ARTICLES.length})
          </button>
          <button
            onClick={() => setSelectedCategory('sleep_science')}
            className={`px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              selectedCategory === 'sleep_science'
                ? 'bg-purple-500 text-white font-bold shadow-md'
                : 'bg-slate-950 text-indigo-200 hover:bg-slate-800'
            }`}
          >
            Sleep Science
          </button>
          <button
            onClick={() => setSelectedCategory('bedtime_anxiety')}
            className={`px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              selectedCategory === 'bedtime_anxiety'
                ? 'bg-rose-500 text-white font-bold shadow-md'
                : 'bg-slate-950 text-indigo-200 hover:bg-slate-800'
            }`}
          >
            Bedtime Fears & Anxiety
          </button>
          <button
            onClick={() => setSelectedCategory('toddler_routines')}
            className={`px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              selectedCategory === 'toddler_routines'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-950 text-indigo-200 hover:bg-slate-800'
            }`}
          >
            Story Length & Pacing
          </button>
          <button
            onClick={() => setSelectedCategory('emotional_growth')}
            className={`px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              selectedCategory === 'emotional_growth'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-950 text-indigo-200 hover:bg-slate-800'
            }`}
          >
            Routine Psychology
          </button>
        </div>

        {/* Search Field */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sleep topics..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((art) => {
          const isBookmarked = bookmarkedIds.includes(art.id);
          return (
            <div
              key={art.id}
              onClick={() => setActiveArticle(art)}
              className="group cursor-pointer bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl overflow-hidden shadow-lg transition-all hover:scale-[1.01] flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                    {art.category.replace('_', ' ')}
                  </span>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => toggleBookmark(art.id, e)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 hover:text-amber-300 border border-white/10 transition-colors"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                    <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>{art.author}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{art.readTimeMinutes} min read</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-2">
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {art.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[10px] bg-slate-950 text-indigo-300/80 px-2.5 py-0.5 rounded-md border border-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-300 font-bold group-hover:translate-x-1 transition-transform pt-3">
                  <span>Read Article</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl my-8">
            <div className="relative h-64 overflow-hidden">
              <img
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-slate-200 hover:text-white border border-white/10"
              >
                ✕
              </button>

              <div className="absolute bottom-4 left-6 right-6 space-y-2">
                <span className="px-3 py-1 rounded-full bg-purple-500/80 text-white text-[10px] font-bold uppercase tracking-wider">
                  {activeArticle.category.replace('_', ' ')}
                </span>
                <h2 className="font-serif text-2xl font-bold text-slate-100">
                  {activeArticle.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-amber-200/90 font-medium">
                  <span>By {activeArticle.author} ({activeArticle.authorRole})</span>
                  <span>•</span>
                  <span>{activeArticle.readTimeMinutes} min read</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Key Takeaways Box */}
              <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 space-y-2">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Key Clinical & Behavioral Takeaways</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {activeArticle.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Full Article Content */}
              <div className="space-y-4 text-sm text-slate-200 leading-relaxed font-sans">
                {activeArticle.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
