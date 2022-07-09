import { Palette } from "react-leaflet-hotline";
import { SweetAlertOptions, SweetAlertResult } from "sweetalert2";
import { RendererName } from "./renderers";

export interface PopupOptions {
    name: string;
    tag: string;
    renderer: RendererName;
    color: string;
    palette: Palette;
}


export type PopupFunc = (options: SweetAlertOptions<any, any>) => Promise<SweetAlertResult<any>>