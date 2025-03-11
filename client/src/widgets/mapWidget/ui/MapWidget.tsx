import React, { useEffect, useRef } from 'react';

import type { RootState } from '../../../app/store';
import {
  addPointToRoute,
  stopAnimation,
} from '../../../features/routeBuilder/model/routeBuilderSlice';
import Leaflet from 'leaflet';
import mapImage from '../assets/map.jpg';
import 'leaflet/dist/leaflet.css';
import type { PredefinedPoints, UserRoute } from '../../../features/routeBuilder/types/routeBuilderType';
import { getPredefinedPoints } from '../../../features/routeBuilder/lib/routeBuilderThunks';
import styles from './MapWidget.module.scss';
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks"

const MAP_WIDTH = 1554;
const MAP_HEIGHT = 1093;

function MapWidget(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { predefinedPoints, userRoute, result, animating } = useAppSelector(
    (state: RootState) => state.points,
  );
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
        dispatch(
          addPointToRoute({
            // id: Date.now(),
            name: `Точка ${(userRoute.length + 1).toString()}`,
            latitude: lat,
            longitude: lng,
          }),
        );
      }
    });

    void dispatch(getPredefinedPoints());

    return () => {
      map.remove();
    };
  }, [dispatch, userRoute.length]);

  // Обновление предопределенных маркеров
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    map.eachLayer((layer: Leaflet.Layer) => {
      if (layer instanceof Leaflet.Marker && layer.options.opacity === 0.5) {
        map.removeLayer(layer);
      }
    });

    predefinedPoints.forEach((point: PredefinedPoints) => {
      Leaflet.marker([point.latitude, point.longitude], { opacity: 0.5 })
        .addTo(map)
        .bindPopup(`<b>${point.name}</b><br>${point.description ?? ''}`)
        .on('click', (e) => {
          (e.target as Leaflet.Marker).openPopup();
        });
    });
  }, [predefinedPoints]);

  // Обновление пользовательского маршрута
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

  // Анимация Фродо
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
        dispatch(stopAnimation());
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
  }, [animating, userRoute, result, dispatch]);

  return <div id="map" className={styles.map} />;
}

export default MapWidget;
