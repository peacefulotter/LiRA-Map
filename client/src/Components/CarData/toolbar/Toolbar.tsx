import { FC, useState } from "react";

import '../../../css/toolbar.css'


export interface IToolbar {
    Icon: any;
}

const Toolbar: FC<IToolbar> = ( props ) => {

    const { children, Icon } = props;

    console.log(children, Icon);
    

    const [show, setShow] = useState<boolean>(true)

    const toggleShow = () => setShow( prev => !prev )

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