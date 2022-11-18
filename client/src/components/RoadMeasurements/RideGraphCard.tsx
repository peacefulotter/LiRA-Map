import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
import {useEffect, useState} from "react";

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

export default function RideGraphCard() {
    const [ data, setData ] = useState<[number, number][]>([[0, 1], [1, 2], [2, 3]]);

    useEffect(() => {
        // get data
        const newData : [number, number] = [0, 34];
        setData(pData => [...pData, newData]);
    }, []);

    return (
        <Card sx={{ width: '50vw', position: 'absolute', bottom: '10px', right: '10px', zIndex: 2 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Graph of the Day
                </Typography>
                <Chart
                    type='bar'
                    data={{
                        labels: data.map(([x, _]) => x),
                        datasets: [
                            {
                                order: 1,
                                type: 'line' as const,
                                data: data.map(([_, y]) => y),
                                label: 'Measurement Type',
                                borderColor: 'rgba(253, 59, 59, 1)',
                                borderWidth: 3,
                                fill: false,
                            }
                        ]
                    }}
                    options={{
                        plugins: {
                            legend: {
                                position: 'top',
                                align: 'end',
                                labels: {
                                    usePointStyle: true
                                }
                            }
                        },
                        elements: {
                            line: {
                                tension: 0.4
                            }
                        }
                    }}
                    height={80}
                />
            </CardContent>
            <CardActions>
            </CardActions>
        </Card>
    );
}