import { FC, useEffect, useMemo, useRef } from "react";
import { ActiveElement, Chart, ChartData, ChartEvent, ChartOptions, ChartTypeRegistry, Plugin } from "chart.js";
import { Color, Palette } from "react-leaflet-hotline";
import { Line } from "react-chartjs-2";

import { ConditionType } from "../../models/graph";

const addPaletteChart = (palette: Palette) => (chart: Chart<keyof ChartTypeRegistry, number[], unknown>) => {
    const dataset = chart.data.datasets[0];
    const gradient = chart.ctx.createLinearGradient(0, 256, 0, 0);
    palette.forEach( (c: Color) => {
        gradient.addColorStop(c.t, `rgb(${c.r}, ${c.g}, ${c.b})`);
    })
    dataset.borderColor = gradient;
    dataset.backgroundColor = gradient;
}

const plugins = (palette: Palette): Plugin<'line'>[] => [ {
    id: 'id',
    beforeDatasetsUpdate: addPaletteChart(palette),
} ]

const options = (type: ConditionType): ChartOptions<'line'> => ({
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
                text: 'distance (m)' 
            },
            ticks: { 
                maxTicksLimit: 30,
                stepSize: 200, 
                callback: (tick: string | number) => Math.round(parseFloat(tick.toString())) 
            }
        },
        y: {
            title: { 
                display: true, 
                text: type.name
            },
            min: type.min,
            max: type.max
        }
    }
});

interface Props {
    type: ConditionType;
    data: ChartData<"line", number[], number> | undefined
    palette: Palette;
}

const ConditionsGraph: FC<Props> = ( { type, data, palette } ) => {

    const ref = useRef<Chart<"line", number[], number>>(null)

    useEffect( () => {
        if (ref.current === null ) return;
        const chart = ref.current;
        addPaletteChart(palette)(chart)
        chart.update()
    }, [ref, palette])

    // attach events to the graph options
    const graphOptions: ChartOptions<'line'> = useMemo( () => ({
        ...options(type),
        onClick: (event: ChartEvent, elts: ActiveElement[], chart: Chart<keyof ChartTypeRegistry, number[], unknown>) => {
            const elt = elts[0] // doesnt work if multiple datasets
            const pointIndex = elt.index
            console.log(event);
            console.log(elts);
        }
    }), [] )

    const graphPlugins = useMemo<Plugin<"line">[]>( () => plugins(palette), [palette] )

    return (
        <div className="ml-graph">
            { data && <Line
                ref={ref} 
                data={data} 
                options={graphOptions} 
                plugins={graphPlugins} />  
            }
        </div>
    )
}

export default ConditionsGraph;