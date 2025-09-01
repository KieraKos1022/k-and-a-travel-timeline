import { Hero } from "@/components/Hero";
import { Timeline } from "@/components/Timeline";

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
  {
    date: "January 18-May TBD, 2026",
    location: "Mexico City",
    country: "Mexico",
    coordinates: [19.4326, -99.1332] as [number, number],
    travelers: ["K", "A"],
  },
];


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      <main className="container mx-auto px-6 py-16">
        {/* Timeline */}
        <Timeline entries={travelEntries} />

        {/* How to reach us Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">How to reach us</h2>
            <div className="max-w-2xl mx-auto space-y-8">
              <div>
                <p className="text-xl text-muted-foreground mb-6">
                  For any packages, please send them to our package storage facility- we'll pick them up the next time we're in Houston!
                </p>
                <div className="bg-card p-6 rounded-lg border shadow-soft">
                  <p className="text-lg font-medium text-foreground">
                    Kiera Kosciolek<br />
                    VRO4109<br />
                    3426 Yale St.<br />
                    Houston, TX, 77018
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-xl text-muted-foreground mb-6">
                  For any snail mail, please send it to our travel mailbox.
                </p>
                <div className="bg-card p-6 rounded-lg border shadow-soft">
                  <p className="text-lg font-medium text-foreground">
                    Aadil Razvi & Kiera Kosciolek<br />
                    500 Westover Dr. #35887<br />
                    Sanford, NC 27330
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Index;