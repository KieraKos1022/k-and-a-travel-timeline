export const Hero = () => {
  return (
    <section className="relative min-h-[40vh] flex items-center justify-center bg-background overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-secondary/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <div className="text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight animate-fade-in">
          Where They At?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
          ✈️ Follow the adventure ✨
        </p>
      </div>
    </section>
  );
};