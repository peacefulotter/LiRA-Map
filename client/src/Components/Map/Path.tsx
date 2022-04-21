import { FC } from "react";

import renderers from "../../assets/renderers";
import { PathProps } from "../../models/path";
import { Renderer } from "../../models/renderers";

const Path: FC<PathProps> = ( { dataPath, properties, onClick } ) => {

    const Renderer = renderers[properties.rendererName] as Renderer

    const onClickOrDefault = onClick ? onClick : (i: number) => (e: any) => {}

    return dataPath.path.length !== 0 && Renderer !== undefined
        ? <Renderer dataPath={dataPath} properties={properties} onClick={onClickOrDefault}/>
        : null
}

export default Path;
