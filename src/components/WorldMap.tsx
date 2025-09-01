import { MapPin } from "lucide-react";

interface Location {
  name: string;
  coordinates: [number, number];
  isCurrent?: boolean;
}

interface WorldMapProps {
  locations: Location[];
}

export const WorldMap = ({ locations }: WorldMapProps) => {
  // Convert lat/lng to SVG coordinates (simplified projection)
  const projectCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return { x, y };
  };

  return (
    <div className="w-full bg-gradient-to-b from-background to-muted rounded-lg shadow-elevation overflow-hidden">
      <div className="relative">
        <svg 
          viewBox="0 0 800 400" 
          className="w-full h-[500px]"
          style={{ background: 'linear-gradient(to bottom, #87CEEB, #4682B4)' }}
        >
          {/* Simplified world map continents */}
          <g fill="#228B22" stroke="#1e5128" strokeWidth="1">
            {/* North America */}
            <path d="M 80 120 L 180 100 L 220 130 L 200 180 L 120 170 Z" />
            <path d="M 100 180 L 160 175 L 180 200 L 140 220 L 100 210 Z" />
            
            {/* South America */}
            <path d="M 180 220 L 200 210 L 220 240 L 210 300 L 190 320 L 170 300 L 175 250 Z" />
            
            {/* Europe */}
            <path d="M 380 110 L 420 105 L 430 125 L 410 140 L 385 135 Z" />
            
            {/* Africa */}
            <path d="M 400 150 L 450 145 L 470 180 L 460 250 L 430 260 L 410 230 L 405 180 Z" />
            
            {/* Asia */}
            <path d="M 450 100 L 650 90 L 680 130 L 650 160 L 500 150 L 460 120 Z" />
            <path d="M 500 160 L 620 155 L 640 190 L 580 200 L 510 195 Z" />
            
            {/* Australia */}
            <path d="M 620 260 L 680 255 L 690 280 L 670 295 L 625 290 Z" />
          </g>
          
          {/* Location markers */}
          {locations.map((location, index) => {
            const { x, y } = projectCoordinates(location.coordinates[0], location.coordinates[1]);
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r={location.isCurrent ? "8" : "6"}
                  fill={location.isCurrent ? "hsl(220, 100%, 30%)" : "hsl(260, 60%, 25%)"}
                  stroke="white"
                  strokeWidth="2"
                  className={location.isCurrent ? "animate-pulse" : ""}
                />
                <text
                  x={x}
                  y={y - 15}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="600"
                  className="drop-shadow-lg"
                >
                  {location.name}
                </text>
                {location.isCurrent && (
                  <text
                    x={x}
                    y={y + 25}
                    textAnchor="middle"
                    fill="hsl(220, 100%, 30%)"
                    fontSize="10"
                    fontWeight="600"
                    className="drop-shadow"
                  >
                    Current
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};