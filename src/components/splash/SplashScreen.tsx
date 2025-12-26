import { useEffect, useState } from 'react';
import { Heart, BookOpen, HandHeart } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [stage, setStage] = useState<'logo' | 'tagline' | 'fade'>('logo');

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('tagline'), 800);
    const timer2 = setTimeout(() => setStage('fade'), 2200);
    const timer3 = setTimeout(() => onComplete(), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-700 ${
        stage === 'fade' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, hsl(174, 42%, 51%) 0%, hsl(165, 50%, 60%) 50%, hsl(45, 100%, 64%) 100%)',
      }}
    >
      {/* Logo Container */}
      <div
        className={`flex flex-col items-center transition-all duration-700 ${
          stage === 'logo' ? 'scale-100 opacity-100' : 'scale-100 opacity-100'
        }`}
      >
        {/* Logo Icon */}
        <div
          className={`relative w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 transition-all duration-700 ${
            stage !== 'logo' ? 'animate-logo-pop' : ''
          }`}
          style={{
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}
        >
          {/* Heart + Book + Hands */}
          <div className="relative">
            <Heart className="w-12 h-12 md:w-16 md:h-16 text-white fill-white absolute -top-2 left-1/2 -translate-x-1/2" />
            <BookOpen className="w-10 h-10 md:w-14 md:h-14 text-white/90 absolute top-6 -left-4" />
            <HandHeart className="w-10 h-10 md:w-14 md:h-14 text-white/90 absolute top-6 -right-4" />
          </div>
        </div>

        {/* App Name */}
        <h1
          className={`text-5xl md:text-7xl font-extrabold text-white tracking-tight transition-all duration-500 ${
            stage === 'logo' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
          style={{
            textShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          EMEC
        </h1>

        {/* Tagline */}
        <p
          className={`mt-4 text-lg md:text-xl text-white/90 text-center max-w-md px-6 transition-all duration-500 delay-200 ${
            stage === 'tagline' || stage === 'fade'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          Empowering Health & Education for Children
        </p>

        {/* Icons Animation */}
        <div
          className={`flex gap-4 mt-8 transition-all duration-500 delay-300 ${
            stage === 'tagline' || stage === 'fade'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center animate-bounce-soft">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center animate-bounce-soft" style={{ animationDelay: '0.2s' }}>
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center animate-bounce-soft" style={{ animationDelay: '0.4s' }}>
            <HandHeart className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className={`absolute bottom-8 text-center text-white/70 text-sm transition-all duration-500 ${
          stage === 'tagline' || stage === 'fade' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p>© 2025 EMEC – All rights reserved</p>
        <p className="mt-1">Developed by Jacob Johnson & Barack Hussein, Mbita High School</p>
      </div>
    </div>
  );
}
