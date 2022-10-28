import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {Typography, FormGroup} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {MaterialUISwitch} from '../components/MaterialUISwitch';
import {useSelector} from "react-redux";
import {RootState} from "../store";
import useSettings from "../hooks/useSettings";
import SettingsMode from '../components/settings/drawer/SettingMode'

const languages = [
    { label: 'Danish', id: 1 },
    { label: 'English', id: 2 },
];

const Settings = () => {
    // Theme Switch
    const { themeMode, onChangeMode } = useSettings();

    const isDark = themeMode === 'dark';

    // Tab Context
    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    // User information
    const { userData, userCredentials } = useSelector((state: RootState) => state.access)

    return (
        <Box sx={{ width: '100%', margin: '5px', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange}>
                        <Tab label="Profile" value="1" />
                        <Tab label="Account" value="2" />
                        <Tab label="Personalization" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Stack spacing={2} alignItems="start">
                        <Typography variant="h5">General Info</Typography>

                        <TextField id="outlined-basic" label="First Name" defaultValue={userData?.firstName} variant="outlined" />

                        <Typography variant="overline" display="block">Last Name</Typography>
                        <TextField id="outlined-basic" label="" defaultValue={userData?.lastName} variant="outlined" />

                        <Typography variant="overline" display="block">Email</Typography>
                        <TextField id="outlined-basic" label="" defaultValue={userCredentials?.user?.email} variant="outlined" />

                        <Button variant="contained">Save Information</Button>
                    </Stack>
                </TabPanel>
                <TabPanel value="2">
                    <Stack spacing={2} alignItems="start">
                        <Typography variant="h5">Change Password</Typography>

                        <Typography variant="overline" display="block">Old Password</Typography>
                        <TextField id="outlined-basic" label="" variant="outlined" />

                        <Typography variant="overline" display="block">New Password</Typography>
                        <TextField id="outlined-basic" label="" variant="outlined" />

                        <Typography variant="overline" display="block">Confirm Password</Typography>
                        <TextField id="outlined-basic" label="" variant="outlined" />

                        <Button variant="contained">Confirm</Button>
                    </Stack>
                </TabPanel>
                <TabPanel value="3">
                    <Stack spacing={2} alignItems="start">
                        <Typography variant="h5">Preferences</Typography>

                        <Typography variant="overline" display="block">Language selector</Typography>
                        <Autocomplete
                            disablePortal
                            id="combo-box-lang"
                            options={languages}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="" />}
                        />
                        <Typography variant="overline" display="block">Theme switch</Typography>
                        <FormGroup>
                            <FormControlLabel
                                control={<MaterialUISwitch sx={{ m: 1 }} checked={isDark} onChange={() => onChangeMode}/>}
                                label={`${isDark ? 'Dark mode' : 'Light mode'}`}
                            />
                        </FormGroup>
                        <SettingsMode></SettingsMode>
                    </Stack>
                </TabPanel>
            </TabContext>
        </Box>
    );
}

export default Settings;