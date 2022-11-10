import React, { FC, RefObject, useRef } from 'react';
import { FiMinus, FiPlus, FiRotateCcw, FiDownload } from 'react-icons/fi';
import { CSVLink } from 'react-csv';
import Link from 'react-csv/components/Link';

const zoomGap = 0.5;

interface IGraphButtons {
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setCSV: string[][];
  labelY: string;
}

const GraphButtons: FC<IGraphButtons> = ({ setZoom, setCSV, labelY }) => {
  const zoomIn = () => setZoom((z) => z + zoomGap);
  const zoomOut = () => setZoom((z) => Math.max(1, z - zoomGap));
  const resetZoom = () => setZoom(1);
  const myRef = useRef(null);
  const handleClick = () => {
    if (myRef.current != null) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      myRef.current.link.click();
    }
  };

  return (
    <div className="zoom-btns">
      <div className="btn zoom-btn" onClick={zoomIn}>
        <FiPlus />
      </div>
      <div className="btn zoom-btn" onClick={zoomOut}>
        <FiMinus />
      </div>
      <div className="btn zoom-btn" onClick={resetZoom}>
        <FiRotateCcw />
      </div>
      <div className="btn zoom-btn" onClick={handleClick}>
        <FiDownload />
      </div>
      <CSVLink
        data={setCSV}
        key={`${name}`}
        filename={labelY + '.csv'}
        className="hidden"
        ref={myRef}
        hidden
        aria-hidden={true}
      >
        Download
      </CSVLink>
    </div>
  );
};

export default GraphButtons;
