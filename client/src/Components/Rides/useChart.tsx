import { useState } from 'react' 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const colors = [
    "#8884d8",
    "#82ca9d"
]

const useChart = () => {
    const [chartData, setChartData] = useState<{[key: string]: number}[]>([])
    const [linesData, setLinesData] = useState<string[]>([])

    const addChartData = (data: number[], dataName: string) => {
        console.log(dataName, data);
        const updateLines = [...linesData]
        updateLines.push(dataName)
        setLinesData(updateLines)

        const updatedChart = chartData.length > 0 
            ? chartData.map( (d, i) => { return { ...d, [dataName]: data[i] } } )
            : data.map( (d, i) => { return { [dataName]: data[i] }  } )
        setChartData( updatedChart )

        console.log(updatedChart)
    }

    const removeChartData = (dataName: string) => {

    }

    
    return {
        addChartData, removeChartData,
        chart: 
            <ResponsiveContainer className="chart-container" width="95%">
                <LineChart data={chartData} >
                    <Tooltip />
                    <Legend />
                    <CartesianGrid strokeWidth="0.5" strokeDasharray="3 3"/>
                    {/* <XAxis dataKey="xaxis" stroke="white"/> */}
                    <YAxis stroke="white"/>
                    { linesData.map( (dataName: string, i: number) => {
                        const stroke = colors[i % colors.length]
                        console.log(dataName);
                        return <Line type="monotone" dataKey={dataName} stroke={stroke} key={`linechart-${i}`}/>
                    })
                    }
                </LineChart>
            </ResponsiveContainer>
    }
}


export default useChart;       