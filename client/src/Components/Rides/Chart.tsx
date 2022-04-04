import { FC, useEffect, useState } from 'react' 
import { default as ApexChart } from "react-apexcharts";
import { useChartCtx } from '../../context/ChartContext';
import { ChartData } from '../../models/chart';
import { Path, PointData } from '../../models/path';


const Chart: FC = () => {

    const { setAddChartData, setRemChartData } = useChartCtx()

    const [series, setSeries] = useState<any[]>([])


    const addChartData = (dataName: string, data: Path, minTime?: number) => { 
        console.log('adding ' + dataName);

        const MAX_NB_POINTS = 5_000
        const threshold = Math.ceil(data.length / MAX_NB_POINTS)
        const chartData: ChartData = data
            .filter((point: PointData, i: number) => i % threshold === 0 && point.metadata )
            .map( (point: PointData) => { 
                return { 
                    x: point.metadata.timestamp as number - (minTime || 0), 
                    y: point.value as number || 0
                } 
            } )

        const updated = [...series]
        updated.push( { name: dataName, data: chartData } )
        setSeries( updated )
    }

    const removeChartData = (dataName: string) => {
        const updated = [...series].filter((p: any) => p.name !== dataName )        
        setSeries(updated)
    }

    useEffect( () => {
        console.log('chart before');
        setAddChartData(() => addChartData)
        setRemChartData(() => removeChartData)
        console.log('chart after');
    }, [])

    const options = {
        chart: {
            id: "basic-bar",
            animations: {
                enabled: false,
            }
        },
        stroke: {
            width: 3,
            curve: "smooth" as any
        },
        toolTip: {
            shared: true
        },
        xaxis: {
            type: 'number' as any,
            position: 'bottom',
            tickAmount: 10,
            labels: {
                formatter: (value: string, timestamp?: number, opts?:any) => {
                    const date = new Date(Math.round(Number.parseFloat(value)))
                    const time = date.getHours() + "h" + date.getMinutes();
                    return time;
                }
            }
        },
        theme: {
            mode: 'dark' as any, 
            palette: 'palette1' as any
        }
    }

    
    return (
        <div className="chart-wrapper">
            <ApexChart 
                options={options}
                series={series}
                type="line"
                height={'100%'} />
        </div> 
    )
}


export default Chart;      