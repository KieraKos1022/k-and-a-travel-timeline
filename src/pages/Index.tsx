import { Hero } from "@/components/Hero";
import { Timeline } from "@/components/Timeline";
import { WorldMap } from "@/components/WorldMap";

// Sample travel data - replace with your actual travel history
const travelEntries = [
  {
    date: "January 2024",
    location: "Tokyo",
    country: "Japan",
    coordinates: [35.6762, 139.6503] as [number, number],
  },
  {
    date: "March 2024",
    location: "Paris",
    country: "France",
    coordinates: [48.8566, 2.3522] as [number, number],
  },
  {
    date: "June 2024",
    location: "Santorini",
    country: "Greece",
    coordinates: [36.3932, 25.4615] as [number, number],
  },
  {
    date: "September 2024",
    location: "New York City", 
    country: "United States",
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

        {/* Map Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <WorldMap locations={globeLocations} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;