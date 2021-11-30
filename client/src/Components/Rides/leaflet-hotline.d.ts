import * as L from "leaflet";

declare module "leaflet" {
  export function hotline(data: number[][], options: any): any;
}