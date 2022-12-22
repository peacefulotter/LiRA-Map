/** @author Benjamin Lumbye s204428 */

import { useEffect, useState } from 'react';

const useSize = (ref: React.MutableRefObject<null>): [number, number] => {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (!ref.current) return;

    const updateSize = () => {
      const { width, height } = (ref.current as any).getBoundingClientRect();
      setWidth(width);
      setHeight(height);
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref.current]);

  return [width, height];
};

export default useSize;
