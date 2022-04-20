
import { Renderer, RendererName } from '../models/renderers';
import Circles from '../Components/Map/Renderers/Circles';
import Hotline from '../Components/Map/Renderers/Hotline';
import Hotpoints from '../Components/Map/Renderers/Hotpoints';
import Line from '../Components/Map/Renderers/Line';
import Rectangles from '../Components/Map/Renderers/Rectangles';
import CCircle from '../Components/Map/Renderers/Circle';


const renderers: Record<RendererName, Renderer> = {
    'circle': CCircle,
    'circles': Circles,
    'rectangles': Rectangles,
    'line': Line,
    'hotline': Hotline,
    'hotpoints': Hotpoints,
}

export default renderers;