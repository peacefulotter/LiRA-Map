import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ChartData,
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ActiveElement,
  ChartEvent,
  ChartOptions,
  ChartTypeRegistry,
  Plugin,
} from 'chart.js';
import { Color, Palette } from 'react-leaflet-hotline';
import { Line } from 'react-chartjs-2';

import { ConditionType } from '../../models/graph';
import { CSVLink } from 'react-csv';
import { FiDownload } from 'react-icons/fi';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const options = ({ name, min, max }: ConditionType): ChartOptions<'line'> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { color: 'white' },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'distance (m)',
      },
      ticks: {
        maxTicksLimit: 30,
        stepSize: 200,
        callback: (tick: string | number) =>
          Math.round(parseFloat(tick.toString())),
      },
    },
    y: {
      title: {
        display: true,
        text: name,
      },
      min: min,
      max: max,
    },
  },
});

interface Props {
  type: ConditionType;
  data: ChartData<'line', number[], number> | undefined;
  palette: Palette;
}

const ConditionsGraph: FC<Props> = ({ type, data, palette }) => {
  const ref = useRef<Chart<'line', number[], number>>(null);

  /** @author Matteo Hoffmann s222952, Lucien Kiven Tamo s184448 */

  const csvData: string[][] = [['distance[m]', type.name]];
  const myRef = useRef(null);
  const handleClick = () => {
    if (myRef.current != undefined) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      myRef.current.link.click();
    }
  };

  /** @author Matteo Hoffmann s222952, Lucien Kiven Tamo s184448 */
  const csvDataFunction = () => {
    if (data != undefined) {
      if (data.datasets != undefined && data.labels != undefined) {
        for (let i = 0; i < data.datasets[0].data.length; i++) {
          csvData.push([
            data.labels[i].toString(),
            data.datasets[0].data[i].toString(),
          ]);
        }
      }
    }

    return csvData;
  };
  const addPaletteChart =
    (palette: Palette) =>
    (chart: Chart<keyof ChartTypeRegistry, number[], unknown>) => {
      const dataset = chart.data.datasets[0];
      const gradient = chart.ctx.createLinearGradient(
        0,
        chart.chartArea.bottom,
        0,
        0,
      );
      palette.forEach((c: Color) => {
        console.log('color', c);
        gradient.addColorStop(c.t, `rgb(${c.r}, ${c.g}, ${c.b})`);
      });
      dataset.borderColor = gradient;
      dataset.backgroundColor = gradient;
    };

  useEffect(() => {
    if (ref.current === null) return;
    const chart = ref.current;
    addPaletteChart(palette)(chart);
    chart.update();
    csvDataFunction();
  }, [ref, data, palette]);

  // attach events to the graph options
  const graphOptions: ChartOptions<'line'> = useMemo(
    () => ({
      ...options(type),
      onClick: (
        event: ChartEvent,
        elts: ActiveElement[],
        chart: Chart<keyof ChartTypeRegistry, number[], unknown>,
      ) => {
        if (elts.length === 0) return;
        const elt = elts[0]; // doesnt work if multiple datasets
        const pointIndex = elt.index;
        console.log(pointIndex, event, elts);
      },
    }),
    [],
  );

  const plugins: Plugin<'line'>[] = [
    {
      id: 'id',
    },
  ];

  return (
    <div>
      {data && (
        <div className="road-conditions-graph">
          <Line
            className="road-conditions-graph-margin"
            ref={ref}
            data={data}
            options={graphOptions}
            plugins={plugins}
          ></Line>
          <div className="csv-btns">
            {/** @author Matteo Hoffmann s222952, Lucien Kiven Tamo s184448 */}
            <div className="btn csv-btn">
              <FiDownload onClick={handleClick} />
            </div>
            <CSVLink
              data={csvDataFunction()}
              className="hidden"
              hidden
              aria-hidden={true}
              ref={myRef}
              filename={type.name + '.csv'}
            >
              Download me!
            </CSVLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConditionsGraph;
