import * as L from "leaflet";

declare module "leaflet" {
  export function Hotline(data: number[][][], zoom: number, options: any): any;
}
