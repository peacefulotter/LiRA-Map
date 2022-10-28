import Typography from "@mui/material/Typography";
import {FormGroup, Switch} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const Settings = () => {

    return (
        <div>
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
        </div>
    );
}

const languages = [
    { label: 'Danish', id: 1 },
    { label: 'English', id: 2 },
];

export default Settings;