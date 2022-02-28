import { FC, useEffect, useState } from 'react' 
import { default as ApexChart } from "react-apexcharts";
import { ChartData, ChartPoint } from '../../assets/models';

export type ChartAddFunc = (dataName: string, data: ChartData) => void
export type ChartRemFunc = (dataName: string) => void

interface Props {
    setAddChartData: React.Dispatch<React.SetStateAction<ChartAddFunc>>;
    setRemChartData: React.Dispatch<React.SetStateAction<ChartRemFunc>>;
}

const Chart: FC<Props> = ( { setAddChartData, setRemChartData } ) => {
    const [series, setSeries] = useState<any[]>([])


    const addChartData = (dataName: string, data: ChartData) => { 
        console.log('adding ' + dataName);
        
        const MAX_NB_POINTS = 5_000
        const threshold = Math.ceil(data.length / MAX_NB_POINTS)
        const chartData = data.filter((val: ChartPoint, i: number) => i % threshold === 0 )

        const updated = [...series]
        updated.push( { name: dataName, data: chartData } )
        setSeries( updated )
    }

    const removeChartData = (dataName: string) => {
        const updated = [...series].filter((p: any) => p.name !== dataName )        
        setSeries(updated)
    }

    useEffect( () => {
        console.log('before');
        
        setAddChartData(() => addChartData)
        setRemChartData(() => removeChartData)
        console.log('after');
        
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