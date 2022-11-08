// components
import {CarCrash, Landscape, RemoveRoad, SquareFoot, Dashboard} from "@mui/icons-material";

const navConfig = [
    {
      subheader: 'My Lira',
        items: [
            {title: 'User Dashboard', path: '/user/dashboard', icon: <Dashboard/>},
        ],
    },
    {
        subheader: 'roads',
        items: [
            {title: 'Road Measurement', path: '/road/measurement', icon: <SquareFoot/>},
            {title: 'Road Condition', path: '/road/condition', icon: <RemoveRoad/>},
            {title: 'Altitude', path: '/road/altitude', icon: <Landscape/>},
        ],
    },
    {
        subheader: 'cars',
        items: [
            {title: 'Car Data', path: '/car/data', icon: <CarCrash/>}
        ],
    },
];

export default navConfig;
