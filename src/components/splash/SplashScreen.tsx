import { useEffect, useState } from 'react';
import { Heart, BookOpen, HandHeart, Shield, Stethoscope, GraduationCap } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [stage, setStage] = useState<'logo' | 'tagline' | 'features' | 'fade'>('logo');

  useEffect(() => {
    // OPTIMIZED: Ultra-fast splash - 800ms total
    const timer1 = setTimeout(() => setStage('tagline'), 150);
    const timer2 = setTimeout(() => setStage('features'), 350);
    const timer3 = setTimeout(() => setStage('fade'), 600);
    const timer4 = setTimeout(() => onComplete(), 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-700 ${
        stage === 'fade' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, hsl(174, 42%, 51%) 0%, hsl(165, 50%, 45%) 40%, hsl(45, 100%, 64%) 100%)',
      }}
    >
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-white/10 animate-pulse-soft" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5 animate-float" />
        <div className="absolute top-1/4 right-10 w-20 h-20 rounded-full bg-white/10 animate-bounce-soft" />
      </div>

      {/* Logo Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Main Logo */}
        <div
          className={`relative w-36 h-36 md:w-44 md:h-44 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 transition-all duration-700 ${
            stage !== 'logo' ? 'animate-logo-pop' : ''
          }`}
          style={{
            boxShadow: '0 25px 80px rgba(0,0,0,0.25), inset 0 0 30px rgba(255,255,255,0.1)',
          }}
        >
          {/* Logo Icons Composition */}
          <div className="relative w-20 h-20 md:w-24 md:h-24">
            <Heart 
              className="w-10 h-10 md:w-12 md:h-12 text-white fill-white absolute top-0 left-1/2 -translate-x-1/2 drop-shadow-lg" 
            />
            <Stethoscope 
              className="w-8 h-8 md:w-10 md:h-10 text-white/90 absolute bottom-0 left-0 drop-shadow-md" 
            />
            <GraduationCap 
              className="w-8 h-8 md:w-10 md:h-10 text-white/90 absolute bottom-0 right-0 drop-shadow-md" 
            />
          </div>
          
          {/* Glowing Ring */}
          <div className="absolute inset-0 rounded-3xl border-2 border-white/30 animate-pulse-soft" />
        </div>

        {/* App Name */}
        <h1
          className={`text-6xl md:text-8xl font-black text-white tracking-tighter transition-all duration-500 ${
            stage === 'logo' ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
          }`}
          style={{
            textShadow: '0 6px 30px rgba(0,0,0,0.3)',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          EMEC
        </h1>

        {/* Full Name */}
        <p
          className={`mt-2 text-sm md:text-base text-white/70 font-medium tracking-widest uppercase transition-all duration-500 delay-100 ${
            stage === 'logo' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Electronic Medical & Education Companion
        </p>

        {/* Tagline */}
        <p
          className={`mt-6 text-xl md:text-2xl text-white text-center max-w-md px-6 font-semibold transition-all duration-500 delay-200 ${
            stage === 'tagline' || stage === 'features' || stage === 'fade'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
        >
          Your Health. Your Records. Your Control.
        </p>

        {/* Feature Icons */}
        <div
          className={`flex gap-5 mt-8 transition-all duration-500 delay-300 ${
            stage === 'features' || stage === 'fade'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          {[
            { icon: Heart, label: 'Health' },
            { icon: Shield, label: 'Security' },
            { icon: BookOpen, label: 'Education' },
            { icon: HandHeart, label: 'Care' },
          ].map((item, i) => (
            <div 
              key={item.label}
              className="flex flex-col items-center gap-1 animate-bounce-soft"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <item.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <span className="text-[10px] md:text-xs text-white/70 font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Demo Badge */}
        <div
          className={`mt-8 px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm transition-all duration-500 delay-500 ${
            stage === 'features' || stage === 'fade'
              ? 'opacity-100'
              : 'opacity-0'
          }`}
        >
          <span className="text-sm font-medium text-white">
            ✨ Demo Mode – Works Offline
          </span>
        </div>
      </div>

      {/* Footer */}
      <div
        className={`absolute bottom-6 md:bottom-8 text-center text-white/60 text-xs md:text-sm transition-all duration-500 ${
          stage === 'features' || stage === 'fade' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="font-medium">© 2025 EMEC – All rights reserved</p>
        <p className="mt-1">Developed by Jacob Johnson & Barack Hussein</p>
        <p className="text-white/40">Mbita High School, Kenya</p>
      </div>

      {/* Loading Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-[800ms] ease-out"
          style={{ width: stage === 'logo' ? '0%' : stage === 'tagline' ? '33%' : stage === 'features' ? '66%' : '100%' }}
        />
      </div>
    </div>
  );
}
