import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock } from 'lucide-react';
import { siteConfig } from '../config';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

export const CountdownSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(siteConfig.pujaStartDate).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isComplete: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <section id="countdown" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="relative rounded-2xl bg-gradient-to-b from-[#21090d] via-[#1a070a] to-[#120406] border border-amber-500/30 p-6 sm:p-8 shadow-xl overflow-hidden">
        
        {/* Subtle decorative gold alpana corners */}
        <div className="absolute top-2 left-2 text-amber-500/20 text-3xl select-none pointer-events-none">❀</div>
        <div className="absolute top-2 right-2 text-amber-500/20 text-3xl select-none pointer-events-none">❀</div>
        <div className="absolute bottom-2 left-2 text-amber-500/20 text-3xl select-none pointer-events-none">❀</div>
        <div className="absolute bottom-2 right-2 text-amber-500/20 text-3xl select-none pointer-events-none">❀</div>

        <div className="text-center relative z-10">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-bengali">শারদীয়ার শুভ আগমন</span>
            <span className="text-amber-500/50">·</span>
            <span>Festival Countdown</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-amber-100 mb-2">
            {timeLeft.isComplete ? 'মা আসছেন ঘরে' : 'Durga Puja Begins In'}
          </h2>

          <p className="font-bengali text-amber-200/70 text-sm sm:text-base max-w-md mx-auto mb-6">
            কাশফুল, শিউলি আর ঢাকের আওয়াজে সেজে উঠছে ধরণী। শুভ মহালয়া ও শারদোৎসবের দিন গণনা।
          </p>

          {timeLeft.isComplete ? (
            <div className="py-4">
              <div className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-red-600/30 via-amber-500/30 to-red-600/30 border border-amber-400/50 text-3xl sm:text-4xl font-bold font-bengali text-amber-200 animate-pulse">
                শুভ দুর্গাপূজা! ❤️
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto">
              
              {/* Days */}
              <div className="flex flex-col items-center bg-[#2d0e13]/80 border border-amber-900/50 rounded-xl p-3 sm:p-4 shadow-inner">
                <span className="font-mono tabular-nums text-2xl sm:text-4xl font-bold text-amber-300">
                  {formatNumber(timeLeft.days)}
                </span>
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-amber-200/60 font-medium mt-1">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center bg-[#2d0e13]/80 border border-amber-900/50 rounded-xl p-3 sm:p-4 shadow-inner">
                <span className="font-mono tabular-nums text-2xl sm:text-4xl font-bold text-amber-300">
                  {formatNumber(timeLeft.hours)}
                </span>
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-amber-200/60 font-medium mt-1">
                  Hours
                </span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center bg-[#2d0e13]/80 border border-amber-900/50 rounded-xl p-3 sm:p-4 shadow-inner">
                <span className="font-mono tabular-nums text-2xl sm:text-4xl font-bold text-amber-300">
                  {formatNumber(timeLeft.minutes)}
                </span>
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-amber-200/60 font-medium mt-1">
                  Minutes
                </span>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center bg-[#2d0e13]/80 border border-amber-900/50 rounded-xl p-3 sm:p-4 shadow-inner">
                <span className="font-mono tabular-nums text-2xl sm:text-4xl font-bold text-amber-400">
                  {formatNumber(timeLeft.seconds)}
                </span>
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-amber-200/60 font-medium mt-1">
                  Seconds
                </span>
              </div>

            </div>
          )}

          <div className="mt-5 text-xs text-amber-200/50 flex items-center justify-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-amber-500/70" />
            <span>
              Target date: {new Date(siteConfig.pujaStartDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
