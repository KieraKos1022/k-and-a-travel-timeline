import { Globe, Heart, MapPin } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero"></div>
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 animate-bounce delay-100">
          <MapPin className="w-6 h-6 text-white/30" />
        </div>
        <div className="absolute top-40 right-20 animate-bounce delay-300">
          <Globe className="w-8 h-8 text-white/25" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-bounce delay-500">
          <Heart className="w-5 h-5 text-white/35" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Globe className="w-12 h-12 mr-4 animate-pulse" />
          <Heart className="w-8 h-8 text-secondary animate-pulse delay-100" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Our Journey
          <span className="block text-3xl md:text-4xl font-light text-white/90 mt-2">
            Around the World
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed max-w-2xl mx-auto">
          Follow our adventure as we explore the globe together, creating memories one destination at a time.
        </p>
        
        <div className="flex items-center justify-center space-x-8 text-white/70">
          <div className="text-center">
            <MapPin className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Multiple Countries</span>
          </div>
          <div className="text-center">
            <Heart className="w-6 h-6 mx-auto mb-2 text-secondary" />
            <span className="text-sm font-medium">Endless Adventures</span>
          </div>
          <div className="text-center">
            <Globe className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Global Exploration</span>
          </div>
        </div>
      </div>
    </section>
  );
};