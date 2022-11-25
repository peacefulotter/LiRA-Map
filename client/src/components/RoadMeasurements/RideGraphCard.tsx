import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

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

export interface IRideGraphCard {
    type?: string;
    data?: [Date, number][];
}

const RideGraphCard: React.FC<IRideGraphCard> = ({ type, data }): JSX.Element | null => {

    const date_format = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit', fractionalSecondDigits: 3,
    });

    return (
        (type && data && data.length > 0) ? (
            <Card sx={{ width: '50vw', position: 'absolute', bottom: '10px', right: '10px', zIndex: 2 }}>
                <CardContent>
                    <Chart
                        type='line'
                        data={{
                            datasets: [
                                {
                                    order: 1,
                                    type: 'line' as const,
                                    data: data.map(value => [date_format.format(value[0]), value[1]]),
                                    label: type,
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
                            scales: {
                                x: {
                                    ticks: {
                                        maxTicksLimit: 10
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
        ) : null
    );
}

export default RideGraphCard;