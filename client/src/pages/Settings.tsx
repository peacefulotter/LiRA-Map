import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {Typography} from "@mui/material";
import {FormGroup, Switch} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const languages = [
    { label: 'Danish', id: 1 },
    { label: 'English', id: 2 },
];

const Settings = () => {
    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Item One" value="1" />
                        <Tab label="Item Two" value="2" />
                        <Tab label="Item Three" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Typography>
                        Language selector:
                    </Typography>
                    <FormGroup>
                        <FormControlLabel control={<Switch defaultChecked />} label="Label" />
                        <FormControlLabel disabled control={<Switch />} label="Disabled" />
                    </FormGroup>
                    <Typography>
                        Some other selector lmao
                    </Typography>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={languages}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Language" />}
                    />
                </TabPanel>
                <TabPanel value="2">Item Two</TabPanel>
                <TabPanel value="3">Item Three</TabPanel>
            </TabContext>
        </Box>
    );
}

export default Settings;