declare module "@svg-country-maps/indonesia" {
  export interface Location {
    name: string;
    id: string;
    path: string;
  }

  export interface MapData {
    label: string;
    viewBox: string;
    locations: Location[];
  }

  const mapData: MapData;
  export default mapData;
}
