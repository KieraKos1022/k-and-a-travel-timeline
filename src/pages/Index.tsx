import { Hero } from "@/components/Hero";
import { Timeline } from "@/components/Timeline";
import { WorldMap } from "@/components/WorldMap";

// Sample travel data - replace with your actual travel history
const travelEntries = [
  {
    date: "January 2025 -May 2025",
    location: "Mexico City",
    country: "Mexico",
    coordinates: [19.4326, -99.1332] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "May 2025",
    location: "Houston",
    country: "Texas",
    coordinates: [29.7604, -95.3698] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "June 2025-July 2025",
    location: "La Jolla",
    country: "California",
    coordinates: [32.8328, -117.2713] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "July 2025-August 2025",
    location: "Buenos Aires", 
    country: "Argentina",
    coordinates: [-34.6118, -58.3960] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "August 2025",
    location: "Montevideo", 
    country: "Uruguay",
    coordinates: [-34.9011, -56.1645] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "August 26- August 29, 2025",
    location: "Houston", 
    country: "Texas",
    coordinates: [29.7604, -95.3698] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "August 29-31, 2025",
    location: "Brooklyn", 
    country: "New York",
    coordinates: [40.6782, -73.9442] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "September 2-7, 2025",
    location: "Yellowstone", 
    country: "Montana",
    coordinates: [44.4280, -110.5885] as [number, number],
    travelers: ["K", "A"],
    isCurrent: true,
  },
  {
    date: "September 9-18, 2025",
    location: "La Jolla",
    country: "California", 
    coordinates: [32.8328, -117.2713] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "September 18-20, 2025",
    location: "Chicago",
    country: "Illinois",
    coordinates: [41.8781, -87.6298] as [number, number],
    travelers: ["K"],
  },
  {
    date: "September 21-October 5, 2025",
    location: "Mexico City",
    country: "Mexico",
    coordinates: [19.4326, -99.1332] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "October 5-November 23, 2025",
    location: "Mexico City",
    country: "Mexico",
    coordinates: [19.4326, -99.1332] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "November 5-November 12, 2025",
    location: "Krakow",
    country: "Poland",
    coordinates: [50.0647, 19.9450] as [number, number],
    travelers: ["K"],
  },
  {
    date: "November 23-December 10, 2025",
    location: "Houston",
    country: "Texas",
    coordinates: [29.7604, -95.3698] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "December 10-December 30, 2025",
    location: "La Jolla",
    country: "California",
    coordinates: [32.8328, -117.2713] as [number, number],
    travelers: ["K", "A"],
  },
];

// Convert travel entries to globe locations
const globeLocations = travelEntries.map(entry => ({
  name: entry.location,
  coordinates: entry.coordinates,
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