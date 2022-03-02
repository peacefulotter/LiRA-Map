
import { Renderer } from './models'
import Circles from '../Components/Map/Renderers/Circle';
import Hotline from '../Components/Map/Renderers/Hotline';
import Hotpoints from '../Components/Map/Renderers/Hotpoints';
import Line from '../Components/Map/Renderers/Line';
import Rectangles from '../Components/Map/Renderers/Rectangle';

export enum RendererName {
    circles = 'circles', 
    rectangles = 'rectangles',
    line = 'line',
    hotline = 'hotline',
    hotpoints = 'hotpoints'
}

const renderers: Partial<Record<RendererName, Renderer>> = {
    'circles': Circles,
    'rectangles': Rectangles,
    'line': Line,
    'hotline': Hotline,
    'hotpoints': Hotpoints,
}

export default renderers;