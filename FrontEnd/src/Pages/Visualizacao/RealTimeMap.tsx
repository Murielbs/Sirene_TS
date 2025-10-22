import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

const CASA_FORTE_COORDS: [number, number] = [-8.0335, -34.9080];
const MAP_CONTAINER_STYLE = {
    width: '100%',
    height: '200px'
};

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Componente auxiliar que força o Leaflet a recalcular seu tamanho
const MapSizer = () => {
  const map = useMap();

  useEffect(() => {
    // Força o Leaflet a recalcular o layout quando o componente for montado
    map.invalidateSize(); 
  }, [map]);

  return null;
}

const RealTimeMap: React.FC = () => {
    return (
        <MapContainer
            center={CASA_FORTE_COORDS}
            zoom={15}
            scrollWheelZoom={false}
            style={MAP_CONTAINER_STYLE}
        >
            <MapSizer />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={CASA_FORTE_COORDS} icon={customIcon} />
        </MapContainer>
    );
};

export default RealTimeMap;
