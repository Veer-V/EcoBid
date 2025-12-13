import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import BackgroundPattern from './BackgroundPattern';

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Start animation
    setLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-slate-900">
      
      {/* Background with darker overlay for better contrast */}
      <div className="absolute inset-0 opacity-20">
        <BackgroundPattern theme="dark" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-eco-darkTeal/90 via-slate-900/90 to-black/90 z-0"></div>
      
      <div className={`relative z-10 flex flex-col items-center transform transition-all duration-1000 ease-out ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        
        {/* Glass Container for Logo */}
        <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl animate-float">
           <Logo variant="light" className="scale-125" />
        </div>
        
        {/* Refined Loading Indicator */}
        <div className="mt-12 flex flex-col items-center gap-4">
            <div className="w-56 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-eco-green to-eco-teal animate-[width_2.5s_ease-in-out_infinite] shadow-[0_0_15px_rgba(76,175,80,0.6)]" style={{width: '30%'}}></div>
            </div>
            <p className="text-gray-400 text-[10px] font-bold tracking-[0.3em] uppercase animate-pulse-slow">Initializing Secure Environment</p>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-white/10 text-[10px] tracking-[0.2em] z-10 font-medium">
        POWERED BY SUSTAINABLE TECH
      </div>
    </div>
  );
};

export default SplashScreen;