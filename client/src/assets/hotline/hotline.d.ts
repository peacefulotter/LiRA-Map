
import { Polyline } from 'leaflet'
import { InputHotlineData } from './core'
import { HotlineOptions } from '../../models/path'

export default class HotlineClass extends Polyline {
    constructor(latlngs: InputHotlineData, options?: HotlineOptions);
}