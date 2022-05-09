import { FC } from "react";

import renderers from "../../assets/renderers";
import { PathProps } from "../../models/path";
import { Renderer } from "../../models/renderers";

const Path: FC<PathProps> = ( { path, properties, onClick } ) => {

    const Renderer = renderers[properties.rendererName] as Renderer

    const onClickOrDefault = onClick ? onClick : (i: number) => (e: any) => {}

    return path.length !== 0 && Renderer !== undefined
        ? <Renderer path={path} properties={properties} onClick={onClickOrDefault}/>
        : null
}

export default Path;
