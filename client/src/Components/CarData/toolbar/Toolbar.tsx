import { FC, useEffect, useState } from "react";
import { useSegment } from "../../../context/SegmentContext";

import '../../../css/toolbar.css'


export interface IToolbar {
    Icon: any;
    isSegment: boolean
}

const Toolbar: FC<IToolbar> = ( { children, Icon, isSegment }  ) => {

    const { segment } = useSegment()
    const [show, setShow] = useState<boolean>(true)

    const toggleShow = () => setShow( prev => !prev )

    useEffect( () => {
        setShow(isSegment || show)
    }, [segment] )

    return (
        <div className='toolbar-container'>
            <Icon onClick={toggleShow} className="filter-button" />
            <div className="seg-popup-wrapper">
                { show ? children : null }
            </div>
        </div>
    )
}


export default Toolbar;