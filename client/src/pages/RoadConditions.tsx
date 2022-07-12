import  { useEffect, useRef, useState } from "react";
import { Color, Palette } from "react-leaflet-hotline";

import { RENDERER_PALETTE } from "../Components/Map/constants";
import PaletteEditor from "../Components/Palette/PaletteEditor";
import MapWrapper from "../Components/Map/MapWrapper";
import Ways from "../Components/RoadCondition/Ways";
import Graph from "../Components/Graph/Graph";

import { Bounds, Condition } from "../models/path";

import { getConditions } from "../queries/conditions";

import { GraphProvider } from "../context/GraphContext";

import { GraphData, Plot } from "../assets/graph/types";

import "../css/road_conditions.css";
import { Chart, Line } from "react-chartjs-2";
import { ChartOptions, ChartTypeRegistry, Plugin, ScatterDataPoint } from "chart.js";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { AnyObject } from "chart.js/types/basic";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



const RoadConditions = () => {
    
    const [palette, setPalette] = useState<Palette>([])
    const [plot, setPlot] = useState<Plot>()

    const ref = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState<number>()

    const type = {
        name: 'IRI',
        min: 0,
        max: 10,
        grid: true,
        samples: 40
    }

    const onClick = (way_id: string, way_length: number) => {
        getConditions(way_id, type.name, (wc: Condition[]) => {
            const bounds: Bounds = {
                minX: 0,
                maxX: way_length,
                minY: type.min,
                maxY: type.max,
            }
            const data: GraphData = wc.map( p => [p.way_dist * way_length, p.value] )
            const label = way_id
            console.log('received');
            setPlot( { bounds, data, label } )
        })
    }

    useEffect( () => {
        if ( ref.current === null ) return;
        const { width: w } = ref.current.getBoundingClientRect()
        setWidth(w)
    }, [ref])

    const data = plot && {
        labels: plot.data.map( (p) => p[0] ),
        datasets: [
            {
                type: 'line' as const,
                label: 'RC1',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                data: plot.data.map( p => p[1] ),
                
            }
        ]
    }

    const plugins: Plugin<'line'>[] = [
        {
            id: 'id',
            start: (chart: ChartJS<keyof ChartTypeRegistry, number[], unknown>) => {
                const dataset = chart.data.datasets[0];
                const gradient = chart.ctx.createLinearGradient(0, 256, 0, 0);
                palette.forEach( (c: Color) => {
                    gradient.addColorStop(c.t, `rgb(${c.r}, ${c.g}, ${c.b})`);
                })
                dataset.borderColor = gradient;
                dataset.backgroundColor = gradient;
                console.log('beforeRender');
                chart.draw()
            }
        }
    ]

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
          },
         
        },
        scales: {
            x: {
                ticks: { 
                    maxTicksLimit: 30,
                    stepSize: 200, 
                    callback: (tick: string | number) => '$' + Math.round(parseFloat(tick.toString())) 
                }
            }
            // x: {
            //     ticks: {
            //         callback: (tick: number) => Math.round(tick) // (Number(tick) % 10 === 0 ? tick : null) // Replace null with "" to show gridline
            //     }
            // }
        }
      };

    // const options: ChartOptions<'line'> = { 
    //     scales: {
    //         x: {
    //             // type: 'time',
    //             ticks: {
    //                 source: 'labels', // get ticks from given labels
    //             },
    //             // time: {
    //             //     minUnit: 'minute', // smallest time format
    //             //     displayFormats: {
    //             //         minute: "HH:mm",
    //             //         hour: "dd/MM HH:mm",
    //             //         day: "dd/MM",
    //             //         week: "dd/MM",
    //             //         month: "MMMM yyyy",
    //             //         quarter: 'MMMM yyyy',
    //             //         year: "yyyy",
    //             //     }
    //             // }
    //         },
    //     },
    // }

    const onGraphClick = () => {
        console.log('graph click');
    }

    return (
        <GraphProvider>
        <div className="ml-wrapper">
            <div className="ml-map" ref={ref}>
                <PaletteEditor 
                    defaultPalette={RENDERER_PALETTE}
                    width={width}
                    cursorOptions={{scale: type.max, grid: type.grid, samples: type.samples}}
                    onChange={setPalette} />

                <MapWrapper>
                    <Ways palette={palette} type={type.name} onClick={onClick}/>
                </MapWrapper>
            </div>

            <div className="ml-graph">
                { data && <Line options={options} plugins={plugins} data={data} />  }
                
                {/* <Graph 
                    labelX="distance (m)" 
                    labelY="IRI"
                    palette={palette}
                    plots={plot ? [plot] : []}
                /> */}
            </div>
        </div>

        </GraphProvider> 
    );
}

export default RoadConditions;