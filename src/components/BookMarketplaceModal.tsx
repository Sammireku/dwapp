import React, { useState } from 'react';
import { ShoppingBag, BookOpen, Check, Sparkles, Heart, Package, Star, CreditCard, ArrowRight } from 'lucide-react';
import { Story, BookOrder } from '../types';
import confetti from 'canvas-confetti';

interface BookMarketplaceModalProps {
  story: Story;
  onClose: () => void;
  onOrderComplete: (order: BookOrder) => void;
}

export const BookMarketplaceModal: React.FC<BookMarketplaceModalProps> = ({
  story,
  onClose,
  onOrderComplete,
}) => {
  const [format, setFormat] = useState<'hardcover' | 'softcover' | 'digital_deluxe'>('hardcover');
  const [inscription, setInscription] = useState(`For ${story.childName}, with endless love at bedtime.`);
  const [recipientName, setRecipientName] = useState(story.childName);
  const [isOrdering, setIsOrdering] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<BookOrder | null>(null);

  const priceMap = {
    hardcover: 24.99,
    softcover: 14.99,
    digital_deluxe: 6.99,
  };

  const handleCheckout = () => {
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      const order: BookOrder = {
        id: `ord_${Date.now()}`,
        storyId: story.id,
        storyTitle: story.title,
        format,
        coverStyle: 'Starlight Metallic Edition',
        inscription,
        recipientName,
        price: priceMap[format],
        status: 'processing',
        createdAt: new Date().toISOString(),
      };

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setCompletedOrder(order);
      onOrderComplete(order);
    }, 1500);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in text-slate-100"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg font-bold">Illustrated Book Marketplace</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg transition-colors"
            title="Close"
          >
            ✕
          </button>
        </div>

        {!completedOrder ? (
          <div className="p-6 overflow-y-auto space-y-6 text-xs font-medium">
            {/* Book Preview Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="md:col-span-5 aspect-[3/4] bg-gradient-to-tr from-amber-500/20 via-indigo-900/40 to-slate-900 rounded-xl border border-amber-400/30 p-4 flex flex-col justify-between shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-amber-400/5 group-hover:bg-amber-400/10 transition-colors pointer-events-none" />
                <div>
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">Bedtime Keepsake Edition</span>
                  <h4 className="font-serif text-sm font-bold text-slate-100 mt-1 line-clamp-2">
                    {story.title}
                  </h4>
                </div>
                <div className="text-[11px] italic text-slate-300 border-t border-slate-800 pt-2">
                  "{inscription}"
                </div>
              </div>

              <div className="md:col-span-7 space-y-3">
                <h4 className="font-serif text-base font-bold text-amber-200">
                  Turn {story.childName}'s Custom Story into a Physical Keepsake
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Printed on premium archival paper with full-color AI illustrations, glossy hardbound cover, and custom golden page margins.
                </p>
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>4.9/5 stars from 1,200+ parents</span>
                </div>
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-slate-300 mb-2 font-bold">Select Edition Format</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: 'hardcover', name: 'Deluxe Hardcover', price: '$24.99', desc: 'Glossy linen cover, gold foil foil edges' },
                  { key: 'softcover', name: 'Softcover Edition', price: '$14.99', desc: 'Durable matte paper, bedtime size' },
                  { key: 'digital_deluxe', name: 'Digital eBook & Audio', price: '$6.99', desc: 'High-res PDF + MP3 narration' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setFormat(item.key as any)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      format === item.key
                        ? 'bg-amber-400/15 border-amber-400 text-amber-200 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-100 text-xs">{item.name}</span>
                        <span className="font-mono text-amber-300 font-bold">{item.price}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Inscription Form */}
            <div>
              <label className="block text-slate-300 mb-1 font-bold">Custom Book Dedication / Inscription</label>
              <input
                type="text"
                value={inscription}
                onChange={(e) => setInscription(e.target.value)}
                placeholder="e.g. For Zula, on your 5th birthday..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>

            {/* Action Checkout */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Total Price</span>
                <span className="font-serif text-xl font-bold text-amber-300">${priceMap[format]}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isOrdering}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold hover:from-amber-300 hover:to-amber-400 shadow-lg flex items-center gap-2 text-xs"
                >
                  {isOrdering ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Order Printed Book</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Confirmation Receipt Screen */
          <div className="p-8 text-center space-y-4">
            <Package className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-slate-100">
              Order Confirmed for {story.childName}!
            </h3>
            <p className="text-slate-300 text-xs max-w-md mx-auto">
              Order #{completedOrder.id} has been submitted for print-on-demand fulfillment. Estimated arrival: 3-5 business days.
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left max-w-md mx-auto space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Story Title:</span>
                <span className="text-slate-200 font-semibold">{completedOrder.storyTitle}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Format:</span>
                <span className="text-amber-300 capitalize font-semibold">{completedOrder.format}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Inscription:</span>
                <span className="text-slate-200 italic">{completedOrder.inscription}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300"
            >
              Back to DreamWeaver
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
