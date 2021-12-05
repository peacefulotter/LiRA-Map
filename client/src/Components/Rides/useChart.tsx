import { useState, FC } from 'react' 
import Chart from "react-apexcharts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const colors = [
//     "#8884d8",
//     "#82ca9d"
// ]

interface ChartPoint {
    x: number;
    y: number;
}

export type ChartData = ChartPoint[]

const useChart = () => {
    const [series, setSeries] = useState<any[]>([])

    // const series = [
    //     {
    //         name: "series-1",
    //         data: [[1324508400000, 34], [1324594800000, 54] , [1326236400000, 43]]
    //     },
    //     {
    //         name: "series-2",
    //         data: [[1324508500000, 24],   [1324594899900, 74] , [1326236400000, 63]]
    //     }
    // ]

    const addFirstLine = (data: ChartData, dataName: string) => {
        setSeries([{
            name: dataName,
            data: data
        }])
    }

    const addChartData = (dataName: string, data: ChartData) => { 
        if ( series.length === 0 )
            addFirstLine(data, dataName)       
        
        else
        {
            const updated = [...series]
            updated.push( { name: dataName, data: data } )
            setSeries( updated )
        }
    }

    const removeChartData = (dataName: string) => {
        console.log("removing", dataName);
        
        const updated = [...series]
        updated.filter((p: any) => p.name !== dataName )
        setSeries(updated)
    }

    const options = {
        chart: {
            id: "basic-bar"
        },
        stroke: {
            width: 3,
            curve: "smooth" as any
        },
        xaxis: {
            type: 'datetime' as any,
            position: 'bottom',
            labels: {
                // formatter?(value: string, timestamp?: number, opts?:any): string | string[]
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