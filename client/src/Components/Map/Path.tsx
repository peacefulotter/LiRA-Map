import { FC } from "react";

import { PathProps, Renderer } from '../../assets/models'
import renderers from "../../assets/renderers";

const Path: FC<PathProps> = ( { path, properties } ) => {

    const Renderer = renderers[properties.renderer] as Renderer

    if ( path.data.length === 0 || Renderer === undefined ) 
         return <></>

    return <Renderer path={path} properties={properties} />
}

export default Path;
