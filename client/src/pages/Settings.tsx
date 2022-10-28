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

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

const Settings = () => {
    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
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

                        <Typography variant="overline" display="block">First Name</Typography>
                        <TextField id="outlined-basic" label="" variant="outlined" />

                        <Typography variant="overline" display="block">Last Name</Typography>
                        <TextField id="outlined-basic" label="" variant="outlined" />

                        <Typography variant="overline" display="block">Email</Typography>
                        <TextField id="outlined-basic" label="" variant="outlined" />

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

                        <Typography>Language selector</Typography>
                        <Autocomplete
                            disablePortal
                            id="combo-box-lang"
                            options={languages}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="" />}
                        />
                        <Typography>Theme switch</Typography>
                        <FormGroup>
                            <FormControlLabel
                                control={<MaterialUISwitch sx={{ m: 1 }} checked={checked} onChange={() => setChecked((prev) => !prev)}/>}
                                label={`${checked? 'Dark mode':'Light mode'}`}
                            />
                        </FormGroup>
                    </Stack>
                </TabPanel>
            </TabContext>
        </Box>
    );
}

export default Settings;