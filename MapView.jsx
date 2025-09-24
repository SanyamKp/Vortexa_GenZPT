import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';

// Fix for default marker icon issue with Create React App
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// A helper component to manage the heatmap layer
const HeatmapLayer = ({ points }) => {
  const map = useMap();
  const heatLayerRef = useRef(null);

  useEffect(() => {
    if (points && points.length > 0) {
      // Format points for leaflet.heat: [lat, lng, intensity]
      const heatPoints = points.map(p => [p.lat, p.lon, 0.8]); 
      
      if (heatLayerRef.current) {
        // If layer exists, just update the data
        heatLayerRef.current.setLatLngs(heatPoints);
      } else {
        // Otherwise, create a new layer and add it to the map
        heatLayerRef.current = L.heatLayer(heatPoints, { radius: 25 }).addTo(map);
      }
    }
    
    // Cleanup function: remove the layer when the component is unmounted
    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [points, map]);

  return null; // This component does not render any visible JSX
};

// The main MapView component
export default function MapView({ reports, viewMode }) {
  const center = [20.5937, 78.9629]; // Center of India

  return (
    <MapContainer center={center} zoom={5} style={{ height: '600px', width: '100%' }} className="rounded-lg">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {viewMode === 'points' ? (
        // If viewMode is 'points', render individual markers with popups
        reports.map(report => (
          <Marker position={[report.lat, report.lon]} key={report.id}>
            <Popup>
              <strong>Disease:</strong> {report.disease.replace(/_/g, ' ')} <br />
              <strong>Confidence:</strong> {(report.confidence * 100).toFixed(1)}% <br />
              <strong>Risk:</strong> {report.risk_level}
            </Popup>
          </Marker>
        ))
      ) : (
        // If viewMode is not 'points', render the heatmap
        <HeatmapLayer points={reports} />
      )}
    </MapContainer>
  );
}