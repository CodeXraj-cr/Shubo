import React from 'react';
import { Sparkles, Heart, Sun, Music, Flame } from 'lucide-react';
import { siteConfig } from '../config';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Decorative Top Border */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="h-[1px] flex-1 max-w-xs bg-gradient-to-r from-transparent via-amber-500/40 to-amber-500/80" />
        <span className="font-bengali text-amber-400 text-lg">❀ ॐ দুর্গায়ৈ নমঃ ❀</span>
        <div className="h-[1px] flex-1 max-w-xs bg-gradient-to-l from-transparent via-amber-500/40 to-amber-500/80" />
      </div>

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bengali">শারদীয়ার ঐতিহ্য</span>
          <span>· Heritage & Culture</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
          About Durga Puja
        </h2>
        <p className="font-bengali text-amber-200/80 text-lg sm:text-xl font-medium max-w-2xl mx-auto">
          "বাঙালির প্রাণের উৎসব শারদোৎসব — আনন্দ, সম্প্রীতি ও একাত্মতার মহোৎসব"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-12">
        
        {/* Left Column: Cultural Narrative */}
        <div className="bg-[#19080b]/90 border border-amber-900/40 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-amber-100 mb-4">
              Celebrating Culture, Community & Memories
            </h3>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-4">
              Durga Puja is a celebration of devotion, culture, creativity and community. From magnificent artistic pandals to echoing dhak beats, fragrant shiuli blossoms, and divine anjali offerings — every moment becomes a memory worth cherishing.
            </p>
            <p className="text-stone-400 text-sm leading-relaxed mb-4">
              Celebrated with immense grandeur in Bengal and across the global Bengali diaspora, Durga Puja honors the victory of Goddess Durga over evil. It transcends religious boundaries into a UNESCO Intangible Cultural Heritage of Humanity festival where millions walk the illuminated night streets together.
            </p>
            <p className="font-bengali text-amber-200/90 text-sm sm:text-base leading-relaxed">
              মহালয়ার ভোরে বীরেন্দ্রকৃষ্ণ ভদ্রের চণ্ডীপাঠ দিয়ে শুরু হয়ে বিজয়া দশমীর সিঁদুর খেলা ও কোলাকুলিতে শেষ হয় উৎসবের দিনগুলি। আমাদের এই ডিজিটাল প্ল্যাটফর্মের উদ্দেশ্য সেই সব দুর্লভ মুহূর্তকে এক সুতোয় বেঁধে রাখা।
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-900/30 flex items-center gap-3 text-xs text-amber-400/80">
            <span className="text-lg">🪔</span>
            <span>শারদীয়ার প্রীতি ও শুভেচ্ছা সকলের জন্য</span>
          </div>
        </div>

        {/* Right Column: 4 Core Pillars of Durga Puja */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="bg-[#170609] border border-amber-900/40 rounded-xl p-5 hover:border-amber-500/40 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400 mb-3">
                <Music className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white text-base mb-1">
                Dhak & Dhaaki Beats
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                The rhythmic cadence of the feathered dhak drums and bronze kanshi announces Maa Durga's arrival into our hearts.
              </p>
            </div>
            <span className="font-bengali text-xs text-amber-400/80 mt-3">ঢাকের কাঠি ও কাশফুল</span>
          </div>

          <div className="bg-[#170609] border border-amber-900/40 rounded-xl p-5 hover:border-amber-500/40 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400 mb-3">
                <Sun className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white text-base mb-1">
                Pandal Architecture
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                World-class ephemeral architecture and handcrafted clay sculptures transforming city streets into open-air art museums.
              </p>
            </div>
            <span className="font-bengali text-xs text-amber-400/80 mt-3">শিল্পকলার উন্মুক্ত প্রদর্শনী</span>
          </div>

          <div className="bg-[#170609] border border-amber-900/40 rounded-xl p-5 hover:border-amber-500/40 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400 mb-3">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white text-base mb-1">
                Dhunuchi Naach & Anjali
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Auspicious morning Pushpanjali prayers and the ecstatic, hypnotic clay-censer dance of devotion during Sandhi Puja.
              </p>
            </div>
            <span className="font-bengali text-xs text-amber-400/80 mt-3">সন্ধিপূজা ও ধুনুচি নাচ</span>
          </div>

          <div className="bg-[#170609] border border-amber-900/40 rounded-xl p-5 hover:border-amber-500/40 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400 mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white text-base mb-1">
                Sindoor Khela & Bijoya
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                The joyful vermilion play on Dashami, sweets, touching elders' feet, and the warm promise: "Asche bochor abar hobe!"
              </p>
            </div>
            <span className="font-bengali text-xs text-amber-400/80 mt-3">আসছে বছর আবার হবে</span>
          </div>

        </div>

      </div>

    </section>
  );
};
