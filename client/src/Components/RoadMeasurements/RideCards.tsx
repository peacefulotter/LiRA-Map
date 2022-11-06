import React, { FC, useEffect, useState, ReactNode, useCallback } from 'react';
import { List, ListRowRenderer } from 'react-virtualized';
import { RiDeleteBack2Line } from 'react-icons/ri';

import Checkbox from '../Checkbox';

import { RideMeta, TripsOptions } from '../../models/models';

import '../../css/ridecard.css';
import { useMetasCtx } from '../../context/MetasContext';
import OptionsSelector from './OptionsSelector';
import { CgTemplate } from 'react-icons/cg';
import { filteredData } from './SearchFilterOptions';

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
              {new Date(meta.Created_Date).toLocaleDateString()}
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
  //console.log('🇩🇰', useMetasCtx());
  const [showMetas, setShowMetas] = useState<SelectMeta[]>([]);

  useEffect(() => {
    setShowMetas(metas.map((m) => ({ ...m, selected: false })));
  }, [metas]);

  const onChange = (
    { taskId, postalCode, distanceKm, startCity, endCity, startDate, endDate, reversed }: TripsOptions,



    key: keyof TripsOptions,
  ) => {
    const updatedMetas = metas;
    const temp: SelectMeta[] = updatedMetas
      .filter((meta: RideMeta) => {
        let inSearch;
        console.log('key', key);
        if (key.includes('distanceKm')) {
          const searchedValue = Number(taskId);
          if (isNaN(searchedValue)) {
            inSearch = taskId === '' || meta.TaskId.toString().includes(taskId);
          } else {
            inSearch = meta.DistanceKm > searchedValue;
          }
        } else {
          inSearch = taskId === '' || meta.TaskId.toString().includes(taskId);
        }
        const date = new Date(meta.Created_Date).getTime();
        const inDate = date >= startDate.getTime() && date <= endDate.getTime();
        //filteredData(metas, selectedMetas);
        return inSearch && inDate;
      })
      .map((meta: RideMeta) => {
        const selected =
          selectedMetas.find(({ TripId }) => meta.TripId === TripId) !==
          undefined;
        //console.log('🇩🇰', { ...meta, selected });
        return { ...meta, selected };
      });
    setShowMetas(reversed ? temp.reverse() : temp);
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
      <Cards showMetas={showMetas} onClick={onClick} />
    </div>
  );
};

export default RideCards;
