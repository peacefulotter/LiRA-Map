import * as L from "leaflet";

declare module "leaflet" {
  // if distances are not specified it assumes the points are spread evenly
  export function Hotline(data: [number, number, number][], options: any, dotHoverIndex: number | undefined): any;
}
