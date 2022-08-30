import { FC } from "react";
import { Chart, ChartData, ChartOptions, ChartTypeRegistry, Plugin } from "chart.js";
import { Color, Palette } from "react-leaflet-hotline";
import { Line } from "react-chartjs-2";

import { ConditionType } from "../../models/graph";

const plugins = (palette: Palette): Plugin<'line'>[] => [
    {
        id: 'id',
        beforeDatasetsUpdate: (chart: Chart<keyof ChartTypeRegistry, number[], unknown>) => {
            console.log('beforeRender');
            const dataset = chart.data.datasets[0];
            const gradient = chart.ctx.createLinearGradient(0, 256, 0, 0);
            palette.forEach( (c: Color) => {
                gradient.addColorStop(c.t, `rgb(${c.r}, ${c.g}, ${c.b})`);
            })
            dataset.borderColor = gradient;
            dataset.backgroundColor = gradient;
        }
    }
]

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

    const onGraphClick = () => {
        console.log('graph click');
    }

    return (
        <div className="ml-graph">
            { data && <Line 
                onClick={onGraphClick}
                data={data} 
                options={options(type)} 
                plugins={plugins(palette)} />  
            }
        </div>
    )
}

export default ConditionsGraph;