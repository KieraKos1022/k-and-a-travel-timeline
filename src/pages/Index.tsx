import { Hero } from "@/components/Hero";
import { Timeline } from "@/components/Timeline";
import { InteractiveGlobe } from "@/components/InteractiveGlobe";

// Sample travel data - replace with your actual travel history
const travelEntries = [
  {
    date: "January 2024",
    location: "Tokyo",
    country: "Japan",
    description: "Exploring the vibrant culture, incredible food, and modern architecture of Japan's capital city.",
    coordinates: [35.6762, 139.6503] as [number, number],
  },
  {
    date: "March 2024",
    location: "Paris",
    country: "France",
    description: "Strolling through charming neighborhoods, visiting world-class museums, and enjoying exquisite cuisine.",
    coordinates: [48.8566, 2.3522] as [number, number],
  },
  {
    date: "June 2024",
    location: "Santorini",
    country: "Greece",
    description: "Watching breathtaking sunsets, exploring ancient ruins, and relaxing by the beautiful Aegean Sea.",
    coordinates: [36.3932, 25.4615] as [number, number],
  },
  {
    date: "September 2024",
    location: "New York City", 
    country: "United States",
    description: "Currently exploring the city that never sleeps, from Broadway shows to Central Park walks.",
    coordinates: [40.7128, -74.0060] as [number, number],
    isCurrent: true,
  },
];

// Convert travel entries to globe locations
const globeLocations = travelEntries.map(entry => ({
  name: entry.location,
  coordinates: entry.coordinates,
  isCurrent: entry.isCurrent,
}));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      <main className="container mx-auto px-6 py-16">
        {/* Timeline Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Travel Timeline</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A chronological journey through the amazing places we've visited together
            </p>
          </div>
          <Timeline entries={travelEntries} />
        </section>

        {/* Globe Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Interactive Globe</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our journey on this interactive 3D globe. Click and drag to rotate, scroll to zoom!
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <InteractiveGlobe locations={globeLocations} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;