import * as L from "leaflet";

declare module "leaflet" {
  export function Hotline(data: number[][], options: any): any;
}
