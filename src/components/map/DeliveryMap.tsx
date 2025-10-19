import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DeliveryMapProps {
  customerLat: number;
  customerLng: number;
  driverLat?: number;
  driverLng?: number;
  storeLat?: number;
  storeLng?: number;
}

const customerIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNSIgY3k9IjE1IiByPSIxMCIgZmlsbD0iIzBFQTVFOSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const driverIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNSIgY3k9IjE1IiByPSIxMCIgZmlsbD0iIzEwQjk4MSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const storeIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI1IiB5PSI1IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiNGNTlFMEIiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIvPjwvc3ZnPg==',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

export function DeliveryMap({
  customerLat,
  customerLng,
  driverLat,
  driverLng,
  storeLat,
  storeLng,
}: DeliveryMapProps) {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (mapRef.current && driverLat && driverLng) {
      const bounds = L.latLngBounds([
        [customerLat, customerLng],
        [driverLat, driverLng],
      ]);

      if (storeLat && storeLng) {
        bounds.extend([storeLat, storeLng]);
      }

      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [customerLat, customerLng, driverLat, driverLng, storeLat, storeLng]);

  const center: [number, number] = [customerLat, customerLng];
  const route: [number, number][] = [];

  if (storeLat && storeLng) {
    route.push([storeLat, storeLng]);
  }
  if (driverLat && driverLng) {
    route.push([driverLat, driverLng]);
  }
  route.push([customerLat, customerLng]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[customerLat, customerLng]} icon={customerIcon}>
        <Popup>Your Location</Popup>
      </Marker>

      {driverLat && driverLng && (
        <Marker position={[driverLat, driverLng]} icon={driverIcon}>
          <Popup>Driver Location</Popup>
        </Marker>
      )}

      {storeLat && storeLng && (
        <Marker position={[storeLat, storeLng]} icon={storeIcon}>
          <Popup>Store Location</Popup>
        </Marker>
      )}

      {route.length > 1 && (
        <Polyline positions={route} color="#0EA5E9" weight={4} opacity={0.7} />
      )}
    </MapContainer>
  );
}
