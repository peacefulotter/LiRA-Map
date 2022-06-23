

import ArrowHead from './ArrowHead';

import LeafletLatLngHotline from '../../../assets/hotline/LeafletLatLngHotline';
import { HotlineOptions } from '../../../assets/hotline/hotline';

import { palette, width } from '../../../assets/properties';

import { Renderer } from '../../../models/renderers';

import useHotline from '../Hooks/useHotline';


const Hotline: Renderer = ( { path, properties, onClick  } ) => {

    const options: HotlineOptions = {
        palette: palette(properties),
        weight: width(undefined, properties)
    }
    
    const hotline = useHotline( LeafletLatLngHotline, path, options )

    const origin = path[path.length - 2]
    const end = path[path.length - 1]
    return <ArrowHead key={Math.random()} origin={origin} end={end} />;
}

export default Hotline;