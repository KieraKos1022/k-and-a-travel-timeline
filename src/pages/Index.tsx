import { Hero } from "@/components/Hero";
import { Timeline } from "@/components/Timeline";
import { WorldMap } from "@/components/WorldMap";

// Sample travel data - replace with your actual travel history
const travelEntries = [
  {
    date: "January 2025 -May 2025",
    location: "Mexico City",
    country: "Mexico",
    coordinates: [35.6762, 139.6503] as [number, number],
  },
  {
    date: "May 2025",
    location: "Houston",
    country: "Texas",
    coordinates: [48.8566, 2.3522] as [number, number],
  },
  {
    date: "June 2025-July 2025",
    location: "La Jolla",
    country: "California",
    coordinates: [36.3932, 25.4615] as [number, number],
  },
  {
    date: "July 2025-August 2025",
    location: "Buenos Aires", 
    country: "Argentina",
    coordinates: [40.7128, -74.0060] as [number, number],
    isCurrent: true,
  },
    {
    date: "August 2025",
    location: "Montevideo", 
    country: "Uruguay",
    coordinates: [40.7128, -74.0060] as [number, number],
    isCurrent: true,
  },
    {
    date: "August 26- August 29, 2025",
    location: "Houston", 
    country: "Texas",
    coordinates: [40.7128, -74.0060] as [number, number],
    isCurrent: true,
  },
    {
    date: "August 29-31, 2025",
    location: "Brooklyn", 
    country: "New York",
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