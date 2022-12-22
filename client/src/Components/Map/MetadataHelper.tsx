/** @author: Mads Westermann s174508 */

import React, { FC, useEffect } from 'react';

import { useMap } from 'react-leaflet';
import { useMetasCtx } from '../../context/MetasContext';

interface IMetadataHelper {
  boundLats: number[];
  boundLngs: number[];
}

const MetadataHelper: FC<IMetadataHelper> = ({ boundLats, boundLngs }) => {
  const { focusedMeta, setFocusedMeta } = useMetasCtx();
  const map = useMap();

  useEffect(() => {
    if (focusedMeta === 0) {
      const lat0 = Math.min(...boundLats);
      const lat1 = Math.max(...boundLats);
      const lng0 = Math.min(...boundLngs);
      const lng1 = Math.max(...boundLngs);
      const zoom = map.getBoundsZoom([
        [lat0, lng0],
        [lat1, lng1],
      ]);
      map.setView([(lat0 + lat1) / 2, (lng0 + lng1) / 2], zoom);

      setFocusedMeta(-1);
    }
  }, [focusedMeta]);

  return <></>;
};

export default MetadataHelper;
