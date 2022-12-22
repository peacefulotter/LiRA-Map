import { FC, useEffect } from 'react';

import { addLabelX, addLabelY } from '../../assets/graph/label';

import { SVG } from '../../assets/graph/types';
import { useGeneralGraphContext } from '../../context/GeneralGraphContext';

interface ILabels {
  svg: SVG;
  width: number;
  height: number;
  labelX: string;
  labelY: string;
}

const offsetX = 140;

const Labels: FC<ILabels> = ({ svg, width, height, labelX, labelY }) => {
  const { maxY } = useGeneralGraphContext();

  useEffect(() => {
    const labelW = Math.min(window.innerWidth - offsetX, width);

    const _labelX = addLabelX(svg, labelW, height, labelX);
    const _labelY = addLabelY(svg, height, labelY);

    return () => {
      _labelX.remove();
      _labelY.remove();
    };
  }, [svg, width, height, maxY, labelX, labelY]);

  return null;
};

export default Labels;
