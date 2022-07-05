
import { Renderer, RendererName } from '../models/renderers';
import Circles from '../Components/Map/Renderers/Circles';
import Hotpoints from '../Components/Map/Renderers/Hotpoints';
import Line from '../Components/Map/Renderers/Line';
import Rectangles from '../Components/Map/Renderers/Rectangles';
import CCircle from '../Components/Map/Renderers/Circle';
import { Hotline } from 'react-leaflet-hotline';


const renderers: Record<RendererName, Renderer> = {
    'circle': CCircle,
    'circles': Circles,
    'rectangles': Rectangles,
    'line': Line,
    'hotline': Hotline as any,
    'hotpoints': Hotpoints,
}

export default renderers;