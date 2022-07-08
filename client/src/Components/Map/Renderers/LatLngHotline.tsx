import { LeafletEvent, Polyline } from 'leaflet';
import { Hotline } from "react-leaflet-hotline";
import { HotlineEventHandlers } from "react-leaflet-hotline/lib/types";
import { IRenderer } from "../../../models/renderers";


function LatLngHotline<T>( {data, getLat, getLng, getVal, options, eventHandlers }: IRenderer<T> )
{
    const handlers = Object.entries(eventHandlers || {}).reduce( (acc, [k, v]) => {
        acc[k as keyof HotlineEventHandlers] = (e: LeafletEvent, i: number, p: Polyline<any, any>) => v(i)(e)
        return acc;
    }, {} as HotlineEventHandlers )

    return <Hotline 
        data={data}
        getLat={getLat}
        getLng={getLng}
        getVal={getVal}
        options={options}
        eventHandlers={handlers} />
}

export default LatLngHotline;