import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Problem } from '@/hooks/useProblems';

interface ProblemsMapProps {
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
}

export const ProblemsMap = ({ problems, onSelectProblem }: ProblemsMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN || '';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [9.5375, 33.8869], // Tunisia center coordinates
      zoom: 6,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Cleanup
    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for problems with coordinates
    problems.forEach(problem => {
      if (problem.location_lat && problem.location_lng) {
        const getDangerColor = (level: string) => {
          switch (level) {
            case 'high': return '#ef4444';
            case 'medium': return '#eab308';
            case 'low': return '#22c55e';
            default: return '#6b7280';
          }
        };

        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = getDangerColor(problem.danger_level);
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        el.style.cursor = 'pointer';
        el.style.transition = 'transform 0.2s';

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.2)';
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
        });

        // Create popup
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
        }).setHTML(`
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">${problem.title}</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${problem.location}</p>
            <p style="font-size: 12px; color: #666;">Cliquez pour voir les détails</p>
          </div>
        `);

        // Create marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([problem.location_lng, problem.location_lat])
          .setPopup(popup)
          .addTo(map.current!);

        // Add click event
        el.addEventListener('click', () => {
          onSelectProblem(problem);
        });

        markers.current.push(marker);
      }
    });

    // Fit bounds to show all markers if there are any
    if (problems.length > 0 && problems.some(p => p.location_lat && p.location_lng)) {
      const bounds = new mapboxgl.LngLatBounds();
      problems.forEach(problem => {
        if (problem.location_lat && problem.location_lng) {
          bounds.extend([problem.location_lng, problem.location_lat]);
        }
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 12 });
    }
  }, [problems, onSelectProblem]);

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border shadow-sm">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-card p-3 rounded-lg shadow-lg border">
        <h4 className="text-sm font-semibold mb-2 text-foreground">Niveau de danger</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
            <span className="text-xs text-muted-foreground">Faible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white"></div>
            <span className="text-xs text-muted-foreground">Modéré</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
            <span className="text-xs text-muted-foreground">Élevé</span>
          </div>
        </div>
      </div>
    </div>
  );
};
