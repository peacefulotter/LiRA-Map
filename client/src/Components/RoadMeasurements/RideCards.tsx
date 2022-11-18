import React, { FC, ReactNode, useEffect, useState } from 'react';
import { List, ListRowRenderer } from 'react-virtualized';
import Checkbox from '../Checkbox';

import { RideMeta, TripsOptions } from '../../models/models';

import '../../css/ridecard.css';
import { useMetasCtx } from '../../context/MetasContext';
import OptionsSelector from './OptionsSelector';

interface CardsProps {
  showMetas: SelectMeta[];
  onClick: (meta: SelectMeta, i: number, isChecked: boolean) => void;
}

const Cards: FC<CardsProps> = ({ showMetas, onClick }) => {
  const renderRow: ListRowRenderer = ({ index, key, style }): ReactNode => {
    const meta = showMetas[index];
    return (
      <div key={key} style={style}>
        <Checkbox
          forceState={meta.selected}
          className="ride-card-container"
          html={
            <div>
              <b>{meta.TaskId}</b>
              <br></br>
              {new Date(meta.StartTimeUtc).toLocaleDateString()}
            </div>
          }
          onClick={(isChecked) => {
            onClick(meta, index, isChecked);
          }}
        />
      </div>
    );
  };

  return (
    <List
      width={170}
      height={2500}
      rowHeight={61}
      rowRenderer={renderRow}
      rowCount={showMetas.length}
    />
  );
};

interface SelectMeta extends RideMeta {
  selected: boolean;
}

const RideCards: FC = () => {
  const { metas, selectedMetas, setSelectedMetas } = useMetasCtx();
  const [showMetas, setShowMetas] = useState<SelectMeta[]>([]);
  const [isNight, setIsNight] = useState<boolean>(false);

  useEffect(() => {
    const temp = metas
      .filter((meta: RideMeta) => {
        const startTime = new Date(meta.StartTimeUtc).getHours();
        const endTime = new Date(meta.EndTimeUtc).getHours();
        if (
          (startTime >= 20 && endTime <= 6) ||
          (startTime >= 20 && endTime <= 0) ||
          (startTime >= 0 && endTime <= 6)
        ) {
          return isNight;
        }
        return !isNight;
      })
      .map((meta: RideMeta) => {
        const selected =
          selectedMetas.find(({ TripId }) => meta.TripId === TripId) !==
          undefined;
        return { ...meta, selected };
      });
    setShowMetas(temp);
  }, [isNight]);

  useEffect(() => {
    setShowMetas(metas.map((m) => ({ ...m, selected: false })));
  }, [metas]);

  const onChange = (tripOptions: TripsOptions) => {
    const temp: SelectMeta[] = metas
      .filter((meta: RideMeta) => {
        if (tripOptions.taskId.length === 0) {
          return true;
        }
        return meta.TaskId.toString().includes(tripOptions.taskId);
      })
      .filter((meta: RideMeta) => {
        if (!tripOptions.distanceKm) {
          return true;
        }
        const minimumDistance = Number(tripOptions.distanceKm);
        if (isNaN(minimumDistance)) {
          return true;
        }
        return meta.DistanceKm > minimumDistance;
      })

      .map((meta: RideMeta) => {
        const selected =
          selectedMetas.find(({ TripId }) => meta.TripId === TripId) !==
          undefined;
        return { ...meta, selected };
      });
    setShowMetas(tripOptions.reversed ? temp.reverse() : temp);
  };

  const onClick = (md: SelectMeta, i: number, isChecked: boolean) => {
    const temp = [...showMetas];
    temp[i].selected = isChecked;
    setShowMetas(temp);

    return isChecked
      ? setSelectedMetas((prev) => [...prev, md])
      : setSelectedMetas((prev) =>
          prev.filter(({ TripId }) => md.TripId !== TripId),
        );
  };

  return (
    <div className="ride-list">
      <OptionsSelector onChange={onChange} />
      <Checkbox
        className="ride-sort-cb"
        html={<div>Night mode {isNight ? 'On' : 'Off'}</div>}
        onClick={setIsNight}
      />
      <Cards showMetas={showMetas} onClick={onClick} />
    </div>
  );
};

export default RideCards;
