import { Hero } from "@/components/Hero";
import { Timeline } from "@/components/Timeline";

// Function to parse date ranges and check if current date falls within them
const isCurrentLocation = (dateString: string): boolean => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
  const currentYear = now.getFullYear();
  const currentDay = now.getDate();

  // Handle different date formats
  if (dateString.includes("TBD")) {
    // For TBD dates, we can't determine if they're current
    return false;
  }

  // Parse various date formats
  try {
    // Handle ranges like "September 2-7, 2025" or "August 26- August 29, 2025"
    if (dateString.includes("-") && !dateString.includes("TBD")) {
      const parts = dateString.split("-");
      if (parts.length >= 2) {
        const startPart = parts[0].trim();
        const endPart = parts[1].trim();
        
        // Extract start date
        let startMonth, startDay, startYear;
        if (startPart.includes(",")) {
          const startSegments = startPart.split(" ");
          startMonth = getMonthNumber(startSegments[0]);
          startDay = parseInt(startSegments[1]);
          startYear = parseInt(startSegments[2].replace(",", ""));
        } else {
          const startSegments = startPart.split(" ");
          startMonth = getMonthNumber(startSegments[0]);
          startDay = startSegments[1] ? parseInt(startSegments[1]) : 1;
          startYear = currentYear; // Assume current year if not specified
        }
        
        // Extract end date
        let endMonth, endDay, endYear;
        if (endPart.includes(",")) {
          const endSegments = endPart.split(" ");
          if (endSegments.length >= 3) {
            endMonth = getMonthNumber(endSegments[0]);
            endDay = parseInt(endSegments[1].replace(",", ""));
            endYear = parseInt(endSegments[2]);
          } else {
            endDay = parseInt(endSegments[0].replace(",", ""));
            endMonth = startMonth;
            endYear = parseInt(endSegments[1]);
          }
        } else {
          const endSegments = endPart.split(" ");
          if (endSegments.length >= 2) {
            endMonth = getMonthNumber(endSegments[0]);
            endDay = endSegments[1] ? parseInt(endSegments[1]) : 31;
            endYear = currentYear;
          } else {
            endDay = parseInt(endSegments[0]);
            endMonth = startMonth;
            endYear = startYear;
          }
        }
        
        // Create date objects for comparison
        const startDate = new Date(startYear, startMonth - 1, startDay);
        const endDate = new Date(endYear, endMonth - 1, endDay);
        
        return now >= startDate && now <= endDate;
      }
    }
    
    // Handle single months like "May 2025"
    const monthMatch = dateString.match(/(\w+)\s+(\d{4})/);
    if (monthMatch) {
      const month = getMonthNumber(monthMatch[1]);
      const year = parseInt(monthMatch[2]);
      
      return currentMonth === month && currentYear === year;
    }
    
  } catch (error) {
    console.error("Error parsing date:", dateString, error);
  }
  
  return false;
};

// Helper function to convert month names to numbers
const getMonthNumber = (monthName: string): number => {
  const months = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
  };
  return months[monthName.toLowerCase() as keyof typeof months] || 1;
};

// Sample travel data - replace with your actual travel history
const baseTravelEntries = [
  {
    date: "January 2025-May 2025",
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
    date: "August 26-August 29, 2025",
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
    date: "September 21-October 7, 2025",
    location: "Mexico City",
    country: "Mexico",
    coordinates: [19.4326, -99.1332] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "October 9-October 19, 2025",
    location: "Chicago",
    country: "Illinois",
    coordinates: [41.8781, -87.6298] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "October 21-November 23, 2025",
    location: "Mexico City",
    country: "Mexico",
    coordinates: [19.4326, -99.1332] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "November 23-December 12, 2025",
    location: "Houston",
    country: "Texas",
    coordinates: [29.7604, -95.3698] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "December 12-December 30, 2025",
    location: "La Jolla",
    country: "California",
    coordinates: [32.8328, -117.2713] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "December 30, 2025-January 2, 2026",
    location: "Three Rivers",
    country: "California",
    coordinates: [36.4388, -118.9048] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "January 3-January 13, 2026",
    location: "Austin",
    country: "Texas",
    coordinates: [30.2672, -97.7431] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "January 13-January 18, 2026",
    location: "College Station/Houston",
    country: "Texas",
    coordinates: [30.6280, -96.3344] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "January 18-May 25, 2026",
    location: "Mexico City",
    country: "Mexico",
    coordinates: [19.4326, -99.1332] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "January 23-January 25, 2026",
    location: "Moon River Ranch",
    country: "Texas",
    coordinates: [29.9511, -98.7307] as [number, number],
    travelers: ["K", "A"],
  },
  {
    date: "Early June 2026",
    location: "London",
    country: "England",
    coordinates: [51.5074, -0.1278] as [number, number],
    travelers: ["K", "A"],
  },
];

// Add dynamic current location detection
const travelEntries = baseTravelEntries.map(entry => ({
  ...entry,
  isCurrent: isCurrentLocation(entry.date)
}));


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      <main className="container mx-auto px-6 py-4">
        {/* Timeline */}
        <Timeline entries={travelEntries} />

        {/* How to reach us Section */}
        <section className="mb-20 mt-16">
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