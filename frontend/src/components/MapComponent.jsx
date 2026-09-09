import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Create custom colored SVG pin icons
const createCustomIcon = (color, emoji) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        <span style="transform: rotate(45deg); font-size: 16px; user-select: none;">${emoji}</span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
};

const farmerIcon = createCustomIcon('#16a34a', '🌾');
const collectionIcon = createCustomIcon('#2563eb', '📦');
const marketIcon = createCustomIcon('#dc2626', '🏬');
const vehicleIcon = createCustomIcon('#d97706', '🚛');

function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 12);
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapComponent({
  center = [11.0168, 76.9558], // Coimbatore default
  zoom = 11,
  markers = [], // [{ id, lat, lng, type: 'farmer'|'collection'|'market'|'vehicle', title, description, details }]
  routeCoordinates = [], // [[lat, lng], [lat, lng]]
  height = '400px',
  onMarkerClick = null,
}) {
  const getIcon = (type) => {
    switch (type) {
      case 'farmer':
        return farmerIcon;
      case 'collection':
      case 'collection_point':
        return collectionIcon;
      case 'market':
      case 'buyer':
        return marketIcon;
      case 'vehicle':
        return vehicleIcon;
      default:
        return collectionIcon;
    }
  };

  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden', zIndex: 1 }} className="map-container-wrapper">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapRecenter center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Polylines for routes */}
        {routeCoordinates && routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color="#2563eb"
            weight={4}
            opacity={0.8}
            dashArray="2, 6"
          />
        )}

        {/* Markers */}
        {markers.map((m, idx) => {
          if (!m.lat || !m.lng) return null;
          return (
            <Marker
              key={m.id || idx}
              position={[m.lat, m.lng]}
              icon={getIcon(m.type)}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(m),
              }}
            >
              <Popup>
                <div style={{ padding: '4px', maxWidth: '220px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
                    {m.title}
                  </div>
                  {m.description && (
                    <div style={{ fontSize: '12px', color: '#4b5563', marginBottom: '4px' }}>
                      {m.description}
                    </div>
                  )}
                  {m.details && (
                    <div style={{ fontSize: '11px', color: '#6b7280', borderTop: '1px solid #e5e7eb', paddingTop: '4px' }}>
                      {m.details}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
