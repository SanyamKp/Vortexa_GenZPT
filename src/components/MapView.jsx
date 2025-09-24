import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';

const HeatmapLayer = ({ reports }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || reports.length === 0) return;

    const points = reports.map(r => [r.lat, r.lon, r.confidence]);

    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 18,
      gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'}
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, reports]);

  return null;
};

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapView({ reports, onMarkerClick, selectedReportId }) {
  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <HeatmapLayer reports={reports} />
      {reports.map((report) => (
        <Marker 
          position={[report.lat, report.lon]} 
          key={report.id}
          eventHandlers={{
            click: () => onMarkerClick(report.id),
          }}
        >
          <Popup>
            <div className="popup-content">
              <img src={report.heatmap_url} alt="Heatmap" />
              <strong>{report.disease}</strong><br />
              Confidence: {(report.confidence * 100).toFixed(0)}%
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;