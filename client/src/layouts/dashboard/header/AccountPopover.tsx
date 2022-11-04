import {useState} from 'react';
// @mui
import {alpha} from '@mui/material/styles';
import {Avatar, Box, Divider, MenuItem, Typography} from '@mui/material';
// components
import MenuPopover from '../../../components/MenuPopover';
import {IconButtonAnimate} from '../../../components/animate';
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {Link} from "react-router-dom";

// ----------------------------------------------------------------------

// const MENU_OPTIONS = [
//     {
//         label: 'Home',
//         linkTo: '/',
//     },
//     {
//         label: 'Profile',
//         linkTo: '/',
//     },
//     {
//         label: 'Settings',
//         linkTo: '/',
//     },
// ];

// ----------------------------------------------------------------------

export default function AccountPopover() {
    const [open, setOpen] = useState<HTMLElement | null>(null);

    const { userData, userCredentials } = useSelector(
        (state: RootState) => state.access
    )

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    return (
        <>
            <IconButtonAnimate
                onClick={handleOpen}
                sx={{
                    p: 0,
                    ...(open && {
                        '&:before': {
                            zIndex: 1,
                            content: "''",
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            position: 'absolute',
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                        },
                    }),
                }}
            >
                <Avatar
                    alt="User"
                />
            </IconButtonAnimate>

            <MenuPopover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                sx={{
                    p: 0,
                    mt: 1.5,
                    ml: 0.75,
                    '& .MuiMenuItem-root': {
                        typography: 'body2',
                        borderRadius: 0.75,
                    },
                }}
            >
                <Box sx={{my: 1.5, px: 2.5}}>
                    <Typography variant="subtitle2" noWrap>
                        {userData?.firstName} {userData?.lastName}
                    </Typography>
                    <Typography variant="body2" sx={{color: 'text.secondary'}}>
                        {userCredentials?.user?.email}
                    </Typography>
                </Box>

                {/*<Divider sx={{ borderStyle: 'dashed' }} />*/}

                {/*<Stack sx={{ p: 1 }}>*/}
                {/*  {MENU_OPTIONS.map((option) => (*/}
                {/*    <MenuItem key={option.label} onClick={() => handleNavigate(option.linkTo)}>*/}
                {/*      {option.label}*/}
                {/*    </MenuItem>*/}
                {/*  ))}*/}
                {/*</Stack>*/}

                <Divider sx={{borderStyle: 'dashed'}}/>

                <MenuItem
                    component={Link}
                    to="/user/settings"
                    sx={{m: 1}}
                >Settings</MenuItem>
                <MenuItem sx={{m: 1}}>Logout</MenuItem>
            </MenuPopover>
        </>
    );
}
