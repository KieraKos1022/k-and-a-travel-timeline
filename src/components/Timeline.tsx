import { MapPin, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TimelineEntry {
  date: string;
  location: string;
  country: string;
  coordinates: [number, number];
  isCurrent?: boolean;
  travelers?: string[];
}

interface TimelineProps {
  entries: TimelineEntry[];
}

export const Timeline = ({ entries }: TimelineProps) => {
  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="absolute left-8 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent"></div>
      
      <div className="space-y-8">
        {entries.map((entry, index) => (
          <div
            key={index}
            data-current={entry.isCurrent ? "true" : undefined}
            className={`relative flex items-center ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            } flex-col md:space-x-8`}
          >
            {/* Timeline dot */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 -translate-y-1 z-10">
              <div className={`w-4 h-4 rounded-full border-4 border-background shadow-soft ${
                entry.isCurrent 
                  ? 'bg-gradient-to-r from-primary to-secondary animate-pulse' 
                  : 'bg-gradient-to-r from-secondary to-accent'
              }`}></div>
            </div>

            {/* Content card */}
            <Card className={`flex-1 p-6 max-w-md mx-auto md:mx-0 ml-16 md:ml-0 shadow-elevation hover:shadow-soft transition-all duration-300 hover:scale-105 ${
              entry.isCurrent ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20' : ''
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">{entry.date}</span>
                {entry.isCurrent && (
                  <span className="px-2 py-1 text-xs bg-gradient-to-r from-primary to-secondary text-white rounded-full">
                    Current
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-secondary" />
                <h3 className="text-lg font-semibold text-foreground">{entry.location}</h3>
              </div>
              
              <p className="text-sm text-muted-foreground font-medium">{entry.country}</p>
              
              {entry.travelers && (
                <div className="flex gap-2 mt-3">
                  {entry.travelers.map((traveler, idx) => (
                    <div key={idx} className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">{traveler}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Spacer for alternating layout */}
            <div className="hidden md:block flex-1"></div>
          </div>
        ))}
      </div>
    </div>
  );
};