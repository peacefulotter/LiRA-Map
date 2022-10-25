import { FC, useEffect, useState } from "react";

import { getConnection } from "../../queries/connection";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingIcon from '@mui/icons-material/Pending';
import { green, yellow, red } from '@mui/material/colors'

const Connection: FC = () => {

    const [ connection, setConnection ] = useState<boolean | null>(null)

    useEffect(() => {
        const id = setInterval(() => getConnection(setConnection), 10000);

        return () => {
            clearInterval(id);
        };
    }, []);

    if (connection === true) return (
        <CheckCircleOutlineIcon sx={{ m: 1, color: green[500] }}>
        </CheckCircleOutlineIcon>
    )
    else if (connection === false) return (
        <ErrorOutlineIcon sx={{ m: 1, color: red[500] }}>
        </ErrorOutlineIcon>
    )
    else return (
        <PendingIcon sx={{ m: 1, color: yellow[500]}}>
        </PendingIcon>
    )
}

export default Connection;