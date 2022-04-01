import { FC } from "react";

import renderers from "../../assets/renderers";
import { PathProps } from "../../models/path";
import { Renderer } from "../../models/renderers";

const Path: FC<PathProps> = ( { dataPath, properties } ) => {

    const Renderer = renderers[properties.rendererName] as Renderer

    if ( dataPath.path.length === 0 || Renderer === undefined ) 
         return <></>

    return <Renderer {...dataPath} properties={properties} />
}

export default Path;
