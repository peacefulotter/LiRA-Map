import { useState, FC } from 'react' 
import Chart from "react-apexcharts";


interface ChartPoint {
    x: number;
    y: number;
}

export type ChartData = ChartPoint[]

const useChart = ( ) => {
    const [series, setSeries] = useState<any[]>([])

    const addChartData = (dataName: string, data: ChartData) => { 
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

    
    return {
        addChartData, removeChartData,
        chart:
            <div className="chart-wrapper">
                <Chart 
                    options={options}
                    series={series}
                    type="line"
                    height={'100%'} />
            </div> 
            
            // <ResponsiveContainer className="chart-container" width="95%">
            //     <LineChart data={chartData} >
            //         <Tooltip />
            //         <Legend />
            //         <CartesianGrid strokeWidth="0.5" strokeDasharray="3 3"/>
            //         <XAxis dataKey={'x'} stroke="white"/>
            //         <YAxis stroke="white"/>
            //         { linesData.map( (dataName: string, i: number) => {
            //             const stroke = colors[i % colors.length]
            //             console.log(dataName);
            //             return <Line type="monotone" dataKey={dataName} stroke={stroke} key={`linechart-${i}`}/>
            //         })
            //         }
            //     </LineChart>
            // </ResponsiveContainer>
    }
}


export default useChart;       