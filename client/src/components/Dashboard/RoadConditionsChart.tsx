import React from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController
);

function generate(min: number, max: number) {
    return Math.random() * (max - min + 1) + min;
}

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'];

export const data = {
    labels: labels,
    datasets: [
        {
            order: 2,
            type: 'bar' as const,
            data: labels.map(() => generate(10, 100)),
            label: 'Metric A',
            backgroundColor: 'rgba(83, 136, 216, 0.6)',
            borderWidth: 2
        },
        {
            order: 1,
            type: 'line' as const,
            data: labels.map(() => generate(5, 100)),
            label: 'Metric B',
            borderColor: 'rgba(253, 59, 59, 1)',
            borderWidth: 3,
            fill: false,
            lineTension: 0.4
        }
    ]
};


export default function RoadConditionsChart() {
    return (
    <Chart
        type='bar'
        data={data}
        options={{
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true
                    }
                }
            }
        }}
        height={80}
    />);
}