import React, { useEffect, useRef, useState } from 'react';
import Leaflet from 'leaflet';
import mapImage from '../assets/map.jpg';
import 'leaflet/dist/leaflet.css';
import styles from './MapWidget.module.scss';
import type { PredefinedPoints, UserRoute } from '../../../features/routeBuilder/types/routeBuilderType';

// Моковые данные для предопределённых точек
// TODO: Замените эти данные на получение из RTK с помощью useAppSelector
const mockPredefinedPoints: PredefinedPoints[] = [
  {
    id: Date.now(),
    name: 'Shire',
    latitude: 756,
    longitude: 426,
    description: 'Мирные земли хоббитов',
  },
  {
    id: Date.now(),
    name: 'Rivendell',
    latitude: 776,
    longitude: 760,
    description: 'Эльфийский приют',
  },
  {
    id: Date.now(),
    name: 'Mordor',
    latitude: 290,
    longitude: 1110,
    description: 'Темная земля Саурона',
  },
];

const MAP_WIDTH = 1554;
const MAP_HEIGHT = 1093;

function MapWidget(): React.JSX.Element {
  // TODO: Замените useState на useAppSelector для получения userRoute, animating, result из RTK
  const [userRoute, setUserRoute] = useState<UserRoute[]>([]);
  const [animating, setAnimating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const mapRef = useRef<Leaflet.Map | null>(null);
  const frodoMarkerRef = useRef<Leaflet.Marker | null>(null);

  useEffect(() => {
    const map = Leaflet.map('map', {
      crs: Leaflet.CRS.Simple,
      minZoom: 0,
      maxZoom: 4,
      maxBounds: [
        [0, 0],
        [MAP_HEIGHT, MAP_WIDTH],
      ],
      maxBoundsViscosity: 1.0,
    });

    const bounds: Leaflet.LatLngBoundsExpression = [
      [0, 0],
      [MAP_HEIGHT, MAP_WIDTH],
    ];

    Leaflet.imageOverlay(mapImage, bounds).addTo(map);
    map.fitBounds(bounds);
    map.setView([MAP_HEIGHT / 2, MAP_WIDTH / 2], 0);

    mapRef.current = map;

    map.on('click', (e: Leaflet.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const target = e.originalEvent.target as HTMLElement;
      if (!target.className.includes('leaflet-marker')) {
        // TODO: Замените setUserRoute
        // Используйте RTK для добавления точки в маршрут
        setUserRoute((prev) => [
          ...prev,
          { name: `Точка ${(prev.length + 1).toString()}`, latitude: lat, longitude: lng },
        ]);
      }
    });

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    map.eachLayer((layer: Leaflet.Layer) => {
      if (layer instanceof Leaflet.Marker && layer.options.opacity === 0.5) {
        map.removeLayer(layer);
      }
    });

    mockPredefinedPoints.forEach((point: PredefinedPoints) => {
      Leaflet.marker([point.latitude, point.longitude], { opacity: 0.5 })
        .addTo(map)
        .bindPopup(`<b>${point.name}</b><br>${point.description ?? ''}`)
        .on('click', (e) => {
          (e.target as Leaflet.Marker).openPopup();
        });
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    map.eachLayer((layer: Leaflet.Layer) => {
      if (layer instanceof Leaflet.Marker && layer.options.opacity !== 0.5) {
        map.removeLayer(layer);
      }
      if (layer instanceof Leaflet.Polyline) {
        map.removeLayer(layer);
      }
    });

    userRoute.forEach((point: UserRoute, index: number) => {
      Leaflet.marker([point.latitude, point.longitude])
        .addTo(map)
        .bindPopup(`Точка ${(index + 1).toString()}`);
    });

    if (userRoute.length > 1) {
      const latlngs = userRoute.map(
        (p: UserRoute) => [p.latitude, p.longitude] as [number, number],
      );
      Leaflet.polyline(latlngs, { color: 'red' }).addTo(map);
    }
  }, [userRoute]);

  useEffect(() => {
    if (!animating || !mapRef.current || !result) return;

    const map = mapRef.current;

    if (frodoMarkerRef.current) {
      map.removeLayer(frodoMarkerRef.current);
    }

    frodoMarkerRef.current = Leaflet.marker([userRoute[0].latitude, userRoute[0].longitude], {
      icon: Leaflet.divIcon({ html: '🧝', className: '' }),
    }).addTo(map);

    let step = 0;
    const animateFrodo = (): void => {
      if (step >= userRoute.length - 1) {
        // TODO: Замените setAnimating
        setAnimating(false);
        return;
      }

      const start = userRoute[step];
      const end = userRoute[step + 1];
      const latStep = (end.latitude - start.latitude) / 20;
      const lngStep = (end.longitude - start.longitude) / 20;

      let i = 0;
      const move = (): void => {
        if (i >= 20) {
          step++;
          animateFrodo();
          return;
        }
        const newLat = start.latitude + latStep * i;
        const newLng = start.longitude + lngStep * i;
        frodoMarkerRef.current?.setLatLng([newLat, newLng]);
        i++;
        setTimeout(move, 100);
      };
      move();
    };

    animateFrodo();
  }, [animating, userRoute, result]);

  return <div id="map" className={styles.map} />;
}

export default MapWidget;
