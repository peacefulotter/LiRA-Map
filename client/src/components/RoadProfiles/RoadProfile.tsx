import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import TabContext from '@mui/lab/TabContext';
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import CheckboxList from "./CheckboxList";
import Graph from "./Graph";
import {useEffect} from "react";

export default function RoadProfile(props) {

    const {roadId,openRoadProfile,setOpenRoadProfile} = props;

    const [checked, setChecked] = React.useState([0]);

    const [value, setValue] = React.useState('1');
    const checkedList = React.useState([0]);
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    function printArray(list) {
        return list.map((list) => <li>{list}</li>);
    }

    useEffect ( () => {

    }, [])


    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography variant="h5">Road Name</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <Button variant="outlined">ADD TO LIST</Button>

                        <CheckboxList
                            setChecked = {setChecked}
                            checked = {checked}
                        >
                        </CheckboxList>
                    </Grid>
                    <Grid item xs={5}>
                        <TabContext value={value}>
                            <TabList onChange={handleChange}>
                                <Tab label="Condition" value="1" />
                                <Tab label="Energy" value="2" />
                                <Tab label="Friction" value="3" />
                                <Tab label="Aviation" value="4" />
                            </TabList>
                            <TabPanel value="1">
                                <div> {printArray(checkedList)} </div>
                                <Graph

                                ></Graph>
                            </TabPanel>
                            <TabPanel value="2">
                                <Graph></Graph>
                            </TabPanel>
                            <TabPanel value="3">
                                <div> {printArray(checkedList)} </div>
                                <Graph></Graph>
                            </TabPanel>
                            <TabPanel value="4">
                                <Graph></Graph>
                            </TabPanel>
                        </TabContext>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}