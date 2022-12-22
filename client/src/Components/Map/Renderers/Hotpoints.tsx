import L from 'leaflet';
import { useEffect } from 'react';

import { IRenderer } from '../../../models/renderers';

import useCanvas from '../Hooks/useCanvas';

import { formatEventHandlers, getColorOnPalette } from '../utils';
import { useGeneralGraphContext } from '../../../context/GeneralGraphContext';

function Hotcircles<T>({
  data,
  getLat,
  getLng,
  getVal,
  options,
  eventHandlers,
}: IRenderer<T>) {
  const { width, weight, opacity, palette } = options;

  const [map, canvas] = useCanvas();
  const { minY, maxY } = useGeneralGraphContext();

  useEffect(() => {
    const circles = data.map((t: T, i: number) => {
      const mappedValue: number =
        ((getVal(t, i) || -9999) - (minY || 0)) / ((maxY || 1) - (minY || 0));

      const circle = L.circle([getLat(t, i), getLng(t, i)], {
        renderer: canvas,
        radius: width,
        color: getColorOnPalette(palette, mappedValue),
        weight: weight,
        opacity: opacity,
      });

      circle.on(formatEventHandlers(eventHandlers, i));

      circle.addTo(map);

      return circle;
    });

    return () => {
      circles.forEach((c) => c.remove());
    };
  }, [canvas, map, minY, maxY, data, options]);

  return null;
}

export default Hotcircles;
