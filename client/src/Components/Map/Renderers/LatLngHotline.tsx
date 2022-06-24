
import { HotlineOptions, useHotline } from 'react-leaflet-hotline';

import ArrowHead from './ArrowHead';

import { palette, width } from '../../../assets/properties';

import { Renderer } from '../../../models/renderers';
import { PointData } from '../../../models/path';

const getLat = (p: PointData) => p.lat;
const getLng = (p: PointData) => p.lng;
const getVal = (p: PointData) => p.value || 0;

const LatLngHotline: Renderer = ( { path, properties, onClick  } ) => {

    const options: HotlineOptions = {
        palette: palette(properties),
        weight: width(undefined, properties)
    }
    
    useHotline( path, getLat, getLng, getVal, options )

    const origin = path[path.length - 2]
    const end = path[path.length - 1]
    return <ArrowHead key={Math.random()} origin={origin} end={end} />;
}

export default LatLngHotline;